/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-27 14:38:46
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-27 14:50:59
 */
export const dialog = {
  props: {
    visibled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    visibled(flag) {
      this.show = flag
    }
  },
  methods: {
    controlDialog(flag) {
      this.show = flag
      this.$emit('update:visibled', flag)
    }
  }
}
