import axios from 'axios'
import router from '../router'
import store from '@/store'
import { Message } from 'element-ui'
import { getToken, getUserInfo, getStoreId } from '@/utils/auth'
import { TOKEN_KEY, USER_ID } from '@/store/global-keys'

let isFreshing = false
let isLoginOut = false
let requests = []

const needLogin = message => {
  const { cancel } = store.state.router.axiosCancel
  cancel && cancel()
  store.dispatch('user/logout')
  router.push(`/login?redirect=${router.currentRoute.fullPath}`)
  Message({
    message: message || '您的登录身份已过期，为了安全需要重新登录',
    type: 'warning',
    duration: 5 * 1000
  })
  requests = []
  isLoginOut = false
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 200 * 1000
})

service.interceptors.request.use(
  async config => {
    config.cancelToken = store.state.router.axiosCancel.token
    const { backUserId, merchantId } = (await getUserInfo()) || {}
    const storeId = (await getStoreId()) || ''
    const token = await getToken()
    const { url } = config
    if (!/common-dev/.test(url)) {
      config.url = url
        .replace('MERCHANTID', merchantId)
        .replace('STOREID', storeId)
      if (token) {
        config.headers[TOKEN_KEY] = token
      }
      if (backUserId) {
        config.headers[USER_ID] = backUserId
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  async response => {
    const res = response.data || {}
    const { code, message } = res
    const url = response.config.url
    if (code) {
      if ([3000, 1001].includes(code)) {
        if (isLoginOut) return
        isLoginOut = true
        needLogin(message)
        throw Error('需要重新登录')
      } else if (code === 1101) {
        // 手动删除token
        needLogin(message)
        throw Error()
      } else if (code === 1002) {
        // 刷新token
        const config = response.config
        const token = await getToken()
        const { backUserId } = await getUserInfo()

        if (!isFreshing) {
          isFreshing = true
          return store
            .dispatch('user/refreshToken', { oldToken: token, backUserId })
            .then(async res => {
              const token = await getToken()
              isFreshing = false
              requests.forEach(i => i(token))
              return service(config)
            })
            .catch(e => needLogin(message))
        } else {
          return new Promise(res => {
            requests.push(token => {
              config.baseURL = ''
              config.headers[TOKEN_KEY] = getToken()
              config.headers[USER_ID] = backUserId
              res(service(config))
            })
          })
        }
      } else if (code === 2002 || code === 5002) {
        return res
      } else if (code === 3032) {
        return res
      } else if (code === 520) {
        Message({
          dangerouslyUseHTMLString: true,
          message: `<span>${res.message || 'Error'}</span>`,
          type: 'warning',
          duration: 5 * 1000
        })
        throw Error(res.message || 'Error')
      } else if (code !== 200) {
        if (code === 2005) {
          return code
        } else {
          if (/错误代码/.test(res.message)) {
            return res
          } else {
            Message({
              message: res.message || 'Error',
              type: 'warning',
              duration: 5 * 1000
            })
            throw Error(res.message || 'Error')
          }
        }
      } else {
        return res
      }
    } else {
      if (/\/capcha/.test(url)) {
        store.dispatch('user/setCodeImg', response.headers['captcha-uuid'])
      }
      return res
    }
  },
  error => {
    if (axios.isCancel(error)) return Promise.reject('取消请求')
    console.log('网络错误 :' + error)

    const { status } = error.response || {}
    Message({
      message: `您的网络开了个小差，请检查网络后重试，code：${status}`,
      type: 'warning',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
