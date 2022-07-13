/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-08-18 11:10:41
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-18 11:12:58
 */
const state = {
  showTips: false
}

const mutations = {
  setShowTips(state, bool) {
    state.showTips = bool
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
