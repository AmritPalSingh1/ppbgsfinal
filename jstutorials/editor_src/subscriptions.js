/* global $ */

import { once } from 'ramda';
import store from './redux/store.js';
import render from './view.js';
import { html, js } from './codeEditor.js';
import { runCode } from './codeRunner.js';

// -- On exercise fetch setup ---------------------------------------

const OnDataFetched = once((htmlCode, jsCode, htmlReadOnly, jsReadOnly) => {
  // get options from localstore
  const indentUnit = localStorage.getItem('indentUnit');
  const keymap = localStorage.getItem('keyMap').toLowerCase();
  // if the current exercise is the same as the last one visited,
  // get the html and js code saved in localstorage
  if ($('#task-id').html() === localStorage.getItem('for-task')) {
    htmlCode = localStorage.getItem('htmlCode') || htmlCode;
    jsCode = localStorage.getItem('jsCode') || jsCode;
  }
  // set the current task
  localStorage.setItem('for-task', $('#task-id').html());
  // populate code editor on data fetch
  html.setValue(htmlCode);
  js.setValue(jsCode);
  // set editor options
  html.setOption('readOnly', htmlReadOnly);
  js.setOption('readOnly', jsReadOnly);
  html.setOption('indentUnit', indentUnit || 2);
  js.setOption('indentUnit', indentUnit || 2);
  html.setOption('keyMap', keymap || 'default');
  js.setOption('keyMap', keymap || 'default');
  // show task details
  $('#taskDetailsModal').modal('show');
  // run the exercise
  runCode();
});

const unsubscribeFromDataFetch = store.subscribe(() => {
  const { exercise, dataFetched } = store.getState();
  const { html: htmlCode, js: jsCode, htmlReadOnly, jsReadOnly } = exercise;

  if (dataFetched) {
    OnDataFetched(htmlCode, jsCode, htmlReadOnly, jsReadOnly);
    unsubscribeFromDataFetch();
  }
});

// -- Localstorage --------------------------------------------------

store.subscribe(() => {
  const { dataFetched, userHtml, userJs } = store.getState();

  if (dataFetched) {
    localStorage.setItem('htmlCode', userHtml);
    localStorage.setItem('jsCode', userJs);
  }
});

// -- Render page on state change -----------------------------------

store.subscribe(render);
