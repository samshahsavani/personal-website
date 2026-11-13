import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../../../', import.meta.url);

test('hosted and offline tools are self-contained, with a valid script hash and no network access', async () => {
  const hosted = await readFile(new URL('public/tools/survey-basis/workspace.html', root), 'utf8');
  const offline = await readFile(new URL('public/tools/survey-basis/Survey-Basis.html', root), 'utf8');
  assert.equal(hosted, offline);
  const policy = hosted.match(/http-equiv="Content-Security-Policy" content="([^"]+)"/)[1];
  const script = hosted.match(/<script>([\s\S]+?)<\/script>/)[1];
  const hash = createHash('sha256').update(script).digest('base64');
  assert.ok(policy.includes(`script-src 'sha256-${hash}'`));
  assert.ok(policy.includes("default-src 'none'"));
  assert.ok(policy.includes("connect-src 'none'"));
  assert.ok(policy.includes("form-action 'none'"));
  assert.doesNotMatch(hosted, /<(?:script|link|img)[^>]+(?:src|href)="https?:/i);
  assert.doesNotMatch(hosted, /bloom|survey[ -]?2/i);
});

test('survey source has no upload or persistence APIs and the website sandbox denies origin access', async () => {
  const app = new URL('../app/', import.meta.url);
  for (const path of await readdir(app, { recursive: true })) {
    if (!path.endsWith('.js')) continue;
    const source = await readFile(new URL(path, app), 'utf8');
    assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon|localStorage|sessionStorage|indexedDB|serviceWorker)\b|document\.cookie/, path);
    if (path !== 'website.js') assert.doesNotMatch(source, /postMessage\s*\(/, path);
  }
  const wrapper = await readFile(new URL('components/SurveyBasisWorkspace.tsx', root), 'utf8');
  assert.match(wrapper, /sandbox="allow-scripts allow-downloads"/);
  assert.doesNotMatch(wrapper, /allow-same-origin|allow-forms|allow-top-navigation/);
});
