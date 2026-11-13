export function renderTrueNorthArrow({
  layer,
  start,
  end,
  markerSize,
  svgElement,
}) {
  renderOverlayLine(layer, svgElement, start, end, 'survey-true-north-line');

  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]);
  const headLength = markerSize(16);
  const wingAngle = Math.PI / 7;
  const left = [
    end[0] - Math.cos(angle - wingAngle) * headLength,
    end[1] - Math.sin(angle - wingAngle) * headLength,
  ];
  const right = [
    end[0] - Math.cos(angle + wingAngle) * headLength,
    end[1] - Math.sin(angle + wingAngle) * headLength,
  ];
  renderOverlayLine(layer, svgElement, end, left, 'survey-true-north-head');
  renderOverlayLine(layer, svgElement, end, right, 'survey-true-north-head');
  renderTrueNorthLabel({ layer, point: end, angle, markerSize, svgElement });
}

function renderTrueNorthLabel({ layer, point, angle, markerSize, svgElement }) {
  const offset = markerSize(18);
  const label = svgElement('text');
  const [x, y] = [point[0] + Math.cos(angle) * offset, point[1] + Math.sin(angle) * offset];
  label.setAttribute('transform', `translate(${x} ${y}) scale(1 -1)`);
  label.setAttribute('class', 'survey-true-north-label');
  label.textContent = 'TRUE N';
  layer.appendChild(label);
}

function renderOverlayLine(layer, svgElement, start, end, className) {
  const line = svgElement('line');
  line.setAttribute('x1', start[0]);
  line.setAttribute('y1', start[1]);
  line.setAttribute('x2', end[0]);
  line.setAttribute('y2', end[1]);
  line.setAttribute('class', className);
  layer.appendChild(line);
}
