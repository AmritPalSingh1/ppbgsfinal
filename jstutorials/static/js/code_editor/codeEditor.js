/* global $, CodeMirror, jsyaml */

import { runCode, setState, getState } from './codeRunner.js';

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

const exerciseFile = '/static/mock_data/exercise_canvas.yml';

fetch(exerciseFile, {
  headers: {
    'Content-Type': 'text/plain',
  },
})
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    setState({ secret: data.secret, codeChecks: data.test });

    $('#submit-button').click(() => {
      const { errorCount } = getState();
      const submitData = {
        errorCount,
        usedHint: localStorage.getItem('usedHint'),
      };

      console.log(submitData);
    });

    // insert data to the page
    $('#task-placeholder').html(data.task);
    $('#hint-body').html(data.hint);
    editors.html.setValue(data.html);
    editors.js.setValue(data.js);

    runCode(editors);
  });
