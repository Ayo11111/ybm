/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 09:49:47
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-14 21:41:39
 */

import Vue from 'vue'

import 'ant-design-vue/dist/antd.less'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import '../src/element/theme/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

// // 指引库
// import 'driver.js/dist/driver.min.css' // 引入css
// import Driver from 'driver.js' // 引入库

import App from './App'
import store from './store'
import router from './router'
import Antd from 'ant-design-vue'
import TmEmpty from '@/components/TmEmpty/index.js'
import VTrackevent from 'vue-trackevent' // 数据统计
import GoEasy from 'goeasy'

import '@/icons' // icon
import '@/permission' // permission control

import moment from 'moment'
import echarts from 'echarts'
import PermissionHelper from '@/utils/permission'
import getRowClass from '@/utils/tableHeaderClass.js'

// sentry
import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/tracing'
import { creatAudio } from '@/utils/audio'

Vue.use(PermissionHelper)
Vue.use(Antd)
Vue.use(TmEmpty)
Vue.use(ElementUI, { locale, size: 'medium' })

const _MUSIC_URL =
  process.env.VUE_APP_MUSIC ||
  'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/audio/audio.mp3'

Vue.prototype.$audio = creatAudio('audio', _MUSIC_URL)

Vue.config.productionTip = false
Vue.prototype.$moment = moment
Vue.prototype.$echarts = echarts
Vue.prototype.$getRowClass = getRowClass

Vue.prototype.$bus = new Vue()

const defaultAnalytics = {
  debug: true
}

const createAnalyticsScript = url => {
  if (!url) return
  const hm = document.createElement('script')
  hm.src = url
  const s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
}

const analytics = {
  baidu: {
    init() {
      window._hmt = window._hmt || [] // 挂载到window上
      createAnalyticsScript(
        '//hm.baidu.com/hm.js?' + process.env.VUE_APP_ANA_HASH
      )
    },
    callback(data) {
      if (data instanceof Array && '_hmt' in window) {
        window._hmt.push(['_trackEvent'].concat(data)) // 上报信息
      }
    }
  }
}

Vue.prototype.$goEasy = new GoEasy({
  host: process.env.VUE_APP_GOEASY_HOST,
  appkey: process.env.VUE_APP_GOEASY_KEY,
  onConnected() {
    console.log('debug socket 连接成功', process.env.VUE_APP_GOEASY_HOST)
  },
  onDisconnected() {
    console.log('连接断开！')
  },
  onConnectFailed(error) {
    console.log('连接失败或错误！', error)
  }
})

Vue.use(VTrackevent, Object.assign({}, defaultAnalytics, analytics['baidu']))
// 初始化sentry
Sentry.init({
  dsn: process.env.VUE_APP_SENTRY_DSN,
  integrations: [
    new VueIntegration({
      Vue,
      tracing: true
    }),
    new Integrations.BrowserTracing()
  ],
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
