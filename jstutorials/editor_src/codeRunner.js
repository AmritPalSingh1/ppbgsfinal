/* global $, Babel */

import protect from 'loop-protect';
import store from './redux/store.js';
import { html, js } from './codeEditor.js';
import {
  logToConsole,
  clearConsole,
  incError,
  resetError,
} from './redux/actions.js';
import { tidyHtml, nl2br } from './utils.js';

// -- Console area --------------------------------------------------

const log = x => {
  // format the data nicely before printing
  const toLog = (() => {
    if (Array.isArray(x)) {
      return JSON.stringify(x);
    }

    if (typeof x === 'object') {
      return JSON.stringify(x, null, 2);
    }

    return x;
  })();

  store.dispatch(logToConsole(`<samp>${toLog}</samp><br />`));
};

const fail = x => {
  store.dispatch(incError());
  store.dispatch(
    logToConsole(`<code><i class="fas fa-times-circle"></i> ${x}</code><br />`),
  );
};

// expose fail and log so the iframe can use them
window.fail = fail;
window.log = log;

// -- Babel ---------------------------------------------------------

Babel.registerPlugin(
  'loopProtection',
  protect(200, line => {
    throw new Error(`Possible infinite loop on line ${line}`);
  }),
);

const transform = source =>
  Babel.transform(source, {
    plugins: ['loopProtection'],
  }).code;

// -- Test user code -------------------------------------------------

const testCode = jsCode => {
  const { test } = store.getState().exercise;

  // test if number of lines exceeds maxLines
  // fail if it does
  const lines = jsCode.trim().split('\n').length;
  if (test.maxLines < lines) {
    fail(
      `You must complete this exercise within ${
        test.maxLines
      } lines of JavaScript.
  (Your code has ${lines} lines)`,
    );
  }

  // fail if code does not contain certain strings
  test.has.forEach(piece => {
    const re = new RegExp(piece.regex, piece.flags || '');

    if (!re.test(jsCode)) {
      fail(piece.message);
    }
  });

  // fail if code contains certain strings
  test.hasNot.forEach(piece => {
    const re = new RegExp(piece.regex, piece.flags || '');

    if (re.test(jsCode)) {
      fail(piece.message);
    }
  });
};

// -- Run user code --------------------------------------------------

// write code to an iframe
const writeToFrame = (id, code) => {
  const iframeDocument = $(id)[0].contentWindow.document;

  iframeDocument.open();
  iframeDocument.write(code);
  iframeDocument.close();
};

// eslint-disable-next-line import/prefer-default-export
export const runCode = () => {
  store.dispatch(resetError());
  store.dispatch(clearConsole());

  const { exercise } = store.getState();
  const { secret, test } = exercise;

  const htmlCode = tidyHtml(html.getValue());
  const jsCode = (() => {
    let code = '';
    try {
      code = transform(js.getValue());
    } catch (e) {
      fail(nl2br(e.message));
    }
    return code;
  })();

  // code ran in the visible iframe
  const visibleScriptToRun = `
    {
      ${secret}
    }
    {
      ${jsCode}
    }`;

  // code ran in the hidden iframe
  const hiddenScriptToRun = `
    {
      ${secret}
    }
    {
      ${test.setup}
      {
        try {
          ${jsCode}
        } catch (e) {
          fail(e);
        }
      }
      ${test.run}
      ${test.cleanup}
    }`;

  writeToFrame(
    '#visible-iframe',
    `
    ${htmlCode}
    <script>
      {
        console.log = window.parent.log;
        ${visibleScriptToRun}
      }
    </script>`,
  );

  writeToFrame(
    '#hidden-iframe',
    `
    ${htmlCode}
    <script>
      {
        const fail = window.parent.fail;
        ${hiddenScriptToRun}
      }
    </script>`,
  );

  testCode(js.getValue());
};
