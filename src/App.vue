<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 09:49:47
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-02 10:55:03
-->

<template>
  <a-config-provider :locale="zhCN" :render-empty="renderEmpty">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  name: 'App',
  data() {
    return {
      zhCN
    }
  },
  mounted() {},
  methods: {
    renderEmpty(componentName) {
      return <a-empty description='这里空空如也' />
    }
  }
}
</script>
