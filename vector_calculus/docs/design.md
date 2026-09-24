# Vector calculus exercise app design

## Purpose and constraints

This subproject is a client-only, formative practice app. Students choose an
exercise, answer its multiple-choice questions, check their work, and retry as
often as they like. Answers live in the downloaded exercise modules; there is no
server, account, grade submission, or anti-cheating mechanism.

The first version should stay small: vanilla JavaScript, a single menu view and
exercise view, and no UI framework or router package. Vite builds the app and
bundles its dependencies into a static site. Use a relative Vite `base: './'` so
the built site can be hosted under a subdirectory. The project uses ES modules
and a local `package-lock.json`; Node.js 22.12 or newer is the development
baseline. `package.json` provides `dev`, `build`, `preview`, and `test` scripts,
with Vite as a development dependency and `katex` and `plotly.js-dist` as
runtime dependencies. Runtime exercise content does not require a network
connection.

## Source layout and data flow

| Location | Responsibility |
| --- | --- |
| `index.html`, `src/style.css` | App mount point and restrained, responsive layout. |
| `package.json`, `vite.config.js` | Dependencies, scripts, and relative static build path. |
| `src/main.js` | Hash navigation, menu and exercise views, answer controls, and submission flow. |
| `src/exercises/index.js`, `src/exercises/<topic>.js` | Explicit catalog of curated modules and their exercise generators. |
| `src/exercise.js` | Seeded random number generator and pure answer grading. |
| `src/render.js`, `src/widgets.js` | Structured content rendering, KaTeX, and widget registration/cleanup. |
| `src/progress.js` | Read and update local progress summaries. |

The catalog imports each topic module and exposes its metadata to the menu. On
opening an exercise, `main.js` resolves its definition, creates a random
function from the URL seed, calls `generate`, and passes the returned blocks to
the renderer. The app keeps current selections and the checked result in memory.
Submitting grades the generated instance and updates progress. Returning to the
menu reads the updated summary.

## Exercise authoring contract

An exercise module exports one object:

```js
export default {
  id: 'vector-fields',             // stable, unique module slug
  title: 'Vector fields',
  description: 'Fields and their derivatives',
  exercises: [
    {
      id: 'divergence',             // stable within this module
      title: 'Divergence',
      generate: ({ random }) => ({
        statement: [/* Block */],
        questions: [/* Question */],
      }),
    },
  ],
};
```

`generate({ random })` returns a new exercise instance. It may use `random()`,
which yields a deterministic number in `[0, 1)`, to choose coefficients,
structure, and option order. It must not use `Math.random()`, current time, or
mutable module state; the same seed must produce the same instance. A static
exercise uses the same function and ignores `random`. Each instance has at least
one question. Module and exercise IDs form the progress key and URL; keep them
stable across wording edits. Give substantively new exercises new IDs.

The content vocabulary is deliberately small:

```js
// Inline content: { type: 'text', value: '...' } or { type: 'math', tex: '...' }
// Blocks:
{ type: 'paragraph', content: [/* Inline content */] }
{ type: 'equation', tex: String }
{ type: 'widget', widget: String, data: Object,
  caption: String, description: String }

// Question:
{
  id: String,                        // unique within this instance
  prompt: [/* Block */],
  selection: 'single' | 'multiple',
  options: [
    { id: String, content: [/* Inline content */] },
  ],
  correctOptionIds: [String],
  explanation: [/* Block */],        // optional; shown after checking
}
```

Option IDs are unique within a question and remain attached to their meanings
if an author shuffles the options. `correctOptionIds` has exactly one ID for a
single-selection question and one or more for a checkbox question. The renderer
uses DOM text nodes for text and KaTeX for math; content does not contain raw
HTML. Authors can place blocks in statements and prompts, while options use
inline content only.

For example, a static definition can return the same instance every time:

```js
const constantField = {
  id: 'constant-field',
  title: 'A constant field',
  generate: () => ({
    statement: [{
      type: 'paragraph',
      content: [
        { type: 'text', value: 'Consider ' },
        { type: 'math', tex: '\\mathbf F(x,y)=(2,3)' },
        { type: 'text', value: '.' },
      ],
    }],
    questions: [{
      id: 'divergence',
      prompt: [{ type: 'paragraph', content: [
        { type: 'text', value: 'What is its divergence?' },
      ] }],
      selection: 'single',
      options: [
        { id: 'zero', content: [{ type: 'text', value: '0' }] },
        { id: 'five', content: [{ type: 'text', value: '5' }] },
      ],
      correctOptionIds: ['zero'],
    }],
  }),
};
```

A generated definition uses only the supplied random source. The option IDs
stay meaningful even as the coefficients change:

```js
const generatedDivergence = {
  id: 'linear-divergence',
  title: 'Divergence of a linear field',
  generate: ({ random }) => {
    const a = 1 + Math.floor(4 * random());
    const b = 5 + Math.floor(4 * random());
    return {
      statement: [{ type: 'equation', tex: `\\mathbf F(x,y)=(${a}x,${b}y)` }],
      questions: [{
        id: 'value',
        prompt: [{ type: 'paragraph', content: [
          { type: 'text', value: 'What is the divergence?' },
        ] }],
        selection: 'single',
        options: [
          { id: 'sum', content: [{ type: 'text', value: String(a + b) }] },
          { id: 'a', content: [{ type: 'text', value: String(a) }] },
          { id: 'b', content: [{ type: 'text', value: String(b) }] },
        ],
        correctOptionIds: ['sum'],
      }],
    };
  },
};
```

## Equations and visualization widgets

Use KaTeX for inline and display equations. Use Plotly.js v4 for the four
built-in sampled-field widgets below. Exercise modules provide mathematical
samples, not Plotly traces, so the authoring contract stays independent of the
plotting library. `src/widgets.js` converts the samples to Plotly traces and
loads Plotly only when a plot is present.

| `widget` | `data` fields | Plotly view |
| --- | --- | --- |
| `vector2d` | Equal-length `x`, `y`, `u`, `v` arrays | Quiver arrows |
| `scalar2d` | `x`, `y` coordinate arrays and `values` matrix (rows follow `y`, columns follow `x`) | Contours |
| `vector3d` | Equal-length `x`, `y`, `z`, `u`, `v`, `w` arrays | Cones |
| `scalar3d` | Equal-length flattened `x`, `y`, `z`, `values` arrays, plus `isomin`, `isomax` | Isosurfaces |

Widgets default to axis labels `x`, `y`, and `z`; `data.axisLabels` may replace
them with an object containing the corresponding labels. The renderer uses a
responsive plot container, enables ordinary pan/zoom or 3D rotation, and calls
`Plotly.purge` when leaving the exercise. Every widget block has a visible
caption and a text description conveying the information needed to answer its
questions. If a 3D plot cannot load, keep that description visible.

The widget registry maps a `widget` name to an async renderer of the form
`render(element, data) -> Promise<cleanup>`. The renderer owns its DOM inside
`element` and returns a cleanup function for navigation away from the
exercise. A render that finishes after navigation must be cleaned up rather
than attached to the next view. New interactive widgets register another
renderer without changing exercise or question shapes.

## Navigation, checking, and progress

The menu at `#/` lists exercises grouped by module. Each row shows its title,
best score, attempt count, and whether it has ever been completed. It has no
extra dashboard or account flow. Opening a row navigates to
`#/exercise/<moduleId>/<exerciseId>?seed=<uint32>`. The browser's hash history
supports back and forward navigation on a static host. A missing or invalid
seed is replaced with a newly generated 32-bit unsigned integer from
`crypto.getRandomValues`; an unknown exercise shows a short not-found message
and menu link.

`src/exercise.js` uses Mulberry32 to derive `random()` from the seed. Reloading
or sharing the URL reproduces the same variant for a given version of the
exercise module. Opening an exercise from the menu starts a new variant. The
**Try again** button also generates a new seed and route. A static exercise
simply returns the same content for each seed. Unsubmitted selections are not
saved.

Each question renders native radio buttons or checkboxes with a fieldset,
legend, and explicit labels. Score feedback uses an `aria-live` region.
**Check answers** submits all questions at once.
For each question, grading compares the selected ID set with the correct ID set;
an exact match earns one mark and any other selection, including no selection,
earns zero. The result is `m/n`, where `n` is the number of questions in that
instance. Checking highlights each question's result, shows its correct
selection and optional explanation, and locks its controls. Each check records
one attempt. Retrying is the way to answer again after feedback.

The only durable student data is one local-storage object under
`vector-calculus-progress-v1`, keyed by `<moduleId>/<exerciseId>`:

```json
{
  "vector-fields/divergence": {
    "attempts": 3,
    "latest": { "correct": 1, "total": 2 },
    "best": { "correct": 2, "total": 2 },
    "completed": true
  }
}
```

`best` is the highest fraction `correct/total`; ties keep the earlier score.
`completed` becomes true after any full-score submission and stays true. This
works even if generated variants have different question counts. If browser
storage is unavailable, checking still works and the app keeps progress for
the current page session, with a brief notice that it will not be saved. An
unreadable or incompatible stored value is treated as empty progress; no
migration is needed for the first version.

## Implementation and verification

Build the catalog and one static plus one generated example first, then the
menu/exercise views, grading and storage, and finally the renderers. Keep
grading and seeded generation pure enough to test with Node's built-in test
runner. Verify these behaviors before adding more curated content:

- A fixed seed reproduces the same statement, options, and answers; a new seed
  can produce a different variant.
- Single and checkbox questions award one mark only for an exact selection set;
  an unanswered question earns zero.
- Checking once records one attempt; a full score marks completion; later lower
  scores do not erase completion or the best score.
- Progress survives reload, while an invalid or unavailable storage value does
  not prevent answering.
- Hash links open the intended variant, browser back/forward works, and retry
  changes the seed.
- Equations and all four widget types render on desktop and narrow screens;
  keyboard controls, descriptions, and plot cleanup work when navigating.

Reference documentation: [Vite static deployment](https://vite.dev/guide/static-deploy),
[KaTeX API](https://katex.org/docs/api), and Plotly's
[quiver](https://plotly.com/javascript/quiver-plots/),
[contour](https://plotly.com/javascript/contour-plots/),
[cone](https://plotly.com/javascript/reference/cone/), and
[isosurface](https://plotly.com/javascript/3d-isosurface-plots/) guides.
