<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-20 14:55:27
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-20 10:13:24
-->
<template>
  <div class="flex outer">
    <span>{{ label }}：</span>
    <div class="money">
      <slot name="num" />
      <span v-if="first" style="margin-right: 25px;">原价：<s>￥{{ first }}</s></span>
      <span>
        ￥
      </span>
      <span>
        {{ value || 0 }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowInfo',
  props: {
    label: {
      type: String,
      default: ''
    },
    first: {
      type: [String, Number],
      default: ''
    },
    value: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.outer {
  justify-content: space-between;
  * {
    flex: none;
  }
}

.money {
  display: inline-block;
  text-align: right;
}
</style>
