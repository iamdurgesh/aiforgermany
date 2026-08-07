/**
 * Post-build: hash-based Content Security Policy (WORKING MAP §6.9,
 * no 'unsafe-inline' for scripts).
 *
 * Angular's autoCsp cannot be combined with SSR. Instead: hash all inline
 * scripts of the prerendered pages with sha256 and replace the CSP line
 * in dist/browser/_headers.
 *
 * style-src stays 'unsafe-inline': SSR inlines critical CSS per page
 * (variable content) — for styles this is the usual, low-risk compromise.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BROWSER_DIR = 'dist/browser';
const HEADERS_FILE = join(BROWSER_DIR, '_headers');
const CSP_PLACEHOLDER = "Content-Security-Policy: frame-ancestors 'none'";

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await htmlFiles(path)));
    } else if (entry.name.endsWith('.html')) {
      files.push(path);
    }
  }
  return files;
}

const hashes = new Set();
for (const file of await htmlFiles(BROWSER_DIR)) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attributes, content] = match;
    // Only executable inline scripts: no src, no pure data block.
    if (/(^|\s)src\s*=/.test(attributes) || /type\s*=\s*"application\/json"/.test(attributes)) {
      continue;
    }
    hashes.add(`'sha256-${createHash('sha256').update(content).digest('base64')}'`);
  }
}

const scriptSrc = ["'self'", ...[...hashes].sort()].join(' ');
const csp =
  'Content-Security-Policy: ' +
  [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

const headers = await readFile(HEADERS_FILE, 'utf8');
if (!headers.includes(CSP_PLACEHOLDER)) {
  throw new Error(`CSP placeholder line not found in ${HEADERS_FILE}.`);
}
await writeFile(HEADERS_FILE, headers.replace(CSP_PLACEHOLDER, csp));
console.log(`CSP: ${hashes.size} inline script hash(es) written to _headers.`);
