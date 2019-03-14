/* global $ */

// I am so sorry that you're reading my code

import store from './store.js';
import { fetchExercise, setCoins } from './actions.js';
import './modals.js';
import './splitHandler.js';
import './view.js';
import { html, js } from './codeEditor.js';
import { runCode } from './codeRunner.js';

// -- Onload dispatch -----------------------------------------------

store.dispatch(fetchExercise('/static/mock_data/exercise_canvas.yml'));
store.dispatch(setCoins($('#coin-count-container').html()));

// -- Handle code change --------------------------------------------

let timer;

const handleChange = () => {
  clearTimeout(timer);
  timer = setTimeout(runCode, 1000);
};

js.on('change', handleChange);
html.on('change', handleChange);

// -- Submit code ---------------------------------------------------

$('#submit-button').click(() => {
  const { errorCount, exercise } = store.getState();
  const threshold = exercise.test.errorThreshold;

  const submitData = {
    errorCount,
    grade: Math.max(threshold - errorCount, 0) / threshold,
  };

  // eslint-disable-next-line no-console
  console.log(submitData);
});

fetch('/topics/topic/challenge_api', {
  method: 'POST',
  body: { topic_name: 'Intro to Html', ch_id: 3 },
}).then(console.log.bind(console));
