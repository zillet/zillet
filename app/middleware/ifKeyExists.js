export default function({ store, redirect, route }) {
  if (!store.getters.getAccount.privateKey) {
    return redirect(`/access-wallet?redirect=${route.name}`);
  }
}
