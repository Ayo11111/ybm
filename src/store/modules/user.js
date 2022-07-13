/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-09 11:59:02
 */
import { fhLogin, fhRefreshToken } from '@/api/users'
import { fhGetUserInfo } from '@/api/user'
import {
  setToken,
  removeToken,
  setUserInfo,
  setAccount,
  setStoreId,
  setMerchantManagerType,
  setOrderMode
} from '@/utils/auth'

import { resetRouter } from '@/router'
import { isEmpty } from 'lodash'

const getDefaultState = () => {
  return {
    token: '',
    name: '',
    avatar: '',
    uuid: '',
    merchantName: '',
    orderMode: 0,
    storeId: null,
    merchantInfo: null,
    merchantTypeName: {
      restaurant: '餐饮',
      nurse: '护理',
      retail: '零售'
    }
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: async state => {
    await setStoreId(null)
    await setUserInfo(null)
    await setMerchantManagerType(null)
    await setToken(null)
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_UUID: (state, uuid) => {
    state.uuid = uuid
  },
  SET_NAME: (state, name) => {
    state.merchantName = name
  },
  SET_MERCHANT_INFO: (state, info) => {
    state.merchantInfo = info
  },
  SET_STORE_ID: (state, id) => {
    state.storeId = id
  },
  SET_ORDER_MODE: (state, mode) => {
    state.orderMode = mode
  }
}

const actions = {
  login({ commit }, userInfo) {
    const { account, password, captchaCode, uuid, webType } = userInfo
    return new Promise((resolve, reject) => {
      fhLogin({ account: account.trim(), password, captchaCode, uuid, webType })
        .then(response => {
          const { results } = response
          const { token, backUserId } = results
          commit('SET_TOKEN', token)
          setToken(token)
          setAccount(account)
          setUserInfo(results)
          fhGetUserInfo(backUserId, { webType: 'merchant' })
            .then(res => {
              if (results) {
                if (res === 2005) {
                  commit('SET_TOKEN', '')
                  setToken('')
                  resolve({
                    code: res,
                    backUserId
                  })
                } else {
                  setToken(token)
                  resolve(response)
                }
              }
            })
            .catch(err => {
              commit('SET_TOKEN', '')
              setToken('')
              reject(err)
            })
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // 获取登录用户的信息
  getUserInfo({ commit, dispatch }, backUserId) {
    return new Promise((resolve, reject) => {
      fhGetUserInfo(backUserId, { webType: 'merchant' })
        .then(async res => {
          const { results } = res
          // eslint-disable-next-line no-unused-vars
          const { storeList, router, merchantManagerType, ...info } = results
          const storeId = isEmpty(storeList) ? null : storeList[0].id
          await setStoreId(storeId)
          commit('SET_STORE_ID', storeId)
          await setMerchantManagerType(merchantManagerType)
          commit('SET_MERCHANT_INFO', { ...info, storeId, merchantManagerType })

          const orderMode = isEmpty(storeList) ? null : storeList[0].storeType
          await setOrderMode(orderMode)
          commit('SET_ORDER_MODE', orderMode)

          resolve(results)
        })
        .catch(e => {
          dispatch('router/setRouterFlag', true)
          dispatch('user/logout')
          reject(Error(e))
        })
    })
  },

  // 保存商户名称
  setMerchantName({ commit }, name) {
    commit('SET_NAME', name)
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // 刷新token
  refreshToken({ commit }, tokenInfo) {
    return new Promise((resolve, rejects) => {
      fhRefreshToken(tokenInfo)
        .then(async res => {
          const { results } = res
          const { token } = results
          commit('SET_TOKEN', token)
          await setToken(token)
          resolve(results)
        })
        .catch(e => {
          rejects(e || new Error('刷新token错误，请重新登录'))
        })
    })
  },

  // 存储登录的UUID
  setCodeImg({ commit }, uuid) {
    commit('SET_UUID', uuid)
  },

  // 获取当前商家类型名称
  getMerchantTypeName({ state }) {
    const { merchantInfo = {}, merchantTypeName } = state || {}
    const { merchantManagerType = 'restaurant' } = merchantInfo || {}
    return merchantTypeName[merchantManagerType]
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
