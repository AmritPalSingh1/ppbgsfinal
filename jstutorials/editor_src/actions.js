import jsyaml from 'js-yaml';
import store from './store.js';

export const fetchExercise = endpoint => dispatch =>
  fetch(endpoint)
    .then(data => data.text())
    .then(jsyaml.load)
    .then(data => dispatch({ type: 'fetch-success', data }));

export const buyHint = hintCost => dispatch => {
  const state = store.getState();
  return Promise.resolve({
    coins: state.coins - hintCost,
    hintsUsed: state.hintsUsed + 1,
  }).then(data => dispatch({ type: 'hint-purchase-success', data }));
};

export const logToConsole = data => ({ type: 'log-to-console', data });

export const clearConsole = () => ({ type: 'clear-console' });

export const incError = () => ({ type: 'inc-error' });

export const resetError = () => ({ type: 'reset-error' });

export const setHints = hintsUsed => ({ type: 'set-hints-used', hintsUsed });

export const setPage = page => ({ type: 'set-hint-page', page });

export const setCoins = coinCount => ({ type: 'set-coin-count', coinCount });

export const noOp = () => ({ type: 'no-op' });
