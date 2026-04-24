#!/usr/bin/env node
/**
 * gen-apple-client-secret.mjs
 *
 * Generate an ES256 JWT "client secret" for Sign in with Apple via Supabase.
 * Apple requires this token to be regenerated at least every 6 months.
 *
 * Usage:
 *   node tools/gen-apple-client-secret.mjs \
 *     --team-id     UPU6GJ5B68 \
 *     --key-id      ABCDE12345 \
 *     --services-id com.harijasllc.mymilesaiapp.signin \
 *     --p8-path     ~/Developer/MyMilesAI-Backups/apple-auth/AuthKey_ABCDE12345.p8 \
 *     [--ttl-days   180]
 *
 * Prints the JWT to stdout. Paste into Supabase → Authentication →
 * Providers → Apple → Secret Key (for OAuth flow).
 *
 * Zero deps — uses Node's built-in crypto module. Requires Node 16+.
 */

import { createSign } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { resolve } from 'node:path';

function parseArgs(argv) {
  const out = {};
  for (let i = 2; i < argv.length; i += 2) {
    const k = argv[i].replace(/^--/, '');
    out[k] = argv[i + 1];
  }
  return out;
}

function base64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function expand(p) {
  if (!p) return p;
  if (p.startsWith('~')) return resolve(homedir(), p.slice(2));
  return resolve(p);
}

const args = parseArgs(process.argv);
const teamId = args['team-id'];
const keyId = args['key-id'];
const servicesId = args['services-id'];
const p8Path = expand(args['p8-path']);
const ttlDays = Number(args['ttl-days'] || 180);

const missing = [];
if (!teamId) missing.push('--team-id');
if (!keyId) missing.push('--key-id');
if (!servicesId) missing.push('--services-id');
if (!p8Path) missing.push('--p8-path');
if (missing.length) {
  console.error(`Missing required flags: ${missing.join(', ')}\n`);
  console.error('Example:');
  console.error('  node tools/gen-apple-client-secret.mjs \\');
  console.error('    --team-id UPU6GJ5B68 \\');
  console.error('    --key-id ABCDE12345 \\');
  console.error('    --services-id com.harijasllc.mymilesaiapp.signin \\');
  console.error('    --p8-path ~/Developer/MyMilesAI-Backups/apple-auth/AuthKey_ABCDE12345.p8\n');
  process.exit(1);
}

const privateKey = readFileSync(p8Path, 'utf8');

const now = Math.floor(Date.now() / 1000);
const ttlSec = Math.min(ttlDays, 180) * 24 * 60 * 60; // Apple caps at 6 months

const header = { alg: 'ES256', kid: keyId, typ: 'JWT' };
const payload = {
  iss: teamId,
  iat: now,
  exp: now + ttlSec,
  aud: 'https://appleid.apple.com',
  sub: servicesId,
};

const encHeader = base64url(JSON.stringify(header));
const encPayload = base64url(JSON.stringify(payload));
const signingInput = `${encHeader}.${encPayload}`;

const signer = createSign('SHA256');
signer.update(signingInput);
signer.end();
const derSignature = signer.sign({ key: privateKey, dsaEncoding: 'ieee-p1363' });

const jwt = `${signingInput}.${base64url(derSignature)}`;

const expDate = new Date((now + ttlSec) * 1000).toISOString();
console.error(`[apple-secret] iss=${teamId}  kid=${keyId}  sub=${servicesId}`);
console.error(`[apple-secret] expires: ${expDate}`);
console.error(`[apple-secret] paste the JWT below into Supabase → Providers → Apple → Secret Key\n`);
console.log(jwt);
