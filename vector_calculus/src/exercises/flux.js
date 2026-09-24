const faces = [
  { id: 'A', plane: 'x = -1/2', outwardNormal: '-e1' },
  { id: 'B', plane: 'x = 1/2', outwardNormal: 'e1' },
  { id: 'C', plane: 'y = -1/2', outwardNormal: '-e2' },
  { id: 'D', plane: 'y = 1/2', outwardNormal: 'e2' },
  { id: 'E', plane: 'z = -1/2', outwardNormal: '-e3' },
  { id: 'F', plane: 'z = 1/2', outwardNormal: 'e3' },
];

export default {
  id: 'flux',
  title: 'Surface integrals',
  description: 'Which parts of a surface contribute to flux?',
  exercises: [{
    id: 'constant-field-cube',
    title: 'Flux through the faces of a cube',
    generate: () => ({
      statement: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', value: 'A unit cube is centered at the origin. Let ' },
            { type: 'math', tex: '\\vec{F}=\\alpha\\hat{e}_1' },
            { type: 'text', value: ', where ' },
            { type: 'math', tex: '\\alpha\\ne0' },
            { type: 'text', value: '. Consider the outward flux through each face separately.' },
          ],
        },
        {
          type: 'widget',
          widget: 'cube-faces',
          data: {
            bounds: { x: [-0.5, 0.5], y: [-0.5, 0.5], z: [-0.5, 0.5] },
            faces,
          },
          caption: 'Unit cube with faces A through F',
          description: 'A and B are the negative and positive x faces; C and D are the y faces; E and F are the z faces.',
        },
      ],
      questions: [{
        id: 'nonzero-faces',
        prompt: [{
          type: 'paragraph',
          content: [{
            type: 'text',
            value: 'Which individual faces make a non-zero contribution to the surface integral? Select all that apply.',
          }],
        }],
        selection: 'multiple',
        options: faces.map((face) => ({
          id: face.id,
          content: [{ type: 'text', value: 'Face ' + face.id }],
        })),
        correctOptionIds: ['A', 'B'],
        explanation: [{
          type: 'paragraph',
          content: [
            { type: 'text', value: 'The outward flux is ' },
            { type: 'math', tex: '-\\alpha' },
            { type: 'text', value: ' through A and ' },
            { type: 'math', tex: '+\\alpha' },
            { type: 'text', value: ' through B. The other faces have zero flux. The total flux is zero.' },
          ],
        }],
      }],
    }),
  }],
};
