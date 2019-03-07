/* global $, CodeMirror, jsyaml */

import './splitHandler.js';
import { runCode, setState, getState } from './codeRunner.js';

if (localStorage.getItem('usedHint') == null) {
  localStorage.setItem('usedHint', false);
}

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

fetch(`/static/mock_data/user.json`)
  .then(data => data.json())
  .then(data => {
    const updateCoinCount = () => {
      const usedHint = localStorage.getItem('usedHint') === 'true';
      $('#coin-count-container').html(
        `<i class="fas fa-coins"></i> ${data.coins - usedHint} Coins`,
      );
    };

    updateCoinCount();

    $('#use-hint-button').click(() => {
      $('#hintModal').modal('show');
      localStorage.setItem('usedHint', true);
      updateCoinCount();
    });
  });

$('#ask-for-hint-button').click(() => {
  const usedHint = localStorage.getItem('usedHint') === 'true';
  $(usedHint ? '#hintModal' : '#hintPrompt').modal('show');
});

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
