<template>
  <div>
    <a
      v-if="external"
      class="link px-2"
      v-bind="$attrs"
      target="_blank"
      :href="href"
      rel="noopener noreferrer"
      v-on="{...$listeners,input: event => $emit('input', event.target.value)}">
      <slot />
    </a>
    <nuxt-link
      v-else
      :to="{name:to}">
      <slot />
    </nuxt-link>
  </div>
</template>
<script>
const supportBaseUrl = '//support.zillet.io';
export default {
  name: 'ZLink',
  props: {
    external: {
      default: false,
      type: Boolean
    },
    to: {
      default: '',
      type: String
    }
  },
  computed: {
    href() {
      return `${supportBaseUrl}${this.to}`;
    }
  }
};
</script>
