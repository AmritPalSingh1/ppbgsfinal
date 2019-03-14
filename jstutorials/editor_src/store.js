import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

// -- Intial state --------------------------------------------------

const exercise = {
  // exercise description
  task: '',
  // store hints
  hints: [{
    hintContent: 'Empty hint content',
    hintCost: 0,
  }],
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

// -- Reducer -------------------------------------------------------

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'fetch-success':
      return { ...state, dataFetched: true, exercise: action.data };
    case 'inc-error':
      return { ...state, errorCount: state.errorCount + 1 };
    case 'reset-error':
      return { ...state, errorCount: 0 };
    case 'set-coin-count':
      return { ...state, coins: action.coinCount };
    case 'set-hints-used':
      return { ...state, hintsUsed: action.hintsUsed };
    case 'no-op':
      return state;
    default:
      // eslint-disable-next-line no-console
      console.warn(`Action type: ${action.type} not recognized.`);
      return state;
  }
};

// -- Store ---------------------------------------------------------

const store = createStore(reducer, applyMiddleware(thunk, logger));

export default store;
