import { DEFAULT_INDENT, DEFAULT_KEYMAP, DEFAULT_THEME } from "./redux/constants";

/* global $ */

// do you feel sick?
// because I definitely feel sick

const createModal = (id, title, body, footer) => {
  $('#modal-container').append(
    `<div class="modal fade" id="${id}" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ${body}
          </div>
          <div class="modal-footer">
            ${footer}
          </div>
        </div>
      </div>
    </div>`,
  );
};

// -- Ask for submit ------------------------------------------------

createModal(
  'submitModal',
  'Submit Code',
  `Are you sure you want to submit your code?
   <div id="modal-body-optional-info"></div>`,
  `<button type="button" class="btn btn-secondary" data-dismiss="modal">
     No. Go back!
   </button>
   <button type="button" class="btn btn-primary" id="submit-results-button">
     Yep! I&apos;m done coding!
   </button>`,
);

// -- Display hints -------------------------------------------------

createModal(
  'hintsModal',
  'Hints',
  '<div id="hint-modal-body"></div>',
  `<button type="button" class="btn btn-secondary" data-dismiss="modal">
     Back to code
   </button>`,
);

// -- Task details --------------------------------------------------

createModal(
  'taskDetailsModal',
  'Task',
  '<div id="task-detail-modal-body"></div>',
  `<button type="button" class="btn btn-secondary" data-dismiss="modal">
     Close
   </button>`,
);

// -- Settings ------------------------------------------------------

createModal(
  'settingsModal',
  'Settings',
  `<div id="settings-modal-body">
     <h6>Reset Editors</h6>
     <button class="btn btn-outline-danger" id="reset-html-button">Reset HTML editor</button>
     <button class="btn btn-outline-danger" id="reset-js-button">Reset JS editor</button>
     <hr>
     <h6>Indent Size</h6>
     <select id="indent-select" class="form-control">
       <option>1</option>
       <option>2</option>
       <option>3</option>
       <option>4</option>
       <option>5</option>
       <option>6</option>
       <option>7</option>
       <option>8</option>
     </select>
     <hr>
     <h6>Keymap</h6>
     <select id="keymap-select" class="form-control">
       <option>default</option>
       <option disabled>emacs</option>
       <option>vim</option>
     </select>
     <hr>
     <h6>Theme</h6>
     <select id="theme-select" class="form-control">
       <option>base16-dark</option>
       <option>base16-light</option>
       <option>eclipse</option>
       <option>idea</option>
       <option>material</option>
       <option>neo</option>
       <option>oceanic-next</option>
     </select>
   </div>`,
  `<button type="button" class="btn btn-secondary" data-dismiss="modal">
     Close
   </button>`,
);

$('#indent-select').val(localStorage.getItem('indentUnit') || DEFAULT_INDENT);
$('#keymap-select').val(localStorage.getItem('keyMap') || DEFAULT_KEYMAP);
$('#theme-select').val(localStorage.getItem('theme') || DEFAULT_THEME);

// thanks I hate it
