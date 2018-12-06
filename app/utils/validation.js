/*
 * isNumber
 *
 * Check if the input is number
 *
 * @param {string} value
 * @returns {Boolean}
 */
function isNumber(value) {
  if (typeof Number(value) != 'number' || isNaN(Number(value))) {
    return false;
  }
  return true;
}
export { isNumber };
