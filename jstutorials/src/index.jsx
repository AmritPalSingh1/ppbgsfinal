/** @jsx h */
/* global hyperapp */

import App from './components/App.jsx';

const { h, app } = hyperapp;

const state = {
  task: '',
  htmlCode: '',
  jsCode: '',
  secret: '',
  codeChecks: {
    setup: '',
    run: '',
    cleanup: '',
    has: [],
    hasNot: [],
    maxLines: 500,
  },
};

const actions = {
  fetch: route => {},
};

const view = (state, actions) =>
  <App state={state} actions={actions} />

app(state, actions, view, document.querySelector('#root'));
