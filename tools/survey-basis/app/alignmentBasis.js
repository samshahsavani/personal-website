export function exteriorFaceAlignment(line, boundary, targetAngle) {
  const faceAngle = exteriorFaceAngle(line, boundary?.points);
  if (!Number.isFinite(faceAngle)) return null;
  return {
    faceAngle,
    targetAngle,
    angle: normalizeRotationDelta(targetAngle - faceAngle),
  };
}

export function alignmentFaceGuide(line, boundary, length) {
  const faceAngle = exteriorFaceAngle(line, boundary?.points);
  if (!Number.isFinite(faceAngle)) return null;
  const midpoint = lineMidpoint(line);
  const normal = unitVector(faceAngle);
  return {
    start: midpoint,
    end: [midpoint[0] + normal[0] * length, midpoint[1] + normal[1] * length],
  };
}

export function directionLabel(angle) {
  const normalized = normalizeRotationDelta(angle);
  if (Math.abs(normalized - 90) < 0.001) return 'north';
  if (Math.abs(normalized + 90) < 0.001) return 'south';
  if (Math.abs(Math.abs(normalized) - 180) < 0.001) return 'west';
  return 'east';
}

function exteriorFaceAngle(line, boundaryPoints) {
  if (!line?.start || !line?.end || !boundaryPoints?.length) return null;
  const tangent = vectorAngle(line.start, line.end);
  const midpoint = lineMidpoint(line);
  const interior = polygonCentroid(boundaryPoints);
  const toInterior = [interior[0] - midpoint[0], interior[1] - midpoint[1]];
  const normalA = normalizeRotationDelta(tangent + 90);
  const normalB = normalizeRotationDelta(tangent - 90);
  const scoreA = dot(unitVector(normalA), toInterior);
  const scoreB = dot(unitVector(normalB), toInterior);
  return scoreA <= scoreB ? normalA : normalB;
}

function polygonCentroid(points) {
  let areaTwice = 0;
  let cx = 0;
  let cy = 0;
  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];
    const next = points[(index + 1) % points.length];
    const cross = point[0] * next[1] - next[0] * point[1];
    areaTwice += cross;
    cx += (point[0] + next[0]) * cross;
    cy += (point[1] + next[1]) * cross;
  }
  if (Math.abs(areaTwice) < 0.000001) return averagePoint(points);
  return [cx / (3 * areaTwice), cy / (3 * areaTwice)];
}

function averagePoint(points) {
  const sum = points.reduce((total, point) => [total[0] + point[0], total[1] + point[1]], [0, 0]);
  return points.length ? [sum[0] / points.length, sum[1] / points.length] : [0, 0];
}

function lineMidpoint(line) {
  return [(line.start[0] + line.end[0]) / 2, (line.start[1] + line.end[1]) / 2];
}

function vectorAngle(pointA, pointB) {
  return (Math.atan2(pointB[1] - pointA[1], pointB[0] - pointA[0]) * 180) / Math.PI;
}

function unitVector(angle) {
  const radians = (angle * Math.PI) / 180;
  return [Math.cos(radians), Math.sin(radians)];
}

function dot(vectorA, vectorB) {
  return vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
}

function normalizeRotationDelta(angle) {
  let delta = angle % 360;
  if (delta <= -180) delta += 360;
  if (delta > 180) delta -= 360;
  return delta;
}
