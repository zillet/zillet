export default {
  mode: 'spa',
  srcDir: 'app/',
  head: {
    title: 'Zilliqa Wallet',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
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
  env: {
    price: {
      url: 'https://min-api.cryptocompare.com/data/price',
      token: '4ea3a76a9d52024ae367e5765e9c1932cb2fea1cc1b09cb98f3222edcaa53462'
    }
  },
  loading: { color: '#4dc0b5' },
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
    { src: '~/plugins/nuxt-client-init.js', ssr: false },
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
      config.node = {
        fs: 'empty'
      };
    }
  }
};
