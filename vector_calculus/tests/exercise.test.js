import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import katex from 'katex';
import modules from '../src/exercises/index.js';
import { createExercise, createRandom, grade } from '../src/exercise.js';
import { plotFigure } from '../src/plot-data.js';
import { getProgress, updateProgress } from '../src/progress.js';

const differential = modules.find((module) => module.id === 'differential');
const flux = modules.find((module) => module.id === 'flux');
const exercise = (module, id, seed = 1) =>
  module.exercises.find((entry) => entry.id === id)
    .generate({ random: createRandom(seed) });
const byId = (moduleId, id) => exercise(
  modules.find((module) => module.id === moduleId), id);
const answerTex = (question) => question.options.find((option) =>
  option.id === question.correctOptionIds[0]).content[0].tex;

test('generated exercises repeat for the same seed and vary across seeds', () => {
  const first = exercise(differential, 'linear-divergence', 1);
  assert.deepEqual(first, exercise(differential, 'linear-divergence', 1));
  assert.notDeepEqual(first, exercise(differential, 'linear-divergence', 2));
});

test('seeded answer order varies without changing answers or source definitions', () => {
  const definition = modules.find((module) => module.id === 'coordinates')
    .exercises[0];
  const source = definition.generate({ random: createRandom(17) });
  const instance = createExercise(definition, 17);
  assert.deepEqual(instance, createExercise(definition, 17));
  assert.deepEqual(instance.statement, source.statement);
  assert.deepEqual(instance.questions[0].correctOptionIds,
    source.questions[0].correctOptionIds);
  assert.deepEqual(instance.questions[0].options.map((option) => option.id).sort(),
    source.questions[0].options.map((option) => option.id).sort());
  assert.deepEqual(definition.generate({ random: createRandom(17) }), source);

  const correctPositions = new Set(Array.from({ length: 32 }, (_, seed) => {
    const question = createExercise(definition, seed).questions[0];
    return question.options.findIndex((option) =>
      question.correctOptionIds.includes(option.id));
  }));
  assert.deepEqual([...correctPositions].sort(), [0, 1, 2, 3]);
});

test('shuffled radio and checkbox options still grade by ID', () => {
  for (const definition of [
    differential.exercises.find((entry) => entry.id === 'gradient-squared-norm'),
    flux.exercises.find((entry) => entry.id === 'constant-field-cube'),
  ]) {
    for (const seed of [0, 1, 42]) {
      const instance = createExercise(definition, seed);
      for (const question of instance.questions) {
        assert.equal(grade([question], {
          [question.id]: [...question.correctOptionIds].reverse(),
        }).correct, 1);
        assert.equal(grade([question], { [question.id]: [] }).correct, 0);
      }
    }
  }
});

test('example exercises have valid, distinct answer choices', () => {
  for (const module of modules) {
    for (const definition of module.exercises) {
      for (const seed of [0, 1, 42]) {
        const instance = definition.generate({ random: createRandom(seed) });
        assert.ok(instance.questions.length > 0);
        for (const question of instance.questions) {
          const ids = question.options.map((option) => option.id);
          assert.equal(new Set(ids).size, ids.length);
          assert.ok(question.correctOptionIds.length > 0);
          assert.ok(question.correctOptionIds.every((id) => ids.includes(id)));
          if (question.selection === 'single') {
            assert.equal(question.correctOptionIds.length, 1);
          }
        }
      }
    }
  }
});

test('all catalog exercises are registered in their planned modules', () => {
  const lines = readFileSync(new URL('../docs/exercise-catalog.md', import.meta.url),
    'utf8').split('\n');
  const groupModules = new Map();
  for (const line of lines) {
    const match = line.match(/^\| ([^|]+) \| `([a-z-]+)` \|/);
    if (match) groupModules.set(match[1], match[2]);
  }
  const expected = new Map();
  let group;
  for (const line of lines) {
    if (line.startsWith('## ')) group = line.slice(3);
    const match = line.match(/^\| `([a-z0-9-]+)` \|/);
    if (match) {
      const moduleId = groupModules.get(group);
      assert.ok(moduleId, `No module for catalog group ${group}`);
      if (!expected.has(moduleId)) expected.set(moduleId, []);
      expected.get(moduleId).push(match[1]);
    }
  }
  assert.deepEqual(modules.map((module) => module.id), [...expected.keys()]);
  for (const module of modules) {
    const actual = module.exercises.map((entry) => entry.id);
    assert.equal(new Set(actual).size, actual.length, module.id);
    assert.deepEqual(actual, expected.get(module.id), module.id);
  }
});

test('all generated content has distinct choices, valid math, and described widgets', () => {
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    if (value.type === 'math' || value.type === 'equation') {
      katex.renderToString(value.tex, { throwOnError: true });
    }
    if (value.type === 'widget') {
      assert.ok(value.caption);
      assert.ok(value.description);
      assert.notEqual(value.widget, 'diagram-stub');
    }
    if (Array.isArray(value)) value.forEach(visit);
    else Object.values(value).forEach(visit);
  };
  for (const module of modules) {
    for (const definition of module.exercises) {
      for (const seed of [0, 1, 42]) {
        const instance = definition.generate({ random: createRandom(seed) });
        assert.deepEqual(instance,
          definition.generate({ random: createRandom(seed) }), definition.id);
        assert.ok(instance.statement.length, definition.id);
        const questionIds = instance.questions.map((question) => question.id);
        assert.equal(new Set(questionIds).size, questionIds.length, definition.id);
        for (const question of instance.questions) {
          const labels = question.options.map((option) => JSON.stringify(option.content));
          assert.equal(new Set(labels).size, labels.length,
            `${definition.id}/${question.id}`);
          assert.ok(question.explanation?.length, `${definition.id}/${question.id}`);
        }
        visit(instance);
      }
    }
  }
});

test('representative results across the new groups are correct', () => {
  assert.equal(answerTex(byId('coordinates', 'cartesian-to-spherical-point')
    .questions[0]), '(2,\\pi/4,\\pi/4)');
  assert.equal(answerTex(byId('differential', 'curl-mixed-linear')
    .questions[0]), '(-b,-c,-a)');
  assert.deepEqual(byId('line-integrals', 'rectangular-path-contributing-legs')
    .questions[0].correctOptionIds, ['A', 'C']);
  assert.equal(answerTex(byId('line-integrals', 'stokes-simple-check')
    .questions[1]), '1');
  assert.equal(answerTex(byId('flux', 'radial-field-cylinder-flux')
    .questions[1]), '2\\pi R^2h');
  assert.equal(answerTex(byId('volume-integrals', 'gaussian-all-space-integral')
    .questions[0]), '\\pi^{3/2}');
  assert.equal(answerTex(byId('delta-functions', 'scaled-delta-1d')
    .questions[0]), '1');
  assert.deepEqual(byId('delta-functions', 'delta-3d-cylinder-support')
    .questions.map((question) => question.correctOptionIds[0]),
  ['one', 'zero', 'zero']);
  assert.match(answerTex(byId('piecewise', 'hollow-shell-cumulative')
    .questions[0]), /s\^3-a\^3/);
});

test('every implemented plot widget produces a figure', () => {
  for (const module of modules) {
    for (const definition of module.exercises) {
      const instance = definition.generate({ random: createRandom(1) });
      for (const block of instance.statement) {
        if (block.type !== 'widget') continue;
        const figure = plotFigure(block.widget, block.data);
        assert.ok(figure.traces.length, definition.id);
        assert.ok(figure.layout, definition.id);
      }
    }
  }
});

test('gradient exercise awards partial marks across two questions', () => {
  const instance = exercise(differential, 'gradient-squared-norm');
  const result = grade(instance.questions, {
    expression: ['double'],
    'at-e1': ['zero'],
  });
  assert.equal(result.correct, 1);
  assert.equal(result.total, 2);
  assert.deepEqual(result.results.map((item) => item.correct), [true, false]);
});

test('cube faces require the exact checkbox selection', () => {
  const instance = exercise(flux, 'constant-field-cube');
  const question = instance.questions[0];
  assert.deepEqual(question.correctOptionIds, ['A', 'B']);
  assert.equal(grade([question], { 'nonzero-faces': ['B', 'A'] }).correct, 1);
  assert.equal(grade([question], { 'nonzero-faces': ['A'] }).correct, 0);
  assert.equal(grade([question], {}).correct, 0);
});

test('progress keeps the best score and completed status', () => {
  const key = 'differential/gradient-squared-norm';
  let progress = updateProgress({}, key, { correct: 2, total: 2 });
  progress = updateProgress(progress, key, { correct: 1, total: 2 });
  assert.deepEqual(progress[key], {
    attempts: 2,
    latest: { correct: 1, total: 2 },
    best: { correct: 2, total: 2 },
    completed: true,
  });
});

test('incompatible stored progress is ignored', () => {
  globalThis.localStorage = {
    getItem: () => JSON.stringify({ broken: {}, empty: null }),
  };
  assert.deepEqual(getProgress(), {});
  delete globalThis.localStorage;
});
