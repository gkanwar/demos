import { ex, m, p, q, scalar2d, vector2d, vector3d } from './common.js';

const fieldQuestion = (answers, correct, explanation) =>
  q('field', 'Which expression matches the plot?', answers, correct, explanation);
const fieldAnswers = [
  ['outward', '(x,y)'], ['inward', '(-x,-y)'],
  ['uniform', '(1,0)'], ['rotation', '(-y,x)'],
];
const scalarAnswers = [
  ['ramp', 'x'], ['bowl', 'x^2+y^2'],
  ['cone', '\\sqrt{x^2+y^2}'], ['shifted', '(x-1)^2+y^2'],
];

export default {
  id: 'visualization',
  title: 'Visualizing fields',
  description: 'Match vector and scalar field plots with equations.',
  exercises: [
    ex('uniform-vector-2d', 'Uniform vector field in a plane', [
      p('Identify the field represented by the arrows.'),
      vector2d(() => [1, 0], 'Uniform vector field', 'Arrows on a plane.'),
    ], [fieldQuestion([
      ['right', '\\hat e_1'], ['up', '\\hat e_2'],
      ['radial', 'x\\hat e_1+y\\hat e_2'], ['shear', 'y\\hat e_1'],
    ], 'right', 'Every arrow points right with the same length.')]),
    ex('outward-radial-2d', 'Outward radial field in a plane', [
      p('Identify the field represented by the arrows.'),
      vector2d((x, y) => [x, y], 'Vector field', 'Arrows on a plane.'),
    ], [fieldQuestion(fieldAnswers, 'outward', 'Both components equal the corresponding position coordinates.')]),
    ex('inward-radial-2d', 'Inward radial field in a plane', [
      p('Identify the field represented by the arrows.'),
      vector2d((x, y) => [-x, -y], 'Vector field', 'Arrows on a plane.'),
    ], [fieldQuestion(fieldAnswers, 'inward', 'The arrows point toward the origin and grow farther from it.')]),
    ex('planar-rotation', 'Rotating field in a plane', [
      p('Identify the field represented by the arrows.'),
      vector2d((x, y) => [-y, x], 'Vector field', 'Arrows on a plane.'),
    ], [fieldQuestion(fieldAnswers, 'rotation', 'At (1, 0) the field points upward; at (0, 1) it points left.')]),
    ex('saddle-vector-2d', 'Saddle vector field', [
      p('Identify the field represented by the arrows.'),
      vector2d((x, y) => [x, -y], 'Vector field', 'Arrows on a plane.'),
    ], [fieldQuestion([
      ['saddle', '(x,-y)'], ['radial', '(x,y)'],
      ['inward', '(-x,-y)'], ['rotation', '(-y,x)'],
    ], 'saddle', 'The arrows point outward on the x axis and inward on the y axis.')]),
    ex('uniform-vector-3d', 'Uniform vector field in space', [
      p('Identify the field represented by the arrows.'),
      vector3d(() => [0, 0, 1], '3D vector field', 'Arrows in three dimensions.'),
    ], [fieldQuestion([
      ['z', '\\hat e_3'], ['x', '\\hat e_1'],
      ['radial', '\\vec x'], ['zscaled', 'z\\hat e_3'],
    ], 'z', 'The field points in the positive z direction everywhere.')]),
    {
      id: 'identify-radial-field',
      title: 'Identify a vector field',
      generate: () => ({
        statement: [
          p('Identify the functional form of the field represented by this plot object.'),
          vector3d((x, y, z) => [x, y, z], '3D vector field',
            'Vector field pointed away from the origin in all directions.'),
        ],
        questions: [q('field', 'Which expression describes the field?', [
          ['radial', '\\vec{x}'], ['inward', '-\\vec{x}'],
          ['axis', '|\\vec{x}|\\hat{e}_1'],
          ['rotation', '-y\\hat{e}_1+x\\hat{e}_2'],
        ], 'radial', p('Each arrow has the same components as its position, so the field is ',
          m('\\vec{F}(\\vec{x})=\\vec{x}'), '.'))],
      }),
    },
    ex('inverse-square-radial-3d', 'Decreasing radial field', [
      p('The field is not defined at the origin. Identify it from the sampled arrows.'),
      vector3d((x, y, z) => {
        const r = Math.hypot(x, y, z);
        return r ? [x / r ** 3, y / r ** 3, z / r ** 3] : [0, 0, 0];
      }, '3D vector field away from the origin', 'Arrows in three dimensions.'),
    ], [fieldQuestion([
      ['inverse-square', '\\vec x/|\\vec x|^3'],
      ['radial', '\\vec x'], ['unit', '\\vec x/|\\vec x|'],
      ['inward', '-\\vec x/|\\vec x|^3'],
    ], 'inverse-square', 'The direction is outward and the magnitude decreases as 1/r².')]),
    ex('scalar-ramp-contours', 'Contours of a scalar ramp', [
      p('Identify the scalar field represented by these contours.'),
      scalar2d((x) => x, 'Scalar field contours', 'Contours on the xy plane.'),
    ], [q('field', 'Which expression matches the contours?', scalarAnswers,
      'ramp', 'The value changes with x and is constant along vertical lines.')]),
    ex('scalar-bowl-contours', 'Contours of a scalar bowl', [
      p('Identify the scalar field represented by these contours.'),
      scalar2d((x, y) => x * x + y * y, 'Scalar field contours', 'Contours on the xy plane.'),
    ], [q('field', 'Which expression matches the contours?', scalarAnswers,
      'bowl', 'Equal values lie on circles, and their values increase with squared radius.')]),
    ex('shear-equation-to-plot', 'Choose the shear field plot', [
      p('Let ', m('\\vec F=(y,0)'), '. Which labeled plot shows this field?'),
      vector2d((x, y) => [y, 0], 'Plot A', 'Vector field A.'),
      vector2d((x, y) => [x, 0], 'Plot B', 'Vector field B.'),
      vector2d((x, y) => [0, y], 'Plot C', 'Vector field C.'),
      vector2d((x, y) => [-y, 0], 'Plot D', 'Vector field D.'),
    ], [q('plot', 'Choose a plot.', [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']],
      'A', 'The arrows are horizontal, vanish on y = 0, and reverse direction across it.')]),
    ex('gaussian-equation-to-plot', 'Choose the centered peak', [
      p('Let ', m('f(x,y)=e^{-(x^2+y^2)}'), '. Which labeled contour plot shows it?'),
      scalar2d((x, y) => Math.exp(-x * x - y * y), 'Plot A', 'Scalar field A.'),
      scalar2d((x, y) => x * x + y * y, 'Plot B', 'Scalar field B.'),
      scalar2d((x, y) => Math.exp(-((x - 1) ** 2) - y * y), 'Plot C', 'Scalar field C.'),
      scalar2d((x) => x, 'Plot D', 'Scalar field D.'),
    ], [q('plot', 'Choose a plot.', [['A', 'A'], ['B', 'B'], ['C', 'C'], ['D', 'D']],
      'A', 'The function has a centered maximum and decreases in every radial direction.')]),
  ],
};
