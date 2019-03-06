/* global $, CodeMirror, jsyaml */

import './splitHandler.js';
import { runCode, setState } from './codeRunner.js';

const sharedConfig = {
  autoCloseBrackets: true,
  extraKeys: {
    Tab: 'insertSoftTab',
  },
  gutters: ['CodeMirror-lint-markers'],
  lineNumbers: true,
  scrollbarStyle: 'simple',
  scrollPastEnd: true,
  tabSize: 2,
  theme: 'neo',
};

// create codemirror instances.
const editors = {
  html: CodeMirror($('#html-editor')[0], {
    ...sharedConfig,
    mode: 'htmlmixed',
    autoCloseTags: true,
    lint: true,
  }),
  js: CodeMirror($('#js-editor')[0], {
    ...sharedConfig,
    mode: 'javascript',
    lint: {
      esversion: 6,
    },
  }),
};

editors.js.on('change', () => runCode(editors));

fetch($('#task-data').html(), {
  headers: {
    'Content-Type': 'text/plain',
  },
})
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    setState({ secret: data.secret, codeChecks: data.test });

    $('#submit-button').click(() => {});

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
    $('#coin-count-container').html(
      `<i class="fas fa-coins"></i> ${data.coins} Coins`,
    );
  });

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
