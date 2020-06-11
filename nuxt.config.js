const { ENV } = require("./configs/env");

const routerConfig = {};
if (ENV.BASE_URL) {
  routerConfig.base = ENV.BASE_URL;
}

const generate = {};
if (ENV.GENERATE_ERROR_PAGE) {
  generate.routes = ["/403", "/404", "/500"];
}

module.exports = {
  mode: "universal",

  srcDir: "app",

  router: {
    ...routerConfig
  },

  render: {
    /**
     * compression を通すと2重に Gzip がかかりブラウザが表示できないので
     * なにもしないミドルウェアを定義しておく
     */
    compressor: (req, res, next) => {
      next();
    }
  },

  /*
   ** Headers of the page
   */
  head: {
    title: "Nuxt.js on AWS Lambda",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "Nuxt.js project" }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/assets/favicon.ico" }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#fff" },
  /*
   ** Global CSS
   */
  css: ["@/assets/scss/base.scss"],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["plugins/partials"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    ['@nuxtjs/moment', ['ja']]
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
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },

  generate,

  env: {
    GENERATE_ERROR_PAGE: ENV.GENERATE_ERROR_PAGE,
    NODE_VERSION: process.versions.node
  }
};
