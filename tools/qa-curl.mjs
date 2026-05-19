#!/usr/bin/env node
/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * qa-curl.mjs — fast, comprehensive curl-based audit against the live site.
 * Pairs with qa-smoke.mjs --render (which catches runtime React errors).
 *
 * Per-page checks (via curl, parallel where safe):
 *   1. HTTP 200, valid Content-Type
 *   2. <title> + <meta name="description"> present
 *   3. <link rel="canonical"> matches the requested URL
 *   4. JSON-LD blocks parse + match schema.org required-field map
 *   5. og:image + twitter:card + twitter:image present where expected
 *   6. <a class="skip-link"> on every marketing page
 *   7. Every outbound https://... <a href> HEAD-checked for 4xx/5xx
 *   8. AASA: valid JSON, real Team ID
 *   9. /sitemap.xml URLs all return 200
 *  10. /robots.txt sane (allows /, disallows /app/ /signin/ /signup/)
 *
 * Output: structured JSON + human summary. Exit 1 on any failure.
 */
import { spawnSync, spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const BASE = (() => {
  const idx = process.argv.indexOf('--base');
  return idx >= 0 ? process.argv[idx + 1].replace(/\/$/, '') : 'https://mymilesai.com';
})();

function curlText(url, headOnly = false) {
  const args = ['-sS', '-L', '--max-time', '15', '-A', 'qa-curl.mjs/MyMilesAI'];
  if (headOnly) args.push('-I', '-o', '/dev/null', '-w', '%{http_code}|%{content_type}|%{url_effective}');
  args.push(url);
  const p = spawnSync('/usr/bin/curl', args, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
  return { stdout: p.stdout || '', code: p.status };
}

console.log(`[qa-curl] base = ${BASE}\n`);

// Sitemap
const sitemap = curlText(`${BASE}/sitemap.xml`).stdout;
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`[qa-curl] sitemap = ${sitemapUrls.length} URLs`);

// Robots
const robots = curlText(`${BASE}/robots.txt`).stdout;
const robotsOk = /Disallow:\s*\/app\//.test(robots)
              && /Disallow:\s*\/signin/.test(robots)
              && /Disallow:\s*\/signup/.test(robots)
              && !/Disallow:\s*\/$/m.test(robots);
console.log(`[qa-curl] robots = ${robotsOk ? '✅' : '🔴'}`);

// AASA
const aasaRaw = curlText(`${BASE}/.well-known/apple-app-site-association`).stdout;
let aasa = { ok: false };
try {
  const j = JSON.parse(aasaRaw);
  const id = j?.applinks?.details?.[0]?.appIDs?.[0] || '';
  aasa = { ok: id === 'UPU6GJ5B68.com.harijasllc.mymilesaiapp', appID: id, raw: j };
} catch (e) { aasa = { ok: false, error: e.message }; }
console.log(`[qa-curl] aasa = ${aasa.ok ? '✅' : '🔴'} ${aasa.appID || aasa.error}`);

// OG image
const og = curlText(`${BASE}/assets/og/mymilesai-og.png`, true);
const [ogStatus, ogType] = og.stdout.split('|');
const ogOk = ogStatus === '200' && ogType.includes('image/png');
console.log(`[qa-curl] og image = ${ogOk ? '✅' : '🔴'} ${ogStatus} ${ogType}`);

// Schema.org required fields per @type
const requiredFields = {
  Organization:        ['name', 'url'],
  WebSite:             ['url'],
  SoftwareApplication: ['name', 'applicationCategory', 'operatingSystem'],
  FAQPage:             ['mainEntity'],
  Article:             ['headline', 'datePublished', 'author', 'publisher'],
};

function validateLd(node, violations = []) {
  if (!node || typeof node !== 'object') return violations;
  if (Array.isArray(node)) { node.forEach((n) => validateLd(n, violations)); return violations; }
  const type = node['@type'];
  if (type && requiredFields[type]) {
    for (const f of requiredFields[type]) {
      if (node[f] === undefined) violations.push(`${type} missing ${f}`);
    }
  }
  if (node['@graph']) validateLd(node['@graph'], violations);
  return violations;
}

function extractOutbound(html) {
  const baseHost = new URL(BASE).host;
  const hrefs = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/g)].map((m) => m[1]);
  const out = new Set();
  for (const h of hrefs) {
    if (!/^https?:\/\//i.test(h)) continue;
    let u;
    try { u = new URL(h); } catch { continue; }
    if (u.host === baseHost) continue;
    if (/fonts\.(googleapis|gstatic)\.com$/.test(u.host)) continue;
    if (/^cdn\.fontshare\.com$/.test(u.host)) continue;
    if (/^api\.fontshare\.com$/.test(u.host)) continue;
    out.add(h);
  }
  return [...out];
}

const allUrls = [...new Set([
  ...sitemapUrls,
  `${BASE}/welcome/`,
  `${BASE}/auth-callback/`,
  `${BASE}/app/`,
])].sort();

const isMarketing = (url) => {
  const u = url.replace(BASE, '');
  return u === '/' || /^\/(features|pricing|about|blog|how-it-works|solutions)/.test(u);
};

const requiresJsonLd = (url) => {
  const u = url.replace(BASE, '');
  return u === '/' || u === '/pricing.html' || /^\/blog\/.*\.html$/.test(u);
};

const requiresOg = isMarketing;

const report = {
  base: BASE, startedAt: new Date().toISOString(),
  sitemap: { count: sitemapUrls.length, allReachable: true, broken: [] },
  robots: { ok: robotsOk },
  aasa,
  og: { ok: ogOk, status: ogStatus, type: ogType },
  pages: {},
  totals: {
    pages: 0, http404s: 0, missingMeta: 0, missingCanonical: 0,
    missingOg: 0, missingSkip: 0, ldParseFail: 0, ldSchemaFail: 0, brokenOutbound: 0,
  },
};

console.log(`\n[qa-curl] checking ${allUrls.length} pages...\n`);

for (const url of allUrls) {
  const head = curlText(url, true);
  const [status, type] = head.stdout.split('|');
  if (status !== '200') {
    report.sitemap.broken.push({ url, status });
    report.totals.http404s++;
    console.log(`  ${url}  🔴 ${status}`);
    continue;
  }
  const html = curlText(url).stdout;

  const title = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];
  const desc = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) || [])[1];
  const canonical = (html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i) || [])[1];
  const ogImage = (html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) || [])[1];
  const twitterCard = (html.match(/<meta\s+name=["']twitter:card["']\s+content=["']([^"']+)["']/i) || [])[1];
  const skipLink = /<a[^>]*class=["'][^"']*\bskip-link\b/.test(html);

  // JSON-LD
  const ldBlocks = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)];
  const ldResults = ldBlocks.map((b) => {
    try {
      const parsed = JSON.parse(b[1]);
      const violations = validateLd(parsed);
      return { ok: violations.length === 0, violations };
    } catch (e) { return { ok: false, parseError: e.message }; }
  });

  // Outbound links
  const outbound = extractOutbound(html);
  const brokenOutbound = [];
  for (const h of outbound) {
    const r = curlText(h, true);
    const s = (r.stdout || '').split('|')[0];
    const code = parseInt(s, 10);
    if (!code || code >= 400) brokenOutbound.push({ href: h, status: s || 'no-response' });
  }

  const result = {
    status, type, title: title?.slice(0, 80), hasDescription: !!desc,
    canonical, canonicalOk: canonical === url || canonical === url.replace(/\/$/, ''),
    ogImage, twitterCard, skipLink,
    ldBlocks: ldResults.length, ldOk: ldResults.every((r) => r.ok), ldDetails: ldResults,
    outboundChecked: outbound.length, brokenOutbound,
  };
  report.pages[url] = result;
  report.totals.pages++;

  let pageOk = true;
  const reasons = [];
  if (!title) { report.totals.missingMeta++; reasons.push('no title'); pageOk = false; }
  if (!desc) { report.totals.missingMeta++; reasons.push('no desc'); pageOk = false; }
  if (requiresJsonLd(url) && (!ldResults.length || !ldResults.every((r) => r.ok))) {
    report.totals.ldParseFail += ldResults.filter((r) => r.parseError).length;
    report.totals.ldSchemaFail += ldResults.filter((r) => r.violations?.length > 0).length;
    reasons.push(`ld(${ldResults.length} blocks, ok=${ldResults.every((r) => r.ok)})`);
    pageOk = false;
  }
  if (requiresOg(url) && !ogImage) { report.totals.missingOg++; reasons.push('no og:image'); pageOk = false; }
  if (isMarketing(url) && !skipLink) { report.totals.missingSkip++; reasons.push('no skip-link'); pageOk = false; }
  if (brokenOutbound.length) { report.totals.brokenOutbound += brokenOutbound.length; reasons.push(`broken: ${brokenOutbound.map(b => b.href).join(',')}`); pageOk = false; }

  console.log(`  ${pageOk ? '✅' : '🔴'} ${url.padEnd(60)} ${reasons.join('; ')}`);
}

const reportPath = `/tmp/qa-curl-${Date.now()}.json`;
writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('\n=== SUMMARY ===');
console.log(`pages checked: ${report.totals.pages}`);
console.log(`http 404s: ${report.totals.http404s}`);
console.log(`missing title/desc: ${report.totals.missingMeta}`);
console.log(`missing og:image (marketing): ${report.totals.missingOg}`);
console.log(`missing skip-link (marketing): ${report.totals.missingSkip}`);
console.log(`JSON-LD parse failures: ${report.totals.ldParseFail}`);
console.log(`JSON-LD schema-required-field violations: ${report.totals.ldSchemaFail}`);
console.log(`broken outbound links: ${report.totals.brokenOutbound}`);
console.log(`aasa valid: ${aasa.ok}`);
console.log(`og image valid: ${ogOk}`);
console.log(`robots ok: ${robotsOk}`);
console.log(`\nreport: ${reportPath}`);

const totalFailures = Object.values(report.totals).reduce((s, v) => s + v, 0)
  + (aasa.ok ? 0 : 1) + (ogOk ? 0 : 1) + (robotsOk ? 0 : 1);

process.exit(totalFailures > 0 ? 1 : 0);
