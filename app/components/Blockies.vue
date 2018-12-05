<template>
  <div
    ref="blockieId"/>
</template>
<script>
import blockies from '@/utils/blockies';
export default {
  name: 'ZBlockies',
  props: {
    seed: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: null
    },
    bgcolor: {
      type: String,
      default: null
    },
    size: {
      type: Number,
      default: 8
    },
    scale: {
      type: Number,
      default: 4
    },
    spotcolor: {
      type: String,
      default: null
    }
  },
  mounted() {
    this.url();
  },
  methods: {
    async url() {
      let icon = await blockies.create({
        seed: this.seed && this.seed.toLowerCase(),
        size: 8
      });
      await this.$refs.blockieId.append(icon);
    }
  }
};
</script>
