import { ex, m, p, q, stub, vector2d } from './common.js';

const path = (spec, caption, labels) => stub('path-2d', spec, caption,
  'The path is oriented as stated in the problem.', labels);
const faceChoices = [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']];

export default {
  id: 'line-integrals',
  title: 'Line integrals',
  description: 'Integrate scalar and vector fields along oriented paths.',
  exercises: [
    ex('constant-scalar-on-segment', 'A constant along a segment', [
      p('A straight segment has length ', m('a>0'), '. Let ', m('f=c'), ' along it.'),
      path('segment of length a', 'Line segment'),
    ], [q('integral', 'What is ∫C f ds?', [
      ['correct', 'ca'], ['half', 'ca/2'], ['square', 'ca^2'], ['zero', '0'],
    ], 'correct', 'A constant times the arc length equals c a.')]),
    ex('linear-scalar-on-segment', 'A linear scalar along a segment', [
      p('Along ', m('C:(x,0),\\ 0\\le x\\le a'), ', with ', m('a>0'),
        ', let ', m('f(x,y)=x'), '.'),
      path('horizontal segment from (0,0) to (a,0)', 'Horizontal segment'),
    ], [q('integral', 'What is ∫C f ds?', [
      ['correct', 'a^2/2'], ['linear', 'a'], ['square', 'a^2'], ['zero', '0'],
    ], 'correct', 'Here ds = dx, so integrate x from 0 to a.')]),
    ex('constant-vector-parallel-segment', 'Field parallel to a segment', [
      p('Let ', m('\\vec F=c\\hat e_1'), '. Traverse the segment from ',
        m('(0,0)'), ' to ', m('(a,0)'), ', where ', m('a>0'), '.'),
      path('segment from (0,0) to (a,0); field arrows point +x', 'Directed segment'),
    ], [q('integral', 'What is ∫C F·dℓ?', [
      ['correct', 'ca'], ['negative', '-ca'], ['half', 'ca/2'], ['zero', '0'],
    ], 'correct', 'The field and path tangent are parallel throughout.')]),
    ex('constant-vector-perpendicular-segment', 'Field perpendicular to a segment', [
      p('Let ', m('\\vec F=c\\hat e_1'), '. Traverse the vertical segment from ',
        m('(0,0)'), ' to ', m('(0,a)'), '.'),
      path('vertical segment from (0,0) to (0,a); field arrows point +x', 'Directed segment'),
    ], [q('integral', 'What is ∫C F·dℓ?', [
      ['correct', '0'], ['positive', 'ca'], ['negative', '-ca'], ['square', 'ca^2'],
    ], 'correct', 'The field is perpendicular to the tangent, so the dot product vanishes.')]),
    ex('rectangular-path-contributing-legs', 'Contributing rectangle legs', [
      p('Let ', m('\\vec F=y\\hat e_1'), '. Traverse the boundary of ',
        m('[0,a]\\times[1,2]'), ' counterclockwise as viewed from +z. ',
        'A is the bottom, B the right, C the top, and D the left leg.'),
      path('rectangle [0,a] x [1,2], CCW; A bottom, B right, C top, D left',
        'Labeled rectangle', ['A', 'B', 'C', 'D']),
    ], [q('legs', 'Which legs have nonzero individual line integrals? Select all.',
      faceChoices, ['A', 'C'], 'Only horizontal tangents have a nonzero dot product with the field.',
      'multiple')]),
    ex('constant-field-square-circulation', 'Circulation of a constant field', [
      p('Let ', m('\\vec F=(1,2)'), '. Traverse the unit square ',
        m('[0,1]^2'), ' counterclockwise as viewed from +z.'),
      path('unit square [0,1]^2, counterclockwise; constant field (1,2)', 'Oriented square'),
    ], [q('circulation', 'What is the circulation around the full boundary?', [
      ['correct', '0'], ['one', '1'], ['two', '2'], ['perimeter', '4'],
    ], 'correct', 'Opposite sides contribute equal and opposite amounts.')]),
    ex('rotation-field-circle-circulation', 'Circulation around a circle', [
      p('Let ', m('\\vec F=(-y,x)'), '. Traverse the circle of radius ',
        m('R>0'), ' counterclockwise as viewed from +z.'),
      vector2d((x, y) => [-y, x], 'Rotating field', 'Vector field on the xy plane.'),
      path('counterclockwise circle centered at origin, radius R', 'Oriented circle'),
    ], [q('circulation', 'What is the circulation?', [
      ['correct', '2\\pi R^2'], ['negative', '-2\\pi R^2'],
      ['length', '2\\pi R'], ['area', '\\pi R^2'],
    ], 'correct', 'On the circle the tangential field magnitude is R and the circumference is 2πR.')]),
    ex('shear-field-square-circulation', 'Circulation of a shear field', [
      p('Let ', m('\\vec F=(y,0)'), '. Traverse the unit square ',
        m('[0,1]^2'), ' counterclockwise as viewed from +z.'),
      path('unit square [0,1]^2, CCW, field F=(y,0)', 'Oriented square'),
    ], [q('circulation', 'What is the circulation?', [
      ['correct', '-1'], ['positive', '1'], ['zero', '0'], ['two', '-2'],
    ], 'correct', 'The bottom contributes zero; the top is traversed toward −x and contributes −1.')]),
    ex('gradient-field-endpoints', 'Line integral from a potential', [
      p('Let ', m('f=x^2+y^2'), ' and ', m('\\vec F=\\nabla f'), '. Traverse any path ',
        'from ', m('P=(0,0)'), ' to ', m('Q=(1,2)'), '.'),
      path('path from P=(0,0) to Q=(1,2); route may curve', 'Path with endpoints'),
    ], [q('integral', 'What is ∫ from P to Q of F·dℓ?', [
      ['correct', '5'], ['negative', '-5'], ['length', '\\sqrt5'], ['zero', '0'],
    ], 'correct', 'The integral equals f(Q) − f(P) = 5.')]),
    ex('stokes-simple-check', 'A simple Stokes theorem check', [
      p('Let ', m('\\vec F=(-y/2,x/2,0)'), '. The unit square ',
        m('[0,1]^2'), ' has normal ', m('\\hat e_3'),
        ' and a counterclockwise boundary viewed from +z.'),
      path('unit square [0,1]^2 with +z normal and CCW boundary', 'Oriented square'),
    ], [
      q('curl', 'What is ∇×F?', [
        ['correct', '\\hat e_3'], ['negative', '-\\hat e_3'],
        ['double', '2\\hat e_3'], ['zero', '0'],
      ], 'correct', 'The z component is ∂ₓ(x/2) − ∂ᵧ(−y/2) = 1.'),
      q('integrals', 'What is the value of both the circulation and curl flux?', [
        ['correct', '1'], ['negative', '-1'], ['half', '1/2'], ['zero', '0'],
      ], 'correct', 'The curl is the positive unit normal over a unit area.'),
    ]),
  ],
};
