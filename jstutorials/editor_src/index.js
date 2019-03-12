/* global $ */

// I am so sorry that you're reading my code

import store from './store.js';
import { fetchExercise } from './actions.js';
import './view.js';
import './splitHandler.js';
import './coinsHandler.js';
import './codeEditor.js';

store.dispatch(fetchExercise('/static/mock_data/exercise_canvas.yml'));
