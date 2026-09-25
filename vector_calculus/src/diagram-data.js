import { boxBoundary, cylinderBoundary, diskSurface,
  ellipsoidSurface, sampleSurface, sphereSurface } from './geometry.js';

const blue = '#165c91';
const green = '#226435';
const orange = '#b85e22';
const surfaceBlue = '#78afc8';

const circle = (radius, center = [0, 0], count = 73) =>
  Array.from({ length: count }, (_, index) => {
    const angle = 2 * Math.PI * index / (count - 1);
    return [center[0] + radius * Math.cos(angle),
      center[1] + radius * Math.sin(angle)];
  });
const line = (points, color = blue, width = 3, dash = 'solid') => ({
  type: 'scatter', mode: 'lines',
  x: points.map((point) => point[0]),
  y: points.map((point) => point[1]),
  line: { color, width, dash }, hoverinfo: 'skip', showlegend: false,
});
const marker = (points, color = orange) => ({
  type: 'scatter', mode: 'markers+text',
  x: points.map((point) => point.x),
  y: points.map((point) => point.y),
  text: points.map((point) => point.label || ''),
  textposition: 'top center',
  marker: { color, size: 10 }, showlegend: false,
});

function layout2d(data, equal = true) {
  return {
    margin: { l: 60, r: 25, b: 60, t: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    dragmode: 'pan',
    uirevision: 'diagram-view',
    xaxis: {
      title: { text: data.axisLabels?.x || 'x', standoff: 10 },
      range: data.xRange,
      automargin: true,
      ...(equal ? { scaleanchor: 'y', scaleratio: 1, constrain: 'domain' } : {}),
      ...(data.hideTicks ? { showticklabels: false } : {}),
    },
    yaxis: {
      title: { text: data.axisLabels?.y || 'y', standoff: 10 },
      range: data.yRange,
      automargin: true,
      ...(equal ? { constrain: 'domain' } : {}),
      ...(data.hideTicks ? { showticklabels: false } : {}),
    },
  };
}

function diagram1d(data, value) {
  const layout = layout2d(data, false);
  const traces = [line([[data.xRange[0], 0], [data.xRange[1], 0]], '#586a79', 2)];
  if (data.kind === 'support') {
    layout.yaxis.visible = false;
    layout.yaxis.range = [-0.3, 0.8];
    if (data.interval) layout.shapes = [{
      type: 'rect', x0: data.interval[0], x1: data.interval[1],
      y0: -0.18, y1: 0.18, fillcolor: 'rgba(22,92,145,0.18)',
      line: { width: 0 },
    }];
    traces.push(marker(data.supports.map((support) => ({
      x: support.x, y: 0, label: support.label || 'δ',
    }))));
    return { traces, layout };
  }

  const control = data.control;
  const limit = value ?? control?.initial;
  const [lower, upper] = control?.kind === 'symmetric'
    ? [-limit, limit] : [0, limit];
  for (const segment of data.segments) {
    if (control) {
      const left = Math.max(segment.x0, lower);
      const right = Math.min(segment.x1, upper);
      if (left < right && (segment.y0 || segment.y1)) {
        const height = (x) => segment.y0 +
          (segment.y1 - segment.y0) * (x - segment.x0) /
            (segment.x1 - segment.x0);
        traces.push({
          ...line([[left, 0], [right, 0], [right, height(right)],
            [left, height(left)], [left, 0]], 'rgba(34,100,53,0.5)', 1),
          fill: 'toself', fillcolor: 'rgba(34,100,53,0.25)',
        });
      }
    }
    traces.push(line([[segment.x0, segment.y0], [segment.x1, segment.y1]]));
  }
  layout.shapes = (control?.thresholds || []).map((threshold) => ({
    type: 'line', x0: threshold.value, x1: threshold.value,
    y0: 0, y1: data.yRange[1] * 0.9,
    line: { color: '#8aa0af', width: 1, dash: 'dot' },
  }));
  if (control) {
    for (const bound of control.kind === 'symmetric' ? [-limit, limit] : [limit]) {
      layout.shapes.push({
        type: 'line', x0: bound, x1: bound, y0: 0,
        y1: data.yRange[1] * 0.95,
        line: { color: orange, width: 3, dash: 'dash' },
      });
    }
  }
  if (data.labels?.length) traces.push(marker(data.labels, blue));
  return { traces, layout };
}

function pathArrows(points) {
  const count = points.length - 1;
  const indices = count <= 4 ? Array.from({ length: count }, (_, i) => i)
    : count > 30 ? [9, 27, 45, 63].filter((i) => i < count)
      : [Math.floor(count / 2)];
  return indices.map((index) => {
    const from = points[Math.max(0, index - (count > 4 ? 2 : 0))];
    const to = points[Math.min(count, index + (count > 4 ? 2 : 1))];
    const start = count <= 4 ? [from[0] * 0.65 + to[0] * 0.35,
      from[1] * 0.65 + to[1] * 0.35] : from;
    const end = count <= 4 ? [from[0] * 0.35 + to[0] * 0.65,
      from[1] * 0.35 + to[1] * 0.65] : to;
    return { x: end[0], y: end[1], ax: start[0], ay: start[1],
      xref: 'x', yref: 'y', axref: 'x', ayref: 'y', text: '',
      showarrow: true, arrowhead: 3, arrowsize: 1, arrowwidth: 2,
      arrowcolor: orange };
  });
}

function diagram2d(data, value) {
  const layout = layout2d(data);
  const traces = [];
  if (data.field) traces.push({
    type: 'quiver', ...data.field, anchor: 'tail', lengthmode: 'scaled',
    lengthfactor: 0.5, marker: { color: green }, showlegend: false,
  });
  for (const shape of data.shapes || []) {
    const points = shape.kind === 'disk' ? circle(shape.radius, shape.center)
      : [[shape.bounds[0], shape.bounds[2]], [shape.bounds[1], shape.bounds[2]],
        [shape.bounds[1], shape.bounds[3]], [shape.bounds[0], shape.bounds[3]],
        [shape.bounds[0], shape.bounds[2]]];
    traces.push({ ...line(points), fill: 'toself',
      fillcolor: 'rgba(22,92,145,0.15)' });
  }
  if (data.control?.kind === 'disk') {
    const radius = value ?? data.control.initial;
    const support = data.shapes.find((shape) => shape.kind === 'disk');
    if (radius > 0 && support) {
      traces.push({ ...line(circle(Math.min(radius, support.radius)), green, 1),
        fill: 'toself', fillcolor: 'rgba(34,100,53,0.25)' });
    }
    traces.push(line(circle(radius), orange, 3, 'dash'));
  }
  if (data.path) {
    const points = data.path.kind === 'circle'
      ? circle(data.path.radius, data.path.center)
      : data.path.points;
    traces.push(line(points, orange, 4));
    layout.annotations = pathArrows(points);
  }
  if (data.points?.length) traces.push(marker(data.points));
  if (data.labels?.length) traces.push(marker(data.labels, blue));
  return { traces, layout };
}

const threeLine = (points, color = '#36566c', width = 5) => ({
  type: 'scatter3d', mode: 'lines',
  x: points.map((point) => point[0]),
  y: points.map((point) => point[1]),
  z: points.map((point) => point[2]),
  line: { color, width }, hoverinfo: 'skip', showlegend: false,
});
const threeLabels = (points, color, size = 5) => ({
  type: 'scatter3d', mode: 'markers+text',
  x: points.map((point) => point.x),
  y: points.map((point) => point.y),
  z: points.map((point) => point.z),
  text: points.map((point) => point.label || ''),
  textposition: 'top center',
  textfont: { color: '#1d2935', size: 15 },
  marker: { color, size }, hoverinfo: 'text', showlegend: false,
});

function shapeSurfaces(shape) {
  if (shape.kind === 'sphere') return [sphereSurface(shape.radius)];
  if (shape.kind === 'shell') return [
    sphereSurface(shape.outer), sphereSurface(shape.inner),
  ];
  if (shape.kind === 'ellipsoid') return [ellipsoidSurface(shape.radii)];
  if (shape.kind === 'cylinder') return cylinderBoundary(
    shape.radius, shape.zRange, shape.caps !== false);
  if (shape.kind === 'disk') return [diskSurface(shape.radius, shape.z || 0)];
  if (shape.kind === 'patch') return [{ id: 'patch',
    ...sampleSurface((u, v) => [u, v, u], [0, 1], [0, 1], 2, 2) }];
  if (shape.kind === 'box') return boxBoundary(shape.bounds,
    { xMin: 'xMin', xMax: 'xMax', yMin: 'yMin', yMax: 'yMax',
      zMin: 'zMin', zMax: 'zMax' }).surfaces;
  return [];
}

function diagram3d(data, value, arrowTraces) {
  const axis = (name, range) => ({ title: name, range,
    ...(data.hideTicks ? { showticklabels: false } : {}) });
  const layout = {
    margin: { l: 25, r: 25, b: 25, t: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
    scene: {
      xaxis: axis('x', data.ranges?.x),
      yaxis: axis('y', data.ranges?.y),
      zaxis: axis('z', data.ranges?.z),
      aspectmode: 'data',
      camera: { eye: { x: 1.5, y: 1.5, z: 1.3 } },
      uirevision: 'diagram-view',
    },
  };
  const traces = [];
  for (const shape of data.shapes || []) {
    for (const surface of shapeSurfaces(shape)) {
      traces.push({
        type: 'surface', x: surface.x, y: surface.y, z: surface.z,
        name: surface.id,
        opacity: shape.mode === 'surface' ? 0.72 : 0.28,
        colorscale: [[0, surfaceBlue], [1, surfaceBlue]],
        showscale: false, showlegend: false,
      });
    }
    if (shape.kind === 'box') {
      const boundary = boxBoundary(shape.bounds,
        { xMin: 'xMin', xMax: 'xMax', yMin: 'yMin', yMax: 'yMax',
          zMin: 'zMin', zMax: 'zMax' });
      for (const edge of boundary.edges) traces.push(threeLine(
        edge.x.map((x, i) => [x, edge.y[i], edge.z[i]])));
    }
  }
  if (data.axes) for (const [start, end] of [
    [[-1.5, 0, 0], [1.5, 0, 0]],
    [[0, -1.5, 0], [0, 1.5, 0]],
    [[0, 0, -1.5], [0, 0, 1.5]],
  ]) traces.push(threeLine([start, end], '#9aabb7', 3));

  if (data.control?.kind === 'sphere') {
    const radius = value ?? data.control.initial;
    const source = data.shapes.find((shape) =>
      shape.kind === 'sphere' || shape.kind === 'shell');
    const inner = source?.kind === 'shell' ? source.inner : 0;
    const outer = source?.kind === 'shell' ? source.outer : source?.radius;
    if (source && radius > inner) {
      const overlap = sphereSurface(Math.min(radius, outer));
      traces.push({ type: 'surface', x: overlap.x, y: overlap.y, z: overlap.z,
        opacity: 0.18, colorscale: [[0, green], [1, green]],
        showscale: false, showlegend: false });
      if (inner) {
        const cavity = sphereSurface(inner);
        traces.push({ type: 'surface', x: cavity.x, y: cavity.y, z: cavity.z,
          opacity: 0.18, colorscale: [[0, green], [1, green]],
          showscale: false, showlegend: false });
      }
    }
    for (const plane of [0, 1, 2]) {
      const points = circle(radius).map(([x, y]) =>
        plane === 0 ? [x, y, 0] : plane === 1 ? [x, 0, y] : [0, x, y]);
      traces.push(threeLine(points, orange, 4));
    }
  }
  if (data.field) traces.push(...arrowTraces(data.field));
  if (data.arrows?.length) {
    const vectors = { x: [], y: [], z: [], u: [], v: [], w: [] };
    for (const arrow of data.arrows) {
      vectors.x.push(arrow.at[0]); vectors.y.push(arrow.at[1]);
      vectors.z.push(arrow.at[2]); vectors.u.push(arrow.vector[0]);
      vectors.v.push(arrow.vector[1]); vectors.w.push(arrow.vector[2]);
    }
    traces.push(...arrowTraces(vectors));
    traces.push(threeLabels(data.arrows.filter((arrow) => arrow.label).map((arrow) => ({
      x: arrow.at[0] + 0.6 * arrow.vector[0],
      y: arrow.at[1] + 0.6 * arrow.vector[1],
      z: arrow.at[2] + 0.6 * arrow.vector[2], label: arrow.label,
    })), green, 3));
  }
  if (data.points?.length) traces.push(threeLabels(data.points, orange, 7));
  if (data.labels?.length) traces.push(threeLabels(data.labels, '#36566c'));
  return { traces, layout };
}

export function diagramFigure(widget, data, value, arrowTraces) {
  if (widget === 'diagram1d') return diagram1d(data, value);
  if (widget === 'diagram2d') return diagram2d(data, value);
  if (widget === 'diagram3d') return diagram3d(data, value, arrowTraces);
}
