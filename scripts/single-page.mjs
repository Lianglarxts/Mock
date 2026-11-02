// Packs the Vite build (dist/) into ONE self-contained page for the claude.ai Artifact viewer.
// The viewer only loads scripts from a few public CDNs, so the app's JS and CSS are inlined.
// It also adds its own <html>/<head>/<body>, so only the head contents + the app are written.
// Usage: npm run build:single  →  dist-single/lumen-deal.html
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const outDir = path.join(root, 'dist-single');
const out = path.join(outDir, 'lumen-deal.html');

const html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const js = html.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/);
const css = html.match(/<link rel="stylesheet" crossorigin href="([^"]+)">/);
if (!js || !css) throw new Error('Could not find the built script/stylesheet in dist/index.html. Run "npm run build" first.');

const read = (p) => fs.readFileSync(path.join(dist, p.replace(/^\.?\//, '')), 'utf8');
const jsCode = read(js[1]).replace(/<\/script/gi, '<\/script');
const cssCode = read(css[1]).replace(/<\/style/gi, '<\/style');
const head = html
  .match(/<head>([\s\S]*?)<\/head>/)[1]
  .replace(js[0], '')
  .replace(css[0], '')
  .replace(/<meta charset[^>]*>\s*/, '')
  .replace(/<meta name="viewport"[^>]*>\s*/, '')
  .replace(/<link rel="icon"[^>]*>\s*/, '');

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(out, `${head.trim()}\n<style>${cssCode}</style>\n<div id="root"></div>\n<script type="module">${jsCode}</script>\n`);
console.log(`Wrote ${path.relative(root, out)} (${Math.round(fs.statSync(out).size / 1024)} KB)`);
