import { sampleVectorField } from '../geometry.js';

export const m = (tex) => ({ type: 'math', tex });
export const p = (...parts) => ({
  type: 'paragraph',
  content: parts.map((part) => typeof part === 'string'
    ? { type: 'text', value: part } : part),
});
export const eq = (tex) => ({ type: 'equation', tex });

export function q(id, prompt, answers, correct, explanation, selection = 'single') {
  return {
    id,
    prompt: Array.isArray(prompt) ? prompt : [typeof prompt === 'string' ? p(prompt) : prompt],
    selection,
    options: answers.map(([optionId, tex]) => ({ id: optionId, content: [m(tex)] })),
    correctOptionIds: Array.isArray(correct) ? correct : [correct],
    ...(explanation ? { explanation: [typeof explanation === 'string'
      ? p(explanation) : explanation] } : {}),
  };
}

export const ex = (id, title, statement, questions) => ({
  id, title, generate: () => ({ statement, questions }),
});

export const diagram = (widget, data, caption, description) => ({
  type: 'widget', widget, data, caption, description,
});

const vectorAxis = [-2, -1, 0, 1, 2];
const vectorPoints = vectorAxis.flatMap((x) => vectorAxis.map((y) => [x, y]));
const scalarAxis = Array.from({ length: 21 }, (_, index) => -2 + index * 0.2);

export const vector2d = (field, caption, description) => ({
  type: 'widget', widget: 'vector2d',
  data: {
    x: vectorPoints.map(([x]) => x),
    y: vectorPoints.map(([, y]) => y),
    u: vectorPoints.map(([x, y]) => field(x, y)[0]),
    v: vectorPoints.map(([x, y]) => field(x, y)[1]),
  },
  caption, description,
});

export const scalar2d = (field, caption, description) => ({
  type: 'widget', widget: 'scalar2d',
  data: {
    x: scalarAxis,
    y: scalarAxis,
    values: scalarAxis.map((y) => scalarAxis.map((x) => field(x, y))),
  },
  caption, description,
});

export const vector3d = (field, caption, description) => ({
  type: 'widget', widget: 'vector3d',
  data: sampleVectorField([-1, -0.5, 0, 0.5, 1], field),
  caption, description,
});
