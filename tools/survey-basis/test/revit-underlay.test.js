import assert from 'node:assert/strict';
import test from 'node:test';
import { parseDxfSurvey } from '../app/core/dxfSurveyImport.js';
import { exportRevitUnderlay, inspectRevitUnderlay } from '../app/core/revitUnderlayDxf.js';
import { dxfPairs } from '../app/core/dxfText.js';
import { inferLeftRightSideSegments } from '../app/boundarySideInference.js';
import { applySurveyDistanceCalibration } from '../app/core/surveyCalibration.js';
import { buildSurveySnapIndex, nearestSurveySnap } from '../app/core/surveySnapPoints.js';
import {
  boundaryFromManualSideSegments,
  buildSiteBoundary,
  rotateSurveyUnderlay,
} from '../app/siteSetup.js';
import { directionLabel, exteriorFaceAlignment } from '../app/alignmentBasis.js';
import { surveyExportBlocker, surveyHealthText } from '../app/exportReadiness.js';

test('calibrates and aligns a DXF survey and exports supported Revit geometry', () => {
  const dxf = [
    '0', 'SECTION', '2', 'ENTITIES',
    '0', 'LINE', '8', 'PROPERTY', '10', '0', '20', '0', '11', '10', '21', '0',
    '0', 'LINE', '8', 'PROPERTY', '10', '10', '20', '0', '11', '10', '21', '5',
    '0', 'LINE', '8', 'PROPERTY', '10', '10', '20', '5', '11', '0', '21', '5',
    '0', 'LINE', '8', 'PROPERTY', '10', '0', '20', '5', '11', '0', '21', '0',
    '0', 'ENDSEC', '0', 'EOF',
  ].join('\n');
  const underlay = parseDxfSurvey(dxf, { fileName: 'phase-2-test.dxf' });

  assert.equal(underlay.sourceFileName, 'phase-2-test.dxf');
  assert.equal(underlay.entities.length, 4);
  assert.equal(underlay.bounds.width, 10);

  const snapIndex = buildSurveySnapIndex(underlay.entities);
  assert.equal(nearestSurveySnap(snapIndex, [0.05, 0.05]).candidate.kind, 'endpoint');
  assert.equal(typeof surveyHealthText({ underlay, snapIndex }), 'string');

  const calibrated = applySurveyDistanceCalibration(underlay, {
    pointA: [0, 0],
    pointB: [10, 0],
    trueDistance: 10,
    trueDistanceUnit: 'feet',
  });
  assert.equal(calibrated.units.source, 'calibration');
  assert.equal(surveyExportBlocker({ underlay: calibrated, boundary: null }).includes('Build the property boundary'), true);

  const sideBoundary = boundaryFromManualSideSegments({
    front: [underlay.entities[0]],
    right: [underlay.entities[1]],
    rear: [underlay.entities[2]],
    left: [underlay.entities[3]],
  });
  const boundary = buildSiteBoundary(sideBoundary.points, {
    edgeRoles: sideBoundary.edgeRoles,
    origin: sideBoundary.origin,
    originRole: sideBoundary.originRole,
    unitScaleToFeet: 1,
    source: 'manual-sides:PROPERTY',
  });
  assert.equal(boundary.areaSf, 50);
  assert.equal(boundary.projectOrigin.anchor, 'front-left-property-corner');
  assert.equal(surveyExportBlocker({ underlay: calibrated, boundary }), '');
  const header = (units) => [0, 'SECTION', 2, 'HEADER', 9, '$INSUNITS', 70, units, 0, 'ENDSEC'].join('\n') + '\n';
  const unitless = parseDxfSurvey(header(0) + dxf);
  assert.match(surveyExportBlocker({ underlay: unitless, boundary }), /Calibrate scale/);
  assert.equal(parseDxfSurvey(header(21) + dxf).transform.unitScaleToFeet, 500000 / 499999);
  assert.throws(() => parseDxfSurvey('AC1032 test'), /DWG or binary DXF/);
  assert.throws(() => parseDxfSurvey('AutoCAD Binary DXF\r\n\x1a\0'), /DWG or binary DXF/);
  assert.throws(() => parseDxfSurvey(dxf.replace(/\n0\nEOF$/, '')), /complete text DXF/);

  const sides = inferLeftRightSideSegments({
    front: [underlay.entities[0]], rear: [underlay.entities[2]],
    side1: [underlay.entities[1]], side2: [underlay.entities[3]],
  }, underlay.bounds);
  assert.deepEqual(sides.left, [underlay.entities[3]]);

  const alignment = exteriorFaceAlignment({ start: [0, 0], end: [10, 0] }, boundary, 90);
  assert.equal(directionLabel(alignment.targetAngle), 'north');

  const rotated = rotateSurveyUnderlay(underlay, { angleDegrees: 90, pivot: [0, 0] });
  assert.equal(rotated.transform.rotation, 90);

  const extraEntities = [
    0, 'LINE', 8, 'PROPERTY', 67, 1, 10, 1000, 20, 0, 11, 1000, 21, 50,
    0, 'POINT', 8, 'PROPERTY', 10, 0, 20, 0, 30, 55,
    0, 'LWPOLYLINE', 8, 'PROPERTY', 90, 2, 10, 1, 20, 0, 42, 0.5, 10, 2, 20, 0,
    0, 'ARC', 8, 'PROPERTY', 10, 1, 20, 0, 40, 3, 50, 270, 51, 225,
    0, 'CIRCLE', 8, 'PROPERTY', 10, 1, 20, 0, 40, 2, 230, -1,
    0, 'INSERT', 8, 'PROPERTY', 2, 'EXTERNAL',
    0, 'LINE', 8, 'HIDDEN', 10, 0, 20, 0, 11, 0, 21, 5,
  ].join('\n') + '\n';
  const source = dxf.replace('0\nENDSEC', extraEntities + '0\nENDSEC');
  assert.equal(parseDxfSurvey(source).bounds.width < 20, true);
  const preflight = inspectRevitUnderlay(source);
  const options = {
    sourceMin: [0, 0],
    geometryMatrix: [0, 1, -1, 0, 3, 4],
    origin: [3, 4],
    unitScaleToFeet: 2,
    visibleLayers: new Set(['PROPERTY']),
    boundaryLayer: 'PROPERTY',
  };
  const exported = exportRevitUnderlay(preflight, options);
  assert.equal(exported.summary.included.length, 7);
  assert.equal(exported.summary.flattenedCount, 1);
  assert.equal(exported.summary.hiddenCount, 1);
  assert.equal(exported.summary.paperSpaceCount, 1);
  assert.deepEqual(Object.fromEntries(exported.summary.omitted), { CIRCLE: 1, INSERT: 1 });
  assert.throws(() => exportRevitUnderlay(preflight, { ...options, boundaryLayer: 'HIDDEN' }), /selected property layer/);
  const tags = dxfPairs(exported.text);
  const entityTags = (type) => {
    const start = tags.findIndex((pair) => pair.code === 0 && pair.value === type);
    const end = tags.findIndex((pair, index) => index > start && pair.code === 0);
    return Object.fromEntries(tags.slice(start + 1, end).map(({ code, value }) => [code, value]));
  };
  const feetHeader = tags.findIndex(({ value }) => value === '$INSUNITS');
  assert.deepEqual(tags[feetHeader + 1], { code: 70, value: '2' });
  assert.equal(entityTags('LINE')[21], '20');
  assert.equal(entityTags('POINT')[30], '0');
  assert.deepEqual([40, 50, 51].map((code) => entityTags('ARC')[code]), ['6', '0', '315']);
  assert.ok(tags.some(({ code, value }) => code === 42 && value === '0.5'));
});
