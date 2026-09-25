import { sphereSurface } from '../geometry.js';
import { ex, m, p, q, stub } from './common.js';

const cyl = p('Use cylindrical coordinates ', m('(\\rho,\\phi,z)'),
  ', with ', m('x=\\rho\\cos\\phi'), ', ', m('y=\\rho\\sin\\phi'), '.');
const sph = p('Use spherical coordinates ', m('(r,\\theta,\\phi)'),
  ', where ', m('\\theta'), ' is measured from +z and ', m('\\phi'),
  ' is the azimuth from +x.');

export default {
  id: 'coordinates',
  title: 'Coordinate systems',
  description: 'Points, vector components, and differential elements.',
  exercises: [
    ex('cartesian-to-cylindrical-point', 'Cartesian to cylindrical point', [
      cyl, p('Convert the Cartesian point ', m('(1,1,2)'), '.'),
    ], [q('coordinates', 'What are its cylindrical coordinates?', [
      ['correct', '(\\sqrt2,\\pi/4,2)'], ['radius', '(2,\\pi/4,2)'],
      ['angle', '(\\sqrt2,3\\pi/4,2)'], ['height', '(\\sqrt2,\\pi/4,1)'],
    ], 'correct', 'The radius is √(1²+1²), and the point is in the first quadrant.')]),
    ex('cylindrical-to-cartesian-point', 'Cylindrical to Cartesian point', [
      cyl, p('Convert ', m('(\\rho,\\phi,z)=(2,\\pi/2,1)'), '.'),
    ], [q('coordinates', 'What are its Cartesian coordinates?', [
      ['correct', '(0,2,1)'], ['swap', '(2,0,1)'],
      ['sign', '(0,-2,1)'], ['height', '(0,2,2)'],
    ], 'correct', 'At azimuth π/2 the point lies on the positive y axis.')]),
    ex('cartesian-to-spherical-point', 'Cartesian to spherical point', [
      sph, p('Convert the Cartesian point ', m('(1,1,\\sqrt2)'), '.'),
    ], [q('coordinates', 'What are its spherical coordinates?', [
      ['correct', '(2,\\pi/4,\\pi/4)'],
      ['radius', '(\\sqrt2,\\pi/4,\\pi/4)'],
      ['polar', '(2,\\pi/2,\\pi/4)'],
      ['azimuth', '(2,\\pi/4,3\\pi/4)'],
    ], 'correct', 'The distance is 2, the polar angle is π/4, and the azimuth is π/4.')]),
    ex('spherical-to-cartesian-point', 'Spherical to Cartesian point', [
      sph, p('Convert ', m('(r,\\theta,\\phi)=(2,\\pi/2,\\pi/4)'), '.'),
    ], [q('coordinates', 'What are its Cartesian coordinates?', [
      ['correct', '(\\sqrt2,\\sqrt2,0)'],
      ['unscaled', '(1,1,0)'], ['z', '(\\sqrt2,0,\\sqrt2)'],
      ['sign', '(-\\sqrt2,\\sqrt2,0)'],
    ], 'correct', 'The point lies in the xy plane at azimuth π/4.')]),
    ex('cartesian-to-cylindrical-vector', 'Cartesian vector in a cylindrical basis', [
      cyl, p('At a point with ', m('\\phi=\\pi/2'), ', express ', m('\\hat e_1'),
        ' in the cylindrical basis.'),
      stub('basis-3d', 'point at azimuth pi/2; show Cartesian and cylindrical basis',
        'Basis directions', 'The basis directions are attached to the stated point.'),
    ], [q('vector', 'Which expression is correct?', [
      ['correct', '-\\hat e_\\phi'], ['sign', '\\hat e_\\phi'],
      ['radial', '\\hat e_\\rho'], ['height', '\\hat e_3'],
    ], 'correct', 'At azimuth π/2, the azimuthal direction points toward negative x.')]),
    ex('cylindrical-to-cartesian-vector', 'Cylindrical vector in a Cartesian basis', [
      cyl, p('At a point with ', m('\\phi=\\pi/4'), ', express ',
        m('\\hat e_\\rho'), ' in the Cartesian basis.'),
    ], [q('vector', 'Which expression is correct?', [
      ['correct', '(\\hat e_1+\\hat e_2)/\\sqrt2'],
      ['azimuthal', '(-\\hat e_1+\\hat e_2)/\\sqrt2'],
      ['negative', '-(\\hat e_1+\\hat e_2)/\\sqrt2'],
      ['unnormalized', '\\hat e_1+\\hat e_2'],
    ], 'correct', 'The radial unit vector makes a 45° angle with both positive axes.')]),
    ex('cartesian-to-spherical-vector', 'Cartesian vector in a spherical basis', [
      sph, p('At a point with ', m('(\\theta,\\phi)=(\\pi/2,0)'),
        ', express ', m('\\hat e_3'), ' in the spherical basis.'),
    ], [q('vector', 'Which expression is correct?', [
      ['correct', '-\\hat e_\\theta'], ['sign', '\\hat e_\\theta'],
      ['radial', '\\hat e_r'], ['azimuthal', '\\hat e_\\phi'],
    ], 'correct', 'On the positive x axis, increasing polar angle points toward negative z.')]),
    ex('spherical-basis-directions', 'Spherical basis directions', [
      sph, p('At the point ', m('(1,0,1)'), ', identify the three local unit vectors.'),
      stub('basis-3d', 'point (1,0,1); show e_r, e_theta, e_phi and Cartesian axes',
        'Spherical basis at a marked point', 'The basis vectors are attached to (1, 0, 1).'),
    ], [
      q('radial', 'Which direction is the radial unit vector?', [
        ['correct', '(\\hat e_1+\\hat e_3)/\\sqrt2'],
        ['polar', '(\\hat e_1-\\hat e_3)/\\sqrt2'],
        ['azimuthal', '\\hat e_2'], ['negative', '-(\\hat e_1+\\hat e_3)/\\sqrt2'],
      ], 'correct', 'The radial direction points from the origin toward the point.'),
      q('polar', 'Which direction is the polar unit vector?', [
        ['correct', '(\\hat e_1-\\hat e_3)/\\sqrt2'],
        ['radial', '(\\hat e_1+\\hat e_3)/\\sqrt2'],
        ['azimuthal', '\\hat e_2'], ['negative', '(\\hat e_3-\\hat e_1)/\\sqrt2'],
      ], 'correct', 'Increasing polar angle moves toward +x and −z here.'),
      q('azimuthal', 'Which direction is the azimuthal unit vector?', [
        ['correct', '\\hat e_2'], ['negative', '-\\hat e_2'],
        ['radial', '(\\hat e_1+\\hat e_3)/\\sqrt2'], ['z', '\\hat e_3'],
      ], 'correct', 'Increasing azimuth points along positive y at φ = 0.'),
    ]),
    ex('cylindrical-line-element', 'Cylindrical line element', [
      cyl, p('Consider an infinitesimal displacement in cylindrical coordinates.'),
    ], [q('element', 'Which vector line element is correct?', [
      ['correct', 'd\\vec\\ell=\\hat e_\\rho d\\rho+\\hat e_\\phi\\rho d\\phi+\\hat e_3 dz'],
      ['missing', 'd\\vec\\ell=\\hat e_\\rho d\\rho+\\hat e_\\phi d\\phi+\\hat e_3 dz'],
      ['square', 'd\\vec\\ell=\\hat e_\\rho d\\rho+\\hat e_\\phi\\rho^2 d\\phi+\\hat e_3 dz'],
      ['swap', 'd\\vec\\ell=\\hat e_\\rho\\rho d\\rho+\\hat e_\\phi d\\phi+\\hat e_3 dz'],
    ], 'correct', 'At fixed radius, an angle dφ sweeps an arc of length ρ dφ.')]),
    ex('cylinder-area-element', 'Area element on a cylinder', [
      cyl, p('Consider the outward-oriented side of a cylinder ', m('\\rho=R'),
        ', with ', m('R>0'), '.'),
      stub('region-3d', 'cylinder side rho=R; outward radial normal; coordinates phi and z',
        'Cylinder side', 'The side surface is oriented outward.'),
    ], [q('element', 'Which vector area element is correct?', [
      ['correct', 'd\\vec A=\\hat e_\\rho R\\,d\\phi\\,dz'],
      ['missing', 'd\\vec A=\\hat e_\\rho\\,d\\phi\\,dz'],
      ['sign', 'd\\vec A=-\\hat e_\\rho R\\,d\\phi\\,dz'],
      ['vertical', 'd\\vec A=\\hat e_3R\\,d\\phi\\,dz'],
    ], 'correct', 'The normal is radial and an azimuthal strip has width R dφ.')]),
    ex('sphere-area-element', 'Area element on a sphere', [
      sph, p('Consider the outward-oriented sphere ', m('r=R'), ', with ', m('R>0'), '.'),
      { type: 'widget', widget: 'geometry3d', data: {
        mode: 'surface', surfaces: [sphereSurface()],
      }, caption: 'Schematic sphere', description: 'A sphere centered at the origin.' },
    ], [q('element', 'Which vector area element is correct?', [
      ['correct', 'd\\vec A=\\hat e_rR^2\\sin\\theta\\,d\\theta\\,d\\phi'],
      ['missing-sin', 'd\\vec A=\\hat e_rR^2\\,d\\theta\\,d\\phi'],
      ['missing-r', 'd\\vec A=\\hat e_rR\\sin\\theta\\,d\\theta\\,d\\phi'],
      ['negative', 'd\\vec A=-\\hat e_rR^2\\sin\\theta\\,d\\theta\\,d\\phi'],
    ], 'correct', 'The outward normal is radial; the two arc widths multiply to R² sin θ.')]),
    ex('coordinate-volume-elements', 'Coordinate volume elements', [
      cyl, sph, p('Match each volume element to its coordinates.'),
    ], [
      q('cylindrical', 'Which is the cylindrical volume element?', [
        ['correct', '\\rho\\,d\\rho\\,d\\phi\\,dz'],
        ['cartesian', 'd\\rho\\,d\\phi\\,dz'],
        ['spherical', 'r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi'],
      ], 'correct', 'A cylindrical annular strip contributes the factor ρ.'),
      q('spherical', 'Which is the spherical volume element?', [
        ['correct', 'r^2\\sin\\theta\\,dr\\,d\\theta\\,d\\phi'],
        ['missing-sin', 'r^2\\,dr\\,d\\theta\\,d\\phi'],
        ['cylindrical', '\\rho\\,d\\rho\\,d\\phi\\,dz'],
      ], 'correct', 'A spherical shell contributes r² and polar angle contributes sin θ.'),
    ]),
  ],
};
