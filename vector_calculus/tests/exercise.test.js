import test from 'node:test';
import assert from 'node:assert/strict';
import modules from '../src/exercises/index.js';
import { createRandom, grade } from '../src/exercise.js';
import { getProgress, updateProgress } from '../src/progress.js';

const differential = modules.find((module) => module.id === 'differential');
const flux = modules.find((module) => module.id === 'flux');
const exercise = (module, id, seed = 1) =>
  module.exercises.find((entry) => entry.id === id)
    .generate({ random: createRandom(seed) });

test('generated exercises repeat for the same seed and vary across seeds', () => {
  const first = exercise(differential, 'linear-divergence', 1);
  assert.deepEqual(first, exercise(differential, 'linear-divergence', 1));
  assert.notDeepEqual(first, exercise(differential, 'linear-divergence', 2));
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
