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

createModal(
  'submitModal',
  'Submit Code',
  `Are you sure you want to submit your code?
   <div id="modal-body-optional-info"></div>`,
  `<button type="button" class="btn btn-secondary" data-dismiss="modal">
     No. Go back!
   </button>
   <button type="button" class="btn btn-primary" id="submit-button">
     Yep! I&apos;m done coding!
   </button>`,
);

createModal(
  'hintsModal',
  'Hints',
  '<div id="hint-modal-body"></div>',
  `<button type="button" class="btn btn-secondary" data-dismiss="modal">
     Back to code
   </button>`,
);

createModal(
  'taskDetailsModal',
  'Task',
  '<div id="task-detail-modal-body"></div>',
  `<button type="button" class="btn btn-secondary" data-dismiss="modal">
     Back to code
   </button>`,
)

// thanks I hate it
