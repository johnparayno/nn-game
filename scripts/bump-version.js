#!/usr/bin/env node
/**
 * Bumps patch version in package.json and js/version.js.
 * Run automatically on pre-commit via husky.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const pkgPath = join(root, 'package.json');
const versionPath = join(root, 'js', 'version.js');

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const [major, minor, patch] = pkg.version.split('.').map(Number);
const newVersion = `${major}.${minor}.${patch + 1}`;

pkg.version = newVersion;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

const versionJs = `/**
 * App version - auto-updated on each commit via pre-commit hook
 */
export const VERSION = '${newVersion}';
`;
writeFileSync(versionPath, versionJs);

console.log(`Version bumped to ${newVersion}`);
