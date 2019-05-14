import * as util from '@zilliqa-js/util';
const { units, BN } = util;
export const Account = state => state.wallet;
export const LoggedIn = state => !!state.wallet.privateKey;
export const Online = () => window.navigator.onLine;
export const Prices = state => state.prices;
export const Balance = (state, getters) => {
  let inZil = units.fromQa(new BN(state.wallet.balance), units.Units.Zil);
  let inUsd = inZil * getters.Prices.USD;
  return {
    zil: inZil,
    usd: inUsd,
    qa: state.wallet.balance
  };
};
