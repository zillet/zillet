export default {
  mode: 'spa',
  srcDir: 'app/',
  head: {
    title: 'Zilliqa Wallet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'UI/UX Focused light Zilliqa Wallet'
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600,700'
      }
    ]
  },

  loading: { color: '#fff' },
  css: [
    '~/assets/css/tailwind.css',
    {
      src: '~/assets/css/main.scss',
      lang: 'scss'
    }
  ],
  plugins: [
    '@/plugins/vue-qrcode',
    '@/plugins/vue-zilliqa',
    '@/plugins/axios',
    '@/plugins/vue-notify',
    { src: '@/plugins/zilliqa', ssr: false }
  ],
  modules: ['@nuxtjs/axios'],
  axios: {
    baseURL: process.env.API_BASE_URL
      ? process.env.API_BASE_URL
      : 'http://localhost:4200/'
    // See https://github.com/nuxt-community/axios-module#options
  },
  build: {
    extend(config, ctx) {
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
    }
  }
};
