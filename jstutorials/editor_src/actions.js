import jsyaml from 'js-yaml';

export const fetchExercise = endpoint => dispatch =>
  fetch(endpoint)
    .then(data => data.text())
    .then(jsyaml.load)
    .then(data => dispatch({ type: 'fetch-success', data }));

export const incError = () => ({ type: 'inc-error' });

export const resetError = () => ({ type: 'reset-error' });

export const noOp = () => ({ type: 'no-op' });
