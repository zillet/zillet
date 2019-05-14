export default function({ store, redirect, route }) {
  if (!store.getters.Account.privateKey) {
    return redirect(`/?redirect=${route.name}`);
  }
}
