<template>
  <z-modal
    :visible="visible"
    @close="$emit('close')">
    <div 
      style="min-width:400px" 
      class="mx-4">
      <h3 class="font-semibold text-2xl mb-6 text-gray-800">
        Add Custom Token
      </h3>
      <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
        Token Contract Address
      </div>
      <z-input
        v-model="token.address"
        :hide="false"
        :valid="validateAddress"
        class="mb-4"
        :disabled="fetchingDetails"
        placeholder="zil1399rnnzxnl3yllhakxn08eelmrpk3ydwywv8xy" />
      <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
        Token Symbol
      </div>
      <z-input
        v-model="token.symbol"
        :hide="false"
        class="mb-4 flex-1"
        :disabled="fetchingDetails"
        placeholder="ZWT" />
      <div class="tracking-wide text-gray-700 text-sm font-semibold mb-2 text-left">
        Token Decimals
      </div>
      <z-input
        v-model.number="token.decimals"
        :hide="false"
        class="18"
        number
        :disabled="fetchingDetails"
        placeholder="18" />
      <div class="flex items-center justify-between -mx-3">
        <z-button
          class="mx-3"
          type="default"
          rounded
          @click="$emit('close')">
          Cancel
        </z-button>
        <z-button
          class="mx-3 min-w-42"
          rounded
          :disabled="fetchingDetails || !validateAddress"
          @click="saveToken(token)">
          Save Token
        </z-button>
      </div>
    </div>
  </z-modal>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'AddToken',
  props: {
    visible: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      fetchingDetails: false,
      token: {
        address: '',
        testnetAddress: '',
        name: '',
        symbol: '',
        decimals: '',
        local: true
      }
    };
  },
  computed: {
    ...mapState({
      tokens: state => state.zrc2,
      selectedNode: state => state.selectedNode,
      tokenBalances: state => state.tokenBalances,
      loading: state => state.loading
    }),
    validateAddress() {
      return this.token.address.length == 42;
    }
  },
  watch: {
    'token.address': {
      handler(newValue, oldValue) {
        if (newValue && newValue.length === 42 && newValue != oldValue) {
          this.getDetails(newValue);
        }
      }
    }
  },
  methods: {
    ...mapActions(['getContract', 'getZrc2List', 'fetchTokenBalance']),
    async getDetails(address) {
      this.fetchingDetails = true;
      try {
        const td = await this.getContract(address);
        this.fetchingDetails = false;
        this.token = { ...this.token, ...td };
      } catch (error) {
        this.$notify({
          message: `${error.message}`,
          type: 'danger'
        });
        this.fetchingDetails = false;
      }
    },
    async saveToken() {
      let zrc2;
      let token = this.token;
      let address;
      if (this.selectedNode.id != '1') {
        token.testnetAddress = token.address;
        address = token.address;
        delete token.address;
      }
      try {
        zrc2 = JSON.parse(localStorage.getItem('_zrc2_tokens'));
        let obj = zrc2.find(
          t =>
            (t.address && t.address == token.address) ||
            (t.testnetAddress && t.testnetAddress == token.testnetAddress)
        );
        if (obj && obj.symbol) {
          token.address = address;
          return this.$notify({
            message: `${'This token already exists in your list.'}`,
            type: 'danger'
          });
        } else if (zrc2 && zrc2.length) {
          zrc2.push(token);
        } else {
          zrc2 = [token];
        }
      } catch (error) {
        zrc2 = [token];
      }
      localStorage.setItem('_zrc2_tokens', JSON.stringify(zrc2));
      this.token = {
        address: '',
        testnetAddress: '',
        name: '',
        symbol: '',
        decimals: ''
      };
      await this.getZrc2List();
      await this.fetchTokenBalance();
      this.$emit('close');
    }
  }
};
</script>

<style>
</style>
