import { diagram, ex, m, p, q } from './common.js';

const delta2 = p('In two dimensions, ',
  m('\\delta^{(2)}(\\vec x-\\vec a)=\\delta(x-a_x)\\delta(y-a_y)'), '.');
const delta3 = p('In three dimensions, ',
  m('\\delta^{(3)}(\\vec x-\\vec a)=\\delta(x-a_x)\\delta(y-a_y)\\delta(z-a_z)'), '.');
const supportChoices = [['one', '1'], ['zero', '0'], ['two', '2'], ['negative', '-1']];
const numberLine = (interval, supports, xRange, caption) =>
  diagram('diagram1d', { kind: 'support', interval, supports, xRange,
    axisLabels: { x: 'x' } }, caption, 'The orange points mark delta supports.');
const region2d = (shape, points, xRange, yRange, caption) =>
  diagram('diagram2d', { shapes: [shape], points, xRange, yRange }, caption,
    'The orange points mark delta supports.');
const region3d = (shape, points, ranges, caption) =>
  diagram('diagram3d', { shapes: [shape], points, ranges }, caption,
    'The orange points mark delta supports.');

export default {
  id: 'delta-functions',
  title: 'Delta functions',
  description: 'Use sifting and decide whether support lies inside a region.',
  exercises: [
    ex('delta-1d-sifting', 'Sifting on the real line', [
      p('Evaluate ', m('\\int_{-\\infty}^{\\infty}(x^2+1)\\delta(x-2)\\,dx'), '.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '5'], ['missing-one', '4'], ['point', '2'], ['zero', '0'],
    ], 'correct', 'The delta evaluates x²+1 at x = 2.')]),
    ex('delta-1d-inside-interval', 'Sifting on a bounded interval', [
      p('Evaluate ', m('\\int_0^3 x^2\\delta(x-2)\\,dx'), '.'),
      numberLine([0, 3], [{ x: 2, label: 'δ' }], [-0.5, 3.6], 'Interval and support point'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '4'], ['point', '2'], ['bound', '9'], ['zero', '0'],
    ], 'correct', 'The support is inside the interval, so evaluate x² at 2.')]),
    ex('delta-1d-outside-interval', 'A shifted delta on an interval', [
      p('Evaluate ', m('\\int_0^3 x^2\\delta(x-4)\\,dx'), '.'),
      numberLine([0, 3], [{ x: 4, label: 'δ' }], [-0.5, 4.5], 'Interval and support point'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '0'], ['support', '16'], ['endpoint', '9'], ['point', '4'],
    ], 'correct', 'The delta has no support in the integration interval.')]),
    ex('scaled-delta-1d', 'Sifting a scaled delta', [
      p('Evaluate ', m('\\int_{-\\infty}^{\\infty}(x^2+1)\\delta(2x-2)\\,dx'), '.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '1'], ['missing-scale', '2'], ['wrong-root', '5/2'], ['zero', '0'],
    ], 'correct', 'The root is x = 1, and δ(2x−2) contributes a factor 1/2.')]),
    ex('two-shifted-deltas', 'Two delta supports', [
      p('Evaluate ', m('\\int_{-\\infty}^{\\infty}x^2[\\delta(x+1)+\\delta(x-2)]\\,dx'), '.'),
      numberLine(null, [{ x: -1, label: 'δ' }, { x: 2, label: 'δ' }],
        [-2, 3], 'Two support points'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '5'], ['first', '1'], ['second', '4'], ['difference', '3'],
    ], 'correct', 'The two contributions are (−1)² and 2².')]),
    ex('delta-2d-sifting', 'Sifting in a plane', [
      delta2, p('Evaluate ',
        m('\\int_{\\mathbb R^2}(x+2y)\\delta(x-1)\\delta(y-2)\\,dA'), '.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '5'], ['sum', '3'], ['product', '2'], ['zero', '0'],
    ], 'correct', 'Evaluate x + 2y at (1, 2).')]),
    ex('delta-2d-disk-support', 'Delta and a disk', [
      delta2, p('Integrate ', m('\\delta(x-1)\\delta(y)'),
        ' over the disk ', m('x^2+y^2<4'), '.'),
      region2d({ kind: 'disk', radius: 2, center: [0, 0] },
        [{ x: 1, y: 0, label: '(1, 0)' }], [-2.5, 2.5], [-2.5, 2.5],
        'Disk and support point'),
    ], [q('integral', 'What is the integral?', supportChoices, 'one',
      'The support (1, 0) is inside the radius-2 disk.')]),
    ex('delta-2d-rectangle-support', 'Delta and a rectangle', [
      delta2, p('Integrate ', m('\\delta(x-2)\\delta(y-1/2)'),
        ' over ', m('[0,1]\\times[0,1]'), '.'),
      region2d({ kind: 'rectangle', bounds: [0, 1, 0, 1] },
        [{ x: 2, y: 0.5, label: '(2, 1/2)' }], [-0.3, 2.5], [-0.4, 1.4],
        'Rectangle and support point'),
    ], [q('integral', 'What is the integral?', supportChoices, 'zero',
      'The x coordinate of the support lies outside [0, 1].')]),
    ex('delta-3d-sifting', 'Sifting in space', [
      delta3, p('Evaluate ', m('\\int_{\\mathbb R^3}(x^2+y^2+z^2)\\delta^{(3)}(\\vec x-(1,2,0))\\,dV'), '.'),
    ], [q('integral', 'What is the integral?', [
      ['correct', '5'], ['sum', '3'], ['square-sum', '9'], ['zero', '0'],
    ], 'correct', 'Evaluate x² + y² + z² at (1, 2, 0).')]),
    ex('delta-3d-ball-support', 'Delta and a ball', [
      delta3, p('Integrate ', m('\\delta^{(3)}(\\vec x-(1,0,0))'),
        ' over the ball ', m('|\\vec x|<2'), '.'),
      region3d({ kind: 'sphere', radius: 2 }, [{ x: 1, y: 0, z: 0, label: 'P' }],
        { x: [-2.3, 2.3], y: [-2.3, 2.3], z: [-2.3, 2.3] }, 'Ball and support point'),
    ], [q('integral', 'What is the integral?', supportChoices, 'one',
      'The support is at distance 1 from the origin, inside radius 2.')]),
    ex('delta-3d-ellipsoid-support', 'Delta and an ellipsoid', [
      delta3, p('Integrate ', m('\\delta^{(3)}(\\vec x-(1,1/2,0))'),
        ' over ', m('x^2/4+y^2+z^2<1'), '.'),
      region3d({ kind: 'ellipsoid', radii: [2, 1, 1] },
        [{ x: 1, y: 0.5, z: 0, label: 'P' }],
        { x: [-2.3, 2.3], y: [-1.3, 1.3], z: [-1.3, 1.3] },
        'Ellipsoid and support point'),
    ], [q('integral', 'What is the integral?', supportChoices, 'one',
      'At the support, x²/4 + y² + z² = 1/2 < 1.')]),
    ex('delta-3d-cylinder-support', 'Delta supports and a finite cylinder', [
      delta3, p('Let ', m('V=\\{x^2+y^2<1,\\ 0<z<2\\}'),
        '. Integrate a 3D delta over V at each listed support point.'),
      region3d({ kind: 'cylinder', radius: 1, zRange: [0, 2] },
        [{ x: 0, y: 0, z: 1, label: 'P' },
          { x: 2, y: 0, z: 1, label: 'Q' },
          { x: 0, y: 0, z: 3, label: 'R' }],
        { x: [-1.4, 2.5], y: [-1.4, 1.4], z: [-0.3, 3.5] },
        'Cylinder and three support points'),
    ], [
      q('inside', 'What is the integral for support P = (0, 0, 1)?', supportChoices,
        'one', 'P satisfies both the radial and height bounds.'),
      q('outside-side', 'What is the integral for support Q = (2, 0, 1)?', supportChoices,
        'zero', 'Q lies outside the curved side.'),
      q('outside-cap', 'What is the integral for support R = (0, 0, 3)?', supportChoices,
        'zero', 'R lies above the top cap.'),
    ]),
  ],
};
