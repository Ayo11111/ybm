<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-14 01:18:37
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-04 12:57:03
-->
<template>
  <div>
    <div class="container" style="min-height: 0; padding: 0">
      <el-menu
        :default-active="activeMenu"
        class="el-menu"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="download">报表下载</el-menu-item>
        <el-menu-item index="histories">下载列表</el-menu-item>
      </el-menu>
    </div>

    <div
      v-show="activeMenu === 'download'"
      class="container"
      style="min-height: 0"
    >
      <el-radio-group v-model="downType">
        <el-radio-button label="order">订单数据</el-radio-button>
        <el-radio-button label="goods">商品数据</el-radio-button>
      </el-radio-group>
      <!-- 订单数据 -->
      <download-report
        v-show="downType === 'order'"
        key="order"
        type="order"
        :download-fun="fhExportOrderExcel"
        :fields="currReportFields.order"
      />
      <!-- 商品数据 -->
      <download-report
        v-show="downType === 'goods'"
        key="goods"
        type="goods"
        :download-fun="fhExportCommodityExcel"
        :fields="currReportFields.goods"
      />
    </div>

    <div v-if="activeMenu === 'histories'">
      <historise ref="historise" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fhExportCommodityExcel, fhExportOrderExcel } from '@/api/management'
import DownloadReport from './_components/DownloadReport.vue'
import Historise from './_components/Historise.vue'
import { reportFields, reportNurseFields } from './_utils'
export default {
  components: { DownloadReport, Historise },
  data() {
    return {
      // 当前选中的menu
      activeMenu: 'download',
      // 报表下载字段展示配置
      reportFields,
      // 当前选择下载订单的类型
      downType: 'order'
    }
  },
  computed: {
    ...mapGetters(['merchantInfo']),
    currReportFields() {
      const { merchantManagerType } = this.merchantInfo
      return merchantManagerType === 'nurse' ? reportNurseFields : reportFields
    }
  },
  methods: {
    fhExportCommodityExcel,
    fhExportOrderExcel,
    // 切换menu
    handleSelect(key) {
      this.activeMenu = key
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  .el-menu {
    padding: 0 24px;
  }
}
</style>
