export const LOADING = state => {
  state.loading = true;
};
export const SUCCESS = state => {
  state.loading = false;
  state.errorMsg = '';
};
export const ERROR = (state, msg) => {
  state.loading = false;
  state.errorMsg = msg;
};
export const IMPORT_ACCOUNT = (state, result) => {
  state.wallet = { ...state.wallet, ...result };
};
export const BALANCE = (state, result) => {
  state.wallet = { ...state.wallet, ...result };
};
