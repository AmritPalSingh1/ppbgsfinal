/* global $, CodeMirror */

const sharedConfig = {
  autoCloseBrackets: true,
  extraKeys: {
    Tab: 'insertSoftTab',
  },
  gutters: ['CodeMirror-lint-markers'],
  lineNumbers: true,
  scrollbarStyle: 'simple',
  scrollPastEnd: true,
  tabSize: 2,
  theme: 'neo',
};

// create codemirror instances.
export const html = CodeMirror($('#html-editor')[0], {
  ...sharedConfig,
  mode: 'htmlmixed',
  autoCloseTags: true,
  lint: true,
});

export const js = CodeMirror($('#js-editor')[0], {
  ...sharedConfig,
  mode: 'javascript',
  lint: {
    esversion: 6,
  },
});
