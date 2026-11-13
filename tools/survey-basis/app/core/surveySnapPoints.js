const DEFAULT_PRECISION = 10000;

export function buildSurveySnapIndex(entities, options = {}) {
  const maxIntersectionSegments = options.maxIntersectionSegments ?? 1400;
  const candidates = [];
  const seen = new Set();
  const cleanLines = entities
    .filter((entity) => pointIsFinite(entity.start) && pointIsFinite(entity.end))
    .map((entity, index) => ({ ...entity, index }));

  cleanLines.forEach((line) => {
    addCandidate(candidates, seen, line.start, 'endpoint', line.layer);
    addCandidate(candidates, seen, line.end, 'endpoint', line.layer);
  });

  const intersectionsEnabled = cleanLines.length <= maxIntersectionSegments;
  if (intersectionsEnabled) {
    for (let i = 0; i < cleanLines.length; i += 1) {
      for (let j = i + 1; j < cleanLines.length; j += 1) {
        if (!boxesOverlap(cleanLines[i], cleanLines[j])) continue;
        const point = segmentIntersection(cleanLines[i], cleanLines[j]);
        if (point) addCandidate(candidates, seen, point, 'intersection', `${cleanLines[i].layer || '0'} / ${cleanLines[j].layer || '0'}`);
      }
    }
  }

  return {
    candidates,
    endpointCount: candidates.filter((candidate) => candidate.kind === 'endpoint').length,
    intersectionCount: candidates.filter((candidate) => candidate.kind === 'intersection').length,
    intersectionsEnabled,
  };
}

export function nearestSurveySnap(snapIndex, point) {
  return (snapIndex?.candidates || []).reduce((closest, candidate) => {
    const distance = Math.hypot(candidate.point[0] - point[0], candidate.point[1] - point[1]);
    return distance < closest.distance ? { candidate, distance } : closest;
  }, { candidate: { point, kind: 'free', layer: null }, distance: Infinity });
}

function addCandidate(candidates, seen, point, kind, layer) {
  const normalized = [round(point[0]), round(point[1])];
  const key = `${normalized[0]},${normalized[1]}`;
  if (seen.has(key)) return;
  seen.add(key);
  candidates.push({ point: normalized, kind, layer });
}

function segmentIntersection(a, b) {
  const x1 = a.start[0];
  const y1 = a.start[1];
  const x2 = a.end[0];
  const y2 = a.end[1];
  const x3 = b.start[0];
  const y3 = b.start[1];
  const x4 = b.end[0];
  const y4 = b.end[1];
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < 1e-9) return null;

  const px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;
  const py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;
  return pointWithinSegment([px, py], a) && pointWithinSegment([px, py], b) ? [px, py] : null;
}

function boxesOverlap(a, b) {
  const aBox = lineBox(a);
  const bBox = lineBox(b);
  return aBox.minX <= bBox.maxX && aBox.maxX >= bBox.minX && aBox.minY <= bBox.maxY && aBox.maxY >= bBox.minY;
}

function lineBox(line) {
  return {
    minX: Math.min(line.start[0], line.end[0]) - 1e-7,
    maxX: Math.max(line.start[0], line.end[0]) + 1e-7,
    minY: Math.min(line.start[1], line.end[1]) - 1e-7,
    maxY: Math.max(line.start[1], line.end[1]) + 1e-7,
  };
}

function pointWithinSegment(point, line) {
  const box = lineBox(line);
  return point[0] >= box.minX && point[0] <= box.maxX && point[1] >= box.minY && point[1] <= box.maxY;
}

function pointIsFinite(point) {
  return Number.isFinite(point?.[0]) && Number.isFinite(point?.[1]);
}

function round(value) {
  return Math.round(value * DEFAULT_PRECISION) / DEFAULT_PRECISION;
}
