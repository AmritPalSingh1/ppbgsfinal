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
const html = CodeMirror($('#html-editor')[0], {
  ...sharedConfig,
  mode: 'htmlmixed',
  autoCloseTags: true,
  lint: true,
});

const js = CodeMirror($('#js-editor')[0], {
  ...sharedConfig,
  mode: 'javascript',
  lint: {
    esversion: 6,
  },
});

const run = () => runCode({ html, js });

js.on('change', run);
html.on('change', run);

const submit = errorThreshold => {
  const { errorCount } = getState();

  const submitData = {
    errorCount,
    grade: Math.max(errorThreshold - errorCount, 0) / errorThreshold,
    usedHint: localStorage.getItem('usedHint') === 'true',
  };

  console.log(submitData);
};

fetch('/static/mock_data/exercise_canvas.yml')
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    setState({ secret: data.secret, codeChecks: data.test });

    $('#submit-button').click(submit);

    // insert data to the page
    $('#task-placeholder').html(data.task);
    $('#hint-body').html(data.hint);
    html.setValue(data.html);
    js.setValue(data.js);

    runCode({ html, js });
  });
