/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-26 14:19:27
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-09 11:46:55
 */
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 是否膳食商家或零售商家
    isRestaurant() {
      return ['retail', 'restaurant'].includes(this.type)
    }
  }
}
