<template>
  <td
    :data-label="label"
    class="column">
    <span>
      <slot />
    </span>
  </td>
</template>

<script>
export default {
  name: 'ZTableColumn',
  props: {
    label: {
      type: String,
      default: () => ''
    },
    field: {
      type: String,
      default: () => ''
    },
    width: {
      type: [Number, String],
      default: () => ''
    },
    sortable: {
      type: Boolean,
      default: () => false
    },
    visible: {
      type: Boolean,
      default: () => true
    },
    internal: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      newKey: this.label
    };
  },
  beforeMount() {
    this.addRefToTable();
  },
  methods: {
    addRefToTable() {
      if (!this.$parent.$data.isTable) {
        this.$destroy();
        throw new Error('You should wrap columns on a table');
      }
      if (this.internal) return;
      const repeated = this.$parent.newColumns.some(
        column => column.newKey === this.newKey
      );
      !repeated && this.$parent.newColumns.push(this);
    }
  }
};
</script>
<style scoped lang="scss">
.column {
  @apply py-2 px-4 border-b border-gray-300 text-sm text-gray-800;
}
</style>
