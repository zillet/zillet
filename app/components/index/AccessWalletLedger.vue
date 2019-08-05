<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Connect to Ledger
      <br>
      index: 
      <input
        v-model="hwIndex"
        type="number"
        min="0">
    </template>
    <z-button
      class="w-full mb-8"
      rounded
      @click="connect()">
      Connect
    </z-button>
    <p
      v-if="notFound"
      align="left">
      Zilpay extenstion not found. Please check that extenstion is installed or
      download the extension from the link below.
      <z-button
        class="w-full my-4"
        rounded
        type="default"
        size="small">
        <a
          href="https://zilpay.xyz/"
          target="_blank"
          rel="noopener norefrer nofollow">Download Extenstion</a>
      </z-button>
    </p>
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { fromBech32Address } from '@zilliqa-js/crypto';
import config from '@/config';
import ZilliqaHW from '@/plugins/ledger';
export default {
  name: 'Keystore',
  props: {
    uid: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      isFile: false,
      loading: false,
      passphrase: '',
      fileName: '',
      encryptedWallet: '',
      notFound: false,
      hwIndex: 0
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance'])
  },
  methods: {
    ...mapActions(['selectNode']),
    ...mapMutations(['importAccount', 'saveAccessType']),
    async transportInit() {
      const transport = await ZilliqaHW.create();
      console.log('ledger transport init!');
      return transport;
    },
    async connect() {
      try {
        const transport = await this.transportInit();
        const ledgerZil = new ZilliqaHW(transport);
        const data = await ledgerZil.getPublicKey(this.hwIndex);
        const base16Address = fromBech32Address(data.pubAddr);
        this.save({
          address: base16Address,
          publicKey: data.publicKey
        });
        this.saveAccessType(this.uid);
        this.$router.push({
          name: this.$route.query.redirect || 'send'
        });
      } catch (err) {
        this.$notify({
          message: err.message,
          type: 'success'
        });
      }
    },
    save(account) {
      this.importAccount(account);
    }
  }
};
</script>
