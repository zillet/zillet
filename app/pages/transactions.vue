<template>
  <div class="card">
    <h1>Transactions</h1>
    {{ transactions }}
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from 'vuex';
export default {
  name: 'Home',
  middleware: 'ifKeyExists',
  data() {
    return {
      requestParams: {
        address: '',
        type: '',
        network: '',
        page: ''
      }
    };
  },
  computed: {
    ...mapGetters(['getAccount']),
    ...mapState({
      transactions: state => state.viewblockAccount.txs
    })
  },
  beforeMount() {
    this.requestParams.address = this.getAccount.address;
    this.getTransactions(this.requestParams);
  },
  methods: {
    ...mapActions(['getTransactions'])
  }
};
</script>
