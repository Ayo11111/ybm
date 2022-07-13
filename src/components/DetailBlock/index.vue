<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-03 08:19:39
 * @LastEditors: HJ
 * @LastEditTime: 2020-07-29 17:34:04
-->
<template>
  <div class="box">
    <div class="header dp-flex fx-jsb">
      <div class="title">
        <span class="ml-12 mr-12">{{ title }}</span>
        <slot name="title" />
      </div>
      <div class="fun">
        <slot name="header" />
      </div>
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailBlock',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  background: #fff;
  border-radius: 7px;
  padding: 24px;
  .header {
    margin-bottom: 35px;
    .title {
      &::before {
        content: ' ';
        display: inline-block;
        position: relative;
        width: 4px;
        height: 14px;
        vertical-align: middle;
        background: #52ACFF;
      }

      & > span {
        vertical-align: middle;
      }
    }
  }
}
</style>
