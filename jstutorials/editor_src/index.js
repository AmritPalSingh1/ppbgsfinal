/* global $ */

// I am so sorry that you're reading my code

import './coinsHandler.js';
import './splitHandler.js';
import './codeEditor.js';

const updatePageHeight = () =>
  $('#code--page-container').height(
    $(window).height() - $('#navbar-component').height(),
  );
updatePageHeight();
$(window).resize(updatePageHeight);
