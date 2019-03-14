/* global $ */

import { once } from 'ramda';
import { setPage, setHints } from './actions.js';
import store from './store.js';
import { html, js } from './codeEditor.js';

// -- HTML Components -----------------------------------------------

const Coins = coins => `<i class="fas fa-coins"></i> ${coins} Coins`;

const Errors = errors =>
  `<span class="${errors ? 'text-danger' : ''}">
    <i class="fas fa-times-circle"></i> ${errors} Errors
  </span>`;

const $HintTabs = (hints, page, hintsUsed) =>
  $('<ul class="nav nav-tabs"/>').append(
    Array.from({ length: hints.length }).map((x, i) =>
      $(
        `<li class="nav-item">
          <a class="nav-link ${(() => {
            if (i === page) {
              return 'active';
            }
            if (i > hintsUsed) {
              return 'disabled';
            }
            return '';
          })()}" href="#">
            Hint ${i + 1}
          </a>
        </li>`,
      ).click(() => i <= hintsUsed && store.dispatch(setPage(i))),
    ),
  );

const $Hint = ({ hintContent, hintCost }, page, hintsUsed) =>
  $('<div class="mt-4"/>').append(
    page < hintsUsed
      ? hintContent
      : $('<button/>')
          .html(`Buy Hint (${hintCost})`)
          .click(() =>
            store.dispatch(setHints(store.getState().hintsUsed + 1)),
          ),
  );

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
    hintsUsed,
    exercise,
    errorCount,
    dataFetched,
  } = store.getState();
  const { hints, task } = exercise;

  if (dataFetched) {
    setEditorValuesAndRunCode(exercise.html, exercise.js);
  }

  $('#task-placeholder').html(task);
  $('#console-output').html(consoleOutput);
  $('#coin-count-container').html(Coins(coins));
  $('#error-count-container').html(Errors(errorCount));

  $('#hint-modal-body')
    .html($HintTabs(hints, hintPage, hintsUsed))
    .append($Hint(hints[hintPage], hintPage, hintsUsed));

  // warn user about errors in submit modal
  $('#modal-body-optional-info').html(
    errorCount
      ? `You currently have ${errorCount} errors in your JavaScript code!`
      : '',
  );
});

// -- Page takes up rest of view ------------------------------------

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
