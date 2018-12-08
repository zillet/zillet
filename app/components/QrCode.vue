<template>
  <canvas id="canvas"/>
</template>
<script>
export default {
  name: 'ZQrcode',
  props: {
    value: {
      type: String,
      default: null
    },
    options: {
      type: Object,
      default() {
        return {
          width: 200
        };
      }
    },
    tag: {
      type: String,
      default: 'canvas'
    }
  },
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler() {
        if (this.$el) {
          this.generate();
        }
      }
    }
  },
  mounted() {
    this.generate();
  },
  methods: {
    generate() {
      const { options, tag } = this;
      const value = String(this.value);
      this.$qr.toCanvas(
        document.getElementById('canvas'),
        value,
        options,
        error => {
          if (error) {
            throw error;
          }
        }
      );
    }
  }
};
</script>
