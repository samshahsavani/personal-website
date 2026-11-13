import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { build, transform } from 'esbuild';

const root = new URL('../', import.meta.url);
const source = new URL('tools/survey-basis/app/', root);
const output = new URL('public/tools/survey-basis/', root);
const template = await readFile(new URL('index.html', source), 'utf8');
const styleTag = '<link rel="stylesheet" href="./surveyPrep.css" />';
const scriptTag = '<script type="module" src="./main.js"></script>';
if (!template.includes(styleTag) || !template.includes(scriptTag)) throw new Error('Survey Basis template insertion points are missing.');

const font = await readFile(new URL('node_modules/geist/dist/fonts/geist-sans/Geist-Regular.woff2', root));
const mono = await readFile(new URL('node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.woff2', root));
const fonts = `@font-face{font-family:Geist;src:url(data:font/woff2;base64,${font.toString('base64')}) format('woff2');font-display:swap}@font-face{font-family:GeistMono;src:url(data:font/woff2;base64,${mono.toString('base64')}) format('woff2');font-display:swap}`;
const css = await transform(fonts + await readFile(new URL('surveyPrep.css', source), 'utf8'), { loader: 'css', minify: true });
const js = await build({
  absWorkingDir: fileURLToPath(source),
  stdin: { contents: "import './main.js'; import './website.js';", resolveDir: fileURLToPath(source) },
  bundle: true, format: 'iife', minify: true, write: false, target: ['es2020'],
});
const script = js.outputFiles[0].text.trimEnd();
const hash = createHash('sha256').update(script).digest('base64');
// This app cannot upload, load third-party code, or submit forms. The website
// additionally embeds it in an opaque-origin sandbox, blocking browser storage.
const csp = `default-src 'none'; script-src 'sha256-${hash}'; style-src 'unsafe-inline'; font-src data:; img-src data: blob:; connect-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'`;
const html = template
  .replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n  <meta http-equiv="Content-Security-Policy" content="${csp}" />\n  <meta name="robots" content="noindex" />`)
  .replace(styleTag, () => `<style>${css.code.trimEnd()}</style>`)
  .replace(scriptTag, () => `<script>${script}</script>`);
if (/bloom|survey[ -]?2|https?:\/\/(?!www\.w3\.org\/2000\/svg)/i.test(html)) throw new Error('Unexpected branding or external URL in Survey Basis.');
await mkdir(output, { recursive: true });
await Promise.all(['workspace.html', 'Survey-Basis.html'].map((name) => writeFile(new URL(name, output), html)));
console.log(`Survey Basis: built self-contained workspace and offline download (${Math.round(Buffer.byteLength(html) / 1024)} KB each).`);
