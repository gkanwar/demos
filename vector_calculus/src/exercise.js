export function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createExercise(definition, seed) {
  const instance = definition.generate({ random: createRandom(seed) });
  const random = createRandom(seed ^ 0x9e3779b9);
  return {
    ...instance,
    questions: instance.questions.map((question) => {
      const options = [...question.options];
      for (let index = options.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [options[index], options[other]] = [options[other], options[index]];
      }
      return { ...question, options };
    }),
  };
}

export function newSeed(previous) {
  const value = new Uint32Array(1);
  do {
    crypto.getRandomValues(value);
  } while (value[0] === previous);
  return value[0];
}

export function grade(questions, selections) {
  const results = questions.map((question) => {
    const selected = new Set(selections[question.id] || []);
    const expected = new Set(question.correctOptionIds);
    const correct = selected.size === expected.size &&
      [...selected].every((id) => expected.has(id));
    return { id: question.id, correct };
  });
  return {
    correct: results.filter((result) => result.correct).length,
    total: questions.length,
    results,
  };
}
