// The only messages leaving the sandbox report readiness, never drawing data.
window.addEventListener('message', (event) => {
  if (event.source !== window.parent || event.data?.type !== 'survey-basis:theme') return;
  if (!['light', 'dark'].includes(event.data.theme)) return;
  document.documentElement.dataset.theme = event.data.theme;
});

if (window.parent !== window) window.parent.postMessage({ type: 'survey-basis:ready' }, '*');
