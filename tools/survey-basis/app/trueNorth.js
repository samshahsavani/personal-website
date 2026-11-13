export function trueNorthLabel(pointA, pointB) {
  const metadata = trueNorthMetadata(pointA, pointB);
  if (!metadata) {
    if (pointA) return 'True north tail picked. Pick the arrow tip next.';
    return 'No true north vector picked.';
  }
  return `True North: ${metadata.angleDegrees}° from project east, ${metadata.deviationFromProjectNorthDegrees}° from project north.`;
}

export function trueNorthMetadata(pointA, pointB) {
  if (!pointA || !pointB) return null;
  const angle = vectorAngleDegrees(pointA, pointB);
  const radians = (angle * Math.PI) / 180;
  return {
    source: 'survey-compass-two-point',
    pickedPoints: [pointA, pointB],
    angleDegrees: round2(angle),
    angleConvention: 'degrees from project east in current survey coordinates',
    deviationFromProjectNorthDegrees: round2(normalizeAngleDelta(angle - 90)),
    directionVector: [round6(Math.cos(radians)), round6(Math.sin(radians)), 0],
  };
}

function vectorAngleDegrees(pointA, pointB) {
  return (Math.atan2(pointB[1] - pointA[1], pointB[0] - pointA[0]) * 180) / Math.PI;
}

function normalizeAngleDelta(angle) {
  let delta = angle % 360;
  if (delta <= -180) delta += 360;
  if (delta > 180) delta -= 360;
  return delta;
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function round6(value) {
  return Math.round(value * 1000000) / 1000000;
}
