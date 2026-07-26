import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const scriptPath = resolve(import.meta.dirname, 'check-dependency-security.mjs');

function runWithLock(lock) {
  const directory = mkdtempSync(join(tmpdir(), 'parkhub-security-'));
  const path = join(directory, 'package-lock.json');
  writeFileSync(path, JSON.stringify(lock), 'utf8');
  try {
    return spawnSync(process.execPath, [scriptPath, path], { encoding: 'utf8' });
  } finally {
    rmSync(directory, { recursive: true });
  }
}

test('a prerelease does not satisfy its stable patched floor', () => {
  const result = runWithLock({
    lockfileVersion: 3,
    packages: {
      'node_modules/astro': { version: '7.1.0-beta.1' },
    },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /astro@7\.1\.0-beta\.1 is below 7\.1\.0/);
});

test('an unsupported legacy lockfile fails closed', () => {
  const result = runWithLock({
    lockfileVersion: 1,
    dependencies: {
      astro: { version: '6.1.10' },
    },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /unsupported lockfile/);
});
