<template>
  <AccessWalletContainer
    hide-top
    @exit="$emit('exit')">
    <template v-slot:title>
      Connect to Ledger
      <br>
    </template>
    <p class="text-base text-gray-700">
      Make sure your Ledger is <span class="font-semibold">unlocked</span>, you've selected the <span class="font-semibold">Zilliqa</span> app
      on the device, and browser support is <span class="font-semibold">enabled</span>.
    </p>
    <z-button
      class="w-full mb-8"
      rounded
      :loading="loading"
      @click="connect()">
      {{ indexModal ? 'Connecting...' : 'Connect to Ledger wallet' }}
    </z-button>
    <template v-slot:articles>
      <ZLink
        to="/troubleshooting/troubleshooting-ledger-issues"
        external>
        Troubleshooting Ledger issues
      </ZLink>
      and
      <ZLink
        to="/getting-started/how-to-use-ledger-with-zillet"
        external>
        How to use your Ledger hardware wallet with Zillet
      </ZLink>
    </template>
    <AccountIndex
      :visible="indexModal"
      :accounts="accounts"
      @close="indexModal=false"
      @access="access"
      @addAccount="addAccount" />
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { fromBech32Address } from '@zilliqa-js/crypto';
import config from '@/config.json';
import * as util from '@zilliqa-js/util';
import ZilliqaHW from '@/utils/ledger';
import AccountIndex from '@/components/ledger/AccountIndex';
const { units, BN } = util;
export default {
  name: 'Keystore',
  components: {
    AccountIndex
  },
  props: {
    uid: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      loading: false,
      hwIndex: 0,
      indexModal: false,
      ledgerZil: {},
      accounts: []
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance'])
  },
  methods: {
    ...mapMutations(['importAccount', 'saveAccessType']),
    async transportInit() {
      const transport = await ZilliqaHW.create();
      console.log('ledger transport init!');
      return transport;
    },
    async connect() {
      this.loading = true;
      try {
        const transport = await this.transportInit();
        this.ledgerZil = new ZilliqaHW(transport);
        await this.getAccounts();
      } catch (err) {
        this.$notify({
          message: err.message,
          type: 'danger'
        });
      }
      this.loading = false;
    },
    async getAccounts() {
      // for (let index = this.hwIndex; index < this.hwIndex + ; index++) {
      const data = await this.ledgerZil.getPublicAddress(this.hwIndex); // Wating user access "loading...".
      const res = await this.$zillet.blockchain.getBalance(data.pubAddr);
      const balance = res && res.result ? res.result.balance : 0;
      this.accounts.push({
        index: this.hwIndex,
        pubAddr: data.pubAddr,
        publicKey: data.publicKey,
        base16Address: fromBech32Address(data.pubAddr),
        balance: units.fromQa(new BN(balance), units.Units.Zil)
      });
      // }
      this.indexModal = true;
    },
    addAccount() {
      this.hwIndex += 1;
      this.getAccounts();
    },
    async access(account) {
      try {
        this.loading = true;
        this.save({
          address: account.base16Address,
          publicKey: account.publicKey,
          index: account.index
        });
        this.loading = false;
        this.saveAccessType(this.uid);
        this.$router.push({
          name: this.$route.query.redirect || 'send'
        });
      } catch (err) {
        this.loading = false;
        // If user denied to access.
        this.$notify({
          message: err.message,
          type: 'danger'
        });
      }
    },
    save(account) {
      this.importAccount(account);
    }
  }
};
</script>
