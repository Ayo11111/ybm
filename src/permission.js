/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-28 14:28:20
 */

import router from './router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import { getUserInfo } from '@/utils/auth'
import { Message } from 'element-ui'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
// 处理路由下一步
const handlerNext = (next, params) => {
  const { cancel } = store.state.router.axiosCancel
  cancel && cancel()
  store.dispatch('router/createAxiosCancelToken')
  next(params)
}
// 使用线上路由发方法
const baseFn = async (to, from, next, hasGetUserInfo) => {
  if (!store.getters.routerFlag) {
    try {
      const { backUserId } = hasGetUserInfo
      const results = await store.dispatch('user/getUserInfo', backUserId)
      const { router: userRouter, merchantName } = results
      await store.dispatch('router/GenerateRoutes', userRouter)
      store.dispatch('user/setMerchantName', merchantName)
      // console.log(store.getters.routers)
      router.addRoutes(store.getters.routers)
      if (to.path === '/login') {
        handlerNext(next, { path: '/' })
        NProgress.done()
      } else {
        if (hasGetUserInfo) {
          handlerNext(next)
        } else {
          handlerNext(next, `/login`)
          NProgress.done()
        }
      }
      store.dispatch('router/setRouterFlag', true)
    } catch (e) {
      console.log('debug', e)
      store.dispatch('router/setRouterFlag', true)
      handlerNext(next, { path: '/home/page' })
      await store.dispatch('user/logout')
      Message({
        message: '获取用户信息错误，请登出后重新登录',
        type: 'warning',
        duration: 5 * 1000
      })
      store.dispatch('user/logout')
    }
  } else {
    handlerNext(next)
  }
}

// eslint-disable-next-line space-before-function-paren
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = await getToken()
  if (hasToken) {
    const hasGetUserInfo = await getUserInfo()
    await baseFn(to, from, next, hasGetUserInfo)
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      handlerNext(next)
    } else {
      handlerNext(next, `/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
