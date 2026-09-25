export function sampleSurface(point, uRange, vRange, uSteps = 36, vSteps = 24) {
  const x = [];
  const y = [];
  const z = [];
  for (let row = 0; row < vSteps; row++) {
    const v = vRange[0] + (vRange[1] - vRange[0]) * row / (vSteps - 1);
    const xRow = [];
    const yRow = [];
    const zRow = [];
    for (let column = 0; column < uSteps; column++) {
      const u = uRange[0] + (uRange[1] - uRange[0]) *
        column / (uSteps - 1);
      const position = point(u, v);
      xRow.push(position[0]);
      yRow.push(position[1]);
      zRow.push(position[2]);
    }
    x.push(xRow);
    y.push(yRow);
    z.push(zRow);
  }
  return { x, y, z };
}

export function sampleVectorField(axis, field) {
  const samples = { x: [], y: [], z: [], u: [], v: [], w: [] };
  for (const x of axis) {
    for (const y of axis) {
      for (const z of axis) {
        const [u, v, w] = field(x, y, z);
        if (u === 0 && v === 0 && w === 0) continue;
        samples.x.push(x);
        samples.y.push(y);
        samples.z.push(z);
        samples.u.push(u);
        samples.v.push(v);
        samples.w.push(w);
      }
    }
  }
  return samples;
}

export function sphereSurface(radius = 1, center = [0, 0, 0]) {
  return {
    id: 'sphere',
    ...sampleSurface(
      (longitude, polar) => [
        center[0] + radius * Math.sin(polar) * Math.cos(longitude),
        center[1] + radius * Math.sin(polar) * Math.sin(longitude),
        center[2] + radius * Math.cos(polar),
      ],
      [0, 2 * Math.PI],
      [0, Math.PI],
    ),
  };
}

export function boxBoundary(bounds, faceIds) {
  const [x0, x1] = bounds.x;
  const [y0, y1] = bounds.y;
  const [z0, z1] = bounds.z;
  const [xm, ym, zm] = [(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2];
  const gap = 0.12 * Math.max(x1 - x0, y1 - y0, z1 - z0);
  const patch = (id, point, uRange, vRange) => ({
    id,
    ...sampleSurface(point, uRange, vRange, 2, 2),
  });
  const surfaces = [
    patch(faceIds.xMin, (u, v) => [x0, u, v], bounds.y, bounds.z),
    patch(faceIds.xMax, (u, v) => [x1, u, v], bounds.y, bounds.z),
    patch(faceIds.yMin, (u, v) => [u, y0, v], bounds.x, bounds.z),
    patch(faceIds.yMax, (u, v) => [u, y1, v], bounds.x, bounds.z),
    patch(faceIds.zMin, (u, v) => [u, v, z0], bounds.x, bounds.y),
    patch(faceIds.zMax, (u, v) => [u, v, z1], bounds.x, bounds.y),
  ];
  const labels = [
    { text: faceIds.xMin, x: x0 - gap, y: ym, z: zm },
    { text: faceIds.xMax, x: x1 + gap, y: ym, z: zm },
    { text: faceIds.yMin, x: xm, y: y0 - gap, z: zm },
    { text: faceIds.yMax, x: xm, y: y1 + gap, z: zm },
    { text: faceIds.zMin, x: xm, y: ym, z: z0 - gap },
    { text: faceIds.zMax, x: xm, y: ym, z: z1 + gap },
  ];
  const edges = [];
  for (const y of [y0, y1]) {
    for (const z of [z0, z1]) {
      edges.push({ x: [x0, x1], y: [y, y], z: [z, z] });
    }
  }
  for (const x of [x0, x1]) {
    for (const z of [z0, z1]) {
      edges.push({ x: [x, x], y: [y0, y1], z: [z, z] });
    }
  }
  for (const x of [x0, x1]) {
    for (const y of [y0, y1]) {
      edges.push({ x: [x, x], y: [y, y], z: [z0, z1] });
    }
  }
  return { surfaces, labels, edges };
}
