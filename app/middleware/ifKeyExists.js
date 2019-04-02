export default function({ store, redirect, route }) {
  const { length } = store.state.encryptedWallets;
  if (!store.getters.getAccount.privateKey && !length) {
    return redirect(`/access-wallet?redirect=${route.name}`);
  }
}
