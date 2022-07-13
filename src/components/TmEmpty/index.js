/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-11 11:57:11
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-11 12:19:21
 */
import TmEmptyCom from './TmEmpty.vue'
const TmEmpty = {
  // install 是默认的方法。当外界在 use 这个组件的时候，就会调用本身的 install 方法，同时传一个 Vue 这个类的参数。
  install: function(Vue) {
    Vue.component('TmEmpty', TmEmptyCom)
  }
}
// 导出
export default TmEmpty
