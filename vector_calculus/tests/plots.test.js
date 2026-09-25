import test from 'node:test';
import assert from 'node:assert/strict';
import { boxBoundary, cylinderBoundary, diskSurface, ellipsoidSurface,
  sampleSurface, sampleVectorField, sphereSurface } from '../src/geometry.js';
import { plotFigure } from '../src/plot-data.js';
import previews from '../src/plot-preview.js';
import flux from '../src/exercises/flux.js';
import modules from '../src/exercises/index.js';

const scene = (moduleId, exerciseId) => modules.find((module) =>
  module.id === moduleId).exercises.find((entry) => entry.id === exerciseId)
  .generate().statement.find((block) => block.type === 'widget');

test('parametric sampling creates coordinate grids', () => {
  const surface = sampleSurface((u, v) => [u, v, u + v],
    [0, 1], [0, 1], 2, 2);
  assert.deepEqual(surface, {
    x: [[0, 1], [0, 1]],
    y: [[0, 0], [1, 1]],
    z: [[0, 1], [1, 2]],
  });
});

test('sphere samples lie on the requested surface', () => {
  const surface = sphereSurface(2, [1, -1, 0]);
  for (let row = 0; row < surface.x.length; row++) {
    for (let column = 0; column < surface.x[row].length; column++) {
      const distance = Math.hypot(
        surface.x[row][column] - 1,
        surface.y[row][column] + 1,
        surface.z[row][column],
      );
      assert.ok(Math.abs(distance - 2) < 1e-10);
    }
  }
});

test('disk, cylinder, and ellipsoid samples match their boundaries', () => {
  const disk = diskSurface(2, 1);
  assert.ok(disk.z.flat().every((z) => z === 1));
  assert.ok(disk.x.flat().every((x, i) =>
    Math.hypot(x, disk.y.flat()[i]) <= 2 + 1e-10));
  const cylinder = cylinderBoundary(1, [0, 2]);
  assert.equal(cylinder.length, 3);
  assert.ok(cylinder[0].x.flat().every((x, i) =>
    Math.abs(Math.hypot(x, cylinder[0].y.flat()[i]) - 1) < 1e-10));
  const ellipsoid = ellipsoidSurface([2, 1, 1]);
  assert.ok(ellipsoid.x.flat().every((x, i) => {
    const y = ellipsoid.y.flat()[i];
    const z = ellipsoid.z.flat()[i];
    return Math.abs(x * x / 4 + y * y + z * z - 1) < 1e-10;
  }));
});

test('vector field sampling omits zero vectors', () => {
  const samples = sampleVectorField([-1, 0, 1],
    (x, y, z) => [x, y, z]);
  assert.equal(samples.x.length, 26);
  assert.deepEqual(samples.u, samples.x);
  assert.deepEqual(samples.v, samples.y);
  assert.deepEqual(samples.w, samples.z);
});

test('box boundary has six labeled faces and twelve edges', () => {
  const geometry = boxBoundary(
    { x: [-0.5, 0.5], y: [-0.5, 0.5], z: [-0.5, 0.5] },
    { xMin: 'A', xMax: 'B', yMin: 'C', yMax: 'D', zMin: 'E', zMax: 'F' },
  );
  assert.deepEqual(geometry.surfaces.map((surface) => surface.id),
    ['A', 'B', 'C', 'D', 'E', 'F']);
  assert.equal(geometry.edges.length, 12);
  assert.ok(geometry.labels[0].x < -0.5);
  assert.ok(geometry.labels[1].x > 0.5);
});

test('each preview maps to a Plotly figure with the expected trace type', () => {
  const expected = ['quiver', 'contour', 'scatter3d', 'volume',
    'surface', 'surface', 'surface'];
  previews.slice(0, expected.length).forEach(({ block }, index) => {
    const figure = plotFigure(block.widget, block.data);
    assert.equal(figure.traces[0].type, expected[index]);
    assert.ok(figure.traces.length > 0);
  });
  assert.ok(plotFigure('geometry3d', previews[5].block.data)
    .traces[0].opacity <
    plotFigure('geometry3d', previews[4].block.data).traces[0].opacity);
});

test('all diagram previews produce their intended traces', () => {
  const expected = ['scatter', 'scatter', 'quiver', 'scatter', 'scatter',
    'surface', 'scatter3d', 'surface'];
  previews.slice(7).forEach(({ block }, index) => {
    const figure = plotFigure(block.widget, block.data);
    assert.ok(figure.traces.some((trace) => trace.type === expected[index]));
  });
});

test('numeric support diagrams show exact geometry and marked points', () => {
  const disk = scene('delta-functions', 'delta-2d-disk-support');
  const diskFigure = plotFigure(disk.widget, disk.data);
  assert.deepEqual(disk.data.points[0], { x: 1, y: 0, label: '(1, 0)' });
  assert.ok(Math.abs(Math.max(...diskFigure.traces[0].x) - 2) < 1e-10);
  const cylinder = scene('delta-functions', 'delta-3d-cylinder-support');
  const cylinderFigure = plotFigure(cylinder.widget, cylinder.data);
  assert.deepEqual(cylinderFigure.traces.at(-1).text, ['P', 'Q', 'R']);
  assert.deepEqual(cylinderFigure.traces.at(-1).x, [0, 2, 0]);
  assert.deepEqual(cylinderFigure.traces.at(-1).z, [1, 1, 3]);
});

test('moving bounds change only the schematic geometry', () => {
  const slab = scene('piecewise', 'nested-slab-layers');
  const near = plotFigure(slab.widget, slab.data, 0.4);
  const far = plotFigure(slab.widget, slab.data, 1.5);
  assert.deepEqual(near.layout.shapes.slice(-2).map((shape) => shape.x0),
    [-0.4, 0.4]);
  assert.deepEqual(far.layout.shapes.slice(-2).map((shape) => shape.x0),
    [-1.5, 1.5]);
  assert.ok(far.traces.length > near.traces.length);
  const disk = scene('piecewise', 'uniform-disk-cumulative');
  const smallFigure = plotFigure(disk.widget, disk.data, 0.5);
  const largeFigure = plotFigure(disk.widget, disk.data, 1.4);
  const small = smallFigure.traces.find((trace) => trace.line?.color === '#b85e22');
  const large = largeFigure.traces.find((trace) => trace.line?.color === '#b85e22');
  assert.ok(Math.max(...large.x) > Math.max(...small.x));
  assert.ok(smallFigure.traces.some((trace) =>
    trace.fillcolor === 'rgba(34,100,53,0.25)'));
  const ball = scene('piecewise', 'uniform-ball-cumulative');
  const smallBall = plotFigure(ball.widget, ball.data, 0.5);
  const largeBall = plotFigure(ball.widget, ball.data, 1.4);
  const boundary = (figure) => figure.traces.find((trace) =>
    trace.line?.color === '#b85e22');
  assert.ok(Math.max(...boundary(largeBall).x) >
    Math.max(...boundary(smallBall).x));
  assert.ok(smallBall.traces.some((trace) =>
    trace.colorscale?.[0]?.[1] === '#226435'));
});

test('2D plots label both axes and contours fill the initial view', () => {
  for (const { block } of previews.slice(0, 2)) {
    const figure = plotFigure(block.widget, block.data);
    assert.equal(figure.layout.xaxis.title.text, 'x');
    assert.equal(figure.layout.yaxis.title.text, 'y');
    assert.equal(figure.layout.dragmode, 'pan');
    assert.ok(figure.layout.margin.l >= 60);
    assert.ok(figure.layout.margin.b >= 60);
  }
  const contour = previews[1].block;
  const layout = plotFigure(contour.widget, contour.data).layout;
  assert.ok(Math.min(...contour.data.x) < layout.xaxis.range[0]);
  assert.ok(Math.max(...contour.data.x) > layout.xaxis.range[1]);
  assert.ok(Math.min(...contour.data.y) < layout.yaxis.range[0]);
  assert.ok(Math.max(...contour.data.y) > layout.yaxis.range[1]);
  assert.equal(layout.xaxis.constrain, 'domain');
  assert.equal(layout.yaxis.constrain, 'domain');
});

test('all 3D vector fields use shafts and cone heads with the same style', () => {
  const radial = previews[2].block.data;
  const cube = previews[6].block.data.vectors;
  const sphere = flux.exercises.find((entry) => entry.id === 'sphere-flux')
    .generate().statement[1].data.vectors;
  assert.equal(radial.x.length, 124);
  assert.equal(cube.x.length, 125);
  assert.equal(sphere.x.length, 124);
  assert.deepEqual(sphere, radial);
  assert.ok(cube.u.every((value) => value === 1));
  assert.ok(cube.v.every((value) => value === 0));
  assert.ok(cube.w.every((value) => value === 0));

  for (const [widget, data] of [
    ['vector3d', radial],
    ['geometry3d', previews[6].block.data],
    ['geometry3d', { mode: 'surface', surfaces: [sphereSurface()], vectors: sphere }],
  ]) {
    const field = widget === 'vector3d' ? data : data.vectors;
    const traces = plotFigure(widget, data).traces;
    const shaft = traces.find((trace) => trace.connectgaps === false);
    const head = traces.find((trace) => trace.type === 'cone');
    assert.equal(shaft.mode, 'lines');
    assert.deepEqual(shaft.line, { color: '#226435', width: 3 });
    assert.equal(shaft.opacity, 0.55);
    assert.equal(head.sizeref, 0.22);
    assert.equal(head.opacity, 0.55);
    assert.deepEqual(head.colorscale,
      [[0, '#226435'], [1, '#226435']]);
    assert.equal(head.x.length, field.x.length);
    assert.deepEqual(head.customdata[0],
      [field.x[0], field.y[0], field.z[0]]);
    assert.deepEqual([shaft.x[0], shaft.y[0], shaft.z[0]],
      head.customdata[0]);
    assert.deepEqual([shaft.x[1], shaft.y[1], shaft.z[1]],
      [head.x[0], head.y[0], head.z[0]]);
    assert.deepEqual([shaft.x[2], shaft.y[2], shaft.z[2]],
      [null, null, null]);
  }
  const radialShaft = plotFigure('vector3d', radial).traces[0];
  const cubeShaft = plotFigure('geometry3d', previews[6].block.data)
    .traces.find((trace) => trace.connectgaps === false);
  const longest = (shaft) => Math.max(...shaft.x.filter((_, index) => index % 3 === 0)
    .map((_, index) => Math.hypot(
      shaft.x[index * 3 + 1] - shaft.x[index * 3],
      shaft.y[index * 3 + 1] - shaft.y[index * 3],
      shaft.z[index * 3 + 1] - shaft.z[index * 3],
    )));
  assert.ok(Math.abs(longest(radialShaft) - 0.25) < 1e-10);
  assert.ok(Math.abs(longest(cubeShaft) - 0.1) < 1e-10);
});

test('cube and sphere share a surface material with mode-specific opacity', () => {
  const cube = plotFigure('geometry3d', previews[6].block.data);
  const sphere = plotFigure('geometry3d',
    flux.exercises.find((entry) => entry.id === 'sphere-flux')
      .generate().statement[1].data);
  assert.deepEqual(cube.traces[0].colorscale, sphere.traces[0].colorscale);
  assert.equal(cube.traces[0].opacity, 0.28);
  assert.equal(sphere.traces[0].opacity, 0.72);
  assert.deepEqual(cube.traces.slice(0, 6).map((trace) => trace.colorscale),
    Array(6).fill(cube.traces[0].colorscale));
  assert.equal(cube.traces.at(-1).mode, 'markers+text');
  assert.deepEqual(cube.traces.at(-1).text, ['A', 'B', 'C', 'D', 'E', 'F']);
});

test('scalar preview shades its full sampled value range', () => {
  const data = previews[3].block.data;
  const trace = plotFigure('scalar3d', data).traces[0];
  assert.equal(Math.min(...data.values), data.isomin);
  assert.equal(Math.max(...data.values), data.isomax);
  assert.equal(trace.type, 'volume');
  assert.equal(trace.surface.count, 15);
  assert.equal(trace.opacity, 0.1);
  assert.deepEqual(trace.opacityscale, [[0, 0.8], [1, 0.2]]);
  assert.equal(trace.showscale, true);
  assert.equal(trace.colorbar.title.text, 'f(x)');
  assert.deepEqual(trace.caps, {
    x: { show: false }, y: { show: false }, z: { show: false },
  });
});

test('sphere exercise asks for the outward normal and flux', () => {
  const instance = flux.exercises.find((entry) => entry.id === 'sphere-flux')
    .generate();
  assert.deepEqual(instance.questions.map((question) =>
    question.correctOptionIds), [['positive-x'], ['four-pi']]);
  assert.equal(instance.statement[1].widget, 'geometry3d');
});
