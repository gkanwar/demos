# Vector calculus exercises
This sub-project contains a client-only web app that provides an interactive set
of exercises for students to work through at their own pace. These exercises are
purely formative. They should be solved and checked by students directly and
there is no need for secrecy or anti-cheating measures.

The project is split into two pieces:

 1. A set of curated exercises, either static or in some cases with dynamically
   generated content/answers.

 2. A simple Javascript web app that can load exercise modules and allow
   students to interactively work through them.


## Exercise format
To support some problems with dynamically generated content (such as randomly
choosing coefficients or mixing various structural parts of a problem together),
exercises should be implemented as a set of Javascript functions contained in a
few modules. The exact calling convention and return format is to be designed.

Exercises always have multiple-choice answers with either a single selection or
a checkbox selection. Exercise data should provide the correct answer in each
case.

The problem statements may include widgets such as 2D/3D visualizations of
vector and scalar fields, formatted equations, etc. The exercise format should
be designed to support outputing such objects in a way that the frontend
understands.

## Frontend interface
The student interface should initially be kept quite simple and clean. No need
for excessive menu bars, headers, or footers. Just a simple initial menu to
select from the list of exercises across all available modules, which tracks
exercise completion or attempts using local browser storage.

Clicking into an exercise should bring up a clean display page showing the
problem statement, including any relevant widgets, and a list of multiple choice
questions to answer in reference to the statement. Marks should be binary for
each multiple-choice question, and the total marks for a given exercise are just
the number of correct answers `m` out of the number possible `n`.

## Running locally

From this directory, run `npm install` and `npm run dev`, then open the URL
printed by Vite. Use `npm test` for the exercise logic checks and `npm run build`
to create a static site in `dist/`.

Plots support rotation or pan, zoom, hover, and reset controls. Open
`#/plots` after the local URL for a developer preview of all widget types.
See [the design document](docs/design.md) for the authoring interface.
