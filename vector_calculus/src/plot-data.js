const blue = '#165c91';
const green = '#226435';
const surfaceBlue = '#78afc8';

function arrowTraces(data) {
  const gaps = [data.x, data.y, data.z].flatMap((coordinates) => {
    const values = [...new Set(coordinates)].sort((a, b) => a - b);
    return values.slice(1).map((value, index) => value - values[index]);
  });
  const spacing = gaps.length ? Math.min(...gaps) : 1;
  const maxMagnitude = Math.max(0, ...data.u.map((u, index) =>
    Math.hypot(u, data.v[index], data.w[index])));
  if (!maxMagnitude) return [];

  const scale = 0.5 * spacing / maxMagnitude;
  const shafts = { x: [], y: [], z: [] };
  const heads = { x: [], y: [], z: [], u: [], v: [], w: [] };
  const samplePositions = [];
  for (let index = 0; index < data.x.length; index++) {
    const x = data.x[index];
    const y = data.y[index];
    const z = data.z[index];
    const u = data.u[index];
    const v = data.v[index];
    const w = data.w[index];
    if (u === 0 && v === 0 && w === 0) continue;
    const base = [x + scale * u, y + scale * v, z + scale * w];
    shafts.x.push(x, base[0], null);
    shafts.y.push(y, base[1], null);
    shafts.z.push(z, base[2], null);
    heads.x.push(base[0]);
    heads.y.push(base[1]);
    heads.z.push(base[2]);
    heads.u.push(u);
    heads.v.push(v);
    heads.w.push(w);
    samplePositions.push([x, y, z]);
  }

  return [{
    type: 'scatter3d',
    mode: 'lines',
    x: shafts.x, y: shafts.y, z: shafts.z,
    connectgaps: false,
    line: { color: green, width: 3 },
    opacity: 0.55,
    hoverinfo: 'skip',
    showlegend: false,
  }, {
    type: 'cone',
    x: heads.x, y: heads.y, z: heads.z,
    u: heads.u, v: heads.v, w: heads.w,
    customdata: samplePositions,
    hovertemplate: 'At (%{customdata[0]}, %{customdata[1]}, %{customdata[2]})<br>F = (%{u}, %{v}, %{w})<extra></extra>',
    anchor: 'tail',
    sizemode: 'scaled',
    sizeref: 0.22,
    colorscale: [[0, green], [1, green]],
    opacity: 0.55,
    showscale: false,
    showlegend: false,
  }];
}

export function plotFigure(widget, data) {
  const labels = { x: 'x', y: 'y', z: 'z', ...data.axisLabels };
  const layout = {
    margin: { l: 35, r: 20, b: 35, t: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    showlegend: false,
  };

  if (widget === 'vector2d' || widget === 'scalar2d') {
    layout.dragmode = 'pan';
    layout.margin.l = 60;
    layout.margin.b = 60;
    layout.xaxis = {
      title: { text: labels.x, standoff: 10 },
      automargin: true,
      scaleanchor: 'y',
      scaleratio: 1,
      zeroline: true,
    };
    layout.yaxis = {
      title: { text: labels.y, standoff: 10 },
      automargin: true,
      zeroline: true,
    };
    if (widget === 'scalar2d') {
      layout.xaxis.range = [-1.5, 1.5];
      layout.yaxis.range = [-1.5, 1.5];
      layout.xaxis.constrain = 'domain';
      layout.yaxis.constrain = 'domain';
    }
  } else {
    layout.scene = {
      xaxis: { title: labels.x },
      yaxis: { title: labels.y },
      zaxis: { title: labels.z },
      aspectmode: 'data',
      camera: { eye: { x: 1.5, y: 1.5, z: 1.3 } },
    };
  }

  if (widget === 'vector2d') {
    return {
      traces: [{
        type: 'quiver',
        x: data.x, y: data.y, u: data.u, v: data.v,
        anchor: 'tail',
        lengthmode: 'scaled',
        lengthfactor: 0.7,
        marker: { color: blue },
        showlegend: false,
      }],
      layout,
    };
  }
  if (widget === 'scalar2d') {
    return {
      traces: [{
        type: 'contour',
        x: data.x, y: data.y, z: data.values,
        colorscale: 'Blues',
        contours: { coloring: 'heatmap' },
      }],
      layout,
    };
  }
  if (widget === 'vector3d') {
    return { traces: arrowTraces(data), layout };
  }
  if (widget === 'scalar3d') {
    layout.margin.r = 70;
    return {
      traces: [{
        type: 'volume',
        x: data.x, y: data.y, z: data.z, value: data.values,
        isomin: data.isomin, isomax: data.isomax,
        surface: { count: 15 },
        caps: { x: { show: false }, y: { show: false }, z: { show: false } },
        colorscale: [[0, blue], [1, '#a7cfdf']],
        opacity: 0.1,
        opacityscale: [[0, 0.8], [1, 0.2]],
        showscale: true,
        colorbar: { title: { text: 'f(x)' } },
      }],
      layout,
    };
  }
  if (widget === 'geometry3d') {
    const opacity = data.mode === 'volume' ? 0.28 : 0.72;
    const traces = data.surfaces.map((surface) => ({
      type: 'surface',
      x: surface.x, y: surface.y, z: surface.z,
      name: surface.id,
      opacity,
      colorscale: [[0, surfaceBlue], [1, surfaceBlue]],
      showscale: false,
      showlegend: false,
    }));
    for (const edge of data.edges || []) {
      traces.push({
        type: 'scatter3d',
        mode: 'lines',
        x: edge.x, y: edge.y, z: edge.z,
        line: { color: '#36566c', width: 5 },
        hoverinfo: 'skip',
        showlegend: false,
      });
    }
    if (data.vectors) traces.push(...arrowTraces(data.vectors));
    if (data.labels?.length) {
      traces.push({
        type: 'scatter3d',
        mode: 'markers+text',
        x: data.labels.map((label) => label.x),
        y: data.labels.map((label) => label.y),
        z: data.labels.map((label) => label.z),
        text: data.labels.map((label) => label.text),
        textposition: 'top center',
        textfont: { color: '#1d2935', size: 16 },
        marker: { color: 'white', size: 5 },
        hoverinfo: 'text',
        showlegend: false,
      });
    }
    return { traces, layout };
  }
}
