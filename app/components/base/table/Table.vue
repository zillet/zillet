<template>
  <!-- eslint-disable vue/no-use-v-if-with-v-for -->
  <!-- eslint-disable vue/valid-v-for  -->
  <div>
    <table
      class="text-left w-full bc-table"
      style="border-collapse: separate;border-spacing: 0 1em;">
      <thead>
        <tr>
          <th
            v-if="checkable"
            width="20"
            class="table-header checkbox-header" />
          <th
            v-for="(column, index) in newColumns"
            v-if="column.visible || column.visible === undefined"
            :key="index"
            :style="{ width: column.width + 'px' }"
            :class="{'cursor-pointer': column.sortable}"
            class="table-header"
            @click="emitSort(column)">
            <div>
              <template>
                {{ column.label }}
                <span v-if="column.sortable && sortOpt.sortBy===column.field">
                  <i
                    v-show="sortOpt.sortOrder==1"
                    class="eva eva-arrow-upward-outline" />
                  <i
                    v-show="sortOpt.sortOrder!=1"
                    class="eva eva-arrow-downward-outline"
                    style="position:relative; top:2px" />
                </span>
              </template>
            </div>
          </th>
        </tr>
      </thead>
      <tbody v-if="loading">
        <tr>
          <td>
            <vov-loader
              style="height:500px" />
          </td>
        </tr>
      </tbody>
      <tbody
        v-else-if="data.length && !loading"
        :css="false">
        <template v-for="(row, index) in data">
          <tr
            :key="uniqueKey? row[uniqueKey] :index"
            class="border hover:shadow-sm rounded mobile:p-4"
            @click="$emit('rowClicked', row, index)">
            <td
              v-if="checkable"
              width="20"
              class="checkbox-column">
              <input
                :id="row[uniqueKey] ? row[uniqueKey] :index"
                :key="row[uniqueKey] ? row[uniqueKey] :index"
                :value="isRowChecked(row[uniqueKey] ? row[uniqueKey] :index)"
                :checked="isRowChecked(row[uniqueKey] ? row[uniqueKey] :index)"
                type="checkbox"
                @change="toggleCheckbox(row)">
            </td>
            <slot
              v-if="$scopedSlots.default"
              :row="row"
              :index="index"
            />
            <template v-else>
              <MbTableColumn
                v-for="column in newColumns"
                :key="column.field"
                v-bind="column"
                internal>
                <template>
                  {{ getValueByPath(row, column.field) }}
                </template>
              </MbTableColumn>
            </template>
          </tr>
        </template>
      </tbody>
    </table>
    <div
      v-if="pagination && !loading"
      class="mt-8">
      <ul class="flex list-reset w-auto justify-center">
        <li>
          <a
            :class="{'cursor-not-allowed':paginationOpt.currentPage<=1}"
            class="pagination-button bg-gray-200 text-gray-600 hover:text-primary"
            href="#"
            @click="prevBtn(paginationOpt.currentPage-1)">
            <span>
              <i
                class="eva eva-arrow-ios-back-outline relative"
                style="top:2px;" />
            </span>
          </a>
        </li>
        <li
          v-for="index in pageLength"
          v-if="maxPaginationBtn(index)"
          :key="index"
          class="text-gray-600">
          <a
            :class="paginationOpt.currentPage == (index) ?
              `bg-primary text-white hover:text-white` :
              `bg-gray-200 hover:text-primary text-gray-600`"
            class="pagination-button"
            href="#"
            @click="indexBtn(index)">
            <span
              v-if="(index >
                paginationOpt.currentPage + 1 && index!= pageLength) ||
                (paginationOpt.currentPage - 1 > index && index!=1)">
              ...
            </span>
            <span v-else>
              {{ index }}
            </span>
          </a>
        </li>
        <li>
          <a
            :class="{'cursor-not-allowed':paginationOpt.currentPage >= pageLength-1}"
            class="pagination-button bg-gray-200 text-gray-600 hover:text-primary"
            href="#"
            @click="nextBtn(paginationOpt.currentPage+1)">
            <span>
              <i
                class="eva eva-arrow-ios-forward-outline relative"
                style="top:2px;" />
            </span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getValueByPath, roundUp } from './helpers';
import TableColumn from './TableColumn';
import Vue2Filters from 'vue2-filters';
export default {
  name: 'ZTable',
  components: {
    [TableColumn.name]: TableColumn
  },
  mixins: [Vue2Filters.mixin],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    pagination: {
      type: Boolean,
      default: () => false
    },
    paginationOpt: {
      type: Object,
      default: () => {
        return {};
      }
    },
    sortOpt: {
      type: Object,
      default: () => {
        return {};
      }
    },
    checkable: {
      type: Boolean,
      default: () => false
    },
    uniqueKey: {
      type: String,
      default: 'index'
    },
    selectedRows: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getValueByPath,
      roundUp,
      newColumns: [...this.columns],
      isTable: true,
      checkedRows: [...this.selectedRows]
    };
  },
  computed: {
    pageLength() {
      return this.paginationOpt.totalPages;
    },
    screenSize() {
      return window.innerWidth || screen.width;
    }
  },
  watch: {
    columns: {
      handler(value) {
        this.newColumns = [...value];
      }
    },
    selectedRows: {
      handler(val) {
        this.checkedRows = val;
      }
    }
  },
  methods: {
    maxPaginationBtn(index) {
      return (
        (index <=
          this.paginationOpt.currentPage +
            roundUp(this.paginationOpt.show / 2, 0) &&
          index >
            this.paginationOpt.currentPage -
              roundUp(this.paginationOpt.show / 2, 0) -
              1) ||
        index == 1 ||
        index == this.paginationOpt.totalPages
      );
    },
    isRowChecked(index) {
      return this.checkedRows.some(item => {
        return item[this.uniqueKey] === index;
      });
    },
    toggleCheckbox(row, index) {
      row.index = index;
      if (!this.isRowChecked(row[this.uniqueKey])) {
        this.checkedRows.push(row);
      } else {
        this.checkedRows = this.checkedRows.filter(item => {
          return item[this.uniqueKey]
            ? item[this.uniqueKey] != row[this.uniqueKey]
            : item.index !== row[this.uniqueKey];
        });
      }
      this.$emit('selectionChange', row, this.checkedRows);
    },
    prevBtn(number) {
      if (number > 0) {
        this.$emit('pageChange', number);
      }
    },
    nextBtn(number) {
      if (number <= this.paginationOpt.totalPages) {
        this.$emit('pageChange', number);
      }
    },
    indexBtn(number) {
      if (number != this.paginationOpt.currentPage) {
        this.$emit('pageChange', number);
      }
    },
    emitSort(col) {
      if (col.sortable) {
        this.$emit('sortChange', col.field);
      }
    }
  }
};
</script>
<style scoped lang="scss">
.bc-table {
  border-collapse: separate;
  border-spacing: 0 1em;
  td {
    // @apply text-sm font-semibold border-b border-gray-300;
  }
}
.table-header {
  @apply py-2 px-4  font-medium;
  @apply text-sm font-semibold border-b border-gray-300 bg-gray-100;
}
.checkbox-header {
  @apply pr-0;
}
.pagination-button {
  @apply block  px-3 rounded py-2 mx-1 text-xs font-semibold;
}
// TODO: Add media queries
@media screen and (max-width: 992px) and (min-width: 300px) {
  .bc-table {
    thead {
      visibility: hidden;
      display: none;
    }
    td {
      &::before {
        content: attr(data-label);
        @apply font-semibold pr-2 text-left;
      }
      @apply flex w-auto justify-between text-right border-gray-200 px-0;
    }
    tr {
      @apply mb-8 cursor-pointer;
      max-width: 100%;
      position: relative;
      display: block;
    }
  }
}
.checkbox-column {
  @apply py-3 pl-4 pr-0 border-b border-gray-200 text-base text-gray-800;
}
.slide-fade-enter-active {
  transition: all 0.1s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for <2.1.8 */ {
  transform: translateY(10px);
  opacity: 0;
}

.shuffleSlow-move {
  transition: transform 2s;
}

.shuffleMedium-move {
  transition: transform 0.7s;
}

.shuffleFast-move {
  transition: transform 0.5s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
