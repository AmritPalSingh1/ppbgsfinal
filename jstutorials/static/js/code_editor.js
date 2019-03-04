/* global $, CodeMirror, jsyaml */

import './splitHandler.js';
import { runCode, setState } from './codeRunner.js';

// create codemirror instances.
const editors = {
  html: CodeMirror($('#html-editor')[0], {
    lineNumbers: true,
    theme: 'neo',
    mode: 'htmlmixed',
    gutters: ['CodeMirror-lint-markers'],
    lint: true,
  }),
  js: CodeMirror($('#js-editor')[0], {
    lineNumbers: true,
    theme: 'neo',
    mode: 'javascript',
    gutters: ['CodeMirror-lint-markers'],
    lint: {
      esversion: 6,
    },
  }),
};

editors.js.on('change', () => runCode(editors));

const urlParams = new URLSearchParams(window.location.search);
fetch(`/static/mock_data/exercise${urlParams.get('task')}.yml`, {
  headers: {
    'Content-Type': 'text/plain',
  },
})
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    setState({ secret: data.secret, codeChecks: data.test });

    $('#submit-button').click(() => {
      // TODO
    });

    // insert task to the page
    $('#task-placeholder').html(data.task);

    // insert code to the editors
    editors.html.setValue(data.html);
    editors.js.setValue(data.js);

    runCode(editors);
  });

fetch(`/static/mock_data/user.json`)
  .then(data => data.json())
  .then(data => {
    $('#coin-count-container').html(`<i class="fas fa-coins"></i> ${data.coins} Coins`);
  });

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
