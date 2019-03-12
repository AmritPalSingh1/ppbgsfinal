/* global $ */

import store from './store.js';

store.subscribe(() => {
  const { exercise } = store.getState();
  $('#task-placeholder').html(exercise.task);
});

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);