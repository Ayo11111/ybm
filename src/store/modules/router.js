/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-21 10:51:54
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-29 19:46:46
 */
import axios from 'axios'
import { generator, baseRouters } from '@/router/generator-routers'
import { deepClone } from '@/utils'
const state = {
  pageCache: [],
  routers: [],
  controllableRoutes: [],
  routerFlag: false,
  childrenRouter: [],
  axiosCancel: {
    token: null,
    cancel: null
  }
}

const mutations = {
  /**
   * page {路由}
   */
  SET_CACHE: (state, pages) => {
    state.pageCache = pages
  },
  SET_ROUTERS: (state, routers) => {
    const tempRouter = deepClone(routers)
    state.routers = baseRouters.concat(routers)
    state.controllableRoutes = tempRouter
  },
  SET_ROUTER_FLAG: (state, flag) => {
    state.routerFlag = flag
  },
  SET_CHILDREN_ROUTER: (state, children) => {
    state.childrenRouter = children
  },
  SET_CANCEL_TOKEN: (state, source) => {
    state.axiosCancel = source
  }
}

const actions = {
  // 创建路由
  GenerateRoutes({ commit }, data) {
    return new Promise(resolve => {
      const routers = generator(data)
      const tempChildren = routers
        .map(i => {
          const { children } = i
          return children
        })
        .flat(Infinity)
      commit('SET_ROUTERS', routers)
      commit('SET_ROUTER_FLAG', true)
      commit('SET_CHILDREN_ROUTER', tempChildren)
      resolve(routers)
    })
  },
  // 设置需要缓存的路由
  setPage({ commit, state }, page) {
    const { pageCache } = state
    const temp = new Set(pageCache)
    temp.add(page)
    const res = [...temp]
    commit('SET_CACHE', res)
  },
  // 移除缓存的页面
  removePage({ commit, state }, page) {
    const { pageCache } = state
    const temp = new Set(pageCache)
    temp.delete(page)
    commit('SET_CACHE', [...temp])
  },
  // 清除缓存的所有页面
  clearPage({ commit }) {
    commit('SET_CACHE', [])
  },
  // 设置路由标识
  setRouterFlag({ commit }, flag) {
    commit('SET_ROUTER_FLAG', flag)
  },
  // 跳转路由的时候创建新的axios取消token
  createAxiosCancelToken({ commit }) {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    commit('SET_CANCEL_TOKEN', source)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
