const TRUE_DISTANCE_UNITS_TO_FEET = Object.freeze({
  feet: 1,
  meters: 3.280839895,
  inches: 1 / 12,
});

export function applySurveyDistanceCalibration(underlay, calibration) {
  const drawnDistance = distanceBetween(calibration.pointA, calibration.pointB);
  const trueDistance = Number(calibration.trueDistance);
  const feetPerTrueUnit = TRUE_DISTANCE_UNITS_TO_FEET[calibration.trueDistanceUnit || 'meters'];

  if (!underlay?.entities?.length) throw new Error('No survey underlay is available to calibrate.');
  if (!Number.isFinite(drawnDistance) || drawnDistance <= 0) throw new Error('Pick two different points to calibrate scale.');
  if (!Number.isFinite(trueDistance) || trueDistance <= 0) throw new Error('Enter a real-world distance greater than zero.');
  if (!Number.isFinite(feetPerTrueUnit)) throw new Error('Unsupported calibration unit.');

  const trueDistanceFeet = trueDistance * feetPerTrueUnit;
  const unitScaleToFeet = trueDistanceFeet / drawnDistance;

  return {
    ...underlay,
    units: {
      id: 'calibrated',
      label: 'Calibrated from known distance',
      feetPerDrawingUnit: unitScaleToFeet,
      source: 'calibration',
      insunits: underlay.units?.insunits ?? null,
    },
    transform: {
      ...underlay.transform,
      unitScaleToFeet,
      scale: 1,
    },
    calibration: {
      pointA: calibration.pointA,
      pointB: calibration.pointB,
      drawnDistance,
      trueDistance,
      trueDistanceUnit: calibration.trueDistanceUnit || 'meters',
      trueDistanceFeet,
    },
  };
}

function distanceBetween(pointA, pointB) {
  return Math.hypot(pointB?.[0] - pointA?.[0], pointB?.[1] - pointA?.[1]);
}
