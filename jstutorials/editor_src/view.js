/* global $ */

import { once } from 'ramda';
import store from './store.js';
import { html, js } from './codeEditor.js';

// -- Populate code editor ------------------------------------------

const setEditorValuesAndRunCode = once((htmlCode, jsCode) => {
  html.setValue(htmlCode);
  js.setValue(jsCode);
});

// -- Render page on state change -----------------------------------

store.subscribe(() => {
  const { coins, exercise, errorCount, dataFetched } = store.getState();

  if (dataFetched) {
    setEditorValuesAndRunCode(exercise.html, exercise.js);
  }

  // show task in the navbar
  $('#task-placeholder').html(exercise.task);

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
});

// -- Page takes up rest of view ------------------------------------

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
