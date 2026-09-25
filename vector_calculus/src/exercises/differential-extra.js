import { ex, m, p, q, scalar2d, stub, vector2d } from './common.js';

const signs = [['positive', '\\text{positive}'], ['negative', '\\text{negative}'],
  ['zero', '0']];

export default [
  ex('gradient-linear-scalar', 'Gradient of a linear scalar field', [
    p('In three dimensions, let ', m('f(x,y,z)=ax+by+cz'), '.'),
  ], [q('gradient', 'What is the gradient?', [
    ['correct', '(a,b,c)'], ['position', '(ax,by,cz)'],
    ['sum', '(a+b+c,a+b+c,a+b+c)'], ['zero', '(0,0,0)'],
  ], 'correct', 'Differentiate with respect to x, y, and z in turn.')]),
  ex('gradient-xy-z2', 'Gradient of xy + z²', [
    p('Let ', m('f(x,y,z)=xy+z^2'), '.'),
  ], [q('gradient', 'What is the gradient?', [
    ['correct', '(y,x,2z)'], ['unswapped', '(x,y,2z)'],
    ['missing-two', '(y,x,z)'], ['scalar', 'xy+2z'],
  ], 'correct', 'The x derivative is y, the y derivative is x, and the z derivative is 2z.')]),
  ex('gradient-distance', 'Gradient of distance', [
    p('For ', m('\\vec x\\ne0'), ', let ', m('f(\\vec x)=|\\vec x|'), '.'),
  ], [q('gradient', 'What is the gradient?', [
    ['correct', '\\vec x/|\\vec x|'], ['position', '\\vec x'],
    ['double', '2\\vec x'], ['inverse', '-\\vec x/|\\vec x|^3'],
  ], 'correct', 'Differentiate the square root of x² + y² + z².')]),
  ex('gradient-gaussian', 'Gradient of a radial exponential', [
    p('Let ', m('f(\\vec x)=e^{-|\\vec x|^2}'), '.'),
  ], [q('gradient', 'What is the gradient?', [
    ['correct', '-2\\vec x e^{-|\\vec x|^2}'],
    ['sign', '2\\vec x e^{-|\\vec x|^2}'],
    ['factor', '-\\vec x e^{-|\\vec x|^2}'],
    ['exponent', '-2\\vec x e^{-|\\vec x|}'],
  ], 'correct', 'Apply the chain rule to the exponent −|x|².')]),
  ex('gradient-from-contours', 'Gradient direction from contours', [
    p('Contours of a scalar field have increasing values outward. The point P is (1, 0).'),
    stub('marked-contour', 'f(x,y)=x^2+y^2; mark P=(1,0); label increasing contours',
      'Contours with a marked point', 'The gradient direction is requested at P.'),
  ], [q('direction', 'Which way does the gradient point at P?', [
    ['right', '+\\hat e_1'], ['left', '-\\hat e_1'],
    ['up', '+\\hat e_2'], ['down', '-\\hat e_2'],
  ], 'right', 'The gradient is normal to a contour and points toward larger values.')]),
  ex('contours-to-gradient-plot', 'Match a field to its gradient', [
    p('The first plot shows a scalar field. Which labeled vector plot shows its gradient?'),
    scalar2d((x, y) => x * x + y * y, 'Scalar field', 'Contours on the xy plane.'),
    vector2d((x, y) => [2 * x, 2 * y], 'Plot A', 'Vector field A.'),
    vector2d((x, y) => [-2 * x, -2 * y], 'Plot B', 'Vector field B.'),
    vector2d((x, y) => [-y, x], 'Plot C', 'Vector field C.'),
    vector2d(() => [1, 0], 'Plot D', 'Vector field D.'),
  ], [q('plot', 'Choose a plot.', [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']],
    'A', 'The scalar contours form an outward-growing bowl, whose gradient points outward.')]),
  ex('divergence-constant-field', 'Divergence of a constant field', [
    p('Let ', m('\\vec F=(2,-1,3)'), ' everywhere in three dimensions.'),
  ], [q('divergence', 'What is the divergence?', [
    ['zero', '0'], ['sum', '4'], ['one', '1'], ['three', '3'],
  ], 'zero', 'Every component has zero derivative.')]),
  ex('divergence-shear-field', 'Divergence of a shear field', [
    p('Let ', m('\\vec F=(y,0,0)'), ' in three dimensions.'),
  ], [q('divergence', 'What is the divergence?', [
    ['zero', '0'], ['one', '1'], ['y', 'y'], ['x', 'x'],
  ], 'zero', 'The x component changes with y, but divergence differentiates it with respect to x.')]),
  ex('divergence-sign-from-plots', 'Divergence signs from plots', [
    p('For each 2D field plot, decide the sign of its divergence.'),
    vector2d((x, y) => [x, y], 'Plot A', 'Vector field A.'),
    vector2d((x, y) => [-x, -y], 'Plot B', 'Vector field B.'),
    vector2d((x, y) => [-y, x], 'Plot C', 'Vector field C.'),
  ], [
    q('A', 'What is the divergence sign in plot A?', signs, 'positive', 'Outward radial flow has positive divergence.'),
    q('B', 'What is the divergence sign in plot B?', signs, 'negative', 'Inward radial flow has negative divergence.'),
    q('C', 'What is the divergence sign in plot C?', signs, 'zero', 'Pure planar rotation has zero divergence.'),
  ]),
  ex('curl-planar-rotation', 'Curl of a rotating field', [
    p('Let ', m('\\vec F=(-y,x,0)'), '.'),
  ], [q('curl', 'What is the curl?', [
    ['correct', '2\\hat e_3'], ['sign', '-2\\hat e_3'],
    ['one', '\\hat e_3'], ['zero', '0'],
  ], 'correct', 'The z component is ∂ₓFᵧ − ∂ᵧFₓ = 1 − (−1) = 2.')]),
  ex('curl-mixed-linear', 'Curl of a mixed linear field', [
    p('Let ', m('\\vec F=(ay,bz,cx)'), '.'),
  ], [q('curl', 'What is the curl?', [
    ['correct', '(-b,-c,-a)'], ['positive', '(b,c,a)'],
    ['unrotated', '(-a,-b,-c)'], ['zero', '(0,0,0)'],
  ], 'correct', 'Each nonzero derivative enters with a negative sign in the corresponding curl component.')]),
  ex('curl-direction-from-plot', 'Curl direction from rotation', [
    p('View this field from the positive z direction.'),
    vector2d((x, y) => [-y, x], 'Rotating field', 'Arrows on the xy plane.'),
  ], [q('direction', 'Which direction does the curl point?', [
    ['positive', '+\\hat e_3'], ['negative', '-\\hat e_3'],
    ['right', '+\\hat e_1'], ['zero', '0'],
  ], 'positive', 'Counterclockwise planar rotation has curl in the positive z direction.')]),
];
