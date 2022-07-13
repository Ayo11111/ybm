<!--
 * @Descripttion: 
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-12 18:20:57
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-01 15:33:04
-->
<template>
  <div class="container">
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane label="铃声设置" name="audio"><Audio /></el-tab-pane>
      <el-tab-pane label="打印机设置" name="print"><print /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Audio from './audio.vue'
import print from './print.vue'
export default {
  name: 'SettingIndex',
  components: { print, Audio },
  data() {
    return {
      activeName: 'audio'
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: transparent;
  padding: 0;
}
</style>
