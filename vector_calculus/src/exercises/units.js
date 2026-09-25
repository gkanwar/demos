import { ex, m, p, q } from './common.js';

const choices = (power) => [
  ['correct', `L^{p${power < 0 ? power : '+' + power}}`],
  ['unchanged', 'L^p'],
  ['opposite', `L^{p${power < 0 ? '+' + -power : -power}}`],
  ['double', `L^{p${power < 0 ? 2 * power : '+' + 2 * power}}`],
];

export default {
  id: 'units',
  title: 'Units',
  description: 'Track powers of length through derivatives and integrals.',
  exercises: [
    ex('ordinary-derivative-units', 'Units of a derivative', [
      p('Let ', m('[f]=L^p'), ' and ', m('[x]=L'), '.'),
    ], [q('units', 'What are the units of df/dx?', choices(-1), 'correct',
      'Differentiating with respect to length removes one power of L.')]),
    ex('gradient-units', 'Units of a gradient', [
      p('Let ', m('[f]=L^p'), '.'),
    ], [q('units', 'What are the units of ∇f?', choices(-1), 'correct',
      'Each Cartesian derivative removes one power of length.')]),
    ex('divergence-curl-units', 'Units of divergence and curl', [
      p('Let ', m('[\\vec F]=L^p'), '.'),
    ], [
      q('divergence', 'What are the units of ∇·F?', choices(-1), 'correct',
        'Divergence contains one spatial derivative.'),
      q('curl', 'What are the units of ∇×F?', choices(-1), 'correct',
        'Curl also contains one spatial derivative.'),
    ]),
    ex('line-integral-units', 'Units of a line integral', [
      p('Let ', m('[\\vec F]=L^p'), ' and let the path coordinate have units of length.'),
    ], [q('units', 'What are the units of ∫ F·dℓ?', choices(1), 'correct',
      'The line element adds one power of length.')]),
    ex('surface-integral-units', 'Units of a surface integral', [
      p('Let ', m('[\\vec F]=L^p'), '.'),
    ], [q('units', 'What are the units of ∫ F·dA?', choices(2), 'correct',
      'The area element adds two powers of length.')]),
    ex('volume-integral-units', 'Units of a volume integral', [
      p('Let ', m('[f]=L^p'), '.'),
    ], [q('units', 'What are the units of ∫ f dV?', choices(3), 'correct',
      'The volume element adds three powers of length.')]),
    ex('delta-units-by-dimension', 'Units of delta functions', [
      p('The integrals of ', m('\\delta(x)'), ', ', m('\\delta^{(2)}(\\vec x)'),
        ', and ', m('\\delta^{(3)}(\\vec x)'), ' over their full spaces are dimensionless.'),
    ], [
      q('one', 'What are the units of a 1D delta function?', [
        ['correct', 'L^{-1}'], ['zero', 'L^0'], ['two', 'L^{-2}'], ['positive', 'L'],
      ], 'correct', 'It cancels the units L of dx.'),
      q('two', 'What are the units of a 2D delta function?', [
        ['correct', 'L^{-2}'], ['one', 'L^{-1}'], ['three', 'L^{-3}'], ['positive', 'L^2'],
      ], 'correct', 'It cancels the units L² of dA.'),
      q('three', 'What are the units of a 3D delta function?', [
        ['correct', 'L^{-3}'], ['two', 'L^{-2}'], ['one', 'L^{-1}'], ['positive', 'L^3'],
      ], 'correct', 'It cancels the units L³ of dV.'),
    ]),
    ex('delta-weighted-integral-units', 'Units of a delta-weighted integral', [
      p('Let ', m('[f]=L^p'), ' and consider ',
        m('\\int f(\\vec x)\\delta^{(3)}(\\vec x-\\vec a)\\,dV'), '.'),
    ], [q('units', 'What are the units of the integral?', [
      ['correct', 'L^p'], ['minus', 'L^{p-3}'],
      ['plus', 'L^{p+3}'], ['zero', 'L^0'],
    ], 'correct', 'The 3D delta contributes L⁻³ and dV contributes L³.')]),
  ],
};
