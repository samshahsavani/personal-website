import { dxfPairs, isDxfPaperSpace } from './dxfText.js';

const MAX_UNDERLAY_ENTITIES = 5000;
const MAX_DISPLAY_ENTITIES = 20000;
const CURVE_SEGMENT_COUNT = 24;
const FEET_PER_US_SURVEY_FOOT = (1200 / 3937) / 0.3048;
const UNIT_DEFINITIONS = Object.freeze({
  unitless: { id: 'unitless', label: 'Unspecified (calibration required)', feetPerDrawingUnit: 1 },
  inches: { id: 'inches', label: 'Inches', feetPerDrawingUnit: 1 / 12 },
  feet: { id: 'feet', label: 'Feet', feetPerDrawingUnit: 1 },
  yards: { id: 'yards', label: 'Yards', feetPerDrawingUnit: 3 },
  miles: { id: 'miles', label: 'Miles', feetPerDrawingUnit: 5280 },
  millimeters: { id: 'millimeters', label: 'Millimeters', feetPerDrawingUnit: 1 / 304.8 },
  centimeters: { id: 'centimeters', label: 'Centimeters', feetPerDrawingUnit: 1 / 30.48 },
  meters: { id: 'meters', label: 'Meters', feetPerDrawingUnit: 1 / 0.3048 },
  kilometers: { id: 'kilometers', label: 'Kilometers', feetPerDrawingUnit: 1000 / 0.3048 },
  surveyFeet: { id: 'surveyFeet', label: 'US Survey Feet', feetPerDrawingUnit: FEET_PER_US_SURVEY_FOOT },
});

const INSUNITS_TO_UNIT_ID = Object.freeze({
  0: 'unitless',
  1: 'inches',
  2: 'feet',
  3: 'miles',
  4: 'millimeters',
  5: 'centimeters',
  6: 'meters',
  7: 'kilometers',
  10: 'yards',
  21: 'surveyFeet',
});

const SUPPORTED_MODEL_SPACE_ENTITY_TYPES = new Set([
  'LINE',
  'LWPOLYLINE',
  'POLYLINE',
  'SPLINE',
  'LEADER',
  'CIRCLE',
  'ARC',
  'ELLIPSE',
  'HATCH',
  'POINT',
  'SOLID',
  'TRACE',
  '3DFACE',
  'TEXT',
  'MTEXT',
  'ATTRIB',
  'ATTDEF',
  'DIMENSION',
  'INSERT',
]);

const ACI_COLORS = Object.freeze({
  1: '#ff0000',
  2: '#ffff00',
  3: '#00ff00',
  4: '#00ffff',
  5: '#0000ff',
  6: '#ff00ff',
  7: '#111827',
  8: '#808080',
  9: '#c0c0c0',
  30: '#ff7f00',
  40: '#ffbf00',
  70: '#7fff00',
  90: '#00ff7f',
  130: '#007fff',
  170: '#7f00ff',
  210: '#ff007f',
  250: '#333333',
  251: '#555555',
  252: '#777777',
  253: '#999999',
  254: '#bbbbbb',
  255: '#ffffff',
});

export function parseDxfSurvey(text, options = {}) {
  const pairs = dxfPairs(text);
  const units = resolveDxfUnits(pairs, options.units);
  const layerTable = readLayerTable(pairs);
  const blocks = readBlockDefinitions(pairs, layerTable);
  const entityStats = readModelSpaceEntityStats(pairs);
  const rawDisplayEntities = readModelSpaceDisplayEntities(pairs, blocks, layerTable);
  const displayEntities = rawDisplayEntities.slice(0, MAX_DISPLAY_ENTITIES);
  const directLineEntities = readModelSpaceDirectLineEntities(pairs, layerTable);
  const lineEntities = directLineEntities.length ? directLineEntities : displayEntities.filter((entity) => entity.type === 'line');
  const drawableLineEntities = lineEntities.filter(isDrawableLine);
  const cleanEntities = drawableLineEntities.slice(0, MAX_UNDERLAY_ENTITIES);
  if (!cleanEntities.length) {
    throw new Error('No supported survey linework was found. This pass supports DXF LINE and polyline entities.');
  }

  const sourceBounds = displayBounds(displayEntities.length ? displayEntities : cleanEntities);
  const normalizedEntities = cleanEntities.map((entity) => ({
    ...entity,
    start: normalizePoint(entity.start, sourceBounds),
    end: normalizePoint(entity.end, sourceBounds),
  }));
  const normalizedDisplayEntities = displayEntities.map((entity) => normalizeDisplayEntity(entity, sourceBounds));
  const normalizedBounds = displayBounds(normalizedDisplayEntities.length ? normalizedDisplayEntities : normalizedEntities);
  const viewBounds = displayBounds(normalizedEntities);

  return {
    kind: 'survey-underlay',
    sourceFileName: options.fileName || 'survey.dxf',
    format: 'dxf',
    importedAt: new Date().toISOString(),
    entityCount: cleanEntities.length,
    displayEntityCount: normalizedDisplayEntities.length,
    units,
    layerTable,
    sourceBounds,
    bounds: normalizedBounds,
    viewBounds,
    diagnostics: buildImportDiagnostics({
      entityStats,
      displayEntityCount: rawDisplayEntities.length,
      displayEntityCap: MAX_DISPLAY_ENTITIES,
      selectableEntityCount: drawableLineEntities.length,
      selectableEntityCap: MAX_UNDERLAY_ENTITIES,
    }),
    transform: {
      unitScaleToFeet: units.feetPerDrawingUnit,
      scale: 1,
      rotation: 0,
      offset: [0, 0],
      geometryMatrix: [1, 0, 0, 1, 0, 0],
    },
    entities: normalizedEntities,
    displayEntities: normalizedDisplayEntities,
  };
}

function buildImportDiagnostics({
  entityStats,
  displayEntityCount,
  displayEntityCap,
  selectableEntityCount,
  selectableEntityCap,
}) {
  const diagnostics = [];
  const unsupported = [...entityStats.entries()]
    .filter(([type]) => !SUPPORTED_MODEL_SPACE_ENTITY_TYPES.has(type))
    .map(([type, count]) => `${type} (${count})`);

  if (unsupported.length) {
    diagnostics.push({
      severity: 'warning',
      code: 'unsupported-dxf-entities',
      message: `Skipped unsupported DXF entity types: ${unsupported.join(', ')}.`,
    });
  }

  if (displayEntityCount > displayEntityCap) {
    diagnostics.push({
      severity: 'warning',
      code: 'display-entity-cap',
      message: `Preview capped at ${displayEntityCap.toLocaleString()} display entities out of ${displayEntityCount.toLocaleString()}.`,
    });
  }

  if (selectableEntityCount > selectableEntityCap) {
    diagnostics.push({
      severity: 'warning',
      code: 'selectable-entity-cap',
      message: `Selectable survey vectors capped at ${selectableEntityCap.toLocaleString()} out of ${selectableEntityCount.toLocaleString()}.`,
    });
  }

  if (!diagnostics.length) {
    diagnostics.push({
      severity: 'info',
      code: 'dxf-import-complete',
      message: 'DXF model-space geometry imported without parser warnings.',
    });
  }

  return diagnostics;
}

function readSectionName(pairs, index) {
  const pair = pairs[index];
  return pair?.code === 2 ? pair.value.toUpperCase() : null;
}

export function surveyUnitDefinition(unitId) {
  return UNIT_DEFINITIONS[unitId] || UNIT_DEFINITIONS.unitless;
}

export function surveyUnitOptions() {
  return Object.values(UNIT_DEFINITIONS).map((unit) => ({ ...unit }));
}

function resolveDxfUnits(pairs, requestedUnitId) {
  const requested = requestedUnitId ? surveyUnitDefinition(requestedUnitId) : null;
  if (requested) return { ...requested, source: 'manual', insunits: null };

  const insunits = readHeaderVariableNumber(pairs, '$INSUNITS');
  const detectedUnitId = INSUNITS_TO_UNIT_ID[insunits];
  const unit = detectedUnitId ? surveyUnitDefinition(detectedUnitId) : UNIT_DEFINITIONS.unitless;
  return {
    ...unit,
    source: unit.id === 'unitless' ? 'fallback' : 'dxf-insunits',
    insunits: Number.isFinite(insunits) ? insunits : null,
  };
}

function readHeaderVariableNumber(pairs, variableName) {
  for (let i = 0; i < pairs.length - 1; i += 1) {
    if (pairs[i].code === 9 && pairs[i].value.toUpperCase() === variableName) {
      const valuePair = pairs[i + 1];
      if (valuePair.code !== 70 || !valuePair.value) return null;
      const value = Number(valuePair?.value);
      return Number.isFinite(value) ? value : null;
    }
  }
  return null;
}

function readLayerTable(pairs) {
  const layers = {};
  let inTables = false;
  let inLayerTable = false;

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];
    const value = pair.value?.toUpperCase?.();
    if (pair.code === 0 && value === 'SECTION') {
      inTables = readSectionName(pairs, i + 1) === 'TABLES';
      inLayerTable = false;
      continue;
    }
    if (inTables && pair.code === 0 && value === 'ENDSEC') {
      inTables = false;
      inLayerTable = false;
      continue;
    }
    if (!inTables) continue;
    if (pair.code === 0 && value === 'TABLE') {
      inLayerTable = readSectionName(pairs, i + 1) === 'LAYER';
      continue;
    }
    if (inLayerTable && pair.code === 0 && value === 'ENDTAB') {
      inLayerTable = false;
      continue;
    }
    if (inLayerTable && pair.code === 0 && value === 'LAYER') {
      const data = readDxfEntityData(pairs, i + 1);
      const name = data.groups[2] || '0';
      const colorIndex = numberOrNull(data.groups[62]) ?? 7;
      layers[name] = {
        name,
        color: colorFromTrueOrAci(data.groups[420], colorIndex),
        colorIndex,
        lineType: data.groups[6] || 'Continuous',
        isOff: colorIndex < 0,
      };
      i = data.nextIndex - 1;
    }
  }

  if (!layers['0']) layers['0'] = { name: '0', color: '#111827', colorIndex: 7, lineType: 'Continuous', isOff: false };
  return layers;
}

function readBlockDefinitions(pairs, layerTable) {
  const blocks = {};
  let inBlocks = false;

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];
    const value = pair.value?.toUpperCase?.();
    if (pair.code === 0 && value === 'SECTION') {
      inBlocks = readSectionName(pairs, i + 1) === 'BLOCKS';
      continue;
    }
    if (inBlocks && pair.code === 0 && value === 'ENDSEC') {
      inBlocks = false;
      continue;
    }
    if (!inBlocks || pair.code !== 0 || value !== 'BLOCK') continue;

    const header = readDxfEntityData(pairs, i + 1);
    const name = header.groups[2] || header.groups[3];
    const block = { name, base: pointFromGroups(header.groups, 10, 20, [0, 0]), entities: [] };
    i = header.nextIndex;
    for (; i < pairs.length; i += 1) {
      if (pairs[i].code === 0 && pairs[i].value.toUpperCase() === 'ENDBLK') break;
      if (pairs[i].code !== 0) continue;
      const parsed = parseDisplayEntity(pairs, i, layerTable);
      block.entities.push(...parsed.entities);
      i = parsed.nextIndex - 1;
    }
    if (name) blocks[name] = block;
  }

  return blocks;
}

function readModelSpaceDisplayEntities(pairs, blocks, layerTable) {
  const entities = [];
  let inEntities = false;

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];
    const value = pair.value?.toUpperCase?.();
    if (pair.code === 0 && value === 'SECTION') {
      inEntities = readSectionName(pairs, i + 1) === 'ENTITIES';
      continue;
    }
    if (inEntities && pair.code === 0 && value === 'ENDSEC') {
      inEntities = false;
      continue;
    }
    if (!inEntities || pair.code !== 0) continue;

    const parsed = parseDisplayEntity(pairs, i, layerTable);
    if (!isDxfPaperSpace(pairs, i)) parsed.entities.forEach((entity) => {
      if (entity.type === 'insert') entities.push(...expandInsert(entity, blocks, layerTable));
      else entities.push(entity);
    });
    i = parsed.nextIndex - 1;
  }

  return entities.filter(isDrawableDisplayEntity);
}

function readModelSpaceEntityStats(pairs) {
  const counts = new Map();
  let inEntities = false;

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];
    const value = pair.value?.toUpperCase?.();
    if (pair.code === 0 && value === 'SECTION') {
      inEntities = readSectionName(pairs, i + 1) === 'ENTITIES';
      continue;
    }
    if (inEntities && pair.code === 0 && value === 'ENDSEC') {
      inEntities = false;
      continue;
    }
    if (!inEntities || pair.code !== 0 || isEntityBookkeepingMarker(value) || isDxfPaperSpace(pairs, i)) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }

  return counts;
}

function isEntityBookkeepingMarker(value) {
  return ['SECTION', 'ENDSEC', 'EOF', 'VERTEX', 'SEQEND', 'ENDBLK'].includes(value);
}

function readModelSpaceDirectLineEntities(pairs, layerTable) {
  const lines = [];
  let inEntities = false;

  for (let i = 0; i < pairs.length; i += 1) {
    const pair = pairs[i];
    const value = pair.value?.toUpperCase?.();
    if (pair.code === 0 && value === 'SECTION') {
      inEntities = readSectionName(pairs, i + 1) === 'ENTITIES';
      continue;
    }
    if (inEntities && pair.code === 0 && value === 'ENDSEC') {
      inEntities = false;
      continue;
    }
    if (!inEntities || pair.code !== 0 || value === 'INSERT') continue;

    const parsed = parseDisplayEntity(pairs, i, layerTable);
    if (!isDxfPaperSpace(pairs, i)) lines.push(...parsed.entities.filter((entity) => entity.type === 'line'));
    i = parsed.nextIndex - 1;
  }

  return lines;
}

function parseDisplayEntity(pairs, index, layerTable) {
  const entityType = pairs[index]?.value?.toUpperCase?.() || '';
  if (entityType === 'POLYLINE') return parseLegacyPolylineEntity(pairs, index, layerTable);

  const data = readDxfEntityData(pairs, index + 1);
  const layer = data.layer;
  const colorInfo = entityColorInfo(data, layerTable);
  const withDisplayColor = (entity) => ({ ...entity, ...colorInfo });

  if (entityType === 'LINE') {
    return {
      nextIndex: data.nextIndex,
      entities: [withDisplayColor({
        type: 'line',
        layer,
        start: pointFromGroups(data.groups, 10, 20),
        end: pointFromGroups(data.groups, 11, 21),
      })],
    };
  }

  if (entityType === 'LWPOLYLINE') {
    const vertices = lwPolylineVertices(data.pairs);
    return {
      nextIndex: data.nextIndex,
      entities: verticesToLines(vertices, layer, data.closed).map(withDisplayColor),
    };
  }

  if (entityType === 'SPLINE' || entityType === 'LEADER') {
    const vertices = verticesFromRepeatedCodes(data.repeated, 10, 20);
    return {
      nextIndex: data.nextIndex,
      entities: verticesToLines(vertices, layer, false).map(withDisplayColor),
    };
  }

  if (entityType === 'CIRCLE' || entityType === 'ARC') {
    return {
      nextIndex: data.nextIndex,
      entities: [withDisplayColor({
        type: entityType.toLowerCase(),
        layer,
        center: pointFromGroups(data.groups),
        radius: numberOrNull(data.groups[40]) ?? 0,
        startAngle: numberOrNull(data.groups[50]) ?? 0,
        endAngle: numberOrNull(data.groups[51]) ?? 360,
      })],
    };
  }

  if (entityType === 'ELLIPSE') {
    return {
      nextIndex: data.nextIndex,
      entities: ellipseToLines(data.groups, layer).map(withDisplayColor),
    };
  }

  if (entityType === 'HATCH') {
    return {
      nextIndex: data.nextIndex,
      entities: hatchToLines(data, layer).map(withDisplayColor),
    };
  }

  if (entityType === 'POINT') {
    return {
      nextIndex: data.nextIndex,
      entities: [withDisplayColor({ type: 'point', layer, point: pointFromGroups(data.groups) })],
    };
  }

  if (entityType === 'SOLID' || entityType === 'TRACE' || entityType === '3DFACE') {
    return {
      nextIndex: data.nextIndex,
      entities: [withDisplayColor({ type: 'solid', layer, points: solidPoints(data.groups) })],
    };
  }

  if (entityType === 'TEXT' || entityType === 'MTEXT' || entityType === 'ATTRIB' || entityType === 'ATTDEF') {
    return {
      nextIndex: data.nextIndex,
      entities: [withDisplayColor(textEntityFromData(data, entityType, layer))],
    };
  }

  if (entityType === 'DIMENSION') {
    const blockName = data.groups[2] || '';
    const fallback = dimensionFallbackLines(data, layer).map(withDisplayColor);
    const blockInsert = blockName ? [withDisplayColor({
      type: 'insert',
      layer,
      blockName,
      point: [0, 0],
      scale: [1, 1],
      rotation: 0,
    })] : [];
    return { nextIndex: data.nextIndex, entities: [...blockInsert, ...fallback] };
  }

  if (entityType === 'INSERT') {
    return {
      nextIndex: data.nextIndex,
      entities: [withDisplayColor({
        type: 'insert',
        layer,
        blockName: data.groups[2] || '',
        point: pointFromGroups(data.groups),
        scale: [numberOrNull(data.groups[41]) ?? 1, numberOrNull(data.groups[42]) ?? 1],
        rotation: numberOrNull(data.groups[50]) ?? 0,
        columnCount: Math.max(1, Math.round(numberOrNull(data.groups[70]) ?? 1)),
        rowCount: Math.max(1, Math.round(numberOrNull(data.groups[71]) ?? 1)),
        columnSpacing: numberOrNull(data.groups[44]) ?? 0,
        rowSpacing: numberOrNull(data.groups[45]) ?? 0,
      })],
    };
  }

  return { nextIndex: data.nextIndex, entities: [] };
}

function parseLegacyPolylineEntity(pairs, index, layerTable) {
  const data = readDxfEntityData(pairs, index + 1);
  const vertices = [];
  let nextIndex = data.nextIndex;

  for (let i = data.nextIndex; i < pairs.length; i += 1) {
    const value = pairs[i].value?.toUpperCase?.();
    if (pairs[i].code === 0 && value === 'SEQEND') {
      nextIndex = i + 1;
      break;
    }
    if (pairs[i].code === 0 && value === 'VERTEX') {
      const vertexData = readDxfEntityData(pairs, i + 1);
      vertices.push({
        point: pointFromGroups(vertexData.groups),
        bulge: numberOrNull(vertexData.groups[42]) || 0,
      });
      i = vertexData.nextIndex - 1;
    }
  }

  const colorInfo = entityColorInfo(data, layerTable);
  return {
    nextIndex,
    entities: verticesToLines(vertices, data.layer, data.closed).map((entity) => ({ ...entity, ...colorInfo })),
  };
}

function readDxfEntityData(pairs, index) {
  const groups = {};
  const repeated = {};
  const entityPairs = [];
  let nextIndex = pairs.length;

  for (let i = index; i < pairs.length; i += 1) {
    const pair = pairs[i];
    if (pair.code === 0) {
      nextIndex = i;
      break;
    }
    entityPairs.push(pair);
    groups[pair.code] = pair.value;
    if (!repeated[pair.code]) repeated[pair.code] = [];
    repeated[pair.code].push(pair.value);
  }

  return {
    groups,
    repeated,
    pairs: entityPairs,
    layer: groups[8] || '0',
    closed: (Number(groups[70]) & 1) === 1,
    nextIndex,
  };
}

function verticesToLines(vertices, layer, closed) {
  const lines = [];
  for (let i = 0; i < vertices.length - 1; i += 1) {
    lines.push(...segmentToLines(vertices[i], vertices[i + 1], layer));
  }
  if (closed && vertices.length > 2) {
    lines.push(...segmentToLines(vertices.at(-1), vertices[0], layer));
  }
  return lines;
}

function segmentToLines(startVertex, endVertex, layer) {
  const start = vertexPoint(startVertex);
  const end = vertexPoint(endVertex);
  const bulge = vertexBulge(startVertex);
  if (Math.abs(bulge) < 1e-9) return [{ type: 'line', layer, start, end }];
  return bulgeToLines(start, end, bulge, layer);
}

function vertexPoint(vertex) {
  return Array.isArray(vertex) ? vertex : vertex.point;
}

function vertexBulge(vertex) {
  return Array.isArray(vertex) ? 0 : Number(vertex.bulge) || 0;
}

function bulgeToLines(start, end, bulge, layer) {
  const chord = Math.hypot(end[0] - start[0], end[1] - start[1]);
  if (chord < 1e-9) return [];
  const theta = 4 * Math.atan(bulge);
  const radius = chord / (2 * Math.sin(Math.abs(theta) / 2));
  const midpoint = [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
  const direction = [(end[0] - start[0]) / chord, (end[1] - start[1]) / chord];
  const normal = [-direction[1], direction[0]];
  const centerOffset = radius * Math.cos(Math.abs(theta) / 2) * Math.sign(bulge);
  const center = [midpoint[0] + normal[0] * centerOffset, midpoint[1] + normal[1] * centerOffset];
  const startAngle = Math.atan2(start[1] - center[1], start[0] - center[0]);
  const segments = Math.max(4, Math.ceil(Math.abs(theta) / (Math.PI / 12)));
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const angle = startAngle + (theta * index) / segments;
    return [center[0] + Math.cos(angle) * Math.abs(radius), center[1] + Math.sin(angle) * Math.abs(radius)];
  });
  return verticesToStraightLines(points, layer);
}

function verticesToStraightLines(points, layer) {
  return points.slice(0, -1).map((point, index) => ({
    type: 'line',
    layer,
    start: point,
    end: points[index + 1],
  }));
}

function lwPolylineVertices(pairs) {
  const vertices = [];
  let current = null;
  pairs.forEach((pair) => {
    if (pair.code === 10) {
      if (current?.point?.every(Number.isFinite)) vertices.push(current);
      current = { point: [Number(pair.value), NaN], bulge: 0 };
    } else if (pair.code === 20 && current) {
      current.point[1] = Number(pair.value);
    } else if (pair.code === 42 && current) {
      current.bulge = numberOrNull(pair.value) || 0;
    }
  });
  if (current?.point?.every(Number.isFinite)) vertices.push(current);
  return vertices;
}

function ellipseToLines(groups, layer) {
  const center = pointFromGroups(groups);
  const major = pointFromGroups(groups, 11, 21);
  const ratio = numberOrNull(groups[40]) ?? 1;
  const startParam = numberOrNull(groups[41]) ?? 0;
  const endParam = numberOrNull(groups[42]) ?? Math.PI * 2;
  const majorLength = Math.hypot(major[0], major[1]);
  if (!Number.isFinite(majorLength) || majorLength < 1e-9) return [];
  const majorUnit = [major[0] / majorLength, major[1] / majorLength];
  const minorUnit = [-majorUnit[1], majorUnit[0]];
  const span = normalizeParamSpan(startParam, endParam);
  const segments = Math.max(8, Math.ceil((Math.abs(span) / (Math.PI * 2)) * CURVE_SEGMENT_COUNT));
  const points = Array.from({ length: segments + 1 }, (_, index) => {
    const param = startParam + (span * index) / segments;
    const majorOffset = Math.cos(param) * majorLength;
    const minorOffset = Math.sin(param) * majorLength * ratio;
    return [
      center[0] + majorUnit[0] * majorOffset + minorUnit[0] * minorOffset,
      center[1] + majorUnit[1] * majorOffset + minorUnit[1] * minorOffset,
    ];
  });
  return verticesToStraightLines(points, layer);
}

function hatchToLines(data, layer) {
  const edges = [];
  for (let index = 0; index < data.pairs.length; index += 1) {
    if (data.pairs[index].code !== 92) continue;
    const path = readHatchBoundaryPath(data.pairs, index + 1, layer);
    edges.push(...path.entities);
    index = path.nextIndex - 1;
  }
  return edges;
}

function readHatchBoundaryPath(pairs, index, layer) {
  let nextIndex = index;
  let closed = false;
  let itemCount = 0;

  for (; nextIndex < pairs.length; nextIndex += 1) {
    const pair = pairs[nextIndex];
    if (pair.code === 92) break;
    if (pair.code === 73) closed = Number(pair.value) === 1;
    if (pair.code === 93) {
      itemCount = Math.max(0, Math.round(Number(pair.value) || 0));
      nextIndex += 1;
      break;
    }
  }

  if (!itemCount) return { entities: [], nextIndex };
  if (pairs[nextIndex]?.code === 10) {
    const vertices = readHatchPolylineVertices(pairs, nextIndex, itemCount);
    return { entities: verticesToLines(vertices.vertices, layer, closed), nextIndex: vertices.nextIndex };
  }

  return readHatchEdges(pairs, nextIndex, itemCount, layer);
}

function readHatchPolylineVertices(pairs, index, vertexCount) {
  const vertices = [];
  let current = null;
  let nextIndex = index;

  for (; nextIndex < pairs.length && vertices.length < vertexCount; nextIndex += 1) {
    const pair = pairs[nextIndex];
    if (pair.code === 92) break;
    if (pair.code === 10) {
      if (current?.point?.every(Number.isFinite)) vertices.push(current);
      current = { point: [Number(pair.value), NaN], bulge: 0 };
    } else if (pair.code === 20 && current) {
      current.point[1] = Number(pair.value);
    } else if (pair.code === 42 && current) {
      current.bulge = numberOrNull(pair.value) || 0;
    }
  }
  if (vertices.length < vertexCount && current?.point?.every(Number.isFinite)) vertices.push(current);

  return { vertices, nextIndex };
}

function readHatchEdges(pairs, index, edgeCount, layer) {
  const entities = [];
  let nextIndex = index;
  let parsedEdges = 0;

  for (; nextIndex < pairs.length && parsedEdges < edgeCount; nextIndex += 1) {
    const pair = pairs[nextIndex];
    if (pair.code === 92) break;
    if (pair.code !== 72) continue;

    const edge = readHatchEdge(pairs, nextIndex + 1, Number(pair.value), layer);
    entities.push(...edge.entities);
    parsedEdges += 1;
    nextIndex = edge.nextIndex - 1;
  }

  return { entities, nextIndex };
}

function readHatchEdge(pairs, index, edgeType, layer) {
  if (edgeType === 1) return readHatchLineEdge(pairs, index, layer);

  const groups = {};
  const repeated = {};
  let nextIndex = index;

  for (; nextIndex < pairs.length; nextIndex += 1) {
    const pair = pairs[nextIndex];
    if (pair.code === 92 || pair.code === 72) break;
    groups[pair.code] = pair.value;
    if (!repeated[pair.code]) repeated[pair.code] = [];
    repeated[pair.code].push(pair.value);
  }

  if (edgeType === 2) {
    return {
      entities: arcToLines(
        pointFromGroups(groups, 10, 20),
        numberOrNull(groups[40]) ?? NaN,
        numberOrNull(groups[50]) ?? NaN,
        numberOrNull(groups[51]) ?? NaN,
        Number(groups[73]) !== 0,
        layer,
      ),
      nextIndex,
    };
  }

  if (edgeType === 4) {
    return { entities: verticesToLines(verticesFromRepeatedCodes(repeated, 10, 20), layer, false), nextIndex };
  }

  return { entities: [], nextIndex };
}

function readHatchLineEdge(pairs, index, layer) {
  const groups = {};
  let nextIndex = index;

  for (; nextIndex < pairs.length; nextIndex += 1) {
    const pair = pairs[nextIndex];
    if (pair.code === 92 || pair.code === 72 || pair.code === 97 || pair.code === 75 || pair.code === 76 || pair.code === 98) break;
    groups[pair.code] = pair.value;
    const hasLine = [10, 20, 11, 21].every((code) => Number.isFinite(numberOrNull(groups[code])));
    if (hasLine) {
      nextIndex += 1;
      break;
    }
  }

  const start = pointFromGroups(groups, 10, 20);
  const end = pointFromGroups(groups, 11, 21);
  return {
    entities: start.every(Number.isFinite) && end.every(Number.isFinite) ? [{ type: 'line', layer, start, end }] : [],
    nextIndex,
  };
}

function arcToLines(center, radius, startAngle, endAngle, counterClockwise, layer) {
  if (![center[0], center[1], radius, startAngle, endAngle].every(Number.isFinite) || radius <= 0) return [];
  let span = endAngle - startAngle;
  if (counterClockwise && span <= 0) span += 360;
  if (!counterClockwise && span >= 0) span -= 360;
  if (Math.abs(span) < 1e-9) span = counterClockwise ? 360 : -360;
  const segments = Math.max(4, Math.ceil(Math.abs(span) / 15));
  const points = Array.from({ length: segments + 1 }, (_, pointIndex) => {
    const angle = ((startAngle + (span * pointIndex) / segments) * Math.PI) / 180;
    return [center[0] + Math.cos(angle) * radius, center[1] + Math.sin(angle) * radius];
  });
  return verticesToStraightLines(points, layer);
}

function dimensionFallbackLines(data, layer) {
  const definition = pointFromGroups(data.groups, 10, 20);
  const start = pointFromGroups(data.groups, 13, 23);
  const end = pointFromGroups(data.groups, 14, 24);
  const lines = [];
  if (start.every(Number.isFinite) && end.every(Number.isFinite)) {
    lines.push({ type: 'line', layer, start, end });
  }
  if (definition.every(Number.isFinite) && start.every(Number.isFinite)) {
    lines.push({ type: 'line', layer, start, end: definition });
  }
  if (definition.every(Number.isFinite) && end.every(Number.isFinite)) {
    lines.push({ type: 'line', layer, start: end, end: definition });
  }
  return lines;
}

function normalizeParamSpan(start, end) {
  let span = end - start;
  if (span <= 0) span += Math.PI * 2;
  return span || Math.PI * 2;
}

function expandInsert(insert, blocks, layerTable, depth = 0) {
  const block = blocks[insert.blockName];
  if (!block || depth > 4) return [];

  const expanded = [];
  for (let row = 0; row < (insert.rowCount || 1); row += 1) {
    for (let column = 0; column < (insert.columnCount || 1); column += 1) {
      const transform = {
        origin: insertArrayOrigin(insert, column, row),
        base: block.base,
        scale: insert.scale,
        rotation: insert.rotation,
      };
      expanded.push(...block.entities.flatMap((blockEntity) => {
        const inherited = inheritInsertDisplayProperties(blockEntity, insert, layerTable);
        if (inherited.type === 'insert') {
          return expandInsert(transformNestedInsert(inherited, transform), blocks, layerTable, depth + 1);
        }
        return [transformDisplayEntity(inherited, transform)];
      }));
    }
  }
  return expanded;
}

function insertArrayOrigin(insert, column, row) {
  const localX = column * (insert.columnSpacing || 0) * (insert.scale?.[0] || 1);
  const localY = row * (insert.rowSpacing || 0) * (insert.scale?.[1] || 1);
  const radians = ((insert.rotation || 0) * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    insert.point[0] + localX * cos - localY * sin,
    insert.point[1] + localX * sin + localY * cos,
  ];
}

function inheritInsertDisplayProperties(entity, insert, layerTable) {
  const layer = entity.layer === '0' ? insert.layer : entity.layer;
  let color = entity.color;
  if (entity.colorSource === 'byBlock') color = insert.color || layerColor(layer, layerTable);
  if (entity.colorSource === 'layer' && entity.layer === '0') color = layerColor(layer, layerTable);
  return { ...entity, layer, color };
}

function transformDisplayEntity(entity, transform) {
  const scale = averageScale(transform.scale);
  if (entity.type === 'line') {
    return { ...entity, start: transformPoint(entity.start, transform), end: transformPoint(entity.end, transform) };
  }
  if (entity.type === 'circle' || entity.type === 'arc') {
    return {
      ...entity,
      center: transformPoint(entity.center, transform),
      radius: Math.abs(entity.radius * scale),
      startAngle: entity.startAngle + transform.rotation,
      endAngle: entity.endAngle + transform.rotation,
    };
  }
  if (entity.type === 'point') return { ...entity, point: transformPoint(entity.point, transform) };
  if (entity.type === 'text') {
    return {
      ...entity,
      point: transformPoint(entity.point, transform),
      height: Math.abs(entity.height * scale),
      rotation: entity.rotation + transform.rotation,
    };
  }
  if (entity.type === 'solid') {
    return { ...entity, points: entity.points.map((point) => transformPoint(point, transform)) };
  }
  return entity;
}

function transformNestedInsert(insert, transform) {
  return {
    ...insert,
    point: transformPoint(insert.point, transform),
    scale: [insert.scale[0] * transform.scale[0], insert.scale[1] * transform.scale[1]],
    rotation: insert.rotation + transform.rotation,
  };
}

function transformPoint(point, transform) {
  const x = (point[0] - transform.base[0]) * transform.scale[0];
  const y = (point[1] - transform.base[1]) * transform.scale[1];
  const radians = (transform.rotation * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    transform.origin[0] + x * cos - y * sin,
    transform.origin[1] + x * sin + y * cos,
  ];
}

function isDrawableLine(entity) {
  return [entity.start?.[0], entity.start?.[1], entity.end?.[0], entity.end?.[1]].every(Number.isFinite)
    && Math.hypot(entity.end[0] - entity.start[0], entity.end[1] - entity.start[1]) > 0.001;
}

function isDrawableDisplayEntity(entity) {
  if (entity.type === 'line') return isDrawableLine(entity);
  if (entity.type === 'circle' || entity.type === 'arc') {
    return [entity.center?.[0], entity.center?.[1], entity.radius].every(Number.isFinite) && entity.radius > 0;
  }
  if (entity.type === 'point' || entity.type === 'text') return [entity.point?.[0], entity.point?.[1]].every(Number.isFinite);
  if (entity.type === 'solid') return entity.points?.length >= 3 && entity.points.flat().every(Number.isFinite);
  return false;
}

function displayBounds(entities) {
  const points = entities.flatMap(entityBoundsPoints);
  if (!points.length) {
    return { min: [0, 0], max: [0, 0], width: 0, depth: 0 };
  }
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return {
    min: [round3(Math.min(...xs)), round3(Math.min(...ys))],
    max: [round3(Math.max(...xs)), round3(Math.max(...ys))],
    width: round3(Math.max(...xs) - Math.min(...xs)),
    depth: round3(Math.max(...ys) - Math.min(...ys)),
  };
}

function entityBoundsPoints(entity) {
  if (entity.type === 'line') return [entity.start, entity.end];
  if (entity.type === 'circle' || entity.type === 'arc') {
    return [
      [entity.center[0] - entity.radius, entity.center[1] - entity.radius],
      [entity.center[0] + entity.radius, entity.center[1] + entity.radius],
    ];
  }
  if (entity.type === 'point') return [entity.point];
  if (entity.type === 'text') {
    const width = Math.max(entity.text?.length || 1, 1) * entity.height * 0.55;
    return [entity.point, [entity.point[0] + width, entity.point[1] + entity.height]];
  }
  if (entity.type === 'solid') return entity.points;
  return [];
}

function normalizeDisplayEntity(entity, bounds) {
  if (entity.type === 'line') {
    return { ...entity, start: normalizePoint(entity.start, bounds), end: normalizePoint(entity.end, bounds) };
  }
  if (entity.type === 'circle' || entity.type === 'arc') {
    return { ...entity, center: normalizePoint(entity.center, bounds), radius: round3(entity.radius) };
  }
  if (entity.type === 'point' || entity.type === 'text') return { ...entity, point: normalizePoint(entity.point, bounds) };
  if (entity.type === 'solid') return { ...entity, points: entity.points.map((point) => normalizePoint(point, bounds)) };
  return entity;
}

function verticesFromRepeatedCodes(repeated, xCode, yCode) {
  const xs = repeated[xCode] || [];
  const ys = repeated[yCode] || [];
  const count = Math.min(xs.length, ys.length);
  return Array.from({ length: count }, (_, index) => [Number(xs[index]), Number(ys[index])]);
}

function solidPoints(groups) {
  return [
    pointFromGroups(groups, 10, 20),
    pointFromGroups(groups, 11, 21),
    pointFromGroups(groups, 12, 22),
    pointFromGroups(groups, 13, 23),
  ].filter((point) => point.every(Number.isFinite));
}

function textEntityFromData(data, entityType, layer) {
  return {
    type: 'text',
    layer,
    point: textPointFromData(data, entityType),
    text: decodeDxfText([...(data.repeated[3] || []), ...(data.repeated[1] || [])].join('')),
    height: numberOrNull(data.groups[40]) ?? 1,
    rotation: textRotationFromData(data),
    anchor: textAnchorFromData(data, entityType),
    baseline: textBaselineFromData(data, entityType),
  };
}

function textPointFromData(data, entityType) {
  const insertion = pointFromGroups(data.groups, 10, 20);
  if (entityType === 'MTEXT') return insertion;

  const horizontalJustification = Math.round(numberOrNull(data.groups[72]) ?? 0);
  const verticalJustification = Math.round(numberOrNull(data.groups[73]) ?? 0);
  if (!horizontalJustification && !verticalJustification) return insertion;

  const alignment = pointFromGroups(data.groups, 11, 21);
  return alignment.every(Number.isFinite) ? alignment : insertion;
}

function textRotationFromData(data) {
  const explicitRotation = numberOrNull(data.groups[50]);
  if (Number.isFinite(explicitRotation)) return explicitRotation;

  const direction = pointFromGroups(data.groups, 11, 21);
  if (!direction.every(Number.isFinite) || Math.hypot(direction[0], direction[1]) < 1e-9) return 0;
  return (Math.atan2(direction[1], direction[0]) * 180) / Math.PI;
}

function textAnchorFromData(data, entityType) {
  if (entityType === 'MTEXT') {
    const attachment = Math.round(numberOrNull(data.groups[71]) ?? 1);
    if ([2, 5, 8].includes(attachment)) return 'middle';
    if ([3, 6, 9].includes(attachment)) return 'end';
    return 'start';
  }

  const horizontalJustification = Math.round(numberOrNull(data.groups[72]) ?? 0);
  if ([1, 4].includes(horizontalJustification)) return 'middle';
  if ([2, 3, 5].includes(horizontalJustification)) return 'end';
  return 'start';
}

function textBaselineFromData(data, entityType) {
  if (entityType === 'MTEXT') {
    const attachment = Math.round(numberOrNull(data.groups[71]) ?? 1);
    if ([4, 5, 6].includes(attachment)) return 'middle';
    if ([7, 8, 9].includes(attachment)) return 'text-after-edge';
    return 'text-before-edge';
  }

  const verticalJustification = Math.round(numberOrNull(data.groups[73]) ?? 0);
  if (verticalJustification === 2) return 'middle';
  if (verticalJustification === 3) return 'text-before-edge';
  if (verticalJustification === 1) return 'text-after-edge';
  return 'alphabetic';
}

function pointFromGroups(groups, xCode = 10, yCode = 20, fallback = null) {
  const x = numberOrNull(groups[xCode]);
  const y = numberOrNull(groups[yCode]);
  if (Number.isFinite(x) && Number.isFinite(y)) return [x, y];
  return fallback ? [...fallback] : [NaN, NaN];
}

function entityColorInfo(data, layerTable) {
  const colorIndex = numberOrNull(data.groups[62]);
  if (Number.isFinite(numberOrNull(data.groups[420]))) {
    return { color: trueColorToHex(Number(data.groups[420])), colorSource: 'explicit', lineType: entityLineType(data, layerTable) };
  }
  if (Number.isFinite(colorIndex) && Math.abs(colorIndex) !== 256) {
    if (colorIndex === 0) return { color: null, colorSource: 'byBlock', lineType: entityLineType(data, layerTable) };
    return { color: aciColor(colorIndex), colorSource: 'explicit', lineType: entityLineType(data, layerTable) };
  }
  return { color: layerColor(data.layer, layerTable), colorSource: 'layer', lineType: entityLineType(data, layerTable) };
}

function layerColor(layer, layerTable) {
  return layerTable?.[layer]?.color || layerTable?.['0']?.color || '#111827';
}

function entityLineType(data, layerTable) {
  return data.groups[6] || layerTable?.[data.layer]?.lineType || 'Continuous';
}

function colorFromTrueOrAci(trueColor, colorIndex) {
  const parsedTrueColor = numberOrNull(trueColor);
  if (Number.isFinite(parsedTrueColor)) return trueColorToHex(parsedTrueColor);
  return aciColor(colorIndex);
}

function aciColor(colorIndex) {
  return ACI_COLORS[Math.abs(Number(colorIndex))] || ACI_COLORS[((Math.abs(Number(colorIndex)) - 1) % 8) + 1] || '#111827';
}

function trueColorToHex(value) {
  const rgb = Number(value) & 0xffffff;
  return `#${rgb.toString(16).padStart(6, '0')}`;
}

function decodeDxfText(value) {
  return `${value || ''}`
    .replaceAll('\\P', ' ')
    .replaceAll('^J', ' ')
    .replace(/\\A\d+;/gi, '')
    .replace(/\\p[^;]*;/gi, '')
    .replace(/\\[HWCQT][^;]*;/gi, '')
    .replace(/\\S([^;]+);/gi, '$1')
    .replaceAll('%%d', '°')
    .replaceAll('%%D', '°')
    .replaceAll('%%c', 'Ø')
    .replaceAll('%%C', 'Ø')
    .replace(/\\[{}]/g, '')
    .replace(/[{}]/g, '')
    .trim();
}

function numberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function averageScale(scale) {
  return (Math.abs(scale[0]) + Math.abs(scale[1])) / 2 || 1;
}

function normalizePoint(point, bounds) {
  return [round3(point[0] - bounds.min[0]), round3(point[1] - bounds.min[1])];
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}
