import { ex, m, p, q, stub } from './common.js';

const cases = (...rows) => '\\begin{cases}' + rows.join('\\\\') + '\\end{cases}';
const range = (spec, caption) => stub('number-line', spec, caption,
  'The source function and the moving integration limit are shown schematically.');

export default {
  id: 'piecewise',
  title: 'Piecewise functions',
  description: 'Build whole functions from moving integration bounds.',
  exercises: [
    ex('one-sided-top-hat-cumulative', 'Cumulative integral of a top hat', [
      p('Let ', m('f(t)=1'), ' for ', m('0<t<a'), ', and zero elsewhere, with ',
        m('a>0'), '. For ', m('x\\ge0'), ', define ', m('G(x)=\\int_0^x f(t)\\,dt'), '.'),
      range('f(t)=1 for 0<t<a, 0 elsewhere; moving upper bound x>=0', 'Top-hat function'),
    ], [q('function', 'Which expression gives G(x) for all x ≥ 0?', [
      ['correct', cases('x & 0\\le x\\le a', 'a & x>a')],
      ['unbounded', cases('x & 0\\le x\\le a', 'x & x>a')],
      ['early', cases('a & 0\\le x\\le a', 'x & x>a')],
    ], 'correct', 'The integral grows with x until the upper limit passes the support.')]),
    ex('symmetric-slab-cumulative', 'Cumulative integral of a symmetric slab', [
      p('Let ', m('f(z)=c'), ' for ', m('|z|<a'), ', and zero elsewhere, with ',
        m('c,a>0'), '. For ', m('s\\ge0'), ', define ', m('G(s)=\\int_{-s}^{s}f(z)\\,dz'), '.'),
      range('f(z)=c for |z|<a, 0 elsewhere; bounds [-s,s]', 'Symmetric slab profile'),
    ], [q('function', 'Which expression gives G(s) for all s ≥ 0?', [
      ['correct', cases('2cs & 0\\le s\\le a', '2ca & s>a')],
      ['half', cases('cs & 0\\le s\\le a', 'ca & s>a')],
      ['unbounded', cases('2cs & 0\\le s\\le a', '2cs & s>a')],
    ], 'correct', 'The interval intersects length 2s of the slab until s reaches a.')]),
    ex('weighted-slab-cumulative', 'Cumulative integral of a weighted slab', [
      p('Let ', m('f(z)=z'), ' for ', m('0<z<a'), ', and zero elsewhere, with ',
        m('a>0'), '. For ', m('s\\ge0'), ', define ', m('G(s)=\\int_0^s f(z)\\,dz'), '.'),
      range('f(z)=z for 0<z<a, 0 elsewhere; moving upper bound s', 'Weighted slab profile'),
    ], [q('function', 'Which expression gives G(s) for all s ≥ 0?', [
      ['correct', cases('s^2/2 & 0\\le s\\le a', 'a^2/2 & s>a')],
      ['linear', cases('s & 0\\le s\\le a', 'a & s>a')],
      ['unbounded', cases('s^2/2 & 0\\le s\\le a', 's^2/2 & s>a')],
    ], 'correct', 'Integrate z until the upper bound passes a, then the result stays fixed.')]),
    ex('nested-slab-layers', 'Cumulative integral of two slab layers', [
      p('Let ', m('f(z)=c_1'), ' for ', m('|z|<a'), ', ', m('f(z)=c_2'),
        ' for ', m('a<|z|<b'), ', and zero elsewhere, with ',
        m('0<a<b'), ' and ', m('c_1,c_2>0'), '. Define ',
        m('G(s)=\\int_{-s}^{s}f(z)\\,dz'), ' for ', m('s\\ge0'), '.'),
      range('symmetric layers: c1 for |z|<a, c2 for a<|z|<b, 0 outside',
        'Two-layer slab profile'),
    ], [q('function', 'Which expression gives G(s) for all s ≥ 0?', [
      ['correct', cases('2c_1s & 0\\le s\\le a',
        '2c_1a+2c_2(s-a) & a<s\\le b', '2c_1a+2c_2(b-a) & s>b')],
      ['missing-two', cases('c_1s & 0\\le s\\le a',
        'c_1a+c_2(s-a) & a<s\\le b', 'c_1a+c_2(b-a) & s>b')],
      ['wrong-offset', cases('2c_1s & 0\\le s\\le a',
        '2c_1a+2c_2s & a<s\\le b', '2c_1a+2c_2b & s>b')],
    ], 'correct', 'Accumulate both symmetric sides of each layer; the outer layer starts at a.')]),
    ex('one-sided-step-cumulative', 'Cumulative integral of a step', [
      p('Let ', m('f(t)=0'), ' for ', m('t<a'), ', and ', m('f(t)=c'),
        ' for ', m('t>a'), ', with ', m('a,c>0'), '. For ', m('x\\ge0'),
        ', define ', m('G(x)=\\int_0^x f(t)\\,dt'), '.'),
      range('step from 0 to c at t=a; moving upper bound x>=0', 'One-sided step'),
    ], [q('function', 'Which expression gives G(x) for all x ≥ 0?', [
      ['correct', cases('0 & 0\\le x\\le a', 'c(x-a) & x>a')],
      ['wrong-offset', cases('0 & 0\\le x\\le a', 'cx & x>a')],
      ['early', cases('cx & 0\\le x\\le a', 'ca & x>a')],
    ], 'correct', 'The integral starts growing only after x passes a.')]),
    ex('uniform-disk-cumulative', 'Cumulative area of a disk', [
      p('A disk of radius ', m('R>0'), ' has constant value ', m('c>0'),
        ' inside and zero outside. Integrate over the concentric radius-', m('s'),
        ' disk for ', m('s\\ge0'), '. In polar coordinates, ', m('dA=\\rho\\,d\\rho\\,d\\phi'), '.'),
      stub('region-2d', 'concentric disks of radii R and variable s; constant c inside R',
        'Two concentric disks', 'The integration disk expands from the origin.'),
    ], [q('function', 'Which expression gives the integral as a function of s?', [
      ['correct', cases('c\\pi s^2 & 0\\le s\\le R', 'c\\pi R^2 & s>R')],
      ['linear', cases('2\\pi cs & 0\\le s\\le R', '2\\pi cR & s>R')],
      ['unbounded', cases('c\\pi s^2 & 0\\le s\\le R', 'c\\pi s^2 & s>R')],
    ], 'correct', 'The integral is c times the area of the smaller disk.')]),
    ex('uniform-ball-cumulative', 'Cumulative volume of a ball', [
      p('A ball of radius ', m('R>0'), ' has constant value ', m('c>0'),
        ' inside and zero outside. Integrate over the concentric radius-', m('s'),
        ' ball for ', m('s\\ge0'), '. Use ',
        m('dV=r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi'), '.'),
      stub('region-3d', 'concentric balls of radii R and variable s; constant c inside R',
        'Two concentric balls', 'The integration ball expands from the origin.'),
    ], [q('function', 'Which expression gives the integral as a function of s?', [
      ['correct', cases('4\\pi cs^3/3 & 0\\le s\\le R', '4\\pi cR^3/3 & s>R')],
      ['surface', cases('4\\pi cs^2 & 0\\le s\\le R', '4\\pi cR^2 & s>R')],
      ['unbounded', cases('4\\pi cs^3/3 & 0\\le s\\le R', '4\\pi cs^3/3 & s>R')],
    ], 'correct', 'The integral is c times the volume of the smaller ball.')]),
    ex('hollow-shell-cumulative', 'Cumulative volume of a hollow shell', [
      p('Let the function equal 1 on ', m('a<r<b'), ' and zero elsewhere, with ',
        m('0<a<b'), '. Integrate over a concentric radius-', m('s'), ' ball for ',
        m('s\\ge0'), '. Use ', m('dV=r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi'), '.'),
      stub('region-3d', 'hollow shell a<r<b; growing ball radius s',
        'Shell and growing ball', 'The integral starts only when s reaches the inner radius.'),
    ], [q('function', 'Which expression gives the integral as a function of s?', [
      ['correct', cases('0 & 0\\le s\\le a',
        '4\\pi(s^3-a^3)/3 & a<s\\le b', '4\\pi(b^3-a^3)/3 & s>b')],
      ['full-ball', cases('4\\pi s^3/3 & 0\\le s\\le a',
        '4\\pi s^3/3 & a<s\\le b', '4\\pi b^3/3 & s>b')],
      ['plus-inner', cases('0 & 0\\le s\\le a',
        '4\\pi(s^3+a^3)/3 & a<s\\le b', '4\\pi(b^3+a^3)/3 & s>b')],
    ], 'correct', 'Subtract the missing inner ball and stop accumulating beyond b.')]),
    ex('quadratic-ball-cumulative', 'Cumulative integral of squared radius', [
      p('Let ', m('f(r)=r^2'), ' for ', m('r<R'), ' and zero outside, with ',
        m('R>0'), '. Integrate over a concentric radius-', m('s'), ' ball for ',
        m('s\\ge0'), '. Use ', m('dV=r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi'), '.'),
      stub('region-3d', 'f(r)=r² for r<R; growing ball radius s',
        'Quadratic ball and growing ball', 'The integral stops changing once s passes R.'),
    ], [q('function', 'Which expression gives the integral as a function of s?', [
      ['correct', cases('4\\pi s^5/5 & 0\\le s\\le R', '4\\pi R^5/5 & s>R')],
      ['volume', cases('4\\pi s^3/3 & 0\\le s\\le R', '4\\pi R^3/3 & s>R')],
      ['unbounded', cases('4\\pi s^5/5 & 0\\le s\\le R', '4\\pi s^5/5 & s>R')],
    ], 'correct', 'The radial integrand is r⁴ and the integral saturates at R.')]),
  ],
};
