import visualization from './exercises/visualization.js';
import flux from './exercises/flux.js';
import coordinates from './exercises/coordinates.js';
import delta from './exercises/delta-functions.js';
import line from './exercises/line-integrals.js';
import piecewise from './exercises/piecewise.js';
import { sphereSurface } from './geometry.js';

const vectorAxis = [-2, -1, 0, 1, 2];
const vectorPoints = vectorAxis.flatMap((x) =>
  vectorAxis.map((y) => [x, y]));
const contourAxis = Array.from({ length: 21 }, (_, index) => -2 + index * 0.2);
const volumeAxis = Array.from({ length: 13 }, (_, index) => -1.5 + index * 0.25);
const volumePoints = volumeAxis.flatMap((x) =>
  volumeAxis.flatMap((y) => volumeAxis.map((z) => [x, y, z])));
const radialField = visualization.exercises.find((entry) =>
  entry.id === 'identify-radial-field').generate().statement[1];
const cube = flux.exercises[0].generate().statement[1];
const example = (module, id) => module.exercises.find((entry) =>
  entry.id === id).generate().statement.find((block) => block.type === 'widget');

export default [
  {
    title: '2D vector field',
    block: {
      type: 'widget',
      widget: 'vector2d',
      data: {
        x: vectorPoints.map((point) => point[0]),
        y: vectorPoints.map((point) => point[1]),
        u: vectorPoints.map((point) => point[0]),
        v: vectorPoints.map((point) => point[1]),
      },
      caption: 'Radial arrows in the plane',
      description: 'The vectors point away from the origin.',
    },
  },
  {
    title: '2D scalar field',
    block: {
      type: 'widget',
      widget: 'scalar2d',
      data: {
        x: contourAxis,
        y: contourAxis,
        values: contourAxis.map((y) =>
          contourAxis.map((x) => x * x + y * y)),
      },
      caption: 'Contours of x² + y²',
      description: 'Values increase in circles around the origin.',
    },
  },
  { title: '3D vector field', block: radialField },
  {
    title: '3D scalar field',
    block: {
      type: 'widget',
      widget: 'scalar3d',
      data: {
        x: volumePoints.map((point) => point[0]),
        y: volumePoints.map((point) => point[1]),
        z: volumePoints.map((point) => point[2]),
        values: volumePoints.map((point) =>
          point[0] ** 2 + point[1] ** 2 + point[2] ** 2),
        isomin: 0,
        isomax: 6.75,
      },
      caption: 'Volume shading of x² + y² + z²',
      description: 'Color indicates squared distance; translucent layers show values throughout the sampled cube.',
    },
  },
  {
    title: 'Sphere surface',
    block: {
      type: 'widget',
      widget: 'geometry3d',
      data: { mode: 'surface', surfaces: [sphereSurface()] },
      caption: 'Unit sphere surface',
      description: 'The boundary of the unit ball.',
    },
  },
  {
    title: 'Enclosed ball',
    block: {
      type: 'widget',
      widget: 'geometry3d',
      data: { mode: 'volume', surfaces: [sphereSurface()] },
      caption: 'Unit ball as a translucent boundary',
      description: 'The region inside the sphere is the intended volume.',
    },
  },
  { title: 'Labeled cube with field', block: cube },
  { title: 'Delta supports on a number line',
    block: example(delta, 'delta-1d-inside-interval') },
  { title: 'Piecewise profile with a moving bound',
    block: example(piecewise, 'nested-slab-layers') },
  { title: 'Directed path',
    block: example(line, 'rectangular-path-contributing-legs') },
  { title: 'Disk and support point',
    block: example(delta, 'delta-2d-disk-support') },
  { title: 'Growing disk',
    block: example(piecewise, 'uniform-disk-cumulative') },
  { title: 'Cylinder and support points',
    block: example(delta, 'delta-3d-cylinder-support') },
  { title: 'Local basis vectors',
    block: example(coordinates, 'spherical-basis-directions') },
  { title: 'Growing ball and shell',
    block: example(piecewise, 'hollow-shell-cumulative') },
];
