/* global $ */

import { curry } from 'ramda';
import store from './redux/store.js';
import {
  fetchExercise,
  setCoins,
  setHintsUsed,
  setHtmlCode,
  setJsCode,
} from './redux/actions.js';
import './splitHandler.js';
import './modals.js';
import './subscriptions.js';
import { html, js } from './codeEditor.js';
import { runCode } from './codeRunner.js';

// -- Onload dispatch -----------------------------------------------

store.dispatch(setCoins($('#coins').html()));
store.dispatch(setHintsUsed($('#hints-used').html()));
store.dispatch(fetchExercise($('#task-data').html()));

// -- Handle code change --------------------------------------------

let timer;

const handleChange = curry((action, cm) => {
  store.dispatch(action(cm.getValue()));
  clearTimeout(timer);
  timer = setTimeout(runCode, 1000);
});

js.on('change', handleChange(setJsCode));
html.on('change', handleChange(setHtmlCode));

// -- Submit code ---------------------------------------------------

$('#submit-results-button').click(() => {
  const { errorCount, exercise } = store.getState();
  const threshold = exercise.test.errorThreshold;

  $('#form_topic_name').val($('#topic-name').html());
  $('#form_challenge').val($('#task-id').html());
  $('#form_grade').val(Math.max(threshold - errorCount, 0) / threshold);
  $('#form_submit').click();
});
