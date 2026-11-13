import {
  importSurveyDxf,
  surveyPreviewEntities,
  surveySelectableLayers,
  surveySelectableLines,
} from './core/surveyImportPipeline.js';
import { applySurveyDistanceCalibration } from './core/surveyCalibration.js';
import { exportRevitUnderlay, inspectRevitUnderlay } from './core/revitUnderlayDxf.js';
import { colorByLayer } from './core/layerColors.js';
import { buildSurveySnapIndex, nearestSurveySnap } from './core/surveySnapPoints.js';
import { alignmentFaceGuide, directionLabel, exteriorFaceAlignment } from './alignmentBasis.js';
import { inferLeftRightSideSegments } from './boundarySideInference.js';
import { renderRevitPreflight, surveyExportBlocker, surveyHealthText } from './exportReadiness.js';
import { renderSurveyPreview, updateSurveyLayerVisibility } from './surveyPreviewRenderer.js';
import { renderWorkflowProgress } from './workflowProgress.js';
import {
  boundaryFromManualSideSegments,
  boundaryLabel,
  buildSiteBoundary,
  rotateBoundaryPoints,
  rotateSurveyUnderlay,
} from './siteSetup.js';

const SVG_NS = 'http://www.w3.org/2000/svg';
const PROPERTY_LAYER_COLOR = '#dc2626';

const state = {
  underlay: null,
  revitPreflight: null,
  importAttempt: 0,
  snapIndex: null,
  layerSnapIndices: new Map(),
  layerColors: new Map(),
  visibleLayers: new Set(),
  pickMode: 'idle',
  pointA: null,
  pointB: null,
  alignA: null,
  alignB: null,
  boundary: null,
  boundaryLayer: '',
  frontEdgeIndex: 0,
  rearEdgeIndex: null,
  frontLineKeys: new Set(),
  rearLineKeys: new Set(),
  sideLineKeys: new Set(),
  side1LineKeys: new Set(),
  side2LineKeys: new Set(),
  leftLineKeys: new Set(),
  rightLineKeys: new Set(),
  selectedAlignLine: null,
  alignTargetAngle: 0,
  hoverSnap: null,
  hoverLine: null,
  hoverSignature: '',
  svg: null,
  pickLayer: null,
  viewBox: null,
  suppressNextClick: false,
  dimBoundaryContext: true,
};

const refs = {
  fileInput: document.getElementById('survey-file-input'),
  fileName: document.getElementById('survey-file-name'),
  canvas: document.getElementById('survey-canvas'),
  summary: document.getElementById('survey-summary'),
  layerList: document.getElementById('layer-list'),
  status: document.getElementById('calibration-status'),
  trueDistance: document.getElementById('true-distance'),
  trueUnit: document.getElementById('true-distance-unit'),
  modeCalibrate: document.getElementById('btn-mode-calibrate'),
  modeAlign: document.getElementById('btn-mode-align'),
  modeFront: document.getElementById('btn-mode-front'),
  modeRear: document.getElementById('btn-mode-rear'),
  modeSide1: document.getElementById('btn-mode-side-1'),
  modeSide2: document.getElementById('btn-mode-side-2'),
  alignTargets: [...document.querySelectorAll('[data-align-target]')],
  applyAlign: document.getElementById('btn-apply-align'),
  clearAlign: document.getElementById('btn-clear-align'),
  alignmentStatus: document.getElementById('alignment-status'),
  propertyLayerSelect: document.getElementById('property-layer-select'),
  useLayerBoundary: document.getElementById('btn-use-layer-boundary'),
  clearFront: document.getElementById('btn-clear-front'),
  boundaryStatus: document.getElementById('boundary-status'),
  fitView: document.getElementById('btn-fit-view'),
  resetPicks: document.getElementById('btn-reset-picks'),
  applyCalibration: document.getElementById('btn-apply-calibration'),
  exportDxf: document.getElementById('btn-export-revit-dxf'),
  exportStatus: document.getElementById('survey-export-status'),
  showLayers: document.getElementById('btn-show-layers'),
  hideLayers: document.getElementById('btn-hide-layers'),
  toggleContextTone: document.getElementById('btn-toggle-context-tone'),
  canvasModeHint: document.getElementById('canvas-mode-hint'),
};

refs.fileInput.addEventListener('change', importDxfFile);
refs.fitView.addEventListener('click', fitDrawing);
refs.resetPicks.addEventListener('click', resetPicks);
refs.applyCalibration.addEventListener('click', applyCalibration);
refs.exportDxf.addEventListener('click', exportRevitDxf);
refs.showLayers.addEventListener('click', () => setAllLayersVisible(true));
refs.hideLayers.addEventListener('click', () => setAllLayersVisible(false));
refs.toggleContextTone.addEventListener('click', toggleContextTone);
refs.modeCalibrate.addEventListener('click', () => togglePickMode('calibrate'));
refs.modeAlign.addEventListener('click', () => togglePickMode('align'));
refs.modeFront.addEventListener('click', () => togglePickMode('front'));
refs.modeRear.addEventListener('click', () => togglePickMode('rear'));
refs.modeSide1.addEventListener('click', () => togglePickMode('side1'));
refs.modeSide2.addEventListener('click', () => togglePickMode('side2'));
refs.applyAlign.addEventListener('click', applyAlignment);
refs.clearAlign.addEventListener('click', clearAlignmentVector);
refs.useLayerBoundary.addEventListener('click', () => buildManualBoundaryFromSelectedSides());
refs.clearFront.addEventListener('click', clearBoundaryMarks);
refs.alignTargets.forEach((button) => button.addEventListener('click', () => setAlignmentTarget(Number(button.dataset.alignTarget) || 0)));
refs.propertyLayerSelect.addEventListener('change', () => {
  state.boundaryLayer = refs.propertyLayerSelect.value || '';
  resetBoundarySelections({ clearBoundary: true });
  refs.boundaryStatus.textContent = state.boundaryLayer
    ? `Property layer set to ${state.boundaryLayer}.`
    : 'No property boundary layer selected.';
  setWorkingLayerVisibility();
  renderLayerList();
  renderToneToggle();
  renderWorkflowProgress(state);
  renderPicks();
});
renderToneToggle();
renderWorkflowProgress(state);

function importDxfFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const attempt = ++state.importAttempt;

  const reader = new FileReader();
  reader.onerror = () => {
    if (attempt === state.importAttempt) setStatus(`Could not read ${file.name}. The active drawing was not changed.`);
  };
  reader.onload = () => {
    if (attempt !== state.importAttempt) return;
    try {
      const underlay = importSurveyDxf(reader.result, { fileName: file.name });
      const displayEntities = surveyPreviewEntities(underlay);
      state.revitPreflight = inspectRevitUnderlay(reader.result);
      state.underlay = underlay;
      refs.fileName.textContent = file.name;
      refs.exportStatus.textContent = '';
      state.snapIndex = buildSurveySnapIndex(surveySelectableLines(underlay));
      state.layerSnapIndices = new Map();
      state.layerColors = colorByLayer(displayEntities, underlay.layerTable);
      state.visibleLayers = new Set([...state.layerColors.keys()]);
      resetBoundarySelections({ clearLayer: true, clearBoundary: true });
      state.alignA = null;
      state.alignB = null;
      state.selectedAlignLine = null;
      state.alignTargetAngle = 0;
      state.hoverSnap = null;
      state.hoverLine = null;
      state.hoverSignature = '';
      state.dimBoundaryContext = true;
      setPickMode('idle');
      resetPicks();
      renderSummary();
      renderLayerList();
      renderPropertyLayerSelect();
      renderToneToggle();
      renderCanvas();
      renderSetupStatuses();
      setWorkingLayerVisibility();
      setStatus(`Loaded. Snaps available: ${state.snapIndex.endpointCount} endpoints + ${state.snapIndex.intersectionCount} intersections.${surveyHealthText(state)}`);
    } catch (error) {
      setStatus(`${file.name}: ${error.message || 'Could not read this DXF.'}${state.underlay ? ' The active drawing was not changed.' : ''}`);
    }
  };
  reader.readAsText(file);
}

function renderSummary() {
  if (!state.underlay) {
    refs.summary.textContent = 'No DXF loaded yet.';
    return;
  }
  const { units, transform } = state.underlay;
  const unitScale = transform.unitScaleToFeet;
  const width = round2((state.underlay.bounds?.width || 0) * unitScale);
  const depth = round2((state.underlay.bounds?.depth || 0) * unitScale);
  const displayCount = state.underlay.preview?.displayEntities?.length || state.underlay.displayEntityCount || state.underlay.entityCount;
  const selectableCount = state.underlay.selectableGeometry?.lines?.length || state.underlay.entityCount;
  const size = units.source === 'fallback' ? 'Units unspecified. Calibrate against a printed survey dimension.' : `${width} ft x ${depth} ft current extents (${units.label}).`;
  refs.summary.textContent = `${displayCount} preview entities, ${selectableCount} selectable vectors, ${state.layerColors.size} layers. ${size}`;
}

function renderLayerList() {
  refs.layerList.replaceChildren();
  if (!state.underlay) return;

  const counts = layerCounts(surveyPreviewEntities(state.underlay));
  [...counts.entries()].sort(([a], [b]) => a.localeCompare(b)).forEach(([layer, count]) => {
    const row = document.createElement('label');
    row.className = 'layer-row';
    const isWorkingLayer = activeBoundaryLayer() === layer;
    row.classList.toggle('is-working-layer', isWorkingLayer);
    row.classList.toggle('is-muted-by-focus', isBoundaryContextDimmed() && state.boundaryLayer !== layer);
    row.innerHTML = `
      <span class="layer-swatch" style="background:${isWorkingLayer ? PROPERTY_LAYER_COLOR : state.layerColors.get(layer)}"></span>
      <span></span>
      <span class="layer-count">${count}</span>
    `;
    row.children[1].textContent = layer;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = state.visibleLayers.has(layer);
    checkbox.disabled = isWorkingLayer;
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) state.visibleLayers.add(layer);
      else state.visibleLayers.delete(layer);
      refreshLayerDisplay();
    });
    row.prepend(checkbox);
    refs.layerList.appendChild(row);
  });
}

function renderPropertyLayerSelect() {
  refs.propertyLayerSelect.replaceChildren();
  const optionNone = document.createElement('option');
  optionNone.value = '';
  optionNone.textContent = 'None selected';
  refs.propertyLayerSelect.appendChild(optionNone);
  surveySelectableLayers(state.underlay).forEach((layer) => {
    const option = document.createElement('option');
    option.value = layer;
    option.textContent = layer;
    refs.propertyLayerSelect.appendChild(option);
  });
  refs.propertyLayerSelect.value = state.boundaryLayer;
}

function renderCanvas({ preserveViewBox = false } = {}) {
  refs.canvas.replaceChildren();
  if (!state.underlay) {
    refs.canvas.innerHTML = '<div class="empty-state">Import a DXF survey to begin.</div>';
    return;
  }

  const svg = svgElement('svg');
  svg.setAttribute('class', 'survey-prep-svg');
  const bounds = state.underlay.viewBounds || state.underlay.bounds;
  const previousViewBox = preserveViewBox ? state.viewBox : null;
  const padding = Math.max(bounds.width, bounds.depth, 1) * 0.04;
  state.viewBox = previousViewBox || { x: (bounds.min?.[0] || 0) - padding, y: (bounds.min?.[1] || 0) - padding, width: bounds.width + padding * 2, height: bounds.depth + padding * 2 };
  state.svg = svg;
  setSvgViewBox();

  const world = svgElement('g');
  world.setAttribute('transform', 'scale(1 -1)');
  svg.appendChild(world);
  renderSurveyPreview(world, {
    entities: surveyPreviewEntities(state.underlay),
    focusedLayer: activeBoundaryLayer(),
    isolateContext: state.dimBoundaryContext,
    visibleLayers: state.visibleLayers,
    layerColors: state.layerColors,
    propertyLayerColor: PROPERTY_LAYER_COLOR,
    bounds: state.underlay.bounds,
  });

  state.pickLayer = svgElement('g');
  world.appendChild(state.pickLayer);
  bindNavigation(svg);
  svg.addEventListener('click', onCanvasClick);
  refs.canvas.appendChild(svg);
  updateLayerVisibility();
  renderPicks();
}

function onCanvasClick(event) {
  if (state.suppressNextClick || !state.snapIndex) {
    state.suppressNextClick = false;
    return;
  }
  const point = svgPointFromEvent(event);
  if (state.pickMode === 'align') {
    pickAlignmentVector(point);
    return;
  }
  if (state.pickMode === 'front') {
    pickFrontVector(point);
    return;
  }
  if (state.pickMode === 'rear') {
    pickRearVector(point);
    return;
  }
  if (state.pickMode === 'side1' || state.pickMode === 'side2') {
    pickSideVector(point, state.pickMode);
    return;
  }
  if (state.pickMode !== 'calibrate') {
    setStatus('Choose a step on the left before picking survey geometry.');
    return;
  }
  const snap = nearestSnapCandidate(point, activeBoundaryLayer());
  if (!snap) {
    setStatus('Move closer to a CAD endpoint/intersection to pick a scale reference.');
    return;
  }
  if (!state.pointA || (state.pointA && state.pointB)) {
    state.pointA = snap.point;
    state.pointB = null;
    setStatus(`Point A snapped to ${snap.kind}.`);
  } else {
    state.pointB = snap.point;
    setStatus(`Point B snapped to ${snap.kind}. Drawn distance: ${round4(distance(state.pointA, state.pointB))} DXF units.`);
  }
  renderPicks();
}

function bindNavigation(svg) {
  let isPanning = false;
  let hasPanned = false;
  let startClient = null;
  let lastPoint = null;

  svg.addEventListener('wheel', (event) => {
    event.preventDefault();
    zoomViewBox(svgPointFromEvent(event), event.deltaY < 0 ? 0.82 : 1.22);
  }, { passive: false });
  svg.addEventListener('pointerdown', (event) => {
    isPanning = true;
    hasPanned = false;
    startClient = [event.clientX, event.clientY];
    lastPoint = svgPointFromEvent(event);
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener('pointermove', (event) => {
    if (!isPanning) {
      updateHover(svgPointFromEvent(event));
      return;
    }
    const screenDelta = Math.hypot(event.clientX - startClient[0], event.clientY - startClient[1]);
    if (!hasPanned && screenDelta < 5) return;
    hasPanned = true;
    const point = svgPointFromEvent(event);
    const dx = lastPoint[0] - point[0];
    const dy = lastPoint[1] - point[1];
    state.viewBox.x += dx;
    state.viewBox.y += dy;
    setSvgViewBox();
    renderPicks();
    lastPoint = svgPointFromEvent(event);
  });
  svg.addEventListener('pointerup', () => {
    isPanning = false;
    if (hasPanned) {
      state.suppressNextClick = true;
      setTimeout(() => { state.suppressNextClick = false; }, 0);
    }
    startClient = null;
  });
  svg.addEventListener('pointerleave', () => {
    state.hoverSnap = null;
    state.hoverLine = null;
    state.hoverSignature = '';
    renderPicks();
  });
}

function applyCalibration() {
  if (!state.underlay) return;
  try {
    state.underlay = applySurveyDistanceCalibration(state.underlay, {
      pointA: state.pointA,
      pointB: state.pointB,
      trueDistance: Number(refs.trueDistance.value),
      trueDistanceUnit: refs.trueUnit.value,
    });
    if (state.boundary?.points?.length) {
      state.boundary = buildSiteBoundary(state.boundary.points, {
        frontEdgeIndex: state.frontEdgeIndex,
        rearEdgeIndex: state.rearEdgeIndex,
        edgeRoles: state.boundary.edges?.map((edge) => edge.role),
        origin: state.boundary.origin,
        originRole: state.boundary.originRole,
        unitScaleToFeet: state.underlay.transform?.unitScaleToFeet || 1,
        source: state.boundary.source,
      });
    }
    renderSummary();
    renderPicks();
    renderSetupStatuses();
    setStatus(`Calibrated: 1 DXF unit = ${round6(state.underlay.transform.unitScaleToFeet)} ft.`);
  } catch (error) {
    setStatus(error.message || 'Could not calibrate this survey.');
  }
}

function exportRevitDxf() {
  const blocker = surveyExportBlocker(state);
  if (blocker) {
    refs.exportStatus.textContent = blocker;
    return;
  }
  try {
    const { text, summary } = exportRevitUnderlay(state.revitPreflight, {
      sourceMin: state.underlay.sourceBounds.min,
      ...state.underlay.transform,
      origin: state.boundary.origin,
      visibleLayers: state.visibleLayers,
      boundaryLayer: state.boundaryLayer,
    });
    downloadTextFile(text, `${state.underlay.sourceFileName.replace(/\.dxf$/i, '')}.revit-2d.dxf`, 'application/dxf');
    refs.exportStatus.textContent = `Exported ${summary.included.length} entities in feet. In Revit, link Origin to Origin if the project origin matches.`;
  } catch (error) {
    refs.exportStatus.textContent = error.message || 'Could not export the Revit underlay.';
  }
}

function downloadTextFile(text, fileName, type) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function renderPicks() {
  state.pickLayer?.replaceChildren();
  renderBoundaryOverlay();
  renderHoverOverlay();
  if (state.selectedAlignLine) {
    renderOverlayLine(state.selectedAlignLine.start, state.selectedAlignLine.end, 'survey-selected-vector');
    renderAlignmentFaceGuide();
  }
  renderSelectedFrontVectors();
  renderSelectedRearVectors();
  renderSelectedSideVectors();
  renderSelectedLeftVectors();
  renderSelectedRightVectors();
  renderPointSet([state.pointA, state.pointB].filter(Boolean), 'survey-pick-point');
  renderPointSet([state.alignA, state.alignB].filter(Boolean), 'survey-align-point');
  if (state.pointA && state.pointB) {
    renderOverlayLine(state.pointA, state.pointB, 'survey-pick-line');
  }
  if (state.alignA && state.alignB) {
    renderOverlayLine(state.alignA, state.alignB, 'survey-align-line');
  }
}

function renderAlignmentFaceGuide() {
  const guide = alignmentFaceGuide(state.selectedAlignLine, state.boundary, markerSize(28));
  if (guide) renderOverlayLine(guide.start, guide.end, 'survey-align-face-normal');
}

function renderSelectedFrontVectors() {
  if (!state.frontLineKeys.size) return;
  surveySelectableLines(state.underlay).forEach((line) => {
    if (state.frontLineKeys.has(lineKey(line))) renderOverlayLine(line.start, line.end, 'survey-front-vector');
  });
}

function renderSelectedRearVectors() {
  if (!state.rearLineKeys.size) return;
  surveySelectableLines(state.underlay).forEach((line) => {
    if (state.rearLineKeys.has(lineKey(line))) renderOverlayLine(line.start, line.end, 'survey-rear-vector');
  });
}

function renderSelectedSideVectors() {
  if (!state.side1LineKeys.size && !state.side2LineKeys.size) return;
  surveySelectableLines(state.underlay).forEach((line) => {
    const key = lineKey(line);
    if (state.side1LineKeys.has(key)) renderOverlayLine(line.start, line.end, 'survey-side-one-vector');
    if (state.side2LineKeys.has(key)) renderOverlayLine(line.start, line.end, 'survey-side-two-vector');
  });
}

function renderSelectedLeftVectors() {
  if (!state.leftLineKeys.size) return;
  surveySelectableLines(state.underlay).forEach((line) => {
    if (state.leftLineKeys.has(lineKey(line))) renderOverlayLine(line.start, line.end, 'survey-left-vector');
  });
}

function renderSelectedRightVectors() {
  if (!state.rightLineKeys.size) return;
  surveySelectableLines(state.underlay).forEach((line) => {
    if (state.rightLineKeys.has(lineKey(line))) renderOverlayLine(line.start, line.end, 'survey-right-vector');
  });
}

function renderPointSet(points, className) {
  points.forEach((point) => {
    const circle = svgElement('circle');
    circle.setAttribute('cx', point[0]);
    circle.setAttribute('cy', point[1]);
    circle.setAttribute('r', className === 'survey-pick-point' ? markerSize(5.2) : markerSize(3.5));
    circle.setAttribute('class', className);
    state.pickLayer.appendChild(circle);
  });
}

function renderHoverOverlay() {
  if (state.hoverLine) {
    renderOverlayLine(state.hoverLine.line.start, state.hoverLine.line.end, 'survey-hover-vector');
  }
  if (state.hoverSnap) {
    const size = markerSize(state.pickMode === 'calibrate' ? 10.2 : 7.4);
    const [x, y] = state.hoverSnap.point;
    const bubble = svgElement('circle');
    bubble.setAttribute('cx', x);
    bubble.setAttribute('cy', y);
    bubble.setAttribute('r', markerSize(state.pickMode === 'calibrate' ? 6.2 : 4.8));
    bubble.setAttribute('class', 'survey-hover-bubble');
    state.pickLayer.appendChild(bubble);
    renderOverlayLine([x - size, y], [x + size, y], 'survey-hover-snap');
    renderOverlayLine([x, y - size], [x, y + size], 'survey-hover-snap');
  }
}

function renderOverlayLine(start, end, className) {
  const line = svgElement('line');
  line.setAttribute('x1', start[0]);
  line.setAttribute('y1', start[1]);
  line.setAttribute('x2', end[0]);
  line.setAttribute('y2', end[1]);
  line.setAttribute('class', className);
  state.pickLayer.appendChild(line);
}

function resetPicks() {
  if (state.pickMode === 'align') {
    state.alignA = null;
    state.alignB = null;
  } else {
    state.pointA = null;
    state.pointB = null;
  }
  renderPicks();
  renderSetupStatuses();
  setStatus(state.underlay ? modeInstruction() : 'Waiting for DXF.');
}

function fitDrawing() {
  if (!state.underlay) return;
  renderCanvas();
}

function setAllLayersVisible(visible) {
  if (!state.underlay) return;
  state.visibleLayers = visible ? new Set([...state.layerColors.keys()]) : new Set();
  if (activeBoundaryLayer()) state.visibleLayers.add(activeBoundaryLayer());
  renderLayerList();
  refreshLayerDisplay({ rebuild: true });
}

function toggleContextTone() {
  state.dimBoundaryContext = !state.dimBoundaryContext;
  renderToneToggle();
  renderLayerList();
  refreshLayerDisplay({ rebuild: true });
}

function renderToneToggle() {
  refs.toggleContextTone.classList.toggle('active', state.dimBoundaryContext);
  refs.toggleContextTone.textContent = state.dimBoundaryContext ? 'Untone Background' : 'Tone Background';
  refs.toggleContextTone.disabled = !activeBoundaryLayer();
}

function setPickMode(mode) {
  state.pickMode = mode;
  [refs.modeCalibrate, refs.modeAlign, refs.modeFront, refs.modeRear, refs.modeSide1, refs.modeSide2].forEach((button) => button.classList.remove('active'));
  const activeButton = { calibrate: refs.modeCalibrate, align: refs.modeAlign, front: refs.modeFront, rear: refs.modeRear, side1: refs.modeSide1, side2: refs.modeSide2 }[mode];
  activeButton?.classList.add('active');
  refs.canvasModeHint.textContent = modeInstruction();
  setStatus(modeInstruction());
  renderWorkflowProgress(state);
}

function togglePickMode(mode) {
  setPickMode(state.pickMode === mode ? 'idle' : mode);
}

function modeInstruction() {
  if (!state.underlay) return 'Waiting for DXF.';
  if (state.pickMode === 'align') return 'Alignment mode: build the boundary, click a property side, then point its outside face to a compass direction.';
  if (state.pickMode === 'front') return 'Front mode: click every property segment that belongs to the front side.';
  if (state.pickMode === 'rear') return 'Rear mode: click every property segment that belongs to the rear side.';
  if (state.pickMode === 'side1') return 'Side 1 mode: click every segment that belongs to the first side run.';
  if (state.pickMode === 'side2') return 'Side 2 mode: click every segment that belongs to the second side run.';
  if (state.pickMode === 'calibrate') return 'Scale mode: pick point A, then point B.';
  return 'Choose a step on the left. Drag pans the drawing; wheel zooms.';
}

function pickAlignmentVector(point) {
  if (!activeBoundaryLayer()) {
    refs.alignmentStatus.textContent = 'Choose the property boundary layer first, then pick one property side.';
    return;
  }
  const hit = nearestLineCandidate(point, activeBoundaryLayer());
  if (!hit) {
    refs.alignmentStatus.textContent = 'Move closer to a CAD vector to select it.';
    return;
  }
  state.selectedAlignLine = hit.line;
  state.alignA = hit.line.start;
  state.alignB = hit.line.end;
  if (!state.boundary?.points?.length) {
    const missing = missingBoundaryRoleLabels();
    refs.alignmentStatus.textContent = missing.length
      ? `Selected ${hit.line.layer || '0'} vector. Build the property boundary before applying alignment. Missing: ${missing.join(', ')}.`
      : `Selected ${hit.line.layer || '0'} vector. Click Apply Face Alignment to build the boundary from your marks and align it.`;
    renderWorkflowProgress(state);
    renderPicks();
    return;
  }
  const alignment = exteriorFaceAlignment(hit.line, state.boundary, state.alignTargetAngle);
  refs.alignmentStatus.textContent = alignment
    ? `Selected ${hit.line.layer || '0'} side. Its outside face will rotate ${round2(alignment.angle)}° to ${directionLabel(state.alignTargetAngle)}.`
    : 'Could not infer the outside face. Build the boundary from front, rear, Side 1, and Side 2 first.';
  renderWorkflowProgress(state);
  renderPicks();
}

function setAlignmentTarget(angle) {
  state.alignTargetAngle = angle;
  refs.alignTargets.forEach((button) => {
    button.classList.toggle('active', Number(button.dataset.alignTarget) === angle);
  });
  if (state.selectedAlignLine) {
    applyAlignment();
  } else {
    refs.alignmentStatus.textContent = `Outside-face target set to ${directionLabel(angle)}. Pick a property side to align.`;
  }
}

function clearAlignmentVector() {
  state.selectedAlignLine = null;
  state.alignA = null;
  state.alignB = null;
  if (state.pickMode === 'align') setPickMode('idle');
  renderWorkflowProgress(state);
  renderPicks();
  refs.alignmentStatus.textContent = 'No alignment vector picked.';
}

function applyAlignment() {
  const line = state.selectedAlignLine;
  if (!state.underlay || !line) {
    refs.alignmentStatus.textContent = 'Pick a CAD alignment vector first.';
    return;
  }
  if (!ensureBoundaryForAlignment()) return;
  const targetAngle = state.alignTargetAngle;
  const alignment = exteriorFaceAlignment(line, state.boundary, targetAngle);
  if (!alignment) {
    refs.alignmentStatus.textContent = 'Build the boundary first so alignment can use the outside face of the property line.';
    return;
  }
  const angle = alignment.angle;
  if (Math.abs(angle) < 0.0001) {
    setPickMode('idle');
    refs.alignmentStatus.textContent = `Selected side outside face already points ${directionLabel(targetAngle)}.`;
    return;
  }
  const pivot = line.start;
  const nextFrontLineKeys = rotateLineKeySet(state.frontLineKeys, pivot, angle);
  const nextRearLineKeys = rotateLineKeySet(state.rearLineKeys, pivot, angle);
  const nextSideLineKeys = rotateLineKeySet(state.sideLineKeys, pivot, angle);
  const nextSide1LineKeys = rotateLineKeySet(state.side1LineKeys, pivot, angle);
  const nextSide2LineKeys = rotateLineKeySet(state.side2LineKeys, pivot, angle);
  const nextLeftLineKeys = rotateLineKeySet(state.leftLineKeys, pivot, angle);
  const nextRightLineKeys = rotateLineKeySet(state.rightLineKeys, pivot, angle);
  const nextSelectedAlignLine = rotateLineGeometry(line, pivot, angle);
  state.underlay = rotateSurveyUnderlay(state.underlay, { angleDegrees: angle, pivot });
  state.snapIndex = buildSurveySnapIndex(surveySelectableLines(state.underlay));
  state.layerSnapIndices = new Map();
  state.frontLineKeys = nextFrontLineKeys;
  state.rearLineKeys = nextRearLineKeys;
  state.sideLineKeys = nextSideLineKeys;
  state.side1LineKeys = nextSide1LineKeys;
  state.side2LineKeys = nextSide2LineKeys;
  syncSideLineKeys();
  state.leftLineKeys = nextLeftLineKeys;
  state.rightLineKeys = nextRightLineKeys;
  state.pointA = rotateOptionalPoint(state.pointA, pivot, angle);
  state.pointB = rotateOptionalPoint(state.pointB, pivot, angle);
  state.selectedAlignLine = nextSelectedAlignLine;
  state.alignA = nextSelectedAlignLine.start;
  state.alignB = nextSelectedAlignLine.end;
  if (state.boundary?.points?.length) {
    const rotatedOrigin = state.boundary.origin
      ? rotateBoundaryPoints([state.boundary.origin], pivot, angle)[0]
      : null;
    state.boundary = buildSiteBoundary(rotateBoundaryPoints(state.boundary.points, pivot, angle), {
      frontEdgeIndex: state.frontEdgeIndex,
      rearEdgeIndex: state.rearEdgeIndex,
      edgeRoles: state.boundary.edges?.map((edge) => edge.role),
      origin: rotatedOrigin,
      originRole: state.boundary.originRole,
      unitScaleToFeet: state.underlay.transform?.unitScaleToFeet || 1,
      source: state.boundary.source,
    });
  }
  state.hoverLine = null;
  state.hoverSnap = null;
  state.hoverSignature = '';
  renderSummary();
  renderCanvas({ preserveViewBox: true });
  renderSetupStatuses();
  setPickMode('idle');
  refs.alignmentStatus.textContent = `Aligned outside face to ${directionLabel(targetAngle)}. Survey rotated ${round2(angle)}°; picks and boundary moved with it.`;
}

function ensureBoundaryForAlignment() {
  if (state.boundary?.points?.length) return true;
  if (!activeBoundaryLayer()) {
    refs.alignmentStatus.textContent = 'Choose the property boundary layer first, then mark front, rear, Side 1, and Side 2.';
    return false;
  }
  const missing = missingBoundaryRoleLabels();
  if (missing.length) {
    refs.alignmentStatus.textContent = `Build the property boundary first. Missing: ${missing.join(', ')}.`;
    return false;
  }
  return buildManualBoundaryFromSelectedSides({ statusElement: refs.alignmentStatus });
}

function buildManualBoundaryFromSelectedSides({ statusElement = refs.boundaryStatus } = {}) {
  if (!state.underlay) return false;
  const markedSegments = selectedBoundaryMarkedSegments();
  const missing = Object.entries(markedSegments)
    .filter(([, lines]) => !lines.length)
    .map(([role]) => boundaryRoleLabel(role));
  if (missing.length) {
    statusElement.textContent = `Pick at least one segment for: ${missing.join(', ')}.`;
    return false;
  }

  const inferredSides = inferLeftRightSideSegments(markedSegments, state.underlay.bounds);
  if (inferredSides.error) {
    statusElement.textContent = inferredSides.error;
    return false;
  }

  state.leftLineKeys = new Set(inferredSides.left.map(lineKey));
  state.rightLineKeys = new Set(inferredSides.right.map(lineKey));
  const sideSegments = {
    front: markedSegments.front,
    right: inferredSides.right,
    rear: markedSegments.rear,
    left: inferredSides.left,
  };
  const manualBoundary = boundaryFromManualSideSegments(sideSegments);
  if (manualBoundary.points.length < 3) {
    statusElement.textContent = 'Could not build a closed boundary from the selected side segments. Check that adjacent sides intersect.';
    return false;
  }

  state.frontEdgeIndex = manualBoundary.edgeRoles.findIndex((role) => role === 'front');
  if (state.frontEdgeIndex < 0) state.frontEdgeIndex = 0;
  state.rearEdgeIndex = manualBoundary.edgeRoles.findIndex((role) => role === 'rear');
  if (state.rearEdgeIndex < 0) state.rearEdgeIndex = null;
  state.boundary = buildSiteBoundary(manualBoundary.points, {
    frontEdgeIndex: state.frontEdgeIndex,
    rearEdgeIndex: state.rearEdgeIndex,
    edgeRoles: manualBoundary.edgeRoles,
    origin: manualBoundary.origin,
    originRole: manualBoundary.originRole,
    unitScaleToFeet: state.underlay.transform?.unitScaleToFeet || 1,
    source: `manual-sides:${state.boundaryLayer || 'mixed-layers'}`,
  });
  renderPicks();
  renderSetupStatuses();
  return true;
}

function pickFrontVector(point) {
  pickBoundaryRoleVector(point, 'front');
}

function pickRearVector(point) {
  pickBoundaryRoleVector(point, 'rear');
}

function pickSideVector(point, role) {
  pickBoundaryRoleVector(point, role);
}

function pickBoundaryRoleVector(point, role) {
  if (!activeBoundaryLayer()) {
    refs.boundaryStatus.textContent = 'Choose the property boundary layer first, then mark the side vectors manually.';
    return;
  }
  const hit = nearestLineCandidate(point, activeBoundaryLayer());
  if (!hit) {
    refs.boundaryStatus.textContent = `Move closer to a property CAD vector to mark ${boundaryRoleLabel(role)}.`;
    return;
  }
  const key = lineKey(hit.line);
  removeLineKeyFromOtherRoles(key, role);
  const keySet = lineKeySetForRole(role);
  if (keySet.has(key)) keySet.delete(key);
  else keySet.add(key);
  syncSideLineKeys();
  state.boundary = null;
  state.leftLineKeys = new Set();
  state.rightLineKeys = new Set();

  const count = keySet.size;
  const allCounts = roleCountsText();
  refs.boundaryStatus.textContent = `${count} ${boundaryRoleLabel(role)} segment${count === 1 ? '' : 's'} selected. ${allCounts}. Build boundary after front, rear, Side 1, and Side 2 are marked.`;
  renderWorkflowProgress(state);
  renderPicks();
}

function clearBoundaryMarks() {
  resetBoundarySelections({ clearBoundary: true });
  renderPicks();
  renderSetupStatuses();
}

function selectedBoundaryMarkedSegments() {
  const lines = surveySelectableLines(state.underlay);
  return {
    front: lines.filter((line) => state.frontLineKeys.has(lineKey(line))),
    rear: lines.filter((line) => state.rearLineKeys.has(lineKey(line))),
    side1: lines.filter((line) => state.side1LineKeys.has(lineKey(line))),
    side2: lines.filter((line) => state.side2LineKeys.has(lineKey(line))),
  };
}

function missingBoundaryRoleLabels() {
  return Object.entries(selectedBoundaryMarkedSegments())
    .filter(([, lines]) => !lines.length)
    .map(([role]) => boundaryRoleLabel(role));
}

function lineKeySetForRole(role) {
  if (role === 'front') return state.frontLineKeys;
  if (role === 'rear') return state.rearLineKeys;
  if (role === 'side1') return state.side1LineKeys;
  return state.side2LineKeys;
}

function removeLineKeyFromOtherRoles(key, activeRole) {
  ['front', 'rear', 'side1', 'side2'].forEach((role) => {
    if (role !== activeRole) lineKeySetForRole(role).delete(key);
  });
  syncSideLineKeys();
  state.leftLineKeys.delete(key);
  state.rightLineKeys.delete(key);
}

function roleCountsText() {
  return [
    `front ${state.frontLineKeys.size}`,
    `rear ${state.rearLineKeys.size}`,
    `side 1 ${state.side1LineKeys.size}`,
    `side 2 ${state.side2LineKeys.size}`,
  ].join(' / ');
}

function syncSideLineKeys() {
  state.sideLineKeys = new Set([...state.side1LineKeys, ...state.side2LineKeys]);
}

function resetBoundarySelections({ clearLayer = false, clearBoundary = false } = {}) {
  if (clearLayer) state.boundaryLayer = '';
  if (clearBoundary) state.boundary = null;
  state.frontLineKeys = new Set();
  state.rearLineKeys = new Set();
  state.sideLineKeys = new Set();
  state.side1LineKeys = new Set();
  state.side2LineKeys = new Set();
  state.leftLineKeys = new Set();
  state.rightLineKeys = new Set();
  state.rearEdgeIndex = null;
}

function boundaryRoleLabel(role) {
  if (role === 'side1') return 'Side 1';
  if (role === 'side2') return 'Side 2';
  return role;
}

function renderSetupStatuses() {
  refs.alignmentStatus.textContent = state.underlay
    ? `Rotation: ${round2(state.underlay.prep?.alignmentRotation || 0)}°.`
    : 'No alignment vector picked.';
  const frontText = state.frontLineKeys.size ? ` Front: ${state.frontLineKeys.size} selected vector${state.frontLineKeys.size === 1 ? '' : 's'}.` : '';
  const rearText = state.rearLineKeys.size ? ` Rear: ${state.rearLineKeys.size} selected vector${state.rearLineKeys.size === 1 ? '' : 's'}.` : '';
  const side1Text = state.side1LineKeys.size ? ` Side 1: ${state.side1LineKeys.size} selected vector${state.side1LineKeys.size === 1 ? '' : 's'}.` : '';
  const side2Text = state.side2LineKeys.size ? ` Side 2: ${state.side2LineKeys.size} selected vector${state.side2LineKeys.size === 1 ? '' : 's'}.` : '';
  const inferredText = state.leftLineKeys.size || state.rightLineKeys.size
    ? ` Inferred left/right: ${state.leftLineKeys.size}/${state.rightLineKeys.size}.`
    : '';
  refs.boundaryStatus.textContent = `${boundaryLabel(state.boundary)}${frontText}${rearText}${side1Text}${side2Text}${inferredText}`;
  renderWorkflowProgress(state);
}

function renderBoundaryOverlay() {
  if (!state.boundary?.points?.length) return;
  const polygon = svgElement('polygon');
  polygon.setAttribute('points', state.boundary.points.map((point) => point.join(',')).join(' '));
  polygon.setAttribute('class', 'survey-boundary-polygon');
  state.pickLayer.appendChild(polygon);
  const edgeClassByRole = {
    front: 'survey-boundary-front',
    right: 'survey-boundary-right',
    rear: 'survey-boundary-rear',
    left: 'survey-boundary-left',
  };
  state.boundary.edges.forEach((edge) => {
    const edgeClass = edgeClassByRole[edge.role] || 'survey-boundary-edge';
    renderOverlayLine(edge.start, edge.end, edgeClass);
    const midpoint = [(edge.start[0] + edge.end[0]) / 2, (edge.start[1] + edge.end[1]) / 2];
    const label = svgElement('text');
    label.setAttribute('transform', `translate(${midpoint.join(' ')}) scale(1 -1)`);
    label.setAttribute('class', 'survey-boundary-label');
    label.textContent = ['front', 'right', 'rear', 'left'].includes(edge.role)
      ? edge.role.toUpperCase()
      : `${edge.index + 1}`;
    state.pickLayer.appendChild(label);
  });
}

function updateHover(point) {
  if (!state.underlay) return;
  const layerFilter = activeBoundaryLayer();
  const vectorMode = ['align', 'front', 'rear', 'side1', 'side2'].includes(state.pickMode);
  const snapMode = state.pickMode === 'calibrate';
  const hoverLine = vectorMode ? nearestLineCandidate(point, layerFilter) : null;
  const hoverSnap = snapMode ? nearestSnapCandidate(point, layerFilter) : null;
  const signature = hoverLine
    ? `line:${lineKey(hoverLine.line)}`
    : hoverSnap ? `snap:${round4(hoverSnap.point[0])}:${round4(hoverSnap.point[1])}` : 'none';
  if (signature === state.hoverSignature) return;
  state.hoverSnap = hoverSnap;
  state.hoverLine = hoverLine;
  state.hoverSignature = signature;
  renderPicks();
}

function nearestSnapCandidate(point, layerFilter = null) {
  const snapSource = layerFilter ? snapIndexForLayer(layerFilter) : state.snapIndex;
  const snap = nearestSurveySnap(snapSource, point);
  return snap.distance <= drawingThreshold(12) ? snap.candidate : null;
}

function nearestLineCandidate(point, layerFilter = null) {
  const threshold = drawingThreshold(11);
  const lines = surveySelectableLines(state.underlay)
    .filter((entity) => !layerFilter || (entity.layer || '0') === layerFilter);
  const closest = lines.reduce((best, line) => {
    const projected = projectPointToSegment(point, line.start, line.end);
    const distanceToLine = distance(point, projected);
    if (distanceToLine > threshold || distanceToLine >= best.distance) return best;
    return { line, projected, distance: distanceToLine };
  }, { line: null, projected: null, distance: Infinity });
  return closest.line ? closest : null;
}

function rotateLineKeySet(lineKeys, pivot, angleDegrees) {
  const nextKeys = new Set();
  lineKeys.forEach((key) => {
    const line = surveySelectableLines(state.underlay).find((entity) => lineKey(entity) === key);
    if (!line) return;
    nextKeys.add(lineKey(rotateLineGeometry(line, pivot, angleDegrees)));
  });
  return nextKeys;
}

function rotateLineGeometry(line, pivot, angleDegrees) {
  const [start, end] = rotateBoundaryPoints([line.start, line.end], pivot, angleDegrees);
  return { ...line, start, end };
}

function rotateOptionalPoint(point, pivot, angleDegrees) {
  return point ? rotateBoundaryPoints([point], pivot, angleDegrees)[0] : null;
}

function drawingThreshold(screenPixels) {
  const rect = state.svg?.getBoundingClientRect();
  if (!rect?.width || !state.viewBox?.width) return Infinity;
  return (state.viewBox.width / rect.width) * screenPixels;
}

function markerSize(screenPixels) {
  const rect = state.svg?.getBoundingClientRect();
  if (!rect?.width || !state.viewBox?.width) return 0.18;
  return (state.viewBox.width / rect.width) * screenPixels;
}

function projectPointToSegment(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSq = dx * dx + dy * dy;
  if (lengthSq < 1e-9) return start;
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSq));
  return [start[0] + dx * t, start[1] + dy * t];
}

function activeBoundaryLayer() {
  return state.boundaryLayer || null;
}

function snapIndexForLayer(layerFilter) {
  if (!layerFilter) return state.snapIndex;
  if (state.layerSnapIndices.has(layerFilter)) return state.layerSnapIndices.get(layerFilter);
  const index = buildSurveySnapIndex(surveySelectableLines(state.underlay, layerFilter));
  state.layerSnapIndices.set(layerFilter, index);
  return index;
}

function setWorkingLayerVisibility() {
  if (!state.underlay || !activeBoundaryLayer()) {
    refreshLayerDisplay();
    return;
  }
  state.visibleLayers.add(state.boundaryLayer);
  refreshLayerDisplay();
}

function lineKey(line) {
  return [
    line.layer || '0',
    round4(line.start[0]),
    round4(line.start[1]),
    round4(line.end[0]),
    round4(line.end[1]),
  ].join(':');
}

function updateLayerVisibility() {
  updateSurveyLayerVisibility(state.svg, {
    visibleLayers: state.visibleLayers,
    focusedLayer: activeBoundaryLayer(),
    isolateContext: state.dimBoundaryContext,
  });
}

function refreshLayerDisplay({ rebuild = false } = {}) {
  if (!state.svg) return;
  if (activeBoundaryLayer()) {
    state.visibleLayers.add(activeBoundaryLayer());
  }
  renderRevitPreflight(state);
  if (rebuild || activeBoundaryLayer() || state.svg.querySelector('.survey-preview-context')) {
    renderCanvas({ preserveViewBox: true });
    return;
  }
  updateLayerVisibility();
}

function isBoundaryContextDimmed() {
  return Boolean(activeBoundaryLayer()) && state.dimBoundaryContext;
}

function zoomViewBox(anchor, factor) {
  const newWidth = state.viewBox.width * factor;
  const newHeight = state.viewBox.height * factor;
  const anchorXRatio = (anchor[0] - state.viewBox.x) / state.viewBox.width;
  const anchorYRatio = (anchor[1] - state.viewBox.y) / state.viewBox.height;
  state.viewBox.x = anchor[0] - newWidth * anchorXRatio;
  state.viewBox.y = anchor[1] - newHeight * anchorYRatio;
  state.viewBox.width = newWidth;
  state.viewBox.height = newHeight;
  setSvgViewBox();
  renderPicks();
}

function setSvgViewBox() {
  const { x, y, width, height } = state.viewBox;
  state.svg?.setAttribute('viewBox', `${x} ${-y - height} ${width} ${height}`);
}

function svgPointFromEvent(event) {
  const point = state.svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  const transformed = point.matrixTransform(state.svg.getScreenCTM().inverse());
  return [transformed.x, -transformed.y];
}

function layerCounts(entities) {
  const counts = new Map();
  entities.forEach((entity) => counts.set(entity.layer || '0', (counts.get(entity.layer || '0') || 0) + 1));
  return counts;
}

function setStatus(message) {
  refs.status.textContent = message;
}

function svgElement(tag) {
  return document.createElementNS(SVG_NS, tag);
}

function distance(pointA, pointB) {
  return Math.hypot(pointB[0] - pointA[0], pointB[1] - pointA[1]);
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function round4(value) {
  return Math.round(value * 10000) / 10000;
}

function round6(value) {
  return Math.round(value * 1000000) / 1000000;
}
