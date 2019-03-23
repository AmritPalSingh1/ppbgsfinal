// -- Fetch exercise schema -----------------------------------------

const exercise = {
  // exercise description
  task: 'None',
  // task in detail
  details: 'Code your own thing!',
  // store hints
  hints: [],
  // starter html code
  html: '',
  // starter js code
  js: '',
  // make html editor read only
  htmlReadOnly: false,
  // make js editor read only
  jsReadOnly: false,
  // secret javascript code not shown to the user
  // executes before user code
  secret: '',
  // a testing 'suite' ran against user code
  test: {
    setup: '', // run before user code
    run: '', // run after user code
    cleanup: '', // runs last
    has: [], // checks if code contains a pattern
    hasNot: [], // opposite of 'has'
    maxLines: 1000, // max number of lines user should code
    errorThreshold: 0, // (errorThreshold - errorCount) / errorThreshold = grade
  },
};

// -- Initial state -------------------------------------------------

const initialState = {
  // user html code
  userHtml: '',
  // user js code
  userJs: '',
  // exercise fetched
  dataFetched: false,
  // exercise fetch data
  exercise,
  // user coin count
  coins: 0,
  // hint tab index
  hintPage: 0,
  // number of hints used for this exercise
  hintsUsed: 0,
  // number of errors in user's code
  errorCount: 0,
  // the contents of the console output
  consoleOutput: '',
};

export default initialState;
