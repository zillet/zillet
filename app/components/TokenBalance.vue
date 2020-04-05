<template>
  <div class="w-full">
    <h3 class="font-semibold text-2xl mb-4 text-left">
      Token Balances
    </h3>
    <div>
      <div
        v-for="token in tokenBalances"
        :key="token.symbol"
        class="flex flex-row justify-between items-center">
        <div class="flex">
          <img
            :src="getImages(token.symbol)"
            class="token__icon rounded-full">
          <p class="ml-1 uppercase font-semibold">
            {{ token.symbol }}
          </p>
        </div>
        <div
          class="flex items-center"
          @click="$emit('tokenClicked', token)">
          <div class="flex underline font-bold cursor-pointer">
            {{ token.balance*Math.pow(10, -1*token.decimals) | currency('', 2) }}
          </div>
          <div class="ml-2 text-xs font-semibold text-gray-700">
            ≈  {{ amountInUsd(token) | currency('$', 2) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex';
import { getImages } from '@/utils';
export default {
  name: 'TokenBalance',
  computed: {
    ...mapGetters(['Account', 'Prices', 'Balance']),
    ...mapState({
      tokens: state => state.zrc2,
      tokenBalances: state => state.tokenBalances
    })
  },
  beforeMount() {
    // console.log(this.tokens);
    // const deployedContract = this.$zillet.contracts.at(
    //   this.tokens[0].testnetAddress
    // );
    // console.log(deployedContract);
    this.fetchBalance();
  },
  methods: {
    ...mapActions(['fetchBalance']),
    getImages,
    amountInUsd(token) {
      try {
        return (
          token.balance *
          Math.pow(10, -1 * token.decimals) *
          this.Prices[token.symbol].USD
        );
      } catch (error) {
        return 0;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.token__icon {
  height: 20px;
  width: 20px;
}
</style>
