/* global $ */

import { once } from 'ramda';
import { setPage, buyHint } from './actions.js';
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
    hints.map((x, i) =>
      $('<li class="nav-item"/>')
        .append(
          i > hintsUsed
            ? $('<a class="nav-link disabled"/>')
                .attr('href', '#')
                .append(`<i class="fas fa-lock"></i> Hint ${i + 1}`)
            : $(`<a class="nav-link ${i === page ? 'active' : ''}"/>`)
                .attr('href', '#')
                .append(`Hint ${i + 1}`),
        )
        .click(() => i <= hintsUsed && store.dispatch(setPage(i))),
    ),
  );

const $Hint = ({ hintContent, hintCost }, page, hintsUsed, coins) =>
  $('<div class="mt-4"/>').append(
    (() => {
      if (page < hintsUsed) {
        return hintContent;
      }

      if (coins < hintCost) {
        return $(
          '<button class="btn btn-outline-primary w-100" disabled/>',
        ).append(`Not enough coins! This hint costs ${hintCost} coins`);
      }

      return $('<button class="btn btn-outline-primary w-100"/>')
        .append(`Buy Hint <i class="fas fa-coins"></i> ${hintCost}`)
        .click(() => store.dispatch(buyHint(hintCost)));
    })(),
  );

// -- Render page on state change -----------------------------------

// populate code editor on data fetch and set options
const setupCodeEditors = once((htmlCode, jsCode, htmlReadOnly, jsReadOnly) => {
  html.setValue(htmlCode);
  js.setValue(jsCode);
  html.setOption('readOnly', htmlReadOnly);
  js.setOption('readOnly', jsReadOnly);
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
  const { hints, task, details, htmlReadOnly, jsReadOnly } = exercise;

  if (dataFetched) {
    setupCodeEditors(exercise.html, exercise.js, htmlReadOnly, jsReadOnly);
  }

  $('#html-label-read-only').html(htmlReadOnly && '(Read Only)');
  $('#js-label-read-only').html(jsReadOnly && '(Read Only)');
  $('#task-placeholder').html(task);
  $('#console-output').html(consoleOutput);
  $('#coin-count-container').html(Coins(coins));
  $('#error-count-container').html(Errors(errorCount));
  $('#task-detail-modal-body').html(details);

  if (hints.length > 0) {
    $('#hint-modal-body')
      .html($HintTabs(hints, hintPage, hintsUsed))
      .append($Hint(hints[hintPage], hintPage, hintsUsed, coins));
  }

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
