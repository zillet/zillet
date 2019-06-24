require('dotenv').config();
import path from 'path';
export default {
  mode: 'spa',
  srcDir: 'app/',
  head: {
    titleTemplate: '%s | Zillet.io',
    htmlAttrs: { lang: 'en' },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Lightweight UX focused Zilliqa wallet'
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
  env: {
    cryptocompare: {
      url: 'https://min-api.cryptocompare.com/data/price',
      token: process.env.CRYPTOCOMPARE_TOKEN
    }
  },
  workbox: {
    runtimeCaching: [
      {
        urlPattern: 'https://fonts.googleapis.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      },
      {
        urlPattern: 'https://fonts.gstatic.com/.*',
        handler: 'cacheFirst',
        method: 'GET',
        strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
      }
    ]
  },
  manifest: {
    name: 'Zilliqa Wallet',
    short_name: 'Zilliqa',
    lang: 'en',
    description: 'Lightweight UI/UX focused Zilliqa wallet',
    theme_color: '#00c2b6',
    background_color: '#2a2f39',
    scope: '/',
    start_url: '/',
    display: 'standalone'
  },
  css: [
    {
      src: '@/assets/style/index.scss',
      lang: 'scss'
    },
    'balloon-css/balloon.min.css',
    'eva-icons/style/eva-icons.css'
  ],
  plugins: [
    '@/plugins/qrcode',
    '@/plugins/global',
    '@/plugins/axios',
    '@/plugins/notify',
    '@/plugins/zillet',
    '@/plugins/nuxtClientInit',
    '@/plugins/clipboard',
    '@/plugins/jazzicon',
    '@/plugins/vue-filters',
    { src: '@/plugins/vue-cryptoicon', ssr: false },
    '@/plugins/vue-moment',
    '@/plugins/vuelidate'
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-purgecss',
    '@nuxtjs/style-resources',
    '@nuxtjs/proxy',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-139308938-1'
      }
    ]
  ],
  loading: { color: '#3B8070' },
  styleResources: {
    scss: ['~/assets/style/variables.scss', '~/assets/style/mixins.scss']
  },
  proxy: {
    '/zilliqa': 'https://api.viewblock.io/'
  },
  build: {
    postcss: {
      plugins: {
        'postcss-url': {},
        tailwindcss: path.resolve(__dirname, './app/tailwind.config.js'),
        cssnano: {
          preset: 'default',
          discardComments: { removeAll: true },
          zIndex: false
        }
      },
      preset: {
        stage: 0,
        autoprefixer: {
          cascade: false,
          grid: true
        }
      }
    },
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
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
