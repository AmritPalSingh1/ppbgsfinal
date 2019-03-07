/* global $ */

import './coinsHandler.js';
import './splitHandler.js';
import './codeEditor.js';

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
