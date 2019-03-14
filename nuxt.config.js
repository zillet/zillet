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
    description: 'Lightweight UX focused Zilliqa wallet',
    theme_color: '#00c2b6',
    background_color: '#2a2f39',
    scope: '/',
    start_url: '/',
    display: 'standalone'
  },
  loading: { color: '#fff' },
  css: [
    {
      src: '~/assets/css/main.scss',
      lang: 'scss'
    }
  ],
  plugins: [
    '@/plugins/qrcode',
    '@/plugins/zilliqaComponenets',
    '@/plugins/axios',
    '@/plugins/notify',
    '@/plugins/zilliqa',
    '@/plugins/nuxtClientInit'
  ],
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],
  axios: {
    baseURL: process.env.API_BASE_URL
      ? process.env.API_BASE_URL
      : 'http://localhost:4200/'
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
