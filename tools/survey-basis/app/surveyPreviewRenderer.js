const SVG_NS = 'http://www.w3.org/2000/svg';

export function renderSurveyPreview(svg, {
  entities,
  focusedLayer = '',
  isolateContext = true,
  visibleLayers = new Set(),
  layerColors = new Map(),
  propertyLayerColor = '#dc2626',
  bounds = null,
}) {
  const visibleEntities = (entities || []).filter((entity) => visibleLayers.has(entity.layer || '0'));
  if (focusedLayer && isolateContext) {
    renderContextPath(svg, visibleEntities.filter((entity) => (entity.layer || '0') !== focusedLayer));
    renderDetailedEntities(svg, visibleEntities.filter((entity) => (entity.layer || '0') === focusedLayer), {
      layerColors,
      propertyLayerColor,
      bounds,
      focusedLayer,
    });
    return;
  }

  renderDetailedEntities(svg, visibleEntities, { layerColors, propertyLayerColor, bounds, focusedLayer });
}

export function updateSurveyLayerVisibility(svg, { visibleLayers, focusedLayer = '', isolateContext = true }) {
  svg?.querySelectorAll('.survey-prep-layer').forEach((layerGroup) => {
    const isVisible = visibleLayers.has(layerGroup.dataset.layer);
    const isFocused = Boolean(focusedLayer) && layerGroup.dataset.layer === focusedLayer;
    const isMuted = Boolean(focusedLayer) && isolateContext && layerGroup.dataset.layer !== focusedLayer;
    layerGroup.style.display = isVisible ? '' : 'none';
    layerGroup.classList.toggle('survey-layer-focus', isFocused);
    layerGroup.classList.toggle('survey-layer-muted', isMuted);
  });
}

function renderContextPath(svg, entities) {
  const pathData = [];
  entities.forEach((entity) => {
    if (entity.type === 'line') pathData.push(`M ${entity.start[0]} ${entity.start[1]} L ${entity.end[0]} ${entity.end[1]}`);
    if (entity.type === 'arc') pathData.push(arcPath(entity));
    if (entity.type === 'circle') pathData.push(circlePath(entity));
  });
  if (!pathData.length) return;
  const path = svgElement('path');
  path.setAttribute('d', pathData.join(' '));
  path.setAttribute('class', 'survey-preview-context');
  svg.appendChild(path);
}

function renderDetailedEntities(svg, entities, { layerColors, propertyLayerColor, bounds, focusedLayer = '' }) {
  const layerGroups = new Map();
  entities.forEach((entity) => {
    const layer = entity.layer || '0';
    const isFocused = Boolean(focusedLayer) && focusedLayer === layer;
    const group = layerGroupForEntity(svg, layerGroups, layer, isFocused);
    renderDisplayEntity(group, entity, {
      color: isFocused ? propertyLayerColor : layerColors.get(layer) || entity.color || '#d3342d',
      bounds,
    });
  });
}

function layerGroupForEntity(svg, layerGroups, layer, isFocused) {
  if (!layerGroups.has(layer)) {
    const group = svgElement('g');
    group.setAttribute('class', `survey-prep-layer${isFocused ? ' survey-layer-focus' : ''}`);
    group.setAttribute('data-layer', layer);
    svg.appendChild(group);
    layerGroups.set(layer, group);
  }
  return layerGroups.get(layer);
}

function renderDisplayEntity(svg, entity, { color, bounds }) {
  let node = null;

  if (entity.type === 'line') {
    node = svgElement('line');
    node.setAttribute('x1', entity.start[0]);
    node.setAttribute('y1', entity.start[1]);
    node.setAttribute('x2', entity.end[0]);
    node.setAttribute('y2', entity.end[1]);
  }
  if (entity.type === 'circle') {
    node = svgElement('circle');
    node.setAttribute('cx', entity.center[0]);
    node.setAttribute('cy', entity.center[1]);
    node.setAttribute('r', entity.radius);
  }
  if (entity.type === 'arc') {
    node = svgElement('path');
    node.setAttribute('d', arcPath(entity));
  }
  if (entity.type === 'point') node = pointNode(entity, bounds);
  if (entity.type === 'solid') {
    node = svgElement('polygon');
    node.setAttribute('points', entity.points.map((point) => point.join(',')).join(' '));
  }
  if (entity.type === 'text') {
    node = svgElement('text');
    node.setAttribute('font-size', Math.max(entity.height || 1, 0.35));
    node.setAttribute('transform', `translate(${entity.point.join(' ')}) rotate(${entity.rotation || 0}) scale(1 -1)`);
    node.setAttribute('text-anchor', entity.anchor || 'start');
    node.setAttribute('dominant-baseline', entity.baseline || 'alphabetic');
    node.textContent = entity.text || '';
  }

  if (!node) return;
  node.setAttribute('stroke', color);
  if (isDashedLineType(entity.lineType)) node.setAttribute('stroke-dasharray', '6 4');
  node.style.color = color;
  node.setAttribute('data-layer', entity.layer || '0');
  node.setAttribute('class', `survey-prep-entity survey-prep-${entity.type}`);
  svg.appendChild(node);
}

function pointNode(entity, bounds) {
  const node = svgElement('g');
  const [x, y] = entity.point;
  const size = pointMarkerSize(bounds);
  [
    [[x - size, y], [x + size, y]],
    [[x, y - size], [x, y + size]],
  ].forEach(([start, end]) => {
    const line = svgElement('line');
    line.setAttribute('x1', start[0]);
    line.setAttribute('y1', start[1]);
    line.setAttribute('x2', end[0]);
    line.setAttribute('y2', end[1]);
    node.appendChild(line);
  });
  return node;
}

function pointMarkerSize(bounds) {
  const extent = Math.max(bounds?.width || 0, bounds?.depth || 0, 1);
  return Math.max(0.06, Math.min(0.22, extent * 0.00008));
}

function circlePath(entity) {
  const { center, radius } = entity;
  return `M ${center[0] - radius} ${center[1]} A ${radius} ${radius} 0 1 0 ${center[0] + radius} ${center[1]} A ${radius} ${radius} 0 1 0 ${center[0] - radius} ${center[1]}`;
}

function arcPath(entity) {
  const start = polarPoint(entity.center, entity.radius, entity.startAngle);
  const end = polarPoint(entity.center, entity.radius, entity.endAngle);
  const delta = ((entity.endAngle - entity.startAngle) % 360 + 360) % 360;
  const largeArc = delta > 180 ? 1 : 0;
  return `M ${start[0]} ${start[1]} A ${entity.radius} ${entity.radius} 0 ${largeArc} 1 ${end[0]} ${end[1]}`;
}

function polarPoint(center, radius, angleDegrees) {
  const radians = (angleDegrees * Math.PI) / 180;
  return [center[0] + Math.cos(radians) * radius, center[1] + Math.sin(radians) * radius];
}

function isDashedLineType(lineType = '') {
  return /dash|hidden|center|phantom|border/i.test(lineType);
}

function svgElement(tag) {
  return document.createElementNS(SVG_NS, tag);
}
