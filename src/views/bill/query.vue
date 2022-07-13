<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-08 13:42:35
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-08 17:58:21
-->
<template>
  <div class="container" style="min-height: 0">
    <b style="font-size: 18px">订单查询</b>
    <div style="margin-top: 14px">
      <span>订单ID：</span>
      <el-input
        v-model="orderId"
        style="width: 250px;margin-right: 10px"
      />
      <el-button type="primary" :loading="btnLoad" @click="select">查询</el-button>
    </div>
    <div v-show="queryEnd || detailTable.length > 0">
      <a-divider dashed />
      <bill-table :data="detailTable" :order-id.sync="orderId" />
    </div>
  </div>
</template>

<script>
import BillTable from './_components/queryTable'
import { fhGetOneFinance } from '@/api/finance'
export default {
  components: {
    BillTable
  },
  data() {
    return {
      detailTable: [],
      orderId: '',
      btnLoad: false,
      queryEnd: false
    }
  },
  methods: {
    async fhGetOneFinance(orderId) {
      this.btnLoad = true
      try {
        const { results } = await fhGetOneFinance(orderId)
        this.queryEnd = true
        this.detailTable = []
        results && this.detailTable.push(results)
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    select() {
      if (this.orderId !== '') {
        this.fhGetOneFinance(this.orderId)
      } else {
        this.$message.error('订单号不能为空')
      }
    }
  }
}
</script>
