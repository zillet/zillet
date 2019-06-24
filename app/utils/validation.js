const bip39 = require('bip39');
/*
 * isNumber
 *
 * Check if the input is number
 *
 * @param {string} value
 * @returns {Boolean}
 */
export function isNumber(value) {
  if (typeof Number(value) != 'number' || isNaN(Number(value))) {
    return false;
  }
  return true;
}
/*
 * isMnemonicValid
 *
 * Check if the mnemonic phrase is valid
 *
 * @param {string} value
 * @returns {Boolean}
 */
export function isMnemonicValid(mnemonic) {
  if (mnemonic.trim().split(/\s+/g).length < 12) {
    return false;
  }
  return bip39.validateMnemonic(mnemonic);
}
export default { isNumber, isMnemonicValid };
