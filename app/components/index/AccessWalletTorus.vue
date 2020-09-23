<template>
  <AccessWalletContainer
    hide-top
    @exit="$emit('exit')">
    <template v-slot:title>
      Access your Wallet
      <br>
    </template>
    <p class="text-base text-gray-700">
      Connect using Google via Direct Auth
    </p>
    <z-button
      class="w-full mb-8"
      rounded
      :loading="loading"
      @click="connect()">
      {{ indexModal ? 'Connecting...' : 'Connect' }}
    </z-button>
  </AccessWalletContainer>
</template>
<script>
import TorusSdk from '@toruslabs/torus-direct-web-sdk';
import { mapActions, mapMutations, mapGetters } from 'vuex';
export default {
  name: 'Torus',
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
    ...mapActions(['selectNode']),
    ...mapMutations(['importAccount', 'saveAccessType']),
    async connect() {
      this.loading = true;
      try {
        // NEW: 74915647456-dmjtvi9heh9h944ni2iadabio9kaqd86.apps.googleusercontent.com
        // OLD: 876733105116-i0hj3s53qiio5k95prpfmj0hp0gmgtor.apps.googleusercontent.com
        const torusdirectsdk = new TorusSdk({
          baseUrl:
            process.env.TORUS_SW_URL ||
            window.location.origin + '/serviceworker',
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '718832386865-i96lcpfvpacl0a0gfa6nc0ap5bjqei8i.apps.googleusercontent.com'
        });
        await torusdirectsdk.init();
        const loginDetails = await torusdirectsdk.triggerLogin(
          'google',
          'google-zillet'
        );
        this.loading = false;
        this.$zillet.wallet.addByPrivateKey(loginDetails.privateKey);
        this.importAccount(this.$zillet.wallet.defaultAccount);
        this.saveAccessType(this.uid);
        this.$router.push({
          name: this.$route.query.redirect || 'send'
        });
        return this.$notify({
          message: `Wallet loaded successfully.`,
          type: 'success'
        });
      } catch (error) {
        this.loading = false;
        return this.$notify({
          message: String(error.message),
          type: 'danger'
        });
      }
    }
  }
};
</script>
