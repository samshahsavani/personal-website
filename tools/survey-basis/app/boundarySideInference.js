export function inferLeftRightSideSegments(markedSegments, bounds) {
  const side1Runs = connectedLineRuns(markedSegments.side1, bounds);
  const side2Runs = connectedLineRuns(markedSegments.side2, bounds);
  if (side1Runs.length !== 1 || side2Runs.length !== 1) {
    return {
      error: `Side 1 and Side 2 should each form one connected run. Found ${side1Runs.length || 0} and ${side2Runs.length || 0}.`,
    };
  }

  const frontCenter = lineSetCenter(markedSegments.front);
  const rearCenter = lineSetCenter(markedSegments.rear);
  const depthVector = [rearCenter[0] - frontCenter[0], rearCenter[1] - frontCenter[1]];
  if (Math.hypot(depthVector[0], depthVector[1]) < 0.001) {
    return { error: 'Front and rear marks are too close to infer left/right side orientation.' };
  }

  const ranked = [side1Runs[0], side2Runs[0]].map((run) => {
    const center = lineSetCenter(run);
    const relative = [center[0] - frontCenter[0], center[1] - frontCenter[1]];
    return { run, sideScore: cross2d(depthVector, relative) };
  }).sort((a, b) => b.sideScore - a.sideScore);

  return {
    left: ranked[0].run,
    right: ranked[1].run,
  };
}

function connectedLineRuns(lines, bounds) {
  const remaining = [...lines];
  const runs = [];
  while (remaining.length) {
    const run = [remaining.shift()];
    let expanded = true;
    while (expanded) {
      expanded = false;
      for (let index = remaining.length - 1; index >= 0; index -= 1) {
        if (!lineTouchesRun(remaining[index], run, bounds)) continue;
        run.push(remaining.splice(index, 1)[0]);
        expanded = true;
      }
    }
    runs.push(run);
  }
  return runs;
}

function lineTouchesRun(line, run, bounds) {
  return run.some((runLine) => endpointsTouch(line, runLine, bounds));
}

function endpointsTouch(lineA, lineB, bounds) {
  const tolerance = modelJoinTolerance(bounds);
  return [
    [lineA.start, lineB.start],
    [lineA.start, lineB.end],
    [lineA.end, lineB.start],
    [lineA.end, lineB.end],
  ].some(([pointA, pointB]) => distance(pointA, pointB) <= tolerance);
}

function modelJoinTolerance(bounds) {
  const extent = Math.max(bounds?.width || 0, bounds?.depth || 0, 1);
  return Math.max(0.02, Math.min(extent * 0.0005, 0.75));
}

function lineSetCenter(lines) {
  const points = lines.flatMap((line) => [line.start, line.end]);
  const sum = points.reduce((total, point) => [total[0] + point[0], total[1] + point[1]], [0, 0]);
  return points.length ? [sum[0] / points.length, sum[1] / points.length] : [0, 0];
}

function cross2d(vectorA, vectorB) {
  return vectorA[0] * vectorB[1] - vectorA[1] * vectorB[0];
}

function distance(pointA, pointB) {
  return Math.hypot(pointB[0] - pointA[0], pointB[1] - pointA[1]);
}
