import { boxBoundary, sphereSurface } from '../geometry.js';
import { diagram, ex, m, p, q } from './common.js';

const sphere = { type: 'widget', widget: 'geometry3d',
  data: { mode: 'volume', surfaces: [sphereSurface()] },
  caption: 'Schematic ball', description: 'The volume is inside the spherical boundary.' };
const cube = { type: 'widget', widget: 'geometry3d',
  data: { mode: 'volume', ...boxBoundary(
    { x: [0, 1], y: [0, 1], z: [0, 1] },
    { xMin: 'A', xMax: 'B', yMin: 'C', yMax: 'D', zMin: 'E', zMax: 'F' }) },
  caption: 'Unit cube', description: 'The integration region is [0,1]³.' };
const sphericalMeasure = p('Use spherical coordinates with ',
  m('dV=r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi'), '.');
const region = (shapes, caption, description, labels = []) =>
  diagram('diagram3d', { shapes, labels, hideTicks: true }, caption, description);

export default {
  id: 'volume-integrals',
  title: 'Volume integrals',
  description: 'Integrate simple functions over boxes, balls, and all space.',
  exercises: [
    ex('constant-box-integral', 'A constant over a box', [
      p('A box has side lengths ', m('a,b,h>0'), '. Integrate the constant ', m('c'), '.'),
      region([{ kind: 'box', bounds: { x: [0, 1.2], y: [0, 0.9], z: [0, 1.5] } }],
        'Rectangular box', 'Schematic box with side lengths a, b, h.',
        [{ x: 1.3, y: 0, z: 0, label: 'a' },
          { x: 0, y: 1, z: 0, label: 'b' }, { x: 0, y: 0, z: 1.6, label: 'h' }]),
    ], [q('integral', 'What is ∫V c dV?', [
      ['correct', 'cabh'], ['sum', 'c(a+b+h)'],
      ['half', 'cabh/2'], ['area', 'cab'],
    ], 'correct', 'Multiply the constant by the box volume abh.')]),
    ex('odd-centered-box-integral', 'Odd function over a centered box', [
      p('Integrate ', m('x'), ' over ',
        m('[-a,a]\\times[-b,b]\\times[-h,h]'), ', with positive a, b, h.'),
      region([{ kind: 'box', bounds: { x: [-1, 1], y: [-0.8, 0.8], z: [-1.2, 1.2] } }],
        'Centered box', 'Schematic box symmetric about the origin.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '0'], ['positive', '8a^2bh'],
      ['negative', '-8a^2bh'], ['volume', '8abh'],
    ], 'correct', 'The integrand is odd in x and the x bounds are symmetric.')]),
    ex('linear-positive-box-integral', 'Linear function over a positive box', [
      p('Integrate ', m('x'), ' over ', m('[0,a]\\times[0,b]\\times[0,h]'),
        ', with positive a, b, h.'),
      region([{ kind: 'box', bounds: { x: [0, 1.2], y: [0, 0.9], z: [0, 1.5] } }],
        'Positive-coordinate box', 'Schematic box in the positive coordinate octant.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', 'a^2bh/2'], ['missing-half', 'a^2bh'],
      ['wrong-axis', 'ab^2h/2'], ['volume', 'abh'],
    ], 'correct', 'Integrating x from 0 to a gives a²/2; the other lengths multiply.')]),
    ex('quadratic-unit-cube-integral', 'A quadratic over the unit cube', [
      p('Integrate ', m('x^2+y^2+z^2'), ' over ', m('[0,1]^3'), '.'), cube,
    ], [q('integral', 'What is the integral?', [
      ['correct', '1'], ['one-term', '1/3'], ['two-terms', '2/3'], ['three', '3'],
    ], 'correct', 'Each squared coordinate contributes 1/3.')]),
    ex('constant-ball-integral', 'A constant over a ball', [
      p('Integrate the constant ', m('c'), ' over a ball of radius ', m('R>0'), '.'),
      sphericalMeasure, sphere,
    ], [q('integral', 'What is the integral?', [
      ['correct', '4\\pi cR^3/3'], ['surface', '4\\pi cR^2'],
      ['missing-third', '4\\pi cR^3'], ['circle', '\\pi cR^2'],
    ], 'correct', 'The integral is c times the ball volume 4πR³/3.')]),
    ex('squared-radius-ball-integral', 'Squared radius over a ball', [
      p('Integrate ', m('r^2'), ' over a ball of radius ', m('R>0'), '.'),
      sphericalMeasure, sphere,
    ], [q('integral', 'What is the integral?', [
      ['correct', '4\\pi R^5/5'], ['third', '4\\pi R^5/3'],
      ['fourth', '4\\pi R^4/4'], ['volume', '4\\pi R^3/3'],
    ], 'correct', 'The radial integral is ∫₀ᴿ r⁴ dr = R⁵/5; angles contribute 4π.')]),
    ex('constant-shell-integral', 'A constant over a spherical shell', [
      p('Integrate ', m('c'), ' over the shell ', m('a<r<b'), ', with ', m('0<a<b'), '.'),
      sphericalMeasure,
      region([{ kind: 'shell', inner: 0.55, outer: 1.2 }],
        'Spherical shell', 'Schematic region between concentric spheres.',
        [{ x: 0.55, y: 0, z: 0, label: 'a' }, { x: 1.2, y: 0, z: 0, label: 'b' }]),
    ], [q('integral', 'What is the integral?', [
      ['correct', '4\\pi c(b^3-a^3)/3'],
      ['sum', '4\\pi c(b^3+a^3)/3'],
      ['surface', '4\\pi c(b^2-a^2)'],
      ['missing-third', '4\\pi c(b^3-a^3)'],
    ], 'correct', 'Subtract the inner ball volume from the outer ball volume.')]),
    ex('constant-cylinder-integral', 'A constant over a cylinder', [
      p('Integrate ', m('c'), ' over ', m('0\\le\\rho\\le R'), ', ',
        m('0\\le z\\le h'), ', with full azimuth and ', m('R,h>0'),
        '. Use ', m('dV=\\rho\\,d\\rho\\,d\\phi\\,dz'), '.'),
      region([{ kind: 'cylinder', radius: 1, zRange: [0, 1.5] }],
        'Solid cylinder', 'Schematic radius R and height h.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', 'c\\pi R^2h'], ['missing-half', '2\\pi cR^2h'],
      ['side', '2\\pi cRh'], ['sphere', '4\\pi cR^3/3'],
    ], 'correct', 'The cylinder volume is πR²h.')]),
    ex('separable-all-space-integral', 'A separable integral over all space', [
      p('Evaluate ', m('\\int_{\\mathbb R^3}e^{-|x|-|y|-|z|}\\,dV'),
        '. You may use ', m('\\int_{-\\infty}^{\\infty}e^{-|t|}\\,dt=2'), '.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '8'], ['one-factor', '2'], ['two-factors', '4'], ['zero', '0'],
    ], 'correct', 'The independent x, y, and z integrals each equal 2.')]),
    ex('gaussian-all-space-integral', 'A Gaussian integral over all space', [
      p('Evaluate ', m('\\int_{\\mathbb R^3}e^{-(x^2+y^2+z^2)}\\,dV'),
        '. You may use ', m('\\int_{-\\infty}^{\\infty}e^{-t^2}\\,dt=\\sqrt\\pi'), '.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '\\pi^{3/2}'], ['one-factor', '\\sqrt\\pi'],
      ['two-factors', '\\pi'], ['sphere', '4\\pi/3'],
    ], 'correct', 'The integral factors into three copies of √π.')]),
  ],
};
