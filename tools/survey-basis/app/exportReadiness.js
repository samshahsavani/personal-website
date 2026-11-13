import { summarizeRevitUnderlay } from './core/revitUnderlayDxf.js';

export function surveyExportBlocker({ underlay, boundary }) {
  if (!underlay) return 'Open a text DXF first.';
  if (!boundary?.origin) return 'Build the property boundary first so export can use the front-left property corner as 0,0,0.';
  if (!['calibration', 'dxf-insunits'].includes(underlay?.units?.source)) {
    return 'Calibrate scale first, or import a DXF with reliable units, before exporting corrected survey data.';
  }
  return '';
}

export function renderRevitPreflight({ revitPreflight, visibleLayers, underlay }) {
  if (!revitPreflight) return;
  const summary = summarizeRevitUnderlay(revitPreflight, visibleLayers);
  const omitted = [...summary.omitted].sort(([a], [b]) => a.localeCompare(b))
    .map(([type, count]) => `${type} (${count})`);
  document.getElementById('revit-export-preflight').textContent = [
    `${summary.included.length.toLocaleString()} supported entities on visible layers.`,
    summary.flattenedCount ? `${summary.flattenedCount.toLocaleString()} included entities have Z or thickness that will be flattened.` : '',
    summary.hiddenCount ? `${summary.hiddenCount.toLocaleString()} entities on unselected layers excluded.` : '',
    summary.paperSpaceCount ? `${summary.paperSpaceCount.toLocaleString()} layout entities excluded.` : '',
    omitted.length ? `Omitted on visible layers: ${omitted.join(', ')}.` : '',
    ...(underlay.importDiagnostics || []).filter((item) => item.severity === 'warning').map((item) => item.message),
  ].filter(Boolean).join(' ');
}

export function surveyHealthText({ underlay, snapIndex }) {
  const warnings = (underlay?.importDiagnostics || []).filter((item) => item.severity === 'warning');
  const snapNote = snapIndex?.intersectionsEnabled ? '' : ' Intersection snaps disabled because the selectable vector count is high.';
  return `${snapNote}${warnings.length ? ` ${warnings.length} import warning${warnings.length === 1 ? '' : 's'}; review layer/entity support before export.` : ''}`;
}
