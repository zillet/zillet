<template>
  <button
    :class="{
      'cursor-not-allowed opacity-75': loading || $attrs.disabled,
      'hover:shadow-md': !loading ,
      'bg-teal text-white hover:bg-teal-dark': type==='primary',
      'bg-red text-white hover:bg-red-dark': type==='danger',
      'bg-green text-white hover:bg-green-dark': type==='success',
      'bg-yellow text-white hover:bg-yellow-dark': type==='warning',
      'bg-white text-grey-darkest border hover:shadow-none': type==='default',
      'font-bold px-8 my-4': size==='default',
      'px-4 my-0': size==='small',
    }"
    v-bind="$attrs"
    type="button"
    v-on="$listeners">
    <!-- <div
      v-if="loading"
      class="loader loader--style1"
      title="0">
      <svg
        id="loader-1"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="24"
        height="24"
        viewBox="0 0 40 40"
        enable-background="new 0 0 40 40"
        xml:space="preserve">
        <path
          opacity="0.2"
          fill="#000"
          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
            s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
            c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"/>
        <path
          fill="#ffffff"
          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
            C22.32,8.481,24.301,9.057,26.013,10.047z">
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.5s"
            repeatCount="indefinite"/>
        </path>
      </svg>
    </div> -->
    <div
      :class="{
        'my-2 text-sm font-semibold': size==='small', 
        'my-3': size==='default'}" >
      <slot />
    </div>
  </button>
</template>
<script>
export default {
  name: 'ZButton',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: 'default'
    }
  }
};
</script>
