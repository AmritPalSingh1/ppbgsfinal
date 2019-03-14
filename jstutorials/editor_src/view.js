/* global $ */

import { once } from 'ramda';
import { setPage } from './actions.js';
import store from './store.js';
import { add } from './utils.js';
import { html, js } from './codeEditor.js';

// -- Render page on state change -----------------------------------

// populate code editor on data fetch
const setEditorValuesAndRunCode = once((htmlCode, jsCode) => {
  html.setValue(htmlCode);
  js.setValue(jsCode);
});

store.subscribe(() => {
  const {
    consoleOutput,
    coins,
    hintPage,
    exercise,
    errorCount,
    dataFetched,
  } = store.getState();
  const { hints, task } = exercise;

  if (dataFetched) {
    setEditorValuesAndRunCode(exercise.html, exercise.js);
  }

  // show console output
  $('#console-output').html(consoleOutput);

  // show task in the navbar
  $('#task-placeholder').html(task);

  // show coin count on the footer
  $('#coin-count-container').html(
    `<i class="fas fa-coins"></i> ${coins} Coins`,
  );

  // show error count on the footer
  $('#error-count-container').html(
    `<span class="${errorCount ? 'text-danger' : ''}">
      <i class="fas fa-times-circle"></i> ${errorCount} Errors
    </span>`,
  );

  // warn user about errors in modal
  if (errorCount) {
    $('#modal-body-optional-info').html(
      `You currently have ${errorCount} errors in your JavaScript code!`,
    );
  } else {
    $('#modal-body-optional-info').empty();
  }

  const tabList = $('<ul class="nav nav-tabs"></ul>').append(
    Array.from({ length: hints.length }).map((x, i) =>
      $(`
        <li class="nav-item">
          <a class="nav-link ${i === hintPage ? 'active' : ''}" href="#">
            Hint ${i + 1}
          </a>
        </li>`).click(() => store.dispatch(setPage(i))),
    ),
  );

  $('#hint-modal-body')
    .html(tabList).append(`
      <div class="mt-4">
        ${hints[hintPage].hintContent}
      </div>`);
});

// -- Page takes up rest of view ------------------------------------

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
