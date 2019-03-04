/* global $, Split */

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

// make editors and code output resizable
const splits = {
  left: Split(['#html-editor-parent', '#js-editor-parent'], {
    direction: 'vertical',
    gutterSize: constants.gutterSize,
  }),
  right: Split(['#html-frame-view', '#console-area'], {
    direction: 'vertical',
    gutterSize: constants.gutterSize,
    sizes: state.consoleSplitSize,
    minSize: 0,
    onDrag() {
      state.consoleSplitSize = splits.right.getSizes();
      state.consoleShowned =
        state.consoleSplitSize[0] < constants.consoleClosedThreshold;
    },
  }),
  cols: Split(['#editors', '#code-output'], {
    gutterSize: constants.gutterSize,
  }),
};

$('#toggle-console-button').click(() => {
  $(this).toggleClass('active');

  // if the console is visible, make hidden
  // else, restore the previous size
  if (state.consoleShowned) {
    splits.right.setSizes([100, 0]);
  } else if (state.consoleSplitSize[0] < constants.consoleClosedThreshold) {
    splits.right.setSizes(state.consoleSplitSize);
  } else {
    splits.right.setSizes(constants.consoleDefaultSplitSize);
  }

  state.consoleShowned = !state.consoleShowned;
});
