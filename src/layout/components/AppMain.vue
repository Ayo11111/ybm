<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 09:49:47
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-18 19:53:17
-->

<template>
  <section class="app-main" :style="{paddingTop: paddingTop + 'px'}">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachePage">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachePage() {
      return this.$store.state.router.pageCache
    },
    key() {
      return this.$route.path
    },
    showTips() {
      return this.$store.state.binary.showTips
    },
    paddingTop() {
      return this.$store.state.binary.showTips ? 138 : 100
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 100px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
/* .fixed-header + .app-main {
  padding-top: 100px;
} */
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
