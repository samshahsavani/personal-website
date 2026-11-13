import { dxfEntityEnd, dxfPairs, isDxfPaperSpace } from './dxfText.js';

export function inspectRevitUnderlay(sourceText) {
  const pairs = dxfPairs(sourceText);
  const records = [];
  let paperSpaceCount = 0;
  let inEntities = false;

  for (let index = 0; index < pairs.length; index += 1) {
    const { code, value } = pairs[index];
    if (code !== 0) continue;
    const type = value.toUpperCase();
    if (type === 'SECTION') inEntities = pairs[index + 1]?.value.toUpperCase() === 'ENTITIES';
    else if (type === 'ENDSEC') inEntities = false;
    else if (inEntities && !['VERTEX', 'SEQEND', 'EOF'].includes(type)) {
      let end = dxfEntityEnd(pairs, index);
      const paperSpace = isDxfPaperSpace(pairs, index, end);
      const data = pairs.slice(index + 1, end);
      const vertices = [];
      if (type === 'POLYLINE') {
        while (pairs[end]?.code === 0 && pairs[end].value.toUpperCase() === 'VERTEX') {
          const next = dxfEntityEnd(pairs, end);
          vertices.push(pairs.slice(end + 1, next));
          end = next;
        }
      }
      if (paperSpace) paperSpaceCount += 1;
      else records.push({
        type,
        layer: group(data, 8) || '0',
        shape: readShape(type, data, vertices),
      });
      index = end - 1;
    }
  }
  return { records, paperSpaceCount };
}

export function summarizeRevitUnderlay(preflight, visibleLayers) {
  const included = [];
  const omitted = new Map();
  let hiddenCount = 0;
  let flattenedCount = 0;
  for (const record of preflight.records) {
    if (visibleLayers && !visibleLayers.has(record.layer)) hiddenCount += 1;
    else if (!record.shape) omitted.set(record.type, (omitted.get(record.type) || 0) + 1);
    else {
      included.push(record);
      if (record.shape.hasZ) flattenedCount += 1;
    }
  }
  return { included, omitted, flattenedCount, hiddenCount, paperSpaceCount: preflight.paperSpaceCount };
}

export function exportRevitUnderlay(preflight, {
  sourceMin,
  geometryMatrix = [1, 0, 0, 1, 0, 0],
  origin,
  unitScaleToFeet,
  visibleLayers,
  boundaryLayer,
}) {
  const summary = summarizeRevitUnderlay(preflight, visibleLayers);
  const hasPropertyLinework = summary.included.some(({ layer, shape }) =>
    layer === boundaryLayer && (shape.type === 'LINE' || shape.type === 'LWPOLYLINE'));
  if (boundaryLayer && !hasPropertyLinework) {
    throw new Error('No exportable linework on the selected property layer. In CAD, convert or selectively explode the boundary on a copy and reopen it.');
  }
  if (!summary.included.length) throw new Error('No supported model-space geometry on the visible layers.');

  const [a, b, c, d, e, f] = geometryMatrix;
  if (![a, b, c, d, e, f, ...sourceMin, ...origin, unitScaleToFeet].every(Number.isFinite)
    || unitScaleToFeet <= 0 || Math.abs(a - d) > 1e-6 || Math.abs(b + c) > 1e-6
    || Math.abs(Math.hypot(a, b) - 1) > 1e-4) {
    throw new Error('The survey transform is invalid. Verify the scale and alignment before exporting.');
  }
  const project = ([x, y]) => {
    const dx = x - sourceMin[0];
    const dy = y - sourceMin[1];
    return [(a * dx + c * dy + e - origin[0]) * unitScaleToFeet,
      (b * dx + d * dy + f - origin[1]) * unitScaleToFeet];
  };
  const rotation = Math.atan2(b, a) * 180 / Math.PI;
  const scale = unitScaleToFeet * Math.hypot(a, b);
  return { text: writeDxf(summary.included, project, rotation, scale), summary };
}

function readShape(type, data, legacyVertices) {
  const normal = [number(data, 210, 0), number(data, 220, 0), number(data, 230, 1)];
  if (normal[0] !== 0 || normal[1] !== 0 || normal[2] !== 1) return null;
  const start = xy(data);
  const hasZ = [30, 31, 38, 39].some((code) => number(data, code, 0) !== 0);
  if (type === 'LWPOLYLINE' || type === 'POLYLINE') {
    const flags = number(data, 70, 0);
    if (!Number.isInteger(flags) || flags & ~(type === 'POLYLINE' ? 137 : 129)) return null;
    if (legacyVertices.some((vertex) => number(vertex, 70, 0) & ~32)) return null;
    const vertices = (type === 'LWPOLYLINE' ? lightweightVertices(data) : legacyVertices)
      .map((vertex) => ({ point: xy(vertex), bulge: number(vertex, 42, 0) }));
    const closed = Boolean(flags & 1);
    if (vertices.length < 2 || vertices.some(({ point, bulge }, index) => {
      const next = vertices[(index + 1) % vertices.length].point;
      return !point.every(Number.isFinite) || !Number.isFinite(bulge)
        || ((closed || index < vertices.length - 1) && equalPoint(point, next));
    })) return null;
    return { type: 'LWPOLYLINE', vertices, closed, hasZ: hasZ || legacyVertices.some((vertex) => number(vertex, 30, 0) !== 0) };
  }
  if (!start.every(Number.isFinite)) return null;
  if (type === 'POINT') return { type, start, hasZ };
  if (type === 'LINE') {
    const end = xy(data, 11, 21);
    return end.every(Number.isFinite) && !equalPoint(start, end) ? { type, start, end, hasZ } : null;
  }
  if (type === 'CIRCLE' || type === 'ARC') {
    const radius = number(data, 40);
    if (!Number.isFinite(radius) || radius <= 0) return null;
    if (type === 'CIRCLE') return { type, start, radius, hasZ };
    const angles = [number(data, 50), number(data, 51)];
    return angles.every(Number.isFinite) && wrapDegrees(angles[1] - angles[0]) !== 0
      ? { type, start, radius, angles, hasZ } : null;
  }
  return null;
}

function lightweightVertices(data) {
  const vertices = [];
  for (const pair of data) {
    if (pair.code === 10) vertices.push([]);
    vertices.at(-1)?.push(pair);
  }
  return vertices;
}

function xy(data, x = 10, y = 20) {
  return [number(data, x), number(data, y)];
}

function group(data, code) {
  return data.find((pair) => pair.code === code)?.value;
}

function number(data, code, fallback = NaN) {
  const value = group(data, code);
  return value === undefined ? fallback : value === '' ? NaN : Number(value);
}

function equalPoint(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

function wrapDegrees(degrees) {
  return ((degrees % 360) + 360) % 360;
}

function writeDxf(records, project, rotation, scale) {
  const layers = new Map([['0', '0']]);
  const used = new Set(['0']);
  for (const { layer } of records) {
    if (layers.has(layer)) continue;
    const base = layer.replace(/[<>/\\":;?*|=\x00-\x1f]/g, '_').slice(0, 240);
    let name = base;
    for (let suffix = 2; used.has(name.toUpperCase()); suffix += 1) name = `${base}_${suffix}`;
    layers.set(layer, name);
    used.add(name.toUpperCase());
  }
  const tags = [];
  const add = (...items) => { tags.push(...items); };
  let nextHandle = 16;
  const handle = () => (nextHandle++).toString(16).toUpperCase();
  const section = (name) => add(0, 'SECTION', 2, name);
  const point = (x, y, z, coordinates) => add(x, coordinates[0], y, coordinates[1], z, 0);
  section('HEADER');
  add(9, '$ACADVER', 1, 'AC1021', 9, '$INSUNITS', 70, 2, 9, '$HANDSEED', 5, '0');
  const seedIndex = tags.length - 1;
  add(0, 'ENDSEC');
  section('TABLES');
  add(0, 'TABLE', 2, 'LTYPE', 5, '1', 330, '0', 100, 'AcDbSymbolTable', 70, 1,
    0, 'LTYPE', 5, '2', 330, '1', 100, 'AcDbSymbolTableRecord', 100, 'AcDbLinetypeTableRecord',
    2, 'Continuous', 70, 0, 3, 'Solid line', 72, 65, 73, 0, 40, 0, 0, 'ENDTAB');
  add(0, 'TABLE', 2, 'LAYER', 5, '3', 330, '0', 100, 'AcDbSymbolTable', 70, layers.size);
  for (const name of layers.values()) {
    add(0, 'LAYER', 5, handle(), 330, '3', 100, 'AcDbSymbolTableRecord', 100, 'AcDbLayerTableRecord',
      2, name, 70, 0, 62, 7, 6, 'Continuous');
  }
  add(0, 'ENDTAB', 0, 'ENDSEC');
  section('ENTITIES');
  for (const { shape, layer } of records) {
    add(0, shape.type, 5, handle(), 100, 'AcDbEntity', 8, layers.get(layer));
    if (shape.type === 'LWPOLYLINE') {
      add(100, 'AcDbPolyline', 90, shape.vertices.length, 70, Number(shape.closed), 38, 0);
      for (const vertex of shape.vertices) {
        const [x, y] = project(vertex.point);
        add(10, x, 20, y, 42, vertex.bulge);
      }
    } else {
      const subclass = { POINT: 'AcDbPoint', LINE: 'AcDbLine', ARC: 'AcDbCircle', CIRCLE: 'AcDbCircle' }[shape.type];
      add(100, subclass);
      point(10, 20, 30, project(shape.start));
      if (shape.type === 'LINE') point(11, 21, 31, project(shape.end));
      if (shape.radius) add(40, shape.radius * scale);
      if (shape.type === 'ARC') {
        add(100, 'AcDbArc', 50, wrapDegrees(shape.angles[0] + rotation), 51, wrapDegrees(shape.angles[1] + rotation));
      }
    }
  }
  add(0, 'ENDSEC', 0, 'EOF');
  tags[seedIndex] = handle();
  return tags.join('\r\n') + '\r\n';
}
