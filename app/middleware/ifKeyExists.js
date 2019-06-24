export default function({ store, redirect, route }) {
  if (!store.getters.Account.address) {
    return redirect(`/?redirect=${route.name}`);
  }
}
