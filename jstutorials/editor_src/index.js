// I am so sorry that you're reading my code

import store from './store.js';
import { fetchExercise } from './actions.js';
import './view.js';
import './splitHandler.js';
import './coinsHandler.js';
import { html, js } from './codeEditor.js';
import { runCode } from './codeRunner.js';

store.dispatch(fetchExercise('/static/mock_data/exercise_canvas.yml'));

let timer;

const handleChange = () => {
  clearTimeout(timer);
  timer = setTimeout(() => runCode(), 1000);
};

js.on('change', handleChange);
html.on('change', handleChange);
