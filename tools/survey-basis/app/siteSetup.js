export function rotateSurveyUnderlay(underlay, { angleDegrees, pivot }) {
  const geometryMatrix = composeAffine(
    rotationMatrixAround(pivot, angleDegrees),
    underlay.transform?.geometryMatrix || [1, 0, 0, 1, 0, 0],
  );
  const entities = (underlay.entities || []).map((entity) => ({
    ...entity,
    start: rotatePoint(entity.start, pivot, angleDegrees),
    end: rotatePoint(entity.end, pivot, angleDegrees),
  }));
  const displayEntities = (underlay.displayEntities || []).map((entity) =>
    rotateDisplayEntity(entity, pivot, angleDegrees));
  const previewDisplayEntities = (underlay.preview?.displayEntities || []).map((entity) =>
    rotateDisplayEntity(entity, pivot, angleDegrees));
  const selectableLines = (underlay.selectableGeometry?.lines || []).map((entity) => ({
    ...entity,
    start: rotatePoint(entity.start, pivot, angleDegrees),
    end: rotatePoint(entity.end, pivot, angleDegrees),
  }));
  const bounds = boundsFromDisplayEntities(previewDisplayEntities.length
    ? previewDisplayEntities
    : displayEntities.length ? displayEntities : selectableLines.length ? selectableLines : entities);
  return {
    ...underlay,
    entities,
    displayEntities,
    preview: underlay.preview ? {
      ...underlay.preview,
      displayEntities: previewDisplayEntities,
      bounds,
    } : underlay.preview,
    selectableGeometry: underlay.selectableGeometry ? {
      ...underlay.selectableGeometry,
      lines: selectableLines,
    } : underlay.selectableGeometry,
    bounds,
    transform: {
      ...(underlay.transform || {}),
      rotation: round3(((underlay.transform?.rotation || 0) + angleDegrees) % 360),
      geometryMatrix,
    },
    prep: {
      ...(underlay.prep || {}),
      alignmentRotation: round3(((underlay.prep?.alignmentRotation || 0) + angleDegrees) % 360),
      alignmentPivot: roundPoint(pivot),
    },
  };
}

function rotationMatrixAround(pivot, angleDegrees) {
  const radians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [
    cos,
    sin,
    -sin,
    cos,
    pivot[0] - pivot[0] * cos + pivot[1] * sin,
    pivot[1] - pivot[0] * sin - pivot[1] * cos,
  ];
}

function composeAffine(next, previous) {
  const [a2, b2, c2, d2, e2, f2] = next;
  const [a1, b1, c1, d1, e1, f1] = previous;
  return [
    a2 * a1 + c2 * b1,
    b2 * a1 + d2 * b1,
    a2 * c1 + c2 * d1,
    b2 * c1 + d2 * d1,
    a2 * e1 + c2 * f1 + e2,
    b2 * e1 + d2 * f1 + f2,
  ];
}

export function boundaryFromBounds(bounds) {
  const min = bounds?.min || [0, 0];
  const max = bounds?.max || [0, 0];
  return [
    [min[0], min[1]],
    [max[0], min[1]],
    [max[0], max[1]],
    [min[0], max[1]],
  ];
}

export function boundaryFromManualSideSegments(sideSegments = {}) {
  const roles = ['front', 'right', 'rear', 'left'];
  const polylines = Object.fromEntries(roles.map((role) => [
    role,
    orderedPolylineFromSegments(sideSegments[role] || []),
  ]));
  if (roles.some((role) => polylines[role].length < 2)) return { points: [], edgeRoles: [] };

  const corners = {
    frontRight: cornerBetweenSideSegments(sideSegments.front, sideSegments.right),
    rightRear: cornerBetweenSideSegments(sideSegments.right, sideSegments.rear),
    rearLeft: cornerBetweenSideSegments(sideSegments.rear, sideSegments.left),
    leftFront: cornerBetweenSideSegments(sideSegments.left, sideSegments.front),
  };
  if (!Object.values(corners).every(Boolean)) return { points: [], edgeRoles: [] };

  const sideSlices = {
    front: slicePolylineBetween(polylines.front, corners.leftFront, corners.frontRight),
    right: slicePolylineBetween(polylines.right, corners.frontRight, corners.rightRear),
    rear: slicePolylineBetween(polylines.rear, corners.rightRear, corners.rearLeft),
    left: slicePolylineBetween(polylines.left, corners.rearLeft, corners.leftFront),
  };

  const points = [];
  const edgeRoles = [];
  roles.forEach((role) => appendBoundarySide(points, edgeRoles, sideSlices[role], role));
  closeBoundaryLoop(points, edgeRoles);

  return points.length >= 3
    ? {
      points,
      edgeRoles,
      origin: roundPoint(corners.leftFront),
      originRole: 'front-left-property-corner',
    }
    : { points: [], edgeRoles: [] };
}

export function buildSiteBoundary(points, {
  frontEdgeIndex = 0,
  rearEdgeIndex = null,
  edgeRoles = null,
  origin = null,
  originRole = 'front-left-property-corner',
  unitScaleToFeet = 1,
  source = 'manual',
} = {}) {
  const cleanPoints = points.map(roundPoint);
  const frontIndex = normalizeEdgeIndex(frontEdgeIndex, cleanPoints.length);
  const rearIndex = rearEdgeIndex === null ? null : normalizeEdgeIndex(rearEdgeIndex, cleanPoints.length);
  const cleanOrigin = isFinitePoint(origin) ? roundPoint(origin) : cleanPoints[frontIndex] || cleanPoints[0];
  const projectPoints = cleanPoints.map((point) => [
    round3((point[0] - cleanOrigin[0]) * unitScaleToFeet),
    round3((point[1] - cleanOrigin[1]) * unitScaleToFeet),
    0,
  ]);
  const edges = cleanPoints.map((point, index) => {
    const next = cleanPoints[(index + 1) % cleanPoints.length];
    return {
      id: `edge-${index + 1}`,
      index,
      role: edgeRoles?.[index] || edgeRole(index, frontIndex, cleanPoints.length, rearIndex),
      start: point,
      end: next,
      lengthFeet: round2(distance(point, next) * unitScaleToFeet),
      bearingDegrees: round2((Math.atan2(next[1] - point[1], next[0] - point[0]) * 180) / Math.PI),
    };
  });
  return {
    kind: 'site-boundary',
    source,
    frontEdgeIndex: frontIndex,
    rearEdgeIndex: rearIndex,
    origin: cleanOrigin,
    originRole,
    projectOrigin: {
      anchor: originRole,
      coordinates: [0, 0, 0],
      sourcePoint: cleanOrigin,
      outputUnits: 'feet',
    },
    projectCoordinates: {
      units: 'feet',
      origin: [0, 0, 0],
      points: projectPoints,
    },
    points: cleanPoints,
    edges,
    areaSf: round2(Math.abs(polygonArea(cleanPoints)) * unitScaleToFeet * unitScaleToFeet),
    perimeterFt: round2(edges.reduce((sum, edge) => sum + edge.lengthFeet, 0)),
  };
}

export function rotateBoundaryPoints(points, pivot, angleDegrees) {
  return (points || []).map((point) => roundPoint(rotatePoint(point, pivot, angleDegrees)));
}

export function boundaryLabel(boundary) {
  if (!boundary) return 'No property boundary defined.';
  const originText = boundary.originRole === 'front-left-property-corner'
    ? 'front-left property corner'
    : `edge ${boundary.frontEdgeIndex + 1} start`;
  return `${boundary.points.length}-point boundary, ${boundary.areaSf} sf, ${boundary.perimeterFt} ft perimeter. Origin is ${originText}.`;
}

function orderedPolylineFromSegments(segments) {
  const remaining = (segments || [])
    .map((segment) => ({ start: roundPoint(segment.start), end: roundPoint(segment.end) }))
    .filter((segment) => isFinitePoint(segment.start) && isFinitePoint(segment.end) && distance(segment.start, segment.end) > 0.0001);
  if (!remaining.length) return [];

  const first = remaining.shift();
  const points = [first.start, first.end];

  while (remaining.length) {
    const head = points[0];
    const tail = points.at(-1);
    let best = null;

    remaining.forEach((segment, index) => {
      [
        { mode: 'append', point: segment.start, next: segment.end },
        { mode: 'append', point: segment.end, next: segment.start },
        { mode: 'prepend', point: segment.start, next: segment.end },
        { mode: 'prepend', point: segment.end, next: segment.start },
      ].forEach((candidate) => {
        const anchor = candidate.mode === 'append' ? tail : head;
        const score = distance(anchor, candidate.point);
        if (!best || score < best.score) best = { ...candidate, index, score };
      });
    });

    if (!best) break;
    const [segment] = remaining.splice(best.index, 1);
    if (best.mode === 'append') {
      points.push(samePoint(tail, best.point) ? best.next : nearestSegmentOtherEnd(segment, best.point));
    } else {
      points.unshift(samePoint(head, best.point) ? best.next : nearestSegmentOtherEnd(segment, best.point));
    }
  }

  return dedupeConsecutive(points);
}

function nearestSegmentOtherEnd(segment, point) {
  return distance(point, segment.start) <= distance(point, segment.end) ? segment.end : segment.start;
}

function cornerBetweenSideSegments(sideA = [], sideB = []) {
  let best = null;
  sideA.forEach((lineA) => {
    sideB.forEach((lineB) => {
      const segmentHit = segmentIntersection(lineA.start, lineA.end, lineB.start, lineB.end);
      if (segmentHit) {
        best = betterCorner(best, { point: segmentHit, score: 0 });
        return;
      }

      const infiniteHit = infiniteLineIntersection(lineA.start, lineA.end, lineB.start, lineB.end);
      if (!infiniteHit) return;
      const score = distance(infiniteHit, projectPointToSegment(infiniteHit, lineA.start, lineA.end))
        + distance(infiniteHit, projectPointToSegment(infiniteHit, lineB.start, lineB.end));
      best = betterCorner(best, { point: infiniteHit, score });
    });
  });

  if (best) return roundPoint(best.point);
  return nearestEndpointMidpoint(sideA, sideB);
}

function betterCorner(current, candidate) {
  if (!current || candidate.score < current.score) return candidate;
  return current;
}

function nearestEndpointMidpoint(sideA = [], sideB = []) {
  const pointsA = sideA.flatMap((line) => [line.start, line.end]).filter(isFinitePoint);
  const pointsB = sideB.flatMap((line) => [line.start, line.end]).filter(isFinitePoint);
  let best = null;
  pointsA.forEach((pointA) => {
    pointsB.forEach((pointB) => {
      const score = distance(pointA, pointB);
      if (!best || score < best.score) best = { pointA, pointB, score };
    });
  });
  return best ? roundPoint([(best.pointA[0] + best.pointB[0]) / 2, (best.pointA[1] + best.pointB[1]) / 2]) : null;
}

function segmentIntersection(pointA, pointB, pointC, pointD) {
  const r = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
  const s = [pointD[0] - pointC[0], pointD[1] - pointC[1]];
  const denominator = crossVector(r, s);
  if (Math.abs(denominator) < 1e-9) return null;
  const qMinusP = [pointC[0] - pointA[0], pointC[1] - pointA[1]];
  const t = crossVector(qMinusP, s) / denominator;
  const u = crossVector(qMinusP, r) / denominator;
  if (t < -0.001 || t > 1.001 || u < -0.001 || u > 1.001) return null;
  return [pointA[0] + t * r[0], pointA[1] + t * r[1]];
}

function infiniteLineIntersection(pointA, pointB, pointC, pointD) {
  const r = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
  const s = [pointD[0] - pointC[0], pointD[1] - pointC[1]];
  const denominator = crossVector(r, s);
  if (Math.abs(denominator) < 1e-9) return null;
  const qMinusP = [pointC[0] - pointA[0], pointC[1] - pointA[1]];
  const t = crossVector(qMinusP, s) / denominator;
  return [pointA[0] + t * r[0], pointA[1] + t * r[1]];
}

function crossVector(vectorA, vectorB) {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];
}

function slicePolylineBetween(polyline, start, end) {
  if (polyline.length < 2) return [];
  let working = polyline;
  let from = polylinePosition(working, start);
  let to = polylinePosition(working, end);

  if (from.along > to.along) {
    working = [...polyline].reverse();
    from = polylinePosition(working, start);
    to = polylinePosition(working, end);
  }

  const points = [from.point];
  for (let index = from.index + 1; index <= to.index; index += 1) {
    points.push(working[index]);
  }
  points.push(to.point);
  return dedupeConsecutive(points.map(roundPoint));
}

function polylinePosition(polyline, point) {
  let best = null;
  let along = 0;
  for (let index = 0; index < polyline.length - 1; index += 1) {
    const start = polyline[index];
    const end = polyline[index + 1];
    const length = distance(start, end);
    if (length <= 0.0001) continue;
    const projection = projectPointWithParameter(point, start, end);
    const candidate = {
      index,
      point: roundPoint(projection.point),
      along: along + length * projection.t,
      distance: distance(point, projection.point),
    };
    if (!best || candidate.distance < best.distance) best = candidate;
    along += length;
  }
  return best || { index: 0, point: roundPoint(polyline[0]), along: 0, distance: 0 };
}

function projectPointWithParameter(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq < 1e-9) return { point: start, t: 0 };
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSq));
  return { point: [start[0] + dx * t, start[1] + dy * t], t };
}

function projectPointToSegment(point, start, end) {
  return projectPointWithParameter(point, start, end).point;
}

function appendBoundarySide(points, edgeRoles, sidePoints, role) {
  dedupeConsecutive(sidePoints).forEach((point) => {
    if (!points.length) {
      points.push(roundPoint(point));
      return;
    }
    if (samePoint(points.at(-1), point)) return;
    edgeRoles.push(role);
    points.push(roundPoint(point));
  });
}

function closeBoundaryLoop(points, edgeRoles) {
  if (points.length < 2) return;
  if (samePoint(points[0], points.at(-1))) {
    points.pop();
    return;
  }
  edgeRoles.push(edgeRoles.at(-1) || 'left');
}

function dedupeConsecutive(points) {
  const clean = [];
  points.filter(isFinitePoint).forEach((point) => {
    if (!clean.length || !samePoint(clean.at(-1), point)) clean.push(roundPoint(point));
  });
  return clean;
}

function samePoint(pointA, pointB) {
  return isFinitePoint(pointA) && isFinitePoint(pointB) && distance(pointA, pointB) <= 0.01;
}

function isFinitePoint(point) {
  return Number.isFinite(point?.[0]) && Number.isFinite(point?.[1]);
}

function rotateDisplayEntity(entity, pivot, angleDegrees) {
  if (entity.type === 'line') {
    return {
      ...entity,
      start: rotatePoint(entity.start, pivot, angleDegrees),
      end: rotatePoint(entity.end, pivot, angleDegrees),
    };
  }
  if (entity.type === 'circle' || entity.type === 'arc') {
    return {
      ...entity,
      center: rotatePoint(entity.center, pivot, angleDegrees),
      startAngle: round3((entity.startAngle || 0) + angleDegrees),
      endAngle: round3((entity.endAngle || 0) + angleDegrees),
    };
  }
  if (entity.type === 'point' || entity.type === 'text') {
    return {
      ...entity,
      point: rotatePoint(entity.point, pivot, angleDegrees),
      rotation: round3((entity.rotation || 0) + angleDegrees),
    };
  }
  if (entity.type === 'solid') {
    return { ...entity, points: entity.points.map((point) => rotatePoint(point, pivot, angleDegrees)) };
  }
  return entity;
}

function rotatePoint(point, pivot, angleDegrees) {
  const radians = (angleDegrees * Math.PI) / 180;
  const dx = point[0] - pivot[0];
  const dy = point[1] - pivot[1];
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return roundPoint([pivot[0] + dx * cos - dy * sin, pivot[1] + dx * sin + dy * cos]);
}

function boundsFromDisplayEntities(entities) {
  const points = entities.flatMap(displayEntityBoundsPoints);
  if (!points.length) return { min: [0, 0], max: [0, 0], width: 0, depth: 0 };
  const xs = points.map((point) => point[0]);
  const ys = points.map((point) => point[1]);
  return {
    min: [round3(Math.min(...xs)), round3(Math.min(...ys))],
    max: [round3(Math.max(...xs)), round3(Math.max(...ys))],
    width: round3(Math.max(...xs) - Math.min(...xs)),
    depth: round3(Math.max(...ys) - Math.min(...ys)),
  };
}

function displayEntityBoundsPoints(entity) {
  if (entity.type === 'line') return [entity.start, entity.end];
  if (entity.type === 'circle' || entity.type === 'arc') {
    return [
      [entity.center[0] - entity.radius, entity.center[1] - entity.radius],
      [entity.center[0] + entity.radius, entity.center[1] + entity.radius],
    ];
  }
  if (entity.type === 'point' || entity.type === 'text') return [entity.point];
  if (entity.type === 'solid') return entity.points;
  return [];
}

function edgeRole(index, frontEdgeIndex, edgeCount, rearEdgeIndex = null) {
  if (index === frontEdgeIndex) return 'front';
  if (rearEdgeIndex !== null && index === rearEdgeIndex) return 'rear';
  if (edgeCount === 4 && index === (frontEdgeIndex + 2) % edgeCount) return 'rear';
  return 'side';
}

function normalizeEdgeIndex(index, edgeCount) {
  if (!edgeCount) return 0;
  return ((Math.round(index) % edgeCount) + edgeCount) % edgeCount;
}

function polygonArea(points) {
  return points.reduce((sum, point, index) => {
    const next = points[(index + 1) % points.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0) / 2;
}

function distance(pointA, pointB) {
  return Math.hypot(pointB[0] - pointA[0], pointB[1] - pointA[1]);
}

function roundPoint(point) {
  return [round3(point[0]), round3(point[1])];
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function round3(value) {
  return Math.round(value * 1000) / 1000;
}
