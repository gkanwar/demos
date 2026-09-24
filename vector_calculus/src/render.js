import katex from 'katex';
import 'katex/dist/katex.min.css';
import { renderWidget } from './widgets.js';

export function renderInline(parts, host) {
  for (const part of parts) {
    if (part.type === 'text') {
      host.append(document.createTextNode(part.value));
    } else if (part.type === 'math') {
      const span = document.createElement('span');
      katex.render(part.tex, span, { throwOnError: false });
      host.append(span);
    }
  }
}

export function renderBlocks(blocks, host) {
  const cleanups = [];
  for (const block of blocks) {
    if (block.type === 'paragraph') {
      const paragraph = document.createElement('p');
      renderInline(block.content, paragraph);
      host.append(paragraph);
    } else if (block.type === 'equation') {
      const equation = document.createElement('div');
      equation.className = 'equation';
      katex.render(block.tex, equation, {
        displayMode: true,
        throwOnError: false,
      });
      host.append(equation);
    } else if (block.type === 'widget') {
      cleanups.push(renderWidget(block, host));
    }
  }
  return () => cleanups.forEach((cleanup) => cleanup());
}
