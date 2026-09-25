import test from 'node:test';
import assert from 'node:assert/strict';
import { boxBoundary, sampleSurface, sampleVectorField,
  sphereSurface } from '../src/geometry.js';
import { plotFigure } from '../src/plot-data.js';
import previews from '../src/plot-preview.js';
import flux from '../src/exercises/flux.js';

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
  previews.forEach(({ block }, index) => {
    const figure = plotFigure(block.widget, block.data);
    assert.equal(figure.traces[0].type, expected[index]);
    assert.ok(figure.traces.length > 0);
  });
  assert.ok(plotFigure('geometry3d', previews[5].block.data)
    .traces[0].opacity <
    plotFigure('geometry3d', previews[4].block.data).traces[0].opacity);
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
