/* global $ */

import jsyaml from 'js-yaml';
import { toFormData } from './utils.js';
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
  SET_CSRF_TOKEN,
  NO_OP,
} from './constants.js';

export const fetchExercise = endpoint => dispatch =>
  fetch(endpoint)
    .then(data => data.text())
    .then(jsyaml.load)
    .then(data => dispatch({ type: FETCH_SUCCESS, data }));

export const buyHint = hintCost => dispatch =>
  fetch('/topics/topic/challenge/hint', {
    method: 'post',
    headers: {
      'X-CSRFToken': $('[name=csrfmiddlewaretoken]').val(),
    },
    body: toFormData({
      challenge_id: $('#task-id').html(),
      coins: hintCost,
    }),
  })
    .then(data => data.json())
    // eslint-disable-next-line camelcase
    .then(({ total_coins, hint_number }) => ({
      coins: total_coins,
      hintsUsed: hint_number,
    }))
    .then(data => dispatch({ type: HINT_PURCHASE_SUCCESS, data }));

export const setHtmlCode = code => ({ type: SET_HTML, code });
export const setJsCode = code => ({ type: SET_JS, code });

export const logToConsole = data => ({ type: LOG_TO_CONSOLE, data });
export const clearConsole = () => ({ type: CLEAR_CONSOLE });

export const incError = () => ({ type: INC_ERROR });
export const resetError = () => ({ type: RESET_ERROR });

export const setHintsUsed = hintsUsed => ({ type: SET_HINTS_USED, hintsUsed });
export const setPage = page => ({ type: SET_HINT_PAGE, page });
export const setCoins = coinCount => ({ type: SET_COIN_COUNT, coinCount });
export const setCsrfToken = token => ({ type: SET_CSRF_TOKEN, token });

export const noOp = () => ({ type: NO_OP });
