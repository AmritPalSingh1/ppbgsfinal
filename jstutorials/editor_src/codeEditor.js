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

fetch('/static/mock_data/exercise_canvas.yml')
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    setState({ secret: data.secret, codeChecks: data.test });

    $('#submit-button').click(() => {
      const { errorCount } = getState();
      const threshold = data.test.errorThreshold;
      const submitData = {
        errorCount,
        grade: Math.max((threshold - errorCount), 0) / threshold,
        usedHint: localStorage.getItem('usedHint') === 'true',
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
