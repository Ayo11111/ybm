/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-23 14:18:38
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-28 16:10:43
 */
const state = {
  count: 0,
  newCount: 0,
  menu: {
    1: 0,
    8: 0,
    2: 0,
    9: 0
  },
  change: false
}

const mutations = {
  addCount(state, count) {
    state.count += count
    state.newCount += count
  },
  reduceCount(state, count) {
    if (state.count) {
      state.count -= count
    }
    if (state.newCount) {
      state.newCount -= count
    }
  },
  setMenuCount(state, params) {
    console.log(params)
    let count = (state.menu[params.id] += params.count)
    if (count) {
      state.menu = Object.assign({}, state.menu, { [params.id]: count })
    }
    if (state.count + params.count >= 0) {
      state.count += params.count
    }
    if (state.newCount + params.count >= 0) {
      state.newCount += params.count
    }
  },
  countTo0(state, id) {
    state.menu[id] = 0
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
