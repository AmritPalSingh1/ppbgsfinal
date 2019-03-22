/* global $, CodeMirror */

import store from './redux/store.js';

// -- Codemirror instances ------------------------------------------

const sharedConfig = {
  autoCloseBrackets: true,
  gutters: ['CodeMirror-lint-markers'],
  indentWithTabs: false,
  lineNumbers: true,
  scrollPastEnd: true,
  scrollbarStyle: 'simple',
  tabSize: 4,
  theme: 'neo',
  extraKeys: {
    Tab: 'insertSoftTab',
  },
};

export const html = CodeMirror($('#html-editor')[0], {
  ...sharedConfig,
  mode: 'htmlmixed',
  autoCloseTags: true,
  lint: true,
});

export const js = CodeMirror($('#js-editor')[0], {
  ...sharedConfig,
  mode: 'javascript',
  lint: {
    esversion: 6,
  },
});

// -- Settings ------------------------------------------------------

// reset to initial code
$('#reset-html-button').click(() =>
  html.setValue(store.getState().exercise.html),
);
$('#reset-js-button').click(() => js.setValue(store.getState().exercise.js));

// set indentation size
$('#indent-select').on('change', () => {
  const indentUnit = $('#indent-select option:selected').text();
  html.setOption('indentUnit', indentUnit);
  js.setOption('indentUnit', indentUnit);
  localStorage.setItem('indentUnit', indentUnit);
});

// change keymap
$('#keymap-select').on('change', () => {
  const keymap = $('#keymap-select option:selected').text();
  html.setOption('keyMap', keymap.toLowerCase());
  js.setOption('keyMap', keymap.toLowerCase());
  localStorage.setItem('keyMap', keymap);
});