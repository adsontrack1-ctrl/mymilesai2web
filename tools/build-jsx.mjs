#!/usr/bin/env node
/*
 * MyMilesAI - Copyright (c) 2025-2026 Harijas LLC. All rights reserved.
 */

// build-jsx.mjs — pre-compile every JSX source in the repo so the marketing
// site no longer needs babel-in-browser and the CSP can drop 'unsafe-eval'.
//
// Two kinds of inputs are transformed:
//   1. Standalone .jsx files (ms-parts1.jsx, ms-parts2.jsx, solutions/sol-parts.jsx)
//      → emitted alongside as .compiled.js
//   2. Inline <script type="text/babel">…</script> blocks embedded in HTML
//      → extracted, transformed, emitted as <basename>.inline.js next to the
//        HTML file, and the original block is replaced with
//        <script src="<basename>.inline.js"></script>
//
// HTML rewrites are idempotent: a previously-built HTML carries a marker
// comment so a second run is a no-op (or refreshes the compiled output).

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from '@babel/core';
import presetReact from '@babel/preset-react';
import presetEnv from '@babel/preset-env';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const BABEL_OPTS = {
  presets: [
    [presetEnv, { targets: { browsers: ['> 0.5%, last 2 versions, not dead'] }, modules: false }],
    [presetReact, {}],
  ],
  babelrc: false,
  configFile: false,
  comments: false,
  compact: 'auto',
};

function compile(code, filename) {
  const { code: out } = transformSync(code, { ...BABEL_OPTS, filename });
  return out;
}

// Standalone .jsx → .compiled.js
const JSX_FILES = [
  'ms-parts1.jsx',
  'ms-parts2.jsx',
  'solutions/sol-parts.jsx',
];

for (const rel of JSX_FILES) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    console.warn(`[build-jsx] skip missing: ${rel}`);
    continue;
  }
  const src = readFileSync(abs, 'utf8');
  const out = compile(src, abs);
  const outPath = abs.replace(/\.jsx$/, '.compiled.js');
  writeFileSync(outPath, out);
  console.log(`[build-jsx] compiled ${rel} → ${outPath.replace(ROOT + '/', '')}`);
}

// HTML files with inline text/babel blocks.
const HTML_FILES = [
  'index.html',
  'features.html',
  'how-it-works.html',
  'pricing.html',
  'about.html',
  'blog.html',
  'solutions/index.html',
  'solutions/realtors/index.html',
  'solutions/rideshare/index.html',
  'solutions/freelancers/index.html',
  'solutions/construction/index.html',
  'solutions/sales-reps/index.html',
  'solutions/small-business/index.html',
];

const BUILD_MARKER = '<!-- build-jsx: compiled -->';

const RE_BABEL_INLINE = /<script\s+type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/g;
const RE_BABEL_SRC    = /<script\s+type=["']text\/babel["']\s+src=["']([^"']+)["'][^>]*>\s*<\/script>/g;
const RE_BABEL_VENDOR = /\s*<script\s+src=["'][^"']*assets\/vendor\/babel\.min\.js[^"']*["'][^>]*><\/script>\s*\n?/g;

for (const rel of HTML_FILES) {
  const abs = resolve(ROOT, rel);
  if (!existsSync(abs)) {
    console.warn(`[build-jsx] skip missing: ${rel}`);
    continue;
  }
  let html = readFileSync(abs, 'utf8');

  // 1) Rewrite <script type="text/babel" src="x.jsx"> → <script src="x.compiled.js">.
  html = html.replace(RE_BABEL_SRC, (_, src) => {
    const compiledSrc = src.replace(/\.jsx(\?[^"']*)?$/, (_m, q) => '.compiled.js' + (q || ''));
    return `<script src="${compiledSrc}"></script>`;
  });

  // 2) Extract every inline <script type="text/babel"> block, compile, emit
  //    a sibling .inline.js, and replace the inline block.
  let blockIdx = 0;
  const dir = dirname(abs);
  const base = basename(abs, '.html');
  html = html.replace(RE_BABEL_INLINE, (_match, body) => {
    blockIdx += 1;
    const compiled = compile(body, abs);
    const outName = blockIdx === 1 ? `${base}.inline.js` : `${base}.inline-${blockIdx}.js`;
    writeFileSync(resolve(dir, outName), compiled);
    return `<script src="${outName}"></script>`;
  });

  // 3) Drop the babel.min.js script tag (no longer needed at runtime).
  html = html.replace(RE_BABEL_VENDOR, '');

  // 4) Tighten CSP: strip 'unsafe-eval' from script-src.
  html = html.replace(/script-src\s+([^;]*?)'unsafe-eval'\s*/g, (m, before) => {
    return 'script-src ' + before.trim().replace(/\s+/g, ' ') + ' ';
  });

  // 5) Add build marker so it's obvious the file went through the pipeline.
  if (!html.includes(BUILD_MARKER)) {
    html = html.replace(/<\/head>/, `${BUILD_MARKER}\n</head>`);
  }

  writeFileSync(abs, html);
  console.log(`[build-jsx] rewrote ${rel} (${blockIdx} inline block${blockIdx === 1 ? '' : 's'})`);
}

console.log('[build-jsx] done');
