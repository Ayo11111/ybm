<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-10 14:05:50
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-09 16:01:45
-->
<template>
  <div class="container" style="padding: 0;background: none">
    <el-tabs v-model="paneItem">
      <el-tab-pane label="店铺信息" name="storeInfo">
        <StoreInfo />
      </el-tab-pane>
      <el-tab-pane label="营业资质" name="business">
        <Business />
      </el-tab-pane>
      <el-tab-pane label="合同协议" name="agreement">
        <Agreement />
      </el-tab-pane>
      <el-tab-pane label="结算信息" name="settlement">
        <Settlement />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import StoreInfo from './_components/storeInfo.vue'
import Business from './_components/business.vue'
import Agreement from './_components/agreement.vue'
import Settlement from './_components/settlement.vue'
export default {
  components: {
    StoreInfo,
    Business,
    Agreement,
    Settlement
  },
  data() {
    return {
      paneItem: 'storeInfo'
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__header {
  background: #fff;
  padding: 5px 15px 15px 15px;
}
</style>
