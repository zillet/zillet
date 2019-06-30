<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Connect to ZilPay
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
import { decryptPrivateKey } from '@zilliqa-js/crypto';
import config from '@/config';
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
        try {
          const zilPay = window.zilPay;
          if (!zilPay.isEnable || !zilPay.isConnect) {
            await zilPay.connect();
          }
          const { defaultAccount } = zilPay;
          zilPay.observableAccount().subscribe(account => {
            if (this.Account.address != account.base16) {
              this.save(account.base16);
              this.$notify({
                message: `New account loaded succesfully`,
                type: 'success'
              });
            }
          });
          if (zilPay.net === 'mainnet') {
            this.selectNode(config.NODES[0]);
          } else if (zilPay.net === 'testnet') {
            this.selectNode(config.NODES[1]);
          } else {
            this.selectNode({ url: zilPay.provider.nodeURL });
          }
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
          console.log(error);
          this.$notify({
            message: error,
            type: 'danger'
          });
        }
      } else {
        this.notFound = true;
        this.$notify({
          message: `Zilpay extension is not installed.`,
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
