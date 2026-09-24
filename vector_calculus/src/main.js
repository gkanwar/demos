import './style.css';
import modules from './exercises/index.js';
import { createRandom, grade, newSeed } from './exercise.js';
import { getProgress, recordAttempt } from './progress.js';
import { renderBlocks, renderInline } from './render.js';

const app = document.getElementById('app');
let dispose = () => {};

function addText(parent, tag, content, className) {
  const element = document.createElement(tag);
  element.textContent = content;
  if (className) element.className = className;
  parent.append(element);
  return element;
}

function menuLink(parent) {
  const link = document.createElement('a');
  link.href = '#/';
  link.textContent = 'All exercises';
  parent.append(link);
}

function renderMenu() {
  const progress = getProgress();
  const main = document.createElement('main');
  main.className = 'page menu';
  addText(main, 'h1', 'Vector calculus exercises');
  addText(main, 'p', 'Choose an exercise and check your answers at your own pace.');

  for (const module of modules) {
    const section = document.createElement('section');
    addText(section, 'h2', module.title);
    addText(section, 'p', module.description, 'module-description');
    const list = document.createElement('ul');
    list.className = 'exercise-list';

    for (const exercise of module.exercises) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#/exercise/' + module.id + '/' + exercise.id +
        '?seed=' + newSeed();
      link.textContent = exercise.title;
      item.append(link);

      const summary = progress[module.id + '/' + exercise.id];
      if (summary) {
        const status = summary.completed ? 'Completed' : 'In progress';
        addText(item, 'span', status + ' · Best ' +
          summary.best.correct + '/' + summary.best.total + ' · ' +
          summary.attempts + ' attempt' +
          (summary.attempts === 1 ? '' : 's'), 'progress-summary');
      } else {
        addText(item, 'span', 'Not attempted', 'progress-summary');
      }
      list.append(item);
    }
    section.append(list);
    main.append(section);
  }
  app.append(main);
}

function renderNotFound() {
  const main = document.createElement('main');
  main.className = 'page';
  addText(main, 'h1', 'Exercise not found');
  menuLink(main);
  app.append(main);
}

function renderExercise(moduleId, exerciseId, query) {
  const module = modules.find((entry) => entry.id === moduleId);
  const exercise = module?.exercises.find((entry) => entry.id === exerciseId);
  if (!exercise) {
    renderNotFound();
    return;
  }

  const seedText = new URLSearchParams(query).get('seed');
  const seed = Number(seedText);
  if (seedText === null || !/^\d+$/.test(seedText) ||
      !Number.isInteger(seed) || seed > 0xffffffff) {
    location.replace('#/exercise/' + moduleId + '/' + exerciseId +
      '?seed=' + newSeed());
    return;
  }

  const instance = exercise.generate({ random: createRandom(seed) });
  const cleanups = [];
  const main = document.createElement('main');
  main.className = 'page exercise';
  menuLink(main);
  addText(main, 'p', module.title, 'module-name');
  addText(main, 'h1', exercise.title);

  const statement = document.createElement('section');
  statement.className = 'statement';
  cleanups.push(renderBlocks(instance.statement, statement));
  main.append(statement);

  const form = document.createElement('form');
  const views = instance.questions.map((question, index) => {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'question';
    addText(fieldset, 'legend', 'Question ' + (index + 1));

    const prompt = document.createElement('div');
    prompt.className = 'question-prompt';
    cleanups.push(renderBlocks(question.prompt, prompt));
    fieldset.append(prompt);

    const options = question.options.map((option) => {
      const label = document.createElement('label');
      label.className = 'option';
      const input = document.createElement('input');
      input.type = question.selection === 'single' ? 'radio' : 'checkbox';
      input.name = 'question-' + index;
      input.value = option.id;
      label.append(input);
      const content = document.createElement('span');
      renderInline(option.content, content);
      label.append(content);
      fieldset.append(label);
      return { option, input, label };
    });

    const feedback = addText(fieldset, 'div', '', 'feedback');
    form.append(fieldset);
    return { question, fieldset, options, feedback };
  });

  const result = addText(form, 'p', '', 'score');
  result.setAttribute('aria-live', 'polite');
  const actions = document.createElement('div');
  actions.className = 'actions';
  const checkButton = addText(actions, 'button', 'Check answers');
  checkButton.type = 'submit';
  const retry = document.createElement('a');
  retry.href = '#/exercise/' + moduleId + '/' + exerciseId +
    '?seed=' + newSeed(seed);
  retry.textContent = 'Try again';
  retry.hidden = true;
  const overview = addText(actions, 'button', 'Back to exercises overview',
    'success-button');
  overview.type = 'button';
  overview.hidden = true;
  overview.addEventListener('click', () => {
    location.hash = '#/';
  });
  actions.append(retry);
  form.append(result, actions);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (checkButton.disabled) return;

    const selections = Object.fromEntries(views.map((view) => [
      view.question.id,
      view.options.filter(({ input }) => input.checked)
        .map(({ option }) => option.id),
    ]));
    const score = grade(instance.questions, selections);
    const saved = recordAttempt(moduleId + '/' + exerciseId, {
      correct: score.correct,
      total: score.total,
    });
    result.textContent = 'Score: ' + score.correct + '/' + score.total +
      (saved ? '' : ' · Progress will not be saved.');
    const complete = score.correct === score.total;

    for (const [index, view] of views.entries()) {
      const passed = score.results[index].correct;
      view.fieldset.classList.add(passed ? 'correct' : 'incorrect');
      view.feedback.textContent = passed ? 'Correct.' : 'Incorrect. Try again.';
      for (const { option, input, label } of view.options) {
        input.disabled = true;
        if (complete && view.question.correctOptionIds.includes(option.id)) {
          label.classList.add('correct-answer');
        }
      }
      if (complete && view.question.explanation) {
        cleanups.push(renderBlocks(view.question.explanation, view.feedback));
      }
    }
    checkButton.disabled = true;
    checkButton.hidden = true;
    retry.hidden = false;
    overview.hidden = !complete;
  });

  main.append(form);
  app.append(main);
  dispose = () => cleanups.forEach((cleanup) => cleanup());
}

function render() {
  dispose();
  dispose = () => {};
  app.replaceChildren();

  if (!location.hash) {
    location.hash = '#/';
    return;
  }
  const [path, query = ''] = location.hash.slice(1).split('?');
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 0) {
    renderMenu();
  } else if (parts[0] === 'exercise' && parts.length === 3) {
    renderExercise(parts[1], parts[2], query);
  } else {
    renderNotFound();
  }
}

window.addEventListener('hashchange', render);
render();
