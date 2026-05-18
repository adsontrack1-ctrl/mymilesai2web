#!/usr/bin/env node
/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * seo-inject-blog.mjs — idempotently inject OpenGraph + Twitter +
 * Article JSON-LD into every blog/*.html post, so social previews and
 * Google Rich Results have what they need.
 *
 * Idempotent: a marker comment <!--mmai-seo-injected--> is added on
 * first run; subsequent runs replace the block in place rather than
 * stacking it.
 *
 * Inputs are read from the HTML head:
 *   - <title>…</title>
 *   - <meta name="description" content="…">
 *   - <link rel="canonical" href="…">
 *   - <div class="post-meta">…</div>           (for publish month/year)
 *   - <div class="post-cat">…</div>            (for articleSection)
 *
 * If a post is missing required fields the script logs a warning and
 * skips it (does not fail the build).
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG_DIR = resolve(ROOT, 'blog');
const OG_IMAGE = 'https://mymilesai.com/assets/og/mymilesai-og.png';
const MARKER_OPEN = '<!--mmai-seo-injected-->';
const MARKER_CLOSE = '<!--/mmai-seo-injected-->';

function extract(re, html, label) {
  const m = re.exec(html);
  if (!m) return null;
  return m[1].trim().replace(/\s+/g, ' ');
}

// Parse "April 2026 · 6 min read" or similar.
function monthYearToISO(meta) {
  if (!meta) return null;
  const months = { january:1, february:2, march:3, april:4, may:5, june:6,
                   july:7, august:8, september:9, october:10, november:11, december:12 };
  const m = /([A-Za-z]+)\s+(20\d{2})/.exec(meta);
  if (!m) return null;
  const mo = months[m[1].toLowerCase()];
  if (!mo) return null;
  return `${m[2]}-${String(mo).padStart(2,'0')}-01`;
}

function buildBlock({ title, description, canonical, section, datePublished }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    headline: title,
    description,
    datePublished: datePublished || undefined,
    dateModified: new Date().toISOString().slice(0, 10),
    author: { '@type': 'Organization', name: 'MyMilesAI', url: 'https://mymilesai.com/' },
    publisher: {
      '@type': 'Organization',
      name: 'MyMilesAI',
      logo: { '@type': 'ImageObject', url: 'https://mymilesai.com/favicon.svg' },
    },
    articleSection: section || undefined,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
  Object.keys(ld).forEach((k) => ld[k] === undefined && delete ld[k]);

  return [
    MARKER_OPEN,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:url" content="${escapeAttr(canonical)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:site_name" content="MyMilesAI" />`,
    section ? `<meta property="article:section" content="${escapeAttr(section)}" />` : '',
    datePublished ? `<meta property="article:published_time" content="${datePublished}T00:00:00Z" />` : '',
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
    `<script type="application/ld+json">${JSON.stringify(ld)}</script>`,
    MARKER_CLOSE,
  ].filter(Boolean).join('\n');
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function processFile(filename) {
  const path = resolve(BLOG_DIR, filename);
  const html = readFileSync(path, 'utf8');

  const title = extract(/<title>([^<]+)<\/title>/i, html, 'title');
  const description = extract(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i, html, 'description');
  const canonical = extract(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i, html, 'canonical');
  const meta = extract(/<div\s+class=["']post-meta["'][^>]*>([^<]+)<\/div>/i, html, 'post-meta');
  const section = extract(/<div\s+class=["']post-cat["'][^>]*>([^<]+)<\/div>/i, html, 'post-cat');

  if (!title || !description || !canonical) {
    console.warn(`[seo] skip ${filename} (missing title/description/canonical)`);
    return false;
  }
  const datePublished = monthYearToISO(meta);
  const block = buildBlock({ title, description, canonical, section, datePublished });

  let out;
  if (html.includes(MARKER_OPEN) && html.includes(MARKER_CLOSE)) {
    // Idempotent replace.
    const re = new RegExp(`${MARKER_OPEN}[\\s\\S]*?${MARKER_CLOSE}`);
    out = html.replace(re, block);
  } else {
    // Inject directly after the canonical link.
    out = html.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i, `$1\n${block}`);
  }

  if (out === html) {
    console.log(`[seo] ${filename}: no change`);
    return false;
  }
  writeFileSync(path, out);
  console.log(`[seo] ${filename}: updated (title="${title}", section="${section || '—'}", published=${datePublished || '—'})`);
  return true;
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.html'));
let changed = 0;
for (const f of files) {
  if (processFile(f)) changed++;
}
console.log(`\n[seo] done — ${changed}/${files.length} updated`);
