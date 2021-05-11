<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Connect to Zeeves
    </template>
    <z-alert
      type="info"
      class="mb-6">
      <span>
        You need to have
        <a 
          href="https://t.me/zilliqawalletbot"
          target="_blank"
          style="
            text-decoration: underline;
            color: #4dc0b5
          ">Zeeves bot</a>
        account to import it. Please, register there before you proceed.
      </span>
    </z-alert>
    <div class="flex flex-wrap">
      <div>
        Helpful Article 👉
      </div>
      <div class="flex flex-row">
        <ZLink
          to="/getting-started/how-to-use-zeeves-with-zillet"
          external>
          How to use Zeeves (Telegram account) with Zillet
        </ZLink>
      </div>
    </div>
    <z-button
      class="w-full mb-8"
      :loading="loading"
      rounded
      @click="connect()">
      Connect
    </z-button>
    <p
      v-if="notSupported"
      align="left">
      Zeeves is not supported.
    </p>
  </AccessWalletContainer>
</template>
<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
import 'zeeves-auth-sdk-js';

if (Zeeves) {
  //allow console logging
  Zeeves.properties.isDebug = true;
}

export default {
  name: 'Zeeves',
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
      notSupported: false
    };
  },
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance'])
  },
  methods: {
    ...mapActions(['selectNode']),
    ...mapMutations(['importAccount', 'saveAccessType']),
    async connect() {
      if (window && window.Zeeves) {
        try {
          this.loading = true;
          const zeeves = window.Zeeves;
          await zeeves.auth();
          const { defaultAccount } = zeeves.wallet;
          if (!defaultAccount) {
            return this.$notify({
              message: `Zeeves account not connected for some reason. Please, try again.`,
              type: 'danger'
            });
          }
          this.save(defaultAccount);
          this.saveAccessType(this.uid);
          this.$router.push({
            name: this.$route.query.redirect || 'send'
          });
          return this.$notify({
            message: `Wallet loaded successfully.`,
            type: 'success'
          });
        } catch (error) {
          const errMsg = 'Error connecting Zeeves - ' + error;
          console.error(errMsg);
          this.$notify({
            message: errMsg,
            type: 'danger'
          });
        }
        this.loading = true;
      } else {
        this.notSupported = true;
        this.$notify({
          message: `Zeeves is not supported.`,
          type: 'danger'
        });
        console.warn('Zeeves not installed');
      }
    },
    save(account) {
      this.importAccount(account);
    }
  }
};
</script>
