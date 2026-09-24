const renderers = new Map();

export function registerWidget(name, renderer) {
  renderers.set(name, renderer);
}

function renderDebug(element, data, widget) {
  const summary = document.createElement('pre');
  summary.textContent = JSON.stringify({ widget, data }, null, 2);
  element.append(summary);
  return () => {};
}

registerWidget('vector3d', renderDebug);
registerWidget('cube-faces', renderDebug);

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
