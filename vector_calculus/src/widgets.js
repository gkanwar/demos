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
  let currentValue = data.control?.initial;
  let input;
  let onInput;
  if (data.control) {
    const control = document.createElement('div');
    control.className = 'widget-control';
    const label = document.createElement('label');
    label.textContent = 'Move ' + data.control.symbol + ' (schematic)';
    input = document.createElement('input');
    input.type = 'range';
    input.min = String(data.control.min);
    input.max = String(data.control.max);
    input.step = String(data.control.step);
    input.value = String(currentValue);
    const output = document.createElement('output');
    output.textContent = currentValue + ' drawing units';
    label.append(input);
    control.append(label, output);
    element.append(control);
    onInput = () => {
      currentValue = Number(input.value);
      output.textContent = currentValue + ' drawing units';
      requested++;
      refresh();
    };
    input.addEventListener('input', onInput);
  }

  const plot = document.createElement('div');
  plot.className = 'widget-plot';
  plot.textContent = 'Loading plot…';
  element.append(plot);

  let disposed = false;
  let library;
  let plotted = false;
  let failed = false;
  let requested = 0;
  let rendered = 0;
  let updating = false;
  const config = {
    displayModeBar: true,
    displaylogo: false,
    responsive: true,
    scrollZoom: false,
  };
  const unavailable = () => {
    if (disposed || failed) return;
    failed = true;
    if (input) input.disabled = true;
    if (library) library.purge(plot);
    plot.replaceChildren();
    const notice = document.createElement('p');
    notice.textContent = 'Interactive plot unavailable; showing its data.';
    plot.append(notice);
    renderDebug(plot, data, widget);
  };
  const refresh = async () => {
    if (!plotted || updating || failed || disposed) return;
    updating = true;
    try {
      while (!disposed && rendered !== requested) {
        const version = requested;
        const figure = plotFigure(widget, data, currentValue);
        await library.react(plot, figure.traces, figure.layout, config);
        rendered = version;
      }
    } catch {
      unavailable();
    } finally {
      updating = false;
    }
  };
  loadPlotly().then(async (plotly) => {
    if (disposed) return;
    library = plotly;
    const version = requested;
    const figure = plotFigure(widget, data, currentValue);
    plot.replaceChildren();
    await plotly.newPlot(plot, figure.traces, figure.layout, config);
    plotted = true;
    rendered = version;
    if (disposed) plotly.purge(plot);
    else refresh();
  }).catch(unavailable);

  return () => {
    disposed = true;
    if (input) input.removeEventListener('input', onInput);
    if (plotted) library.purge(plot);
  };
}

for (const name of [
  'vector2d', 'scalar2d', 'vector3d', 'scalar3d', 'geometry3d',
  'diagram1d', 'diagram2d', 'diagram3d',
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
