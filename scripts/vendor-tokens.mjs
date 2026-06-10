#!/usr/bin/env node
/**
 * vendor-tokens.mjs — copy nido/securanido design tokens into src/styles/vendor/
 *
 * Preference order:
 *   1. ~/dev/nido/crates/nido-tokens/dist/{securanido,shared}.css  (commit-pinned, best provenance)
 *   2. https://design.securanido.test/v2/{securanido,shared}.css   (live cluster, reachable from host)
 *
 * Usage: node scripts/vendor-tokens.mjs
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const destDir = resolve(repoRoot, 'src/styles/vendor');

mkdirSync(destDir, { recursive: true });

const NIDO_DIST = resolve(process.env.HOME ?? '/root', 'dev/nido/crates/nido-tokens/dist');
const CLUSTER_BASE = 'https://design.securanido.test/v2';

const brands = ['securanido', 'shared'];

function getNidoSha() {
  const nidoRepo = resolve(process.env.HOME ?? '/root', 'dev/nido');
  if (!existsSync(nidoRepo)) return null;
  try {
    return execSync('git rev-parse --short HEAD', { cwd: nidoRepo, encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function header(source, sha) {
  const shaNote = sha ? ` @ ${sha}` : '';
  return `/* vendored from ${source}${shaNote} */\n/* DO NOT EDIT — regenerate via scripts/vendor-tokens.mjs */\n\n`;
}

function fromDist(brand, sha) {
  const srcPath = resolve(NIDO_DIST, `${brand}.css`);
  if (!existsSync(srcPath)) return false;
  const content = readFileSync(srcPath, 'utf8');
  const dest = resolve(destDir, `nido-${brand}.css`);
  writeFileSync(dest, header(`~/dev/nido/crates/nido-tokens/dist/${brand}.css`, sha) + content, 'utf8');
  console.log(`[vendor-tokens] dist → ${dest} (sha ${sha ?? 'unknown'})`);
  return true;
}

function fromCluster(brand) {
  const url = `${CLUSTER_BASE}/${brand}.css`;
  let content;
  try {
    content = execSync(`curl -fsS --max-time 10 '${url}'`, { encoding: 'utf8' });
  } catch {
    throw new Error(`curl failed for ${url}`);
  }
  const dest = resolve(destDir, `nido-${brand}.css`);
  writeFileSync(dest, header(url, null) + content, 'utf8');
  console.log(`[vendor-tokens] cluster → ${dest}`);
  return true;
}

const sha = getNidoSha();
let errors = 0;

for (const brand of brands) {
  try {
    if (!fromDist(brand, sha)) {
      console.warn(`[vendor-tokens] dist not found for ${brand}, falling back to cluster`);
      fromCluster(brand);
    }
  } catch (err) {
    console.error(`[vendor-tokens] ERROR: ${err.message}`);
    errors++;
  }
}

if (errors > 0) {
  console.error(`[vendor-tokens] ${errors} brand(s) failed`);
  process.exit(1);
}
console.log('[vendor-tokens] done');
