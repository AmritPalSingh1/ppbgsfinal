import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

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
  dataFetched: false,
  exercise,
  coins: 0,
  hintsUsed: 0,
  errorCount: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'fetch-success':
      return { ...state, dataFetched: true, exercise: action.data };
    case 'inc-error':
      return { ...state, errorCount: state.errorCount + 1 };
    case 'reset-error':
      return { ...state, errorCount: 0 };
    case 'no-op':
      return state;
    default:
      // eslint-disable-next-line no-console
      console.warn(`Action type: ${action.type} not recognized.`);
      return state;
  }
};

const store = createStore(reducer, applyMiddleware(thunk));

// AHAHAHA
// I RULE THE UNIVERSE
window.store = store;

export default store;
