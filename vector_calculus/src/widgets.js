import { plotFigure } from './plot-data.js';

const renderers = new Map();
let plotlyPromise;

export function registerWidget(name, renderer) {
  renderers.set(name, renderer);
}

function renderDebug(element, data, widget) {
  const summary = document.createElement('pre');
  summary.textContent = JSON.stringify({ widget, data }, null, 2);
  element.append(summary);
  return () => {};
}

function loadPlotly() {
  if (!plotlyPromise) {
    plotlyPromise = import('plotly.js-dist')
      .then((module) => module.default || module)
      .catch((error) => {
        plotlyPromise = undefined;
        throw error;
      });
  }
  return plotlyPromise;
}

function renderPlot(element, data, widget) {
  const plot = document.createElement('div');
  plot.className = 'widget-plot';
  plot.textContent = 'Loading plot…';
  element.append(plot);

  let disposed = false;
  let library;
  let plotted = false;
  loadPlotly().then(async (plotly) => {
    if (disposed) return;
    library = plotly;
    const figure = plotFigure(widget, data);
    plot.replaceChildren();
    await plotly.newPlot(plot, figure.traces, figure.layout, {
      displayModeBar: true,
      displaylogo: false,
      responsive: true,
      scrollZoom: false,
    });
    plotted = true;
    if (disposed) plotly.purge(plot);
  }).catch(() => {
    if (library) library.purge(plot);
    if (disposed) return;
    plot.replaceChildren();
    const notice = document.createElement('p');
    notice.textContent = 'Interactive plot unavailable; showing its data.';
    plot.append(notice);
    renderDebug(plot, data, widget);
  });

  return () => {
    disposed = true;
    if (plotted) library.purge(plot);
  };
}

for (const name of [
  'vector2d', 'scalar2d', 'vector3d', 'scalar3d', 'geometry3d',
]) {
  registerWidget(name, renderPlot);
}

export function renderWidget(block, host) {
  const figure = document.createElement('figure');
  figure.className = 'widget';

  const caption = document.createElement('figcaption');
  caption.textContent = block.caption;
  figure.append(caption);

  const description = document.createElement('p');
  description.textContent = block.description;
  figure.append(description);

  const content = document.createElement('div');
  content.className = 'widget-content';
  figure.append(content);
  host.append(figure);

  return (renderers.get(block.widget) || renderDebug)(
    content, block.data, block.widget,
  );
}
