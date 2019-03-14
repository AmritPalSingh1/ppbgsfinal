import jsyaml from 'js-yaml';

export const fetchExercise = endpoint => dispatch =>
  fetch(endpoint)
    .then(data => data.text())
    .then(jsyaml.load)
    .then(data => dispatch({ type: 'fetch-success', data }));

export const logToConsole = data => ({ type: 'log-to-console', data });

export const clearConsole = () => ({ type: 'clear-console' });

export const incError = () => ({ type: 'inc-error' });

export const resetError = () => ({ type: 'reset-error' });

export const setHints = hintsUsed => ({ type: 'set-hints-used', hintsUsed });

export const setCoins = coinCount => ({ type: 'set-coin-count', coinCount });

export const noOp = () => ({ type: 'no-op' });
