#!/usr/bin/env node
/**
 * Deterministic lockfile ratchet for advisories already observed by GitHub.
 *
 * GitHub's dependency review action catches vulnerable dependency changes on
 * pull requests. This local check complements it by preventing the exact
 * vulnerable versions removed in T-8739 from returning to package-lock.json.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '..');
if (process.argv.length > 3) {
  console.error('[dependency-security] usage: check-dependency-security.mjs [package-lock.json]');
  process.exit(1);
}

const lockPath = process.argv[2] ? resolve(process.argv[2]) : resolve(repoRoot, 'package-lock.json');
const lock = JSON.parse(readFileSync(lockPath, 'utf8'));
if (
  lock.lockfileVersion !== 3 ||
  lock.packages === null ||
  typeof lock.packages !== 'object' ||
  Array.isArray(lock.packages)
) {
  console.error('[dependency-security] unsupported lockfile: expected lockfileVersion 3 packages');
  process.exit(1);
}

const patchedFloors = new Map([
  [
    'astro',
    {
      version: '7.1.0',
      advisories: [
        'GHSA-8hv8-536x-4wqp',
        'GHSA-2pvr-wf23-7pc7',
        'GHSA-jrpj-wcv7-9fh9',
        'GHSA-4g3v-8h47-v7g6',
        'GHSA-7pw4-f3q4-r2p2',
        'GHSA-f48w-9m4c-m7f5',
      ],
    },
  ],
  [
    'vite',
    {
      version: '8.0.16',
      advisories: ['GHSA-fx2h-pf6j-xcff', 'GHSA-v6wh-96g9-6wx3'],
    },
  ],
  ['esbuild', { version: '0.28.1', advisories: ['GHSA-g7r4-m6w7-qqqr'] }],
  ['@babel/core', { version: '7.29.6', advisories: ['GHSA-4x5r-pxfx-6jf8'] }],
  ['svgo', { version: '4.0.2', advisories: ['GHSA-2p49-hgcm-8545'] }],
  [
    'fast-uri',
    {
      version: '3.1.4',
      advisories: ['GHSA-4c8g-83qw-93j6', 'GHSA-v2hh-gcrm-f6hx'],
    },
  ],
  ['sharp', { version: '0.35.0', advisories: ['GHSA-f88m-g3jw-g9cj'] }],
  ['yaml', { version: '2.8.3', advisories: ['GHSA-48c2-rrv3-qjmp'] }],
]);

function compareVersions(actual, minimum) {
  const parse = (value) => {
    const match =
      /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(value);
    if (!match) {
      throw new Error(`unsupported non-semver version: ${value}`);
    }
    return {
      numbers: match.slice(1, 4).map(Number),
      prerelease: match[4] ?? null,
    };
  };

  const left = parse(actual);
  const right = parse(minimum);
  for (let index = 0; index < left.numbers.length; index += 1) {
    if (left.numbers[index] !== right.numbers[index]) {
      return left.numbers[index] - right.numbers[index];
    }
  }
  if (left.prerelease !== null && right.prerelease === null) return -1;
  if (left.prerelease === null && right.prerelease !== null) return 1;
  if (left.prerelease !== right.prerelease) {
    return left.prerelease.localeCompare(right.prerelease);
  }
  return 0;
}

const failures = [];
let checked = 0;

for (const [path, entry] of Object.entries(lock.packages ?? {})) {
  const marker = 'node_modules/';
  const markerIndex = path.lastIndexOf(marker);
  if (markerIndex === -1 || typeof entry.version !== 'string') continue;

  const packageName = path.slice(markerIndex + marker.length);
  const floor = patchedFloors.get(packageName);
  if (!floor) continue;

  checked += 1;
  if (compareVersions(entry.version, floor.version) < 0) {
    failures.push(
      `${packageName}@${entry.version} is below ${floor.version} (${floor.advisories.join(', ')})`,
    );
  }
}

if (failures.length > 0) {
  console.error('[dependency-security] vulnerable lockfile versions detected:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`[dependency-security] ${checked} advisory-sensitive lock entries satisfy patched floors`);
