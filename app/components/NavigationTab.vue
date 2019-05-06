<template>
  <div class="tabs">
    <input
      id="tab1"
      :checked="$route.name=='send'"
      type="radio"
      name="tab-control">
    <input
      id="tab2"
      :checked="$route.name=='transactions'"
      type="radio"
      name="tab-control">
    <input
      id="tab3"
      :checked="$route.name=='info'"
      type="radio"
      name="tab-control">
    <ul>
      <li
        title="Send Zilliqa"
        @click="$emit('tabSelected', 'send')">
        <label
          for="tab1"
          role="button">
          <i class="eva eva-diagonal-arrow-right-up-outline font-semibold mr-2" />
          <span>Send Zilliqa</span>
        </label>
      </li>
      <li
        title="Transactions"
        @click="$emit('tabSelected', 'transactions')">
        <label
          for="tab2"
          role="button">
          <i class="eva eva-clock-outline font-semibold mr-2" />
          <span>Transactions</span>
          <!-- <div class="pending-transactions"> 2</div> -->
        </label>
      </li>
      <li
        title="Wallet Info"
        @click="$emit('tabSelected', 'info')">
        <label
          for="tab3"
          role="button">
          <i class="eva eva-eye-outline font-semibold mr-2" />
          <span>Wallet Info</span>
        </label>
      </li>
    </ul>
    <div class="slider">
      <div class="indicator" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ZTab'
};
</script>
<style lang="scss" scoped>
@import './../assets/css/_variables.scss';
@import './../assets/css/_mixins.scss';
/* colors */

/* tab setting */
$tab-count: 3;
$indicator-width: 5.33rem;
$indicator-height: 0.2rem;

/* breakpoints */
$breakpoints: (
  medium: #{$tab-count * 240px},
  small: #{$tab-count * 170px}
);

/* selectors relative to radio inputs */
$label-selector: '~ ul > li';
$slider-selector: '~ .slider';
$content-selector: '~ .content > section';

@mixin tabs(
  $label-selector: $label-selector,
  $slider-selector: $slider-selector,
  $content-selector: $content-selector
) {
  @for $i from 1 through $tab-count {
    &:nth-of-type(#{$i}):checked {
      #{$label-selector}:nth-child(#{$i}) {
        @content;
      }

      #{$slider-selector} {
        transform: translateX(#{100% * ($i - 1)});
      }

      #{$content-selector}:nth-child(#{$i}) {
        display: block;
      }
    }
  }
}

.tabs {
  min-width: #{$tab-count * 11rem};
  @include mobile {
    min-width: 100%;
  }
  input[name='tab-control'] {
    display: none;
  }

  .content section h2,
  ul li label {
    @apply font-semibold text-primary;
  }

  ul {
    list-style-type: none;
    @apply pl-0 flex flex-row mb-2 justify-between items-end flex-wrap;
    li {
      box-sizing: border-box;
      @apply flex-1 px-6 cursor-pointer;
      text-align: center;
      width: #{100% / $tab-count};
      &:nth-child(1) {
        @apply pl-0;
        @include mobile {
          @apply pl-6;
        }
      }
      label {
        @include no-select;
        transition: all 0.3s ease-in-out;
        @apply text-gray-700;
        padding: 5px auto;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        white-space: nowrap;
        -webkit-touch-callout: none;
        @apply flex flex-row items-center justify-center relative;
        br {
          display: none;
        }
        &:hover,
        &:focus,
        &:active {
          outline: 0;
          @apply text-gray-600;
        }
      }
    }
  }

  .slider {
    position: relative;
    width: #{100% / $tab-count};
    transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
    .indicator {
      position: relative;
      width: $indicator-width;
      max-width: 100%;
      margin: 0 20%;
      height: $indicator-height;
      @apply bg-primary;
      border-radius: 1px;
    }
  }
  input[name='tab-control'] {
    @include tabs {
      > label {
        cursor: default;
        @apply text-primary;
        @media (max-width: map-get($breakpoints, small)) {
          background: rgba(0, 0, 0, 0.08);
          @apply flex flex-col;
          span {
            @apply font-semibold;
          }
        }
      }
    }
  }

  @keyframes content {
    from {
      opacity: 0;
      transform: translateY(5%);
    }
    to {
      opacity: 1;
      transform: translateY(0%);
    }
  }

  @media (max-width: map-get($breakpoints, medium)) {
    ul li label {
      white-space: initial;
    }
  }

  @media (max-width: map-get($breakpoints, small)) {
    ul li label {
      padding: 5px;
      border-radius: 5px;
      @apply flex flex-col;
      span {
        @apply font-semibold text-sm;
      }
    }

    .slider {
      display: none;
    }
  }
}
.pending-transactions {
  @apply absolute right-0 text-xs bg-gray-200 rounded;
  top: -0.25rem;
  padding: 0.1rem 0.4rem;
}
</style>
