/* global $, CodeMirror */

import jsyaml from 'js-yaml';
import {
  runCode,
  setState as setRunnerState,
  getState as getRunnerState,
} from './codeRunner.js';

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

let timer;

const handleChange = () => {
  clearTimeout(timer);
  timer = setTimeout(() => runCode({ html, js }), 1000);
};

js.on('change', handleChange);
html.on('change', handleChange);

const submitCode = () => {
  const { errorCount, codeChecks } = getRunnerState();
  const threshold = codeChecks.errorThreshold;

  const submitData = {
    errorCount,
    grade: Math.max(threshold - errorCount, 0) / threshold,
  };

  console.log(submitData);
};

fetch('/static/mock_data/exercise_canvas.yml')
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    setRunnerState({ secret: data.secret, codeChecks: data.test });

    $('#submit-button').click(submitCode);

    // insert data to the page
    $('#task-placeholder').html(data.task);
    html.setValue(data.html);
    js.setValue(data.js);

    runCode({ html, js });
  });
