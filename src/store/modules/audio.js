/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-09-02 11:34:30
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-02 18:13:49
 */
const state = {
  count: {}
}

const mutations = {
  setCount(state, data) {
    state.count = data
  }
}

export default {
  namespaced: true,
  mutations,
  state
}
