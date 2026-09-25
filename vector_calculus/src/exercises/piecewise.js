import { diagram, ex, m, p, q } from './common.js';

const cases = (...rows) => '\\begin{cases}' + rows.join('\\\\') + '\\end{cases}';
const profile = (segments, control, caption, xRange, yRange, labels = []) =>
  diagram('diagram1d', { kind: 'profile', segments, control, xRange, yRange,
    labels, axisLabels: { x: 'position', y: 'f' }, hideTicks: true },
  caption, 'Schematic source profile; drag the orange integration bound.');
const ball = (kind, control, caption, description) =>
  diagram('diagram3d', { shapes: [{ kind, radius: 1, inner: 0.5, outer: 1.1 }],
    control, ranges: { x: [-1.9, 1.9], y: [-1.9, 1.9], z: [-1.9, 1.9] },
    labels: kind === 'shell'
      ? [{ x: 0.5, y: 0, z: 0, label: 'a' },
        { x: 1.1, y: 0, z: 0, label: 'b' }]
      : [{ x: 1, y: 0, z: 0, label: 'R' }],
    hideTicks: true }, caption, description);

export default {
  id: 'piecewise',
  title: 'Piecewise functions',
  description: 'Build whole functions from moving integration bounds.',
  exercises: [
    ex('one-sided-top-hat-cumulative', 'Cumulative integral of a top hat', [
      p('Let ', m('f(t)=1'), ' for ', m('0<t<a'), ', and zero elsewhere, with ',
        m('a>0'), '. For ', m('x\\ge0'), ', define ', m('G(x)=\\int_0^x f(t)\\,dt'), '.'),
      profile([{ x0: 0, x1: 1, y0: 1, y1: 1 },
        { x0: 1, x1: 1.7, y0: 0, y1: 0 }],
      { kind: 'upper', symbol: 'x', min: 0, max: 1.7, step: 0.05,
        initial: 0.65, thresholds: [{ value: 1, label: 'a' }] },
      'Top-hat function', [0, 1.8], [-0.15, 1.3], [{ x: 1, y: 1.15, label: 'a' }]),
    ], [q('function', 'Which expression gives G(x) for all x ≥ 0?', [
      ['correct', cases('x & 0\\le x\\le a', 'a & x>a')],
      ['unbounded', cases('x & 0\\le x\\le a', 'x & x>a')],
      ['early', cases('a & 0\\le x\\le a', 'x & x>a')],
    ], 'correct', 'The integral grows with x until the upper limit passes the support.')]),
    ex('symmetric-slab-cumulative', 'Cumulative integral of a symmetric slab', [
      p('Let ', m('f(z)=c'), ' for ', m('|z|<a'), ', and zero elsewhere, with ',
        m('c,a>0'), '. For ', m('s\\ge0'), ', define ', m('G(s)=\\int_{-s}^{s}f(z)\\,dz'), '.'),
      profile([{ x0: -1.7, x1: -1, y0: 0, y1: 0 },
        { x0: -1, x1: 1, y0: 1, y1: 1 },
        { x0: 1, x1: 1.7, y0: 0, y1: 0 }],
      { kind: 'symmetric', symbol: 's', min: 0, max: 1.7, step: 0.05,
        initial: 0.65, thresholds: [{ value: -1 }, { value: 1 }] },
      'Symmetric slab profile', [-1.8, 1.8], [-0.15, 1.3],
      [{ x: -1, y: 1.15, label: '−a' }, { x: 1, y: 1.15, label: 'a' }]),
    ], [q('function', 'Which expression gives G(s) for all s ≥ 0?', [
      ['correct', cases('2cs & 0\\le s\\le a', '2ca & s>a')],
      ['half', cases('cs & 0\\le s\\le a', 'ca & s>a')],
      ['unbounded', cases('2cs & 0\\le s\\le a', '2cs & s>a')],
    ], 'correct', 'The interval intersects length 2s of the slab until s reaches a.')]),
    ex('weighted-slab-cumulative', 'Cumulative integral of a weighted slab', [
      p('Let ', m('f(z)=z'), ' for ', m('0<z<a'), ', and zero elsewhere, with ',
        m('a>0'), '. For ', m('s\\ge0'), ', define ', m('G(s)=\\int_0^s f(z)\\,dz'), '.'),
      profile([{ x0: 0, x1: 1, y0: 0, y1: 1 },
        { x0: 1, x1: 1.7, y0: 0, y1: 0 }],
      { kind: 'upper', symbol: 's', min: 0, max: 1.7, step: 0.05,
        initial: 0.65, thresholds: [{ value: 1 }] },
      'Weighted slab profile', [0, 1.8], [-0.15, 1.3], [{ x: 1, y: 1.15, label: 'a' }]),
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
      profile([{ x0: -1.8, x1: -1.2, y0: 0, y1: 0 },
        { x0: -1.2, x1: -0.6, y0: 0.55, y1: 0.55 },
        { x0: -0.6, x1: 0.6, y0: 1, y1: 1 },
        { x0: 0.6, x1: 1.2, y0: 0.55, y1: 0.55 },
        { x0: 1.2, x1: 1.8, y0: 0, y1: 0 }],
      { kind: 'symmetric', symbol: 's', min: 0, max: 1.8, step: 0.05,
        initial: 0.4, thresholds: [-1.2, -0.6, 0.6, 1.2].map((value) => ({ value })) },
      'Two-layer slab profile', [-1.9, 1.9], [-0.15, 1.3],
      [{ x: 0.6, y: 1.15, label: 'a' }, { x: 1.2, y: 0.8, label: 'b' }]),
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
      profile([{ x0: 0, x1: 1, y0: 0, y1: 0 },
        { x0: 1, x1: 1.7, y0: 1, y1: 1 }],
      { kind: 'upper', symbol: 'x', min: 0, max: 1.7, step: 0.05,
        initial: 0.65, thresholds: [{ value: 1 }] },
      'One-sided step', [0, 1.8], [-0.15, 1.3], [{ x: 1, y: 1.15, label: 'a' }]),
    ], [q('function', 'Which expression gives G(x) for all x ≥ 0?', [
      ['correct', cases('0 & 0\\le x\\le a', 'c(x-a) & x>a')],
      ['wrong-offset', cases('0 & 0\\le x\\le a', 'cx & x>a')],
      ['early', cases('cx & 0\\le x\\le a', 'ca & x>a')],
    ], 'correct', 'The integral starts growing only after x passes a.')]),
    ex('uniform-disk-cumulative', 'Cumulative area of a disk', [
      p('A disk of radius ', m('R>0'), ' has constant value ', m('c>0'),
        ' inside and zero outside. Integrate over the concentric radius-', m('s'),
        ' disk for ', m('s\\ge0'), '. In polar coordinates, ', m('dA=\\rho\\,d\\rho\\,d\\phi'), '.'),
      diagram('diagram2d', { shapes: [{ kind: 'disk', radius: 1, center: [0, 0] }],
        control: { kind: 'disk', symbol: 's', min: 0, max: 1.6, step: 0.05,
          initial: 0.65, thresholds: [{ value: 1 }] },
        xRange: [-1.8, 1.8], yRange: [-1.8, 1.8], hideTicks: true,
        labels: [{ x: 1, y: 0, label: 'R' }] },
      'Two concentric disks', 'Schematic source disk and movable integration boundary.'),
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
      ball('sphere', { kind: 'sphere', symbol: 's', min: 0, max: 1.6, step: 0.05,
        initial: 0.65, thresholds: [{ value: 1 }] },
      'Two concentric balls', 'Schematic source ball and movable integration boundary.'),
    ], [q('function', 'Which expression gives the integral as a function of s?', [
      ['correct', cases('4\\pi cs^3/3 & 0\\le s\\le R', '4\\pi cR^3/3 & s>R')],
      ['surface', cases('4\\pi cs^2 & 0\\le s\\le R', '4\\pi cR^2 & s>R')],
      ['unbounded', cases('4\\pi cs^3/3 & 0\\le s\\le R', '4\\pi cs^3/3 & s>R')],
    ], 'correct', 'The integral is c times the volume of the smaller ball.')]),
    ex('hollow-shell-cumulative', 'Cumulative volume of a hollow shell', [
      p('Let the function equal 1 on ', m('a<r<b'), ' and zero elsewhere, with ',
        m('0<a<b'), '. Integrate over a concentric radius-', m('s'), ' ball for ',
        m('s\\ge0'), '. Use ', m('dV=r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi'), '.'),
      ball('shell', { kind: 'sphere', symbol: 's', min: 0, max: 1.7, step: 0.05,
        initial: 0.35, thresholds: [{ value: 0.5 }, { value: 1.1 }] },
      'Shell and growing ball', 'Schematic shell and movable integration boundary.'),
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
      ball('sphere', { kind: 'sphere', symbol: 's', min: 0, max: 1.6, step: 0.05,
        initial: 0.65, thresholds: [{ value: 1 }] },
      'Quadratic ball and growing ball', 'Schematic support ball and movable integration boundary.'),
    ], [q('function', 'Which expression gives the integral as a function of s?', [
      ['correct', cases('4\\pi s^5/5 & 0\\le s\\le R', '4\\pi R^5/5 & s>R')],
      ['volume', cases('4\\pi s^3/3 & 0\\le s\\le R', '4\\pi R^3/3 & s>R')],
      ['unbounded', cases('4\\pi s^5/5 & 0\\le s\\le R', '4\\pi s^5/5 & s>R')],
    ], 'correct', 'The radial integrand is r⁴ and the integral saturates at R.')]),
  ],
};
