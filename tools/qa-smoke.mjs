#!/usr/bin/env node
/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 *
 * qa-smoke.mjs — pre-deploy QA gate that catches the kind of failure that
 * shipped to production on 2026-05-19: every Solutions page had <script>
 * tags executing before <div id="root"> was parsed, so ReactDOM.createRoot
 * found null and threw React error #299. The page returned HTTP 200 with
 * an empty <div id="root">, so source-grep + Lighthouse-on-homepage QA
 * missed it.
 *
 * What this script does:
 *   1. Static check: for every *.html page that mounts React, verify
 *      <div id="root"> appears BEFORE the first <script src=...> in
 *      <body>. Fails if any page has the broken ordering.
 *   2. Runtime check (optional, --render): spin up a local HTTP server
 *      pointing at the repo root, render every page via headless Chrome,
 *      capture console messages, fail if any "Uncaught" / "TypeError"
 *      appears.
 *
 * Usage:
 *   node tools/qa-smoke.mjs            # static check only (~1s, no Chrome)
 *   node tools/qa-smoke.mjs --render   # static + runtime (~30s)
 *
 * Exit codes: 0 = pass, 1 = fail. Wire into npm run preflight.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, relative, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RENDER = process.argv.includes('--render');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// ── Static check ─────────────────────────────────────────────────────
// Walks every .html under ROOT and verifies script-after-root ordering
// for pages that mount React (signal: load a *.compiled.js or react.*).

const reactPagePatterns = [/\.compiled\.js/, /react\.production/, /\.inline\.js/];
const skipDirs = ['node_modules', '.git', 'docs', '.well-known'];

function walkHtml(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (skipDirs.includes(entry)) continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walkHtml(p, out);
    else if (entry.endsWith('.html')) out.push(p);
  }
  return out;
}

function checkOrdering(html, rel) {
  const m = html.match(/<body[\s\S]*<\/body>/i);
  if (!m) return { kind: 'no-body', ok: true };
  const body = m[0];

  const mountsReact = reactPagePatterns.some((re) => re.test(body));
  if (!mountsReact) return { kind: 'static', ok: true };

  // Find #root (or main#main wrapping it)
  const rootIdx = (() => {
    const a = body.search(/<div\s+id=["']root["']/i);
    const b = body.search(/<main\s+id=["']main["']/i);
    const positions = [a, b].filter((x) => x >= 0);
    return positions.length ? Math.min(...positions) : -1;
  })();

  const scriptIdx = body.search(/<script\s+[^>]*src=/i);

  if (rootIdx < 0) return { kind: 'no-root', ok: false, msg: 'page references React but has no <div id="root"> or <main id="main">' };
  if (scriptIdx < 0) return { kind: 'no-script', ok: true };

  if (scriptIdx < rootIdx) {
    return {
      kind: 'broken',
      ok: false,
      msg: `<script src> at body byte ${scriptIdx} runs BEFORE <div id="root"> at body byte ${rootIdx} — createRoot will fail`,
    };
  }
  return { kind: 'ok', ok: true };
}

const pages = walkHtml(ROOT);
let staticFailed = 0;
const failures = [];
for (const p of pages) {
  const rel = relative(ROOT, p);
  // Skip preview / vendor / iframed pages
  if (rel.includes('/_') || rel.startsWith('_')) continue;
  const html = readFileSync(p, 'utf8');
  const r = checkOrdering(html, rel);
  if (!r.ok) {
    staticFailed++;
    failures.push({ rel, ...r });
    console.error(`[qa] FAIL  ${rel}: ${r.msg}`);
  } else if (r.kind === 'ok') {
    // pass quietly
  }
}
if (staticFailed === 0) {
  console.log(`[qa] static: ${pages.length} HTML files, ${pages.filter((p) => readFileSync(p,'utf8').match(/\.compiled\.js|react\.production/)).length} React pages, all ordering OK`);
} else {
  console.error(`[qa] static: ${staticFailed} FAILURES`);
  process.exit(1);
}

// ── Runtime check (opt-in) ───────────────────────────────────────────

if (!RENDER) {
  console.log('[qa] (skip runtime — pass --render to headless-render every page)');
  process.exit(0);
}

console.log('[qa] runtime: starting local server on :8780');
const server = spawn('python3', ['-m', 'http.server', '8780', '--bind', '127.0.0.1'], { cwd: ROOT, stdio: 'pipe' });
await new Promise((r) => setTimeout(r, 1500));

function renderPage(url) {
  const tmpDom = `/tmp/qa-dom-${Date.now()}.html`;
  const tmpLog = `/tmp/qa-log-${Date.now()}.txt`;
  const proc = spawnSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--enable-logging=stderr', '--virtual-time-budget=12000',
    '--window-size=1400,1200', '--dump-dom', url,
  ], { stdio: ['ignore', 'ignore', 'pipe'], encoding: 'utf8' });
  const log = proc.stderr || '';
  const errors = log.match(/Uncaught[^\n]*|Identifier '[^']+' has already been declared|error #\d+|TypeError[^\n]*|ReferenceError[^\n]*/g) || [];
  return { errors };
}

const urls = pages
  .map((p) => relative(ROOT, p))
  .filter((rel) => !rel.includes('/_') && !rel.startsWith('_'))
  .filter((rel) => !rel.startsWith('offline.html') && !rel.includes('404'))
  .map((rel) => rel.endsWith('index.html') ? rel.replace(/index\.html$/, '') : rel)
  .map((rel) => `http://127.0.0.1:8780/${rel}`);

let runtimeFailed = 0;
for (const url of urls) {
  const { errors } = renderPage(url);
  if (errors.length) {
    runtimeFailed++;
    console.error(`[qa] FAIL  ${url}`);
    for (const e of errors.slice(0, 3)) console.error(`        ${e}`);
  } else {
    console.log(`[qa] ok    ${url}`);
  }
}

server.kill('SIGTERM');

if (runtimeFailed > 0) {
  console.error(`\n[qa] runtime: ${runtimeFailed} FAILURES`);
  process.exit(1);
}
console.log(`\n[qa] runtime: ${urls.length} pages rendered, 0 console errors`);
process.exit(0);
