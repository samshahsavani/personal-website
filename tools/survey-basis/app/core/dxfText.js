export function dxfPairs(text) {
  if (typeof text !== 'string' || !text.trim()) throw new Error('The DXF file is empty or unreadable.');
  if (/^AC10\d{2}|^AutoCAD Binary DXF|\0/i.test(text)) {
    throw new Error('This file is DWG or binary DXF. Save a copy as text (ASCII) DXF and open that copy.');
  }
  const lines = text.replace(/^\uFEFF/, '').split(/\r\n|\n|\r/);
  const pairs = [];
  let last = lines.length;
  while (last && !lines[last - 1].trim()) last -= 1;
  for (let i = 0; i < last; i += 2) {
    if (!/^\d+$/.test(lines[i].trim()) || lines[i + 1] === undefined) {
      throw new Error('Malformed text DXF. Run AUDIT on a CAD copy and save it as text DXF again.');
    }
    pairs.push({ code: Number(lines[i]), value: lines[i + 1].trim() });
  }
  if (pairs.at(-1)?.code !== 0 || pairs.at(-1)?.value.toUpperCase() !== 'EOF') {
    throw new Error('This is not a complete text DXF. Save the drawing as text DXF and try again.');
  }
  return pairs;
}

export function dxfEntityEnd(pairs, start) {
  let end = start + 1;
  while (end < pairs.length && pairs[end].code !== 0) end += 1;
  return end;
}

export function isDxfPaperSpace(pairs, start, end = dxfEntityEnd(pairs, start)) {
  for (let index = start + 1; index < end; index += 1) {
    const { code, value } = pairs[index];
    if ((code === 67 && Number(value) === 1) || (code === 410 && !/^model$/i.test(value))) return true;
  }
  return false;
}
