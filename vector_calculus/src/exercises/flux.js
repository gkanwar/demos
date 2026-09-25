import { boxBoundary, sampleVectorField, sphereSurface } from '../geometry.js';
import extraExercises from './flux-extra.js';

const faces = [
  { id: 'A', plane: 'x = -1/2', outwardNormal: '-e1' },
  { id: 'B', plane: 'x = 1/2', outwardNormal: 'e1' },
  { id: 'C', plane: 'y = -1/2', outwardNormal: '-e2' },
  { id: 'D', plane: 'y = 1/2', outwardNormal: 'e2' },
  { id: 'E', plane: 'z = -1/2', outwardNormal: '-e3' },
  { id: 'F', plane: 'z = 1/2', outwardNormal: 'e3' },
];
const cube = {
  mode: 'volume',
  ...boxBoundary(
    { x: [-0.5, 0.5], y: [-0.5, 0.5], z: [-0.5, 0.5] },
    { xMin: 'A', xMax: 'B', yMin: 'C', yMax: 'D', zMin: 'E', zMax: 'F' },
  ),
  vectors: sampleVectorField(
    [-0.4, -0.2, 0, 0.2, 0.4], () => [1, 0, 0],
  ),
};
const sphere = {
  mode: 'surface',
  surfaces: [sphereSurface()],
  vectors: sampleVectorField(
    [-1, -0.5, 0, 0.5, 1], (x, y, z) => [x, y, z],
  ),
};

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
            { type: 'math', tex: '\\alpha>0' },
            { type: 'text', value: '. Consider the outward flux through each face separately.' },
          ],
        },
        {
          type: 'widget',
          widget: 'geometry3d',
          data: cube,
          caption: 'Unit cube with faces A through F',
          description: 'A and B are the negative and positive x faces; C and D are the y faces; E and F are the z faces. Green arrows indicate the constant field direction.',
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
  }, ...extraExercises.slice(0, 3), {
    id: 'sphere-flux',
    title: 'Outward flux through a sphere',
    generate: () => ({
      statement: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', value: 'Let ' },
            { type: 'math', tex: 'S' },
            { type: 'text', value: ' be the unit sphere centered at the origin, oriented outward. Consider ' },
            { type: 'math', tex: '\\vec{F}(\\vec{x})=\\vec{x}' },
            { type: 'text', value: '.' },
          ],
        },
        {
          type: 'widget',
          widget: 'geometry3d',
          data: sphere,
          caption: 'Unit sphere and radial field',
          description: 'The surface is a sphere of radius one centered at the origin; green field arrows point outward.',
        },
      ],
      questions: [{
        id: 'normal',
        prompt: [{
          type: 'paragraph',
          content: [{ type: 'text', value: 'What is the outward unit normal at (1, 0, 0)?' }],
        }],
        selection: 'single',
        options: [
          { id: 'positive-x', content: [{ type: 'math', tex: '\\hat{e}_1' }] },
          { id: 'negative-x', content: [{ type: 'math', tex: '-\\hat{e}_1' }] },
          { id: 'positive-y', content: [{ type: 'math', tex: '\\hat{e}_2' }] },
          { id: 'zero', content: [{ type: 'math', tex: '0' }] },
        ],
        correctOptionIds: ['positive-x'],
        explanation: [{
          type: 'paragraph',
          content: [{ type: 'text', value: 'The outward normal points directly away from the center.' }],
        }],
      }, {
        id: 'flux',
        prompt: [{
          type: 'paragraph',
          content: [
            { type: 'text', value: 'What is the outward flux ' },
            { type: 'math', tex: '\\iint_S\\vec{F}\\cdot\\hat{n}\\,dS' },
            { type: 'text', value: '?' },
          ],
        }],
        selection: 'single',
        options: [
          { id: 'four-pi', content: [{ type: 'math', tex: '4\\pi' }] },
          { id: 'zero', content: [{ type: 'math', tex: '0' }] },
          { id: 'ball-volume', content: [{ type: 'math', tex: '\\frac{4\\pi}{3}' }] },
          { id: 'two-pi', content: [{ type: 'math', tex: '2\\pi' }] },
        ],
        correctOptionIds: ['four-pi'],
        explanation: [{
          type: 'paragraph',
          content: [
            { type: 'text', value: 'On the unit sphere, ' },
            { type: 'math', tex: '\\hat{n}=\\vec{x}' },
            { type: 'text', value: ' and ' },
            { type: 'math', tex: '\\vec{F}\\cdot\\hat{n}=1' },
            { type: 'text', value: ', so the flux equals the area ' },
            { type: 'math', tex: '4\\pi' },
            { type: 'text', value: '.' },
          ],
        }],
      }],
    }),
  }, ...extraExercises.slice(3)],
};
