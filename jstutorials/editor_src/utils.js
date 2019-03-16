/* global $ */

import { curry } from 'ramda';

export const inspect = x => {
  // eslint-disable-next-line no-console
  console.log(x);
  return x;
};

export const add = curry((a, b) => a + b);

export const nl2br = str => str.replace(/(?:\r\n|\r|\n)/g, '<br />');

export const escapeCode = str =>
  str
    .replace(/\\/g, '\\\\') // preserve backslash
    .replace(/[\n\r]/g, '\\n') // escape new lines
    .replace(/'/g, "\\'"); // escape quotes

export const tidyHtml = code =>
  $('<div/>')
    .html(code)
    .html();

export const toFormData = obj =>
  Object.keys(obj).reduce((data, key) => {
    data.append(key, obj[key]);
    return data;
  }, new FormData());
