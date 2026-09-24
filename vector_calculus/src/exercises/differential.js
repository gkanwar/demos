const text = (value) => ({ type: 'text', value });
const math = (tex) => ({ type: 'math', tex });
const paragraph = (...content) => ({ type: 'paragraph', content });
const choice = (id, tex) => ({ id, content: [math(tex)] });

const points = [];
for (const x of [-1, 0, 1]) {
  for (const y of [-1, 0, 1]) {
    for (const z of [-1, 0, 1]) {
      if (x || y || z) points.push([x, y, z]);
    }
  }
}
const x = points.map((point) => point[0]);
const y = points.map((point) => point[1]);
const z = points.map((point) => point[2]);

export default {
  id: 'differential',
  title: 'Fields and derivatives',
  description: 'Basic vector fields, gradients, and divergence.',
  exercises: [
    {
      id: 'identify-radial-field',
      title: 'Identify a vector field',
      generate: () => ({
        statement: [
          paragraph(text('Identify the functional form of the field represented by this plot object.')),
          {
            type: 'widget',
            widget: 'vector3d',
            data: { x, y, z, u: x, v: y, w: z },
            caption: 'Sampled vector field in three dimensions',
            description: 'The intended plot has arrows pointing away from the origin, with length increasing with distance.',
          },
        ],
        questions: [{
          id: 'field',
          prompt: [paragraph(text('Which expression describes the field?'))],
          selection: 'single',
          options: [
            choice('radial', '\\vec{x}'),
            choice('inward', '-\\vec{x}'),
            choice('axis', '|\\vec{x}|\\hat{e}_1'),
            choice('rotation', '-y\\hat{e}_1+x\\hat{e}_2'),
          ],
          correctOptionIds: ['radial'],
          explanation: [paragraph(
            text('Each arrow has the same components as its position, so the field is '),
            math('\\vec{F}(\\vec{x})=\\vec{x}'),
            text('.'),
          )],
        }],
      }),
    },
    {
      id: 'gradient-squared-norm',
      title: 'Gradient of squared distance',
      generate: () => ({
        statement: [
          paragraph(text('In three dimensions, let '),
            math('f(\\vec{x})=|\\vec{x}|^2=x^2+y^2+z^2'), text('.')),
        ],
        questions: [
          {
            id: 'expression',
            prompt: [paragraph(text('What is the gradient field?'))],
            selection: 'single',
            options: [
              choice('double', '2\\vec{x}'),
              choice('single', '\\vec{x}'),
              choice('scaled', '|\\vec{x}|\\vec{x}'),
              choice('negative', '-2\\vec{x}'),
            ],
            correctOptionIds: ['double'],
            explanation: [paragraph(
              math('\\nabla f=(2x,2y,2z)=2\\vec{x}'),
              text('.'),
            )],
          },
          {
            id: 'at-e1',
            prompt: [paragraph(text('What is the gradient at '),
              math('\\vec{x}=(1,0,0)'), text('?'))],
            selection: 'single',
            options: [
              choice('two-e1', '2\\hat{e}_1'),
              choice('one-e1', '\\hat{e}_1'),
              choice('two-e2', '2\\hat{e}_2'),
              choice('zero', '0'),
            ],
            correctOptionIds: ['two-e1'],
          },
        ],
      }),
    },
    {
      id: 'divergence-radial-field',
      title: 'Divergence of the radial field',
      generate: () => ({
        statement: [
          paragraph(text('In three dimensions, consider '),
            math('\\vec{F}(\\vec{x})=\\vec{x}=(x,y,z)'), text('.')),
        ],
        questions: [{
          id: 'divergence',
          prompt: [paragraph(text('What is '), math('\\nabla\\cdot\\vec{F}'), text('?'))],
          selection: 'single',
          options: [
            choice('three', '3'),
            choice('two', '2'),
            choice('one', '1'),
            choice('zero', '0'),
          ],
          correctOptionIds: ['three'],
          explanation: [paragraph(
            math('\\nabla\\cdot\\vec{F}=\\partial_x x+\\partial_y y+\\partial_z z=3'),
            text('.'),
          )],
        }],
      }),
    },
    {
      id: 'linear-divergence',
      title: 'Divergence of a linear field',
      generate: ({ random }) => {
        const a = 1 + Math.floor(3 * random());
        const b = 4 + Math.floor(3 * random());
        const c = 7 + Math.floor(3 * random());
        return {
          statement: [{
            type: 'equation',
            tex: '\\vec{F}(x,y,z)=' + a + 'x\\hat{e}_1+' +
              b + 'y\\hat{e}_2+' + c + 'z\\hat{e}_3',
          }],
          questions: [{
            id: 'divergence',
            prompt: [paragraph(text('What is '), math('\\nabla\\cdot\\vec{F}'), text('?'))],
            selection: 'single',
            options: [
              choice('sum', String(a + b + c)),
              choice('xy', String(a + b)),
              choice('yz', String(b + c)),
              choice('zero', '0'),
            ],
            correctOptionIds: ['sum'],
            explanation: [paragraph(
              text('Differentiate each component along its own axis: '),
              math('a+b+c=' + (a + b + c)),
              text('.'),
            )],
          }],
        };
      },
    },
  ],
};
