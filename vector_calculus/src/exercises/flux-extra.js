import { boxBoundary, sampleVectorField, sphereSurface } from '../geometry.js';
import { ex, m, p, q, stub } from './common.js';

const bounds = { x: [-0.5, 0.5], y: [-0.5, 0.5], z: [-0.5, 0.5] };
const labels = { xMin: 'A', xMax: 'B', yMin: 'C', yMax: 'D', zMin: 'E', zMax: 'F' };
const cube = (field, caption) => ({
  type: 'widget', widget: 'geometry3d', caption,
  description: 'A and B are the negative and positive x faces; C and D the y faces; E and F the z faces.',
  data: { mode: 'volume', ...boxBoundary(bounds, labels),
    vectors: sampleVectorField([-0.4, -0.2, 0, 0.2, 0.4], field) },
});
const sphere = (field, caption) => ({
  type: 'widget', widget: 'geometry3d', caption,
  description: 'A schematic sphere centered at the origin with the stated vector field.',
  data: { mode: 'surface', surfaces: [sphereSurface()],
    vectors: sampleVectorField([-1, -0.5, 0, 0.5, 1], field) },
});
const faceOptions = [['A', 'A'], ['B', 'B'], ['C', 'C'],
  ['D', 'D'], ['E', 'E'], ['F', 'F']];

export default [
  ex('cube-face-flux-signs', 'Flux signs on cube faces', [
    p('A centered unit cube has outward-oriented faces A through F. ',
      'Let ', m('\\vec F=\\alpha\\hat e_1'), ', where ', m('\\alpha>0'), '.'),
    cube(() => [1, 0, 0], 'Labeled unit cube'),
  ], [
    q('positive', 'Which face has positive flux?', faceOptions, 'B',
      'B has outward normal in the positive x direction.'),
    q('negative', 'Which face has negative flux?', faceOptions, 'A',
      'A has outward normal in the negative x direction.'),
  ]),
  ex('constant-field-cube-total', 'Total flux of a constant field', [
    p('A centered unit cube is oriented outward. Let ', m('\\vec F=\\hat e_1'), '.'),
    cube(() => [1, 0, 0], 'Labeled unit cube'),
  ], [q('flux', 'What is the total outward flux?', [
    ['correct', '0'], ['positive', '1'], ['negative', '-1'], ['double', '2'],
  ], 'correct', 'The +x and −x faces contribute +1 and −1; all other faces contribute zero.')]),
  ex('linear-field-cube-flux', 'Flux of a linear field through a cube', [
    p('A centered unit cube is oriented outward. Let ', m('\\vec F=x\\hat e_1'), '.'),
    cube((x) => [x, 0, 0], 'Labeled unit cube'),
  ], [
    q('face', 'What is the flux through each x face?', [
      ['correct', '1/2'], ['negative', '-1/2'], ['one', '1'], ['zero', '0'],
    ], 'correct', 'On both x faces, the field and outward normal point the same way.'),
    q('total', 'What is the total outward flux?', [
      ['correct', '1'], ['zero', '0'], ['half', '1/2'], ['two', '2'],
    ], 'correct', 'The two x-face contributions add to one.'),
  ]),
  ex('constant-field-sphere-flux', 'Constant field through a sphere', [
    p('Let S be a sphere centered at the origin, oriented outward. Let ',
      m('\\vec F=\\hat e_3'), '.'),
    sphere(() => [0, 0, 1], 'Sphere and constant field'),
  ], [q('flux', 'What is the total outward flux?', [
    ['correct', '0'], ['area', '4\\pi'], ['volume', '4\\pi/3'], ['negative', '-4\\pi'],
  ], 'correct', 'Opposite points on the sphere have opposite normal components.')]),
  ex('inward-field-sphere-flux', 'Inward field through a sphere', [
    p('Let S be a sphere of radius ', m('R>0'), ' centered at the origin, ',
      'oriented outward. Let ', m('\\vec F=-\\vec x'), '.'),
    sphere((x, y, z) => [-x, -y, -z], 'Sphere and inward field'),
  ], [q('flux', 'What is the total outward flux?', [
    ['correct', '-4\\pi R^3'], ['positive', '4\\pi R^3'],
    ['area', '-4\\pi R^2'], ['volume', '-4\\pi R^3/3'],
  ], 'correct', 'On the sphere, F·n = −R and its area is 4πR².')]),
  ex('axial-field-cylinder-parts', 'Flux through cylinder parts', [
    p('A closed vertical cylinder is oriented outward. Let ', m('\\vec F=\\hat e_3'),
      '. A is the bottom cap, B the top cap, and C the curved side.'),
    stub('region-3d', 'closed vertical cylinder; A bottom cap, B top cap, C side; field +z',
      'Labeled cylinder', 'The cylinder is oriented outward.', ['A', 'B', 'C']),
  ], [
    q('nonzero', 'Which parts have nonzero flux? Select all.',
      [['A', 'A'], ['B', 'B'], ['C', 'C']], ['A', 'B'],
      'The field is perpendicular to the caps and tangent to the curved side.', 'multiple'),
    q('positive', 'Which part has positive flux?',
      [['A', 'A'], ['B', 'B'], ['C', 'C']], 'B',
      'The outward normal of the top cap points toward +z.'),
  ]),
  ex('radial-field-cylinder-flux', 'Radial field through a cylinder', [
    p('A closed cylinder has radius ', m('R>0'), ' and height ', m('h>0'),
      ', oriented outward. Let ', m('\\vec F=(x,y,0)'), '.'),
    stub('region-3d', 'cylinder rho=R, 0<=z<=h; F=(x,y,0); side and caps marked',
      'Cylinder in a radial field', 'The side and two caps form a closed surface.'),
  ], [
    q('parts', 'Which part has nonzero flux?', [
      ['side', '\\text{curved side}'], ['top', '\\text{top cap}'],
      ['bottom', '\\text{bottom cap}'], ['all', '\\text{all three}'],
    ], 'side', 'The field is tangent to both caps.'),
    q('total', 'What is the total outward flux?', [
      ['correct', '2\\pi R^2h'], ['half', '\\pi R^2h'],
      ['area', '2\\pi Rh'], ['zero', '0'],
    ], 'correct', 'F·n = R on the side, whose area is 2πRh.'),
  ]),
  ex('oriented-disk-flux', 'Flux through an oriented disk', [
    p('A planar disk of radius ', m('R>0'), ' has normal ', m('+\\hat e_3'),
      '. Let ', m('\\vec F=c\\hat e_3'), ', with ', m('c>0'), '.'),
    stub('region-3d', 'disk z=0, radius R, normal +z; constant field c e3',
      'Oriented planar disk', 'The disk has a closed circular boundary.'),
  ], [q('flux', 'What is the flux through the disk?', [
    ['correct', 'c\\pi R^2'], ['negative', '-c\\pi R^2'],
    ['circumference', '2\\pi cR'], ['zero', '0'],
  ], 'correct', 'The normal component is c over an area πR².')]),
  ex('tilted-rectangle-flux', 'Flux through a tilted rectangle', [
    p('Let ', m('\\vec r(u,v)=(u,v,u)'), ', with ', m('0\\le u,v\\le1'),
      ', and orient the patch by ', m('\\partial_u\\vec r\\times\\partial_v\\vec r'),
      '. Let ', m('\\vec F=\\hat e_3'), '.'),
    stub('region-3d', 'tilted patch r(u,v)=(u,v,u), unit parameter square; oriented by ru cross rv',
      'Tilted planar rectangle', 'The surface normal follows the stated parametrization.'),
  ], [
    q('normal', 'What is the oriented area vector per du dv?', [
      ['correct', '(-1,0,1)'], ['negative', '(1,0,-1)'],
      ['vertical', '(0,0,1)'], ['side', '(1,0,1)'],
    ], 'correct', 'The cross product (1,0,1) × (0,1,0) is (−1,0,1).'),
    q('flux', 'What is the flux?', [
      ['correct', '1'], ['negative', '-1'], ['root', '\\sqrt2'], ['zero', '0'],
    ], 'correct', 'The dot product with e₃ is 1 over the unit parameter square.'),
  ]),
  ex('divergence-theorem-check', 'A divergence theorem check', [
    p('Let ', m('\\vec F=\\vec x'), ' on the centered unit cube, oriented outward.'),
    cube((x, y, z) => [x, y, z], 'Unit cube and radial field'),
  ], [
    q('divergence', 'What is ∇·F?', [
      ['correct', '3'], ['two', '2'], ['one', '1'], ['zero', '0'],
    ], 'correct', 'Each Cartesian component contributes one.'),
    q('integrals', 'What is the common value of the outward flux and volume integral of divergence?', [
      ['correct', '3'], ['one', '1'], ['zero', '0'], ['six', '6'],
    ], 'correct', 'The divergence is 3 throughout a unit volume.'),
  ]),
];
