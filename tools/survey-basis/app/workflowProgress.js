const STEP_STATUS = Object.freeze({
  open: 'open',
  boundary: 'boundary',
  scale: 'scale',
  align: 'align',
  layers: 'layers',
});

export function renderWorkflowProgress(state) {
  const statuses = {
    [STEP_STATUS.open]: state.underlay ? done('Loaded') : pending('Pending'),
    [STEP_STATUS.boundary]: boundaryStatus(state),
    [STEP_STATUS.scale]: scaleStatus(state),
    [STEP_STATUS.align]: state.underlay?.prep?.alignmentPivot
      ? done('Aligned')
      : state.pickMode === 'align' || state.selectedAlignLine ? active('Picking') : pending('Pending'),
    [STEP_STATUS.layers]: state.underlay ? done('Ready') : pending('Pending'),
  };

  Object.entries(statuses).forEach(([step, status]) => {
    const badge = document.querySelector(`[data-step-status="${step}"]`);
    if (!badge) return;
    badge.textContent = status.label;
    badge.dataset.state = status.state;
  });
}

function boundaryStatus(state) {
  if (state.boundary?.points?.length) return done('Built');
  if (state.pickMode === 'front' || state.pickMode === 'rear' || state.pickMode === 'side1' || state.pickMode === 'side2') {
    return active('Marking');
  }
  if (state.boundaryLayer || state.frontLineKeys?.size || state.rearLineKeys?.size || state.side1LineKeys?.size || state.side2LineKeys?.size) {
    return active('Started');
  }
  return pending('Pending');
}

function scaleStatus(state) {
  if (state.underlay?.units?.source === 'calibration') return done('Scaled');
  if (state.underlay?.units?.source === 'dxf-insunits') return optional('DXF Units');
  if (state.pickMode === 'calibrate' || state.pointA || state.pointB) return active('Picking');
  return pending('Pending');
}

function done(label) {
  return { label, state: 'done' };
}

function active(label) {
  return { label, state: 'active' };
}

function optional(label) {
  return { label, state: 'optional' };
}

function pending(label) {
  return { label, state: 'pending' };
}
