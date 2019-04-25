export default function({ store, redirect, route }) {
  if (!store.getters.getAccount.privateKey) {
    return redirect(`/?redirect=${route.name}`);
  }
}
