/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-02 11:35:25
 */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import router from './modules/router'
import order from './modules/order'
import binary from './modules/binary'
import audio from './modules/audio'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    router,
    order,
    binary,
    audio
  },
  getters
})

export default store
