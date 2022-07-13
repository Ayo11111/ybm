'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')
function resolve(dir) {
  return path.join(__dirname, dir)
}

// const assetsCDN = {
//   // webpack build externals
//   externals: {
//     vue: 'Vue',
//     'vue-router': 'VueRouter',
//     vuex: 'Vuex',
//     axios: 'axios',
//     moment: 'moment',
//     echarts: 'echarts'
//   },
//   css: [],
//   // https://unpkg.com/browse/vue@2.6.10/
//   js: [
//     'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
//     'https://cdn.bootcss.com/vue-router/3.1.3/vue-router.min.js',
//     'https://cdn.bootcss.com/vuex/3.1.1/vuex.min.js',
//     'https://cdn.bootcss.com/axios/0.19.0/axios.min.js',
//     'https://cdn.bootcss.com/moment.js/2.27.0/moment.min.js',
//     'https://cdn.bootcss.com/echarts/4.8.0/echarts.min.js'
//   ]
// }

const name = defaultSettings.title || '医便民-店铺端' // page title
const port = process.env.port || process.env.npm_config_port || 9529 // dev port
const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: process.env.VUE_APP_PUBLIC_PATH || '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: !isProd,
  productionSourceMap: false,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#52ACFF',
            'link-color': '#52ACFF',
            'border-radius-base': '2px'
          },
          javascriptEnabled: true
        }
      }
    }
  },
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/unmock-api/capcha': {
        target: `https://ybm-dev.thinkmacro.cn`,
        source: true,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/unmock-api': ''
        }
      },
      '/unmock-api/osspolicy': {
        target: `https://ybm-dev.thinkmacro.cn`,
        source: true,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/unmock-api': ''
        }
      },
      '/unmock-api': {
        target: `https://ybm-dev.thinkmacro.cn`,
        source: true,
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/unmock-api': ''
        }
      }
      // '/unmock-api': {
      //   target: `https://ybm-test.thinkmacro.cn`,
      //   source: true,
      //   ws: false,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/unmock-api': ''
      //   }
      // }
    },
    disableHostCheck: true,
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
        '@C': resolve('src/views/component')
      }
    }
    // externals: isProd ? assetsCDN.externals : {}
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    config.plugins.delete('prefetch')

    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(isProd, config => {
      // config.plugin('html').tap(args => {
      //   args[0].cdn = assetsCDN
      //   return args
      // })
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          antdForVue: {
            name: 'chunk-ant-design', // split elementUI into a single package
            priority: 15, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
