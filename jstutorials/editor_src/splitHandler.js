/* global $, Split */

// -- Local state ---------------------------------------------------

const constants = {
  // the percentage view for the console to be considered closed
  consoleClosedThreshold: 97.5,
  consoleDefaultSplitSize: [60, 40],
  gutterSize: 8,
};

const state = {
  // save split size between html view and console
  consoleSplitSize: constants.consoleDefaultSplitSize,
  // console pane visible state
  consoleShowned: true,
};

// -- resizable splits ----------------------------------------------

// left size
Split(['#html-editor-parent', '#js-editor-parent'], {
  direction: 'vertical',
  gutterSize: constants.gutterSize,
});

// right size
const right = Split(['#html-frame-view', '#console-area'], {
  direction: 'vertical',
  gutterSize: constants.gutterSize,
  sizes: state.consoleSplitSize,
  minSize: 0,
  onDrag() {
    state.consoleSplitSize = right.getSizes();
    state.consoleShowned =
      state.consoleSplitSize[0] < constants.consoleClosedThreshold;
  },
});

// split left and right
Split(['#editors', '#code-output'], {
  gutterSize: constants.gutterSize,
});

// -- toggle console visibility -------------------------------------

$('#toggle-console-button').click(() => {
  $(this).toggleClass('active');

  // if the console state is showen, make hidden
  if (state.consoleShowned) {
    right.setSizes([100, 0]);
  }
  // else, restore the previous size
  else {
    // the stored split size might not be visible. set to default
    if (state.consoleSplitSize[0] >= constants.consoleClosedThreshold) {
      state.consoleSplitSize = constants.consoleDefaultSplitSize;
    }

    right.setSizes(state.consoleSplitSize);
  }

  state.consoleShowned = !state.consoleShowned;
});
