#!/usr/bin/env node
/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * blog-skip-link.mjs — idempotently adds the keyboard skip-link to every
 * /blog/*.html and tags the <article class="post-body"> as id="main".
 *
 * Idempotent: marker comment <!--mmai-skip-injected--> is added on first
 * run; subsequent runs are no-ops.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = resolve(ROOT, 'blog');

const MARKER = '<!--mmai-skip-injected-->';
const SKIP_BLOCK = `${MARKER}
<a class="skip-link" href="#main">Skip to content</a>
<style>.skip-link{position:absolute;left:-9999px;top:0;background:#0B0F0E;color:#FFFFFF;padding:12px 16px;font:600 14px/'DM Sans',system-ui,sans-serif;z-index:9999;border-radius:8px;text-decoration:none}.skip-link:focus{left:16px;top:16px}</style>`;

for (const f of readdirSync(BLOG).filter((x) => x.endsWith('.html'))) {
  const path = join(BLOG, f);
  let html = readFileSync(path, 'utf8');
  if (html.includes(MARKER)) { console.log(`[skip] ${f}: already injected`); continue; }

  // Insert skip-link right after <body>
  if (!html.match(/<body[^>]*>/)) { console.warn(`[skip] ${f}: no <body> — skipping`); continue; }
  html = html.replace(/(<body[^>]*>)/, `$1\n${SKIP_BLOCK}`);

  // Tag the <article class="post-body"> as id="main" so the skip-link target exists.
  // If id="main" is already present elsewhere, skip the tagging.
  if (!/id=["']main["']/.test(html)) {
    html = html.replace(/<article\s+class=["']post-body["']/, '<article id="main" tabindex="-1" class="post-body"');
  }

  writeFileSync(path, html);
  console.log(`[skip] ${f}: updated`);
}
