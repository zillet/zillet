export default function({ store, redirect, route }) {
  console.log(store.getters.getAccount.privateKey);
  if (!store.getters.getAccount.privateKey) {
    return redirect(`/?redirect=${route.name}`);
  }
}
