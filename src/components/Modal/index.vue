<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 17:23:37
 * @LastEditors: HJ
 * @LastEditTime: 2020-07-09 18:28:39
-->
<template>
  <a-modal :visible="show" :title="title" :confirm-loading="confirmLoad" @cancel="hide" @ok="ok">
    <slot />
  </a-modal>
</template>

<script>
export default {
  name: 'HModal',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    confirm: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      show: false,
      confirmLoad: false
    }
  },
  watch: {
    visible: {
      handler: function(v) {
        this.show = v
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    hide() {
      this.show = false
      this.$emit('update:visible', this.show)
    },
    async ok() {
      if (!this.confirm) return
      this.confirmLoad = true
      try {
        await this.confirm()
      } catch (e) {
        console.log(e)
      }
      this.confirmLoad = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
