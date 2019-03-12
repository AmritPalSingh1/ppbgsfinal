import { createStore } from 'redux';

const exercise = {
  // exercise description
  task: '',
  // store hints
  hints: [],
  // starter html code
  html: '',
  // starter js code
  js: '',
  // secret javascript code not shown to the user
  secret: '',
  // a testing 'suite' ran against user code
  test: {
    setup: '', // run before user code
    run: '', // run after user code
    cleanup: '', // runs last
    has: [], // checks if code contains a pattern
    hasNot: [], // opposite of 'has'
    maxLines: 200, // max number of lines user should code
    errorThreshold: 0, // (errorThreshold - errorCount) / errorThreshold = grade
  },
};

const initialState = {
  exercise,
  coins: 0,
  hintsUsed: 0,
  errorCount: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
