export const SURVEY_LAYER_COLORS = [
  '#d3342d',
  '#2563eb',
  '#0f9f6e',
  '#c27803',
  '#7c3aed',
  '#0891b2',
  '#be185d',
  '#4b5563',
  '#ea580c',
  '#16a34a',
  '#0891b2',
  '#dc2626',
];

export function colorByLayer(entities, layerTable = {}) {
  const layers = [...new Set(entities.map((entity) => entity.layer || '0'))].sort();
  return new Map(layers.map((layer, index) => [
    layer,
    layerTable[layer]?.color
      || entities.find((entity) => (entity.layer || '0') === layer)?.color
      || SURVEY_LAYER_COLORS[index % SURVEY_LAYER_COLORS.length],
  ]));
}
