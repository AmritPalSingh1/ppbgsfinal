/* global $ */

import { once } from 'ramda';
import store from './store.js';
import render from './view.js';
import { html, js } from './codeEditor.js';
import { runCode } from './codeRunner.js';

// -- On exercise fetch setup ---------------------------------------

const OnDataFetched = once((htmlCode, jsCode, htmlReadOnly, jsReadOnly) => {
  // "race condition" here:
  // have to get the values from localStore if they exist before setting editor values
  // otherwise, the editors get their default value
  // I don't know why. I don't think this code is asynchronous...
  // just one of those things...
  const realHtmlCode = localStorage.getItem('htmlCode') || htmlCode;
  const realJsCode = localStorage.getItem('jsCode') || jsCode;
  // populate code editor on data fetch and set options
  html.setValue(realHtmlCode);
  js.setValue(realJsCode);
  html.setOption('readOnly', htmlReadOnly);
  js.setOption('readOnly', jsReadOnly);
  // show task details
  $('#taskDetailsModal').modal('show');
  // run the exercise
  runCode();
});

const unsubscribeFromDataFetch = store.subscribe(() => {
  const { exercise, dataFetched, htmlReadOnly, jsReadOnly } = store.getState();

  if (dataFetched) {
    OnDataFetched(exercise.html, exercise.js, htmlReadOnly, jsReadOnly);
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
