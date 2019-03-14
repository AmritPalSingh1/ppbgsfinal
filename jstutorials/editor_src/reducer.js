import initialState from './initialState';
import {
  FETCH_SUCCESS,
  HINT_PURCHASE_SUCCESS,
  SET_HTML,
  SET_JS,
  LOG_TO_CONSOLE,
  CLEAR_CONSOLE,
  INC_ERROR,
  RESET_ERROR,
  SET_HINTS_USED,
  SET_HINT_PAGE,
  SET_COIN_COUNT,
  NO_OP,
} from './constants.js';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return { ...state, dataFetched: true, exercise: action.data };
    case HINT_PURCHASE_SUCCESS:
      return { ...state, ...action.data };

    case SET_HTML:
      return { ...state, userHtml: action.code };
    case SET_JS:
      return { ...state, userJs: action.code };

    case LOG_TO_CONSOLE:
      return { ...state, consoleOutput: state.consoleOutput + action.data };
    case CLEAR_CONSOLE:
      return { ...state, consoleOutput: '' };

    case INC_ERROR:
      return { ...state, errorCount: state.errorCount + 1 };
    case RESET_ERROR:
      return { ...state, errorCount: 0 };

    case SET_COIN_COUNT:
      return { ...state, coins: action.coinCount };
    case SET_HINTS_USED:
      return { ...state, hintsUsed: action.hintsUsed };
    case SET_HINT_PAGE:
      return { ...state, hintPage: action.page };

    case NO_OP:
      return state;
    default:
      // eslint-disable-next-line no-console
      console.warn(`Action type: ${action.type} not recognized.`);
      return state;
  }
};

export default reducer;