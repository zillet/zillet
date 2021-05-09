<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Connect to ZilPay
    </template>
    <z-alert
      type="info"
      class="mb-6">
      You need ZilPay version v0.2.5 and later to have a smooth experience.
    </z-alert>
    <z-button
      class="w-full mb-8"
      rounded
      @click="connect()">
      Connect
    </z-button>
    <p
      v-if="notFound"
      align="left">
      Zilpay extension not found. Please check that the extension is installed or
      download the extension from the link below.
      <z-button
        class="w-full my-4"
        rounded
        :loading="loading"
        type="default"
        size="small">
        <a
          href="https://zilpay.xyz/"
          target="_blank"
          rel="noopener noreferrer nofollow">Download Extension</a>
      </z-button>
    </p>
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import { decryptPrivateKey } from '@zilliqa-js/crypto';
import config from '@/config.json';
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
      notFound: false
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance'])
  },
  methods: {
    ...mapActions(['selectNode']),
    ...mapMutations(['importAccount', 'saveAccessType']),
    async connect() {
      if (window && window.zilPay) {
        this.loading = true;
        try {
          const zilPay = window.zilPay;
          const status = await zilPay.wallet.connect();
          const { defaultAccount } = zilPay.wallet;
          if (!defaultAccount) {
            return this.$notify({
              message: `Kindly unlock your ZilPay account first`,
              type: 'danger'
            });
          }
          zilPay.wallet.observableAccount().subscribe(account => {
            if (this.Account.address != account.base16) {
              this.save(account.base16);
              this.$notify({
                message: `New account loaded successfully`,
                type: 'success'
              });
            }
          });
          var t = this;
          function selectNet(net) {
            if (net === 'mainnet') {
              t.selectNode(config.NODES[0]);
            } else if (net === 'testnet') {
              t.selectNode(config.NODES[1]);
            } else {
              t.selectNode(config.NODES[2]);
            }
          }
          zilPay.wallet.observableNetwork().subscribe(net => selectNet(net));
          selectNet(zilPay.wallet.net);
          this.save(defaultAccount.base16);
          this.saveAccessType(this.uid);
          this.$router.push({
            name: this.$route.query.redirect || 'send'
          });
          return this.$notify({
            message: `Wallet loaded successfully.`,
            type: 'success'
          });
        } catch (error) {
          console.error(error);
          this.$notify({
            message: error,
            type: 'danger'
          });
        }
        this.loading = false;
      } else {
        this.notFound = true;
        this.$notify({
          message: `ZilPay extension is not installed.`,
          type: 'danger'
        });
        console.warn('ZilPay not installed');
      }
    },
    save(account) {
      this.importAccount({
        address: account
      });
    }
  }
};
</script>
