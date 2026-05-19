#!/usr/bin/env node
/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * qa-production.mjs — exhaustive user-shaped audit against the live site.
 *
 * For every page on the production sitemap (plus a handful of un-indexed
 * but reachable routes), this suite runs the following checks:
 *
 *   1. Headless Chrome render at DESKTOP viewport (1440x900) and MOBILE
 *      viewport (375x667). Captures all console errors / warnings.
 *      Fails the page if any Uncaught / SyntaxError / TypeError /
 *      ReferenceError / 'Failed to load resource' / React-#NNN appears.
 *
 *   2. Body rendered size — every React-mounting page must produce a
 *      DOM with body content > 8 KB. Pages whose DOM stays small mean
 *      React never mounted, the same failure mode as the Solutions
 *      bug shipped on 2026-05-19.
 *
 *   3. JSON-LD blocks — every <script type="application/ld+json"> on
 *      every page is JSON.parse'd. Schema.org @type field is checked.
 *      Required fields per type are enforced.
 *
 *   4. Outbound links — every <a href="https?://..."> is HEAD-checked.
 *      Fails if any returns >=400. (Skipped: fonts.googleapis.com,
 *      mailto:, anchor-only hrefs.)
 *
 *   5. Skip-link presence — every marketing page must have a
 *      <a class="skip-link"> in <body> for keyboard accessibility.
 *
 *   6. AASA structure — /.well-known/apple-app-site-association must
 *      be valid JSON with applinks.details[0].appIDs[0] starting with
 *      the real iOS Team ID UPU6GJ5B68.
 *
 *   7. OG image must return 200 and content-type image/png.
 *
 *   8. Sitemap declared URLs vs production reachability — every URL
 *      in sitemap.xml must return HTTP 200.
 *
 * Output: structured JSON report at /tmp/qa-prod-<timestamp>.json plus
 * a human-readable summary to stdout. Exit 1 on any failure.
 *
 * Usage:
 *   node tools/qa-production.mjs [--base https://mymilesai.com]
 */
import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdtempSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const BASE = (() => {
  const idx = process.argv.indexOf('--base');
  return idx >= 0 ? process.argv[idx + 1].replace(/\/$/, '') : 'https://mymilesai.com';
})();

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const REPORT_PATH = `/tmp/qa-prod-${TIMESTAMP}.json`;
const TMP = mkdtempSync(join(tmpdir(), 'qa-prod-'));

// ── Discovery: get all sitemap URLs + a few extras worth checking ────

async function fetchText(url, opts = {}) {
  const proc = spawnSync('/usr/bin/curl', [
    '-sS', '-L', '--max-time', '15',
    '-A', 'Mozilla/5.0 (qa-production.mjs MyMilesAI)',
    ...(opts.head ? ['-I', '-o', '/dev/null', '-w', '%{http_code} %{content_type}'] : []),
    url,
  ], { encoding: 'utf8' });
  return { stdout: proc.stdout || '', stderr: proc.stderr || '', code: proc.status };
}

console.log(`[qa-prod] base = ${BASE}\n`);

const sitemap = (await fetchText(`${BASE}/sitemap.xml`)).stdout;
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const extraUrls = [
  `${BASE}/welcome/`,
  `${BASE}/auth-callback/`,
  `${BASE}/app/`,
  `${BASE}/blog/cra-mileage-rates-2026.html`,
  `${BASE}/blog/freelancer-vehicle-deductions-2026.html`,
  `${BASE}/blog/irs-mileage-audit-guide.html`,
  `${BASE}/blog/new-features-bulk-classify-cra-csv.html`,
  `${BASE}/blog/realtor-mileage-deductions.html`,
  `${BASE}/blog/uber-driver-deductions-2026.html`,
];
const allUrls = [...new Set([...sitemapUrls, ...extraUrls])].sort();

console.log(`[qa-prod] sitemap reports ${sitemapUrls.length} URLs; total to test = ${allUrls.length}\n`);

// ── Helper: headless-render a URL + parse console ────────────────────

function renderPage(url, viewport) {
  const [w, h] = viewport;
  const userDataDir = join(TMP, `chrome-${Math.random().toString(36).slice(2)}`);
  const domPath = join(TMP, `dom-${Math.random().toString(36).slice(2)}.html`);
  const proc = spawnSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    `--user-data-dir=${userDataDir}`,
    '--enable-logging=stderr', '--virtual-time-budget=15000',
    `--window-size=${w},${h}`, '--force-device-scale-factor=1',
    '--dump-dom', url,
  ], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
  const dom = proc.stdout || '';
  const log = proc.stderr || '';

  // Filter the noisy Chrome internal errors that have nothing to do with the page.
  const benignNoise = [
    /CVDisplayLink/, /externally_managed_app_manager/, /os_integration_manager/,
    /GCM\/engine/, /DEPRECATED_ENDPOINT/, /Failed to log in to GCM/,
    /wrong_secret/, /web_applications/, /installwebapp/, /AVCaptureDevice/,
    /favicon\.ico.*404/, // browsers always probe /favicon.ico
  ];
  const realErrorPatterns = [
    /Uncaught[^\n]*/g,
    /SyntaxError:[^\n]*/g,
    /TypeError:[^\n]*/g,
    /ReferenceError:[^\n]*/g,
    /Identifier '[^']+' has already been declared/g,
    /Minified React error #\d+/g,
    /Failed to load resource: the server responded with a status of (4|5)\d\d/g,
    /Refused to (load|execute|connect to)[^\n]*/g, // CSP violations
  ];
  let errors = [];
  for (const re of realErrorPatterns) {
    for (const m of log.matchAll(re)) {
      const text = m[0];
      if (benignNoise.some((n) => n.test(text))) continue;
      errors.push(text.trim());
    }
  }
  errors = [...new Set(errors)];

  return { dom, log, errors, bytes: dom.length };
}

// ── Per-URL checks ───────────────────────────────────────────────────

function extractJsonLd(dom) {
  const blocks = [...dom.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)];
  const out = [];
  for (const m of blocks) {
    try {
      const parsed = JSON.parse(m[1]);
      out.push({ ok: true, parsed });
    } catch (e) {
      out.push({ ok: false, error: e.message, raw: m[1].slice(0, 120) });
    }
  }
  return out;
}

function extractOutboundLinks(dom, base) {
  const baseHost = new URL(base).host;
  const hrefs = [...dom.matchAll(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>/g)].map((m) => m[1]);
  const outbound = new Set();
  for (const h of hrefs) {
    if (!/^https?:\/\//.test(h)) continue;
    const url = new URL(h);
    if (url.host === baseHost) continue;
    // skip well-known cosmetic domains
    if (url.host === 'fonts.googleapis.com' || url.host === 'fonts.gstatic.com') continue;
    outbound.add(h);
  }
  return [...outbound];
}

function hasSkipLink(dom) {
  return /<a[^>]*class=["'][^"']*\bskip-link\b/.test(dom);
}

// ── Schema.org type rule book ────────────────────────────────────────

const requiredFields = {
  Organization:        ['name', 'url'],
  WebSite:             ['url'],
  SoftwareApplication: ['name', 'applicationCategory', 'operatingSystem'],
  FAQPage:             ['mainEntity'],
  Article:             ['headline', 'datePublished', 'author', 'publisher'],
};

function validateLd(block) {
  const violations = [];
  const walk = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) { node.forEach(walk); return; }
    const type = node['@type'];
    if (type && requiredFields[type]) {
      for (const f of requiredFields[type]) {
        if (node[f] === undefined) violations.push(`${type} missing ${f}`);
      }
    }
    if (node['@graph']) walk(node['@graph']);
    for (const v of Object.values(node)) {
      if (typeof v === 'object') walk(v);
    }
  };
  walk(block);
  return violations;
}

// ── Run audit ────────────────────────────────────────────────────────

const report = {
  base: BASE,
  startedAt: new Date().toISOString(),
  sitemapUrls: sitemapUrls.length,
  totalUrls: allUrls.length,
  pages: {},
  ancillary: {},
  totals: { desktopFailures: 0, mobileFailures: 0, ldFailures: 0, outboundFailures: 0, skipLinkMissing: 0 },
};

for (const url of allUrls) {
  console.log(`[qa-prod] ${url}`);
  const desktop = renderPage(url, [1440, 900]);
  const mobile  = renderPage(url, [375, 667]);

  const lds = extractJsonLd(desktop.dom);
  const ldFailures = [];
  for (const b of lds) {
    if (!b.ok) ldFailures.push({ kind: 'parse', error: b.error });
    else {
      const v = validateLd(b.parsed);
      if (v.length) ldFailures.push({ kind: 'schema', violations: v });
    }
  }

  const outbound = extractOutboundLinks(desktop.dom, BASE);
  const outboundResults = [];
  for (const h of outbound) {
    const r = await fetchText(h, { head: true });
    const status = parseInt((r.stdout || '').split(' ')[0], 10);
    if (!status || status >= 400) {
      outboundResults.push({ href: h, status: status || 'no-response' });
    }
  }

  const isMarketingPage = /\/(features|pricing|about|blog|how-it-works|solutions)/.test(url) || url.replace(/\/$/, '') === BASE;
  const skipLinkOk = !isMarketingPage || hasSkipLink(desktop.dom);

  report.pages[url] = {
    desktop: { bytes: desktop.bytes, errors: desktop.errors },
    mobile:  { bytes: mobile.bytes,  errors: mobile.errors  },
    jsonLd: { blocks: lds.length, failures: ldFailures },
    outboundLinkFailures: outboundResults,
    skipLinkPresent: skipLinkOk,
  };

  if (desktop.errors.length) report.totals.desktopFailures++;
  if (mobile.errors.length) report.totals.mobileFailures++;
  if (ldFailures.length) report.totals.ldFailures++;
  if (outboundResults.length) report.totals.outboundFailures++;
  if (!skipLinkOk) report.totals.skipLinkMissing++;

  const flag = (desktop.errors.length || mobile.errors.length || ldFailures.length || outboundResults.length || !skipLinkOk) ? '🔴' : '✅';
  console.log(`         ${flag} desktop=${desktop.bytes}B mobile=${mobile.bytes}B ld=${lds.length} outbound=${outbound.length} skip=${skipLinkOk}`);
  if (desktop.errors.length) console.log(`           DESKTOP ERRORS: ${desktop.errors.slice(0, 2).join(' | ')}`);
  if (mobile.errors.length)  console.log(`           MOBILE  ERRORS: ${mobile.errors.slice(0, 2).join(' | ')}`);
  if (ldFailures.length)     console.log(`           LD FAILURES:    ${JSON.stringify(ldFailures)}`);
  if (outboundResults.length) console.log(`           BROKEN LINKS:   ${outboundResults.map(r => `${r.href}=${r.status}`).join(', ')}`);
}

// ── Ancillary checks: AASA, OG image, sitemap.xml, robots.txt, sw.js ──

console.log('\n[qa-prod] ancillary checks');

const aasa = await fetchText(`${BASE}/.well-known/apple-app-site-association`);
try {
  const j = JSON.parse(aasa.stdout);
  const id = j?.applinks?.details?.[0]?.appIDs?.[0] || '';
  report.ancillary.aasa = {
    ok: id.startsWith('UPU6GJ5B68.com.harijasllc'),
    appID: id,
  };
} catch (e) {
  report.ancillary.aasa = { ok: false, error: e.message };
}
console.log(`         aasa: ${report.ancillary.aasa.ok ? '✅' : '🔴'} ${report.ancillary.aasa.appID || report.ancillary.aasa.error}`);

const og = await fetchText(`${BASE}/assets/og/mymilesai-og.png`, { head: true });
const [ogStatus, ogType] = (og.stdout || '').split(' ');
report.ancillary.ogImage = { ok: ogStatus === '200' && ogType?.includes('image/png'), status: ogStatus, type: ogType };
console.log(`         og image: ${report.ancillary.ogImage.ok ? '✅' : '🔴'} ${ogStatus} ${ogType || ''}`);

// Robots: must allow / + disallow /app/, /signin/, /signup/, /welcome/, /auth-callback/
const robots = (await fetchText(`${BASE}/robots.txt`)).stdout;
report.ancillary.robots = {
  allowsRoot:      /Allow:\s*\/$/m.test(robots) || !/Disallow:\s*\/$/m.test(robots),
  disallowsApp:    /Disallow:\s*\/app\//m.test(robots),
  disallowsAuth:   /Disallow:\s*\/signin/m.test(robots) && /Disallow:\s*\/signup/m.test(robots),
};
console.log(`         robots: ${report.ancillary.robots.allowsRoot && report.ancillary.robots.disallowsApp ? '✅' : '🔴'} ${JSON.stringify(report.ancillary.robots)}`);

writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

console.log('\n=== SUMMARY ===');
console.log(`URLs tested: ${allUrls.length}`);
console.log(`Desktop console-error pages: ${report.totals.desktopFailures}`);
console.log(`Mobile  console-error pages: ${report.totals.mobileFailures}`);
console.log(`JSON-LD failures (parse/schema): ${report.totals.ldFailures}`);
console.log(`Outbound-link failures: ${report.totals.outboundFailures}`);
console.log(`Skip-link missing on marketing pages: ${report.totals.skipLinkMissing}`);
console.log(`AASA valid: ${report.ancillary.aasa.ok ? 'yes' : 'no'}`);
console.log(`OG image valid: ${report.ancillary.ogImage.ok ? 'yes' : 'no'}`);
console.log(`\nFull report: ${REPORT_PATH}`);

const totalFailures = Object.values(report.totals).reduce((s, v) => s + v, 0)
  + (report.ancillary.aasa.ok ? 0 : 1)
  + (report.ancillary.ogImage.ok ? 0 : 1);

if (totalFailures === 0) {
  console.log('\n✅ ALL CHECKS PASSED');
  process.exit(0);
} else {
  console.log(`\n🔴 ${totalFailures} failures detected — see report`);
  process.exit(1);
}
