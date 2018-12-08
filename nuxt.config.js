export default {
  mode: 'spa',
  srcDir: 'app/',

  /*
  ** Headers of the page
  */
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
    node: {
      name: 'Zilliqa V3',
      url: process.env.API_BASE_URL
        ? process.env.API_BASE_URL
        : 'http://localhost:4200/'
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/tailwind.css',
    {
      src: '~/assets/css/main.scss',
      lang: 'scss'
    }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vue-qrcode',
    '@/plugins/vue-zilliqa',
    '@/plugins/vue-notify',
    '@/plugins/fetch',
    { src: '@/plugins/zilliqa', ssr: false }
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
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
