/* global $, CodeMirror, jsyaml, Split */
/* eslint-disable no-console */

const state = {
  // used to get query string parameters
  urlParams: new URLSearchParams(window.location.search),
  // secret javascript code not shown to the user
  secret: '',
  // a testing 'suite' ran against user code
  codeChecks: {
    setup: '', // run before user code
    run: '', // run after user code
    cleanup: '', // runs last
    has: [], // checks if code contains a pattern
    hasNot: [], // opposite of 'has'
    maxLines: 200, // max number of lines user should code
  },
  // when user submits code, test it
  // if any tests fail, set true
  codeFailedTests: false,
  // console pane visible state
  consoleShowned: false,
  // save split size between html view and console
  consoleSplitSize: [60, 40],
};

// references to page elements
const DOMElements = {
  iframe: $('iframe')[0],
  console: $('#console-output')[0],
};

// make editors and code output resizable
const splits = {
  left: Split(['#html-editor-parent', '#js-editor-parent'], {
    direction: 'vertical',
    sizes: [50, 50],
  }),
  right: Split(['#html-frame-view', '#console-area'], {
    direction: 'vertical',
    sizes: [100, 0],
    minSize: 0,
    onDrag() {
      state.consoleSplitSize = splits.right.getSizes();
    },
  }),
  cols: Split(['#editors', '#code-output'], {
    minSize: 200,
  }),
};

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

const log = x => {
  $(DOMElements.console).append(`<samp>${x}</samp><br />`);
  console.log(x);
};

const fail = x => {
  state.codeFailedTests = true;
  $(DOMElements.console).append(`<code>${x}</code><br />`);
  console.error(x);
};

// write code to the iframe
const writeToFrame = code => {
  const iframeDocument = DOMElements.iframe.contentWindow.document;

  iframeDocument.open();
  iframeDocument.write(code);
  iframeDocument.close();
};

const testCode = jsCode => {
  // test if code exceeds maxLines
  if (state.codeChecks.maxLines < jsCode.trim().split('\n').length) {
    fail(
      `You must complete this exercise with ${
        state.codeChecks.maxLines
      } lines of JavaScript or less.`,
    );
  }

  // test if code contains certain strings
  state.codeChecks.has.forEach(piece => {
    const re = new RegExp(piece.regex);

    if (!re.test(jsCode)) {
      fail(piece.message);
    }
  });

  // test if code does not contain certain strings
  state.codeChecks.hasNot.forEach(piece => {
    const re = new RegExp(piece.regex);

    if (re.test(jsCode)) {
      fail(piece.message);
    }
  });

  if (!state.codeFailedTests) {
    log('<span style="color: var(--green)">Yay! All tests passed!</span>');
  }
};

// run the user's code against some tests
const runCode = () => {
  state.codeFailedTests = false;

  $(DOMElements.console).empty();

  const htmlCode = editors.html.getValue();
  const jsCode = editors.js.getValue();

  writeToFrame(`
    ${htmlCode}
    <script>
      {
        const fail = window.parent.fail;
        try {
          console.log = window.parent.log;
          {
            ${state.secret}
          }
          {
            ${state.codeChecks.setup}
            {
              ${jsCode}
            }
            ${state.codeChecks.run}
            ${state.codeChecks.cleanup}
          }
        } catch (e) {
          fail(e.message);
        }
      }
    </script>`);

  testCode(jsCode);
};

editors.js.on("change", () => {
  runCode();
});

$('#toggle-console-button').click(() => {
  $(this).toggleClass('active');

  // if the console is visible, save the size and make hidden
  if (state.consoleShowned) {
    splits.right.setSizes([100, 0]);
  }
  // else, restore the previous size
  else {
    splits.right.setSizes(state.consoleSplitSize);
  }

  state.consoleShowned = !state.consoleShowned;
});

fetch(
  `../../static/code_exercises/ex${state.urlParams.get('task')}.yml`,
  {
    headers: {
      'Content-Type': 'text/plain',
    },
  },
)
  .then(data => data.text())
  .then(jsyaml.load)
  .then(data => {
    state.secret = data.secret;
    state.codeChecks = data.test;

    $('#submit-button').click(() => {
      state.consoleShowned = true;
      splits.right.setSizes(state.consoleSplitSize);
      runCode();
    });

    // test code when ctrl + enter is pressed down
    $(document).keydown(e => {
      if ((e.ctrlKey || e.metaKey) && (e.keyCode === 10 || e.keyCode === 13)) {
        runCode();
      }
    });

    // insert task to the page
    $('#task-placeholder').html(data.task);

    // insert code to the editors
    editors.html.setValue(data.html);
    editors.js.setValue(data.js);

    runCode();
  });

window.fail = fail;
window.log = log;
