/* global $ */

// I am so sorry that you're reading my code

import store from './store.js';
import { fetchExercise, setCoins, setHtmlCode, setJsCode,setCsrfToken } from './actions.js';
import './modals.js';
import './splitHandler.js';
import './view.js';
import { html, js } from './codeEditor.js';
import { runCode } from './codeRunner.js';

// -- Onload dispatch -----------------------------------------------

store.dispatch(setCsrfToken($('[name=csrfmiddlewaretoken]').val()));
store.dispatch(setCoins($('#coins').html()));
store.dispatch(fetchExercise('/static/exercises/array_frame.yaml'));

// -- Handle code change --------------------------------------------

let timer;

const handleChange = () => {
  clearTimeout(timer);
  timer = setTimeout(runCode, 1000);
};

js.on('change', cm => {
  store.dispatch(setJsCode(cm.getValue()));
  handleChange();
});

html.on('change', cm => {
  store.dispatch(setHtmlCode(cm.getValue()));
  handleChange();
});

// -- Submit code ---------------------------------------------------

$('#submit-results-button').click(() => {
  const { errorCount, exercise } = store.getState();
  const threshold = exercise.test.errorThreshold;

  const submitData = {
    errorCount,
    grade: Math.max(threshold - errorCount, 0) / threshold,
  };

  // eslint-disable-next-line no-console
  console.log(submitData);
});
