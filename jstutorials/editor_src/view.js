/* global $ */

import store from './redux/store.js';
import { setPage, buyHint } from './redux/actions.js';

// -- HTML Components -----------------------------------------------

const Coins = coins => `<i class="fas fa-coins"></i> ${coins} Coins`;

const Errors = errors =>
  `<span class="${errors ? 'text-danger' : 'text-success'}">
    <i class="fas ${errors ? 'fa-times-circle' : 'fa-check-circle'}"></i>
    ${errors} Errors
  </span>`;

const $HintTabs = (hints, page, hintsUsed) =>
  $('<ul class="nav nav-tabs"/>').append(
    hints.map((x, i, arr) => {
      const label = i === arr.length - 1 ? 'Solution' : `Hint ${i + 1}`;

      const link =
        i > hintsUsed
          ? $('<a class="nav-link disabled"/>')
              .attr('href', '#')
              .append(`<i class="fas fa-lock"></i> ${label}`)
          : $(`<a class="nav-link ${i === page ? 'active' : ''}"/>`)
              .attr('href', '#')
              .append(label);

      return $('<li class="nav-item"/>')
        .append(link)
        .click(() => i <= hintsUsed && store.dispatch(setPage(i)));
    }),
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

// -- Render page with new state ------------------------------------

const render = () => {
  const {
    consoleOutput,
    coins,
    hintPage,
    hintsUsed,
    exercise,
    errorCount,
  } = store.getState();
  const { hints, task, details, htmlReadOnly, jsReadOnly } = exercise;

  $('#submit-button').attr(
    'class',
    errorCount ? 'btn btn-outline-danger' : 'btn btn-success',
  );

  $('#html-label-read-only').html(htmlReadOnly && '(Read Only)');
  $('#js-label-read-only').html(jsReadOnly && '(Read Only)');
  $('#task-placeholder').html(task);
  $('#console-output').html(consoleOutput);
  $('#coin-count-container').html(Coins(coins));
  $('#error-count-container').html(Errors(errorCount));
  $('#task-detail-modal-body').html(details);

  if (hints && hints.length > 0) {
    $('#hint-modal-body')
      .html($HintTabs(hints, hintPage, hintsUsed))
      .append($Hint(hints[hintPage], hintPage, hintsUsed, coins));
  } else {
    $('#hint-modal-body').html('No hints available for this exercise');
  }

  // warn user about errors in submit modal
  $('#modal-body-optional-info').html(
    errorCount
      ? `You currently have ${errorCount} errors in your JavaScript code!`
      : '',
  );
};

export default render;

// -- Page takes up rest of view ------------------------------------

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
