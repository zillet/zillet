<template>
  <AccessWalletContainer @exit="$emit('exit')">
    <template v-slot:title>
      Connect to Ledger
      <br>
    </template>
    <div
      class="flex justify-center mb-6 mobile:flex-col">
      <span class="mx-2 mobile:mb-2">
        <strong>IMPORTANT</strong> Follow this guide
        <i
          class="eva eva-arrow-forward-outline relative"
          style="top:3px" />
      </span>
      <ZLink
        to="/getting-started/how-to-use-ledger-with-zillet"
        class="font-semibold"
        external>
        How to use your Ledger hardware wallet with Zillet
      </ZLink>
    </div>
    <div class="flex flex-1 flex-col max-w-xs m-auto">
      <div
        class="tracking-wide text-gray-700 text-sm
        font-bold mb-2 uppercase text-left">
        Index
      </div>
      <z-input
        v-model="hwIndex"
        :hide="false"
        size="mini"
        type="number"
        class="flex-1"
        placeholder="0 (Default)" />
    </div>
    <z-button
      class="w-full mb-8"
      rounded
      :loading="loading"
      @click="connect()">
      Connect and Use Account #{{ hwIndex }}
    </z-button>
    <div
      class="flex justify-center mb-6 text-base mobile:flex-col">
      <span class="mx-2 mobile:mb-2">
        Helpful article
        <i
          class="eva eva-arrow-forward-outline relative"
          style="top:3px" />
      </span>
      <ZLink
        to="/troubleshooting/troubleshooting-ledger-issues"
        class="font-semibold"
        external>
        Troubleshooting Ledger Issues
      </ZLink>
    </div>
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
      loading: false,
      hwIndex: 0,
      indexModal: false
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
        this.loading = true;
        const transport = await this.transportInit();
        const ledgerZil = new ZilliqaHW(transport);
        const data = await ledgerZil.getPublicKey(this.hwIndex); // Wating user access "loading...".
        console.log(data);
        const base16Address = fromBech32Address(data.pubAddr);
        this.save({
          address: base16Address,
          publicKey: data.publicKey,
          index: this.hwIndex
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
