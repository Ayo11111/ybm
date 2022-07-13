<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-12-07 16:10:26
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-09 14:32:32
-->
<template>
  <el-row>
    <el-col
      v-for="i in config"
      :key="i.field"
      :span="computedSpan(i.span)"
      :pull="computedPull(i.pull)"
    >
      <span class="mr-12">{{ computedLabel(i.label) }}</span>
      <span>{{ forRender(i) }}</span>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'ForRender',
  props: {
    config: {
      type: Array,
      default: () => []
    },
    source: {
      type: Object,
      default: () => {
        return {}
      },
      require: true
    }
  },
  methods: {
    forRender(item) {
      const { source } = this
      const { field, render, suffix = '', fix, placeholder = '----' } = item

      const curr = source[field]

      let res = render
        ? render(curr, source)
        : curr || curr === 0
        ? `${curr}${suffix}`
        : placeholder
      !render && curr && fix && (res = res.toFixed(fix))
      return res
    },
    // 构建label
    computedLabel(label) {
      return typeof label === 'function' ? label() : label
    },
    // 构建span
    computedSpan(span) {
      return typeof span === 'function' ? span() : span
    },
    // 构建span
    computedPull(pull) {
      return typeof pull === 'function' ? pull() : pull
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
