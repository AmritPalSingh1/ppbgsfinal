export const nl2br = str => str.replace(/(?:\r\n|\r|\n)/g, '<br />');

export const escapeCode = str =>
  str
    .replace(/\\/g, '\\\\') // preserve backslash
    .replace(/[\n\r]/g, '\\n') // escape new lines
    .replace(/'/g, "\\'"); // escape quotes
