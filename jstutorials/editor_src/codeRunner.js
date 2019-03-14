/* global $, Babel */
/* eslint-disable no-console */

import protect from 'loop-protect';
import store from './store.js';
import { html, js } from './codeEditor.js';
import { incError, resetError } from './actions.js';
import { nl2br, escapeCode } from './utils.js';

// -- Console area --------------------------------------------------

const log = x => {
  $('#console-output').append(`<samp>${x}</samp><br />`);
  console.log(x);
};

const fail = x => {
  store.dispatch(incError());
  $('#console-output').append(
    `<code><i class="fas fa-times-circle"></i> ${x}</code><br />`,
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

// -- Run user code --------------------------------------------------

// write code to the iframe
const writeToFrame = code => {
  const iframeDocument = $('iframe')[0].contentWindow.document;

  iframeDocument.open();
  iframeDocument.write(code);
  iframeDocument.close();
};

const testCode = jsCode => {
  const { test } = store.getState().exercise;

  // test if number of lines exceeds maxLines
  // fail if it does
  if (test.maxLines < jsCode.trim().split('\n').length) {
    fail(
      `You must complete this exercise with ${
        test.maxLines
      } lines of JavaScript or less.`,
    );
  }

  // fail if code does not contain certain strings
  test.has.forEach(piece => {
    const re = new RegExp(piece.regex);

    if (!re.test(jsCode)) {
      fail(piece.message);
    }
  });

  // fail if code contains certain strings
  test.hasNot.forEach(piece => {
    const re = new RegExp(piece.regex);

    if (re.test(jsCode)) {
      fail(piece.message);
    }
  });

  if (store.getState().errorCount === 0) {
    log(
      '<span class="text-success"><i class="fas fa-check-circle"></i> Yay! All tests passed!</span>',
    );
  }
};

// run the user's code
// the results appear in the console area
// eslint-disable-next-line import/prefer-default-export
export const runCode = () => {
  store.dispatch(resetError());

  const { exercise } = store.getState();
  const { secret, test } = exercise;

  $('#console-output').empty();

  const htmlCode = html.getValue();
  const jsCode = (() => {
    let code = '';
    try {
      code = escapeCode(transform(js.getValue()));
    } catch (e) {
      fail(nl2br(e.message));
    }
    return code;
  })();

  const scriptToRun = `
    {
      ${secret}
    }
    {
      ${test.setup}
      {
        try {
          eval('${jsCode}');
        } catch (e) {
          fail(e);
        }
      }
      ${test.run}
      ${test.cleanup}
    }`;

  writeToFrame(`
    ${htmlCode}
    <script>
      {
        const fail = window.parent.fail;
        console.log = window.parent.log;
        ${scriptToRun}
      }
    </script>`);

  testCode(jsCode);
};
