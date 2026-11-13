import { parseDxfSurvey } from './dxfSurveyImport.js';

export function importSurveyDxf(text, options = {}) {
  const underlay = parseDxfSurvey(text, options);
  const selectableGeometry = buildSelectableGeometry([
    ...(underlay.entities || []),
    ...(underlay.displayEntities || []),
  ]);

  return {
    ...underlay,
    preview: buildInternalDxfPreview(underlay),
    selectableGeometry,
    importDiagnostics: [
      ...(underlay.diagnostics || []),
      {
        severity: 'info',
        code: 'internal-dxf-preview',
        message: 'Using the internal DXF preview renderer. A CAD-engine SVG preview can replace this without changing survey intelligence.',
      },
    ],
  };
}

export function surveyPreviewEntities(underlay) {
  return underlay?.preview?.displayEntities?.length
    ? underlay.preview.displayEntities
    : underlay?.displayEntities?.length
      ? underlay.displayEntities
      : underlay?.entities || [];
}

export function surveySelectableLines(underlay, layer = null) {
  const lines = underlay?.selectableGeometry?.lines || underlay?.entities || [];
  return layer
    ? lines.filter((line) => (line.layer || '0') === layer)
    : lines;
}

export function surveySelectableLayers(underlay) {
  const layerStats = underlay?.selectableGeometry?.layers || [];
  return layerStats.map((layer) => layer.name).sort();
}

function buildInternalDxfPreview(underlay) {
  return {
    engine: 'internal-dxf',
    kind: 'display-entities',
    fidelity: 'fallback',
    displayEntities: underlay.displayEntities || [],
    bounds: underlay.bounds,
    viewBounds: underlay.viewBounds,
  };
}

function buildSelectableGeometry(lines = []) {
  const seen = new Set();
  const cleanLines = lines
    .filter((entity) => entity.type === 'line')
    .map((line) => {
      const id = lineKey(line);
      return {
        id,
        type: 'line',
        layer: line.layer || '0',
        start: line.start,
        end: line.end,
        lineType: line.lineType || 'Continuous',
      };
    })
    .filter((line) => {
      if (seen.has(line.id)) return false;
      seen.add(line.id);
      return true;
    });

  return {
    intent: 'survey-intelligence',
    description: 'Vectors used for calibration, alignment, snapping, and property boundary tracing. Visual CAD fidelity belongs to preview.',
    lines: cleanLines,
    layers: layerStats(cleanLines),
  };
}

function layerStats(lines) {
  const counts = new Map();
  lines.forEach((line) => counts.set(line.layer || '0', (counts.get(line.layer || '0') || 0) + 1));
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, lineCount]) => ({ name, lineCount }));
}

function lineKey(line) {
  return [
    line.layer || '0',
    round4(line.start[0]),
    round4(line.start[1]),
    round4(line.end[0]),
    round4(line.end[1]),
  ].join(':');
}

function round4(value) {
  return Math.round(value * 10000) / 10000;
}
