<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-03-29 05:52:51
 * @LastEditors: HJ
 * @LastEditTime: 2021-06-25 17:38:47
-->
<template>
  <div class="container" style="min-height: 0">
    <div v-loading="headLoad">
      <div style="display: flex">
        <b style="margin-right: 25px; font-size: 14px">
          账单周期：{{ header.date }}
        </b>
        <b style="font-size: 14px">店铺数量：{{ header.storeCount }}</b>
      </div>
      <a-divider dashed />
      <Statistic :tag-list="info" :tag-data="header" />
    </div>
    <a-divider dashed />
    <b style="font-size: 18px">订单明细</b>
    <Table :source="list" :loading="listLoad" style="margin-top: 20px" />
    <Pagination
      :auto-scroll="autoScroll"
      :total="total"
      @pagination="getFinanceDetailList"
    />
  </div>
</template>

<script>
import Statistic from '@/components/Statistic'
import { fhGetFinanceDetailHeader, fhGetFinanceDetailList } from '@/api/finance'
import Table from './_components/BillTable'
import Pagination from '@/components/Pagination'
import { headerKeys } from './_utils'
export default {
  components: {
    Table,
    Pagination,
    Statistic
  },
  data() {
    return {
      total: 0,
      header: {},
      list: [{}],
      headLoad: false,
      listLoad: false,
      autoScroll: false,
      query: {},
      info: headerKeys
    }
  },
  created() {
    this.query['startTime'] = this.$route.params.date
    this.query['endTime'] = this.$route.params.date
    this.getFinanceDetailHead(this.query)
    this.getFinanceDetailList(this.query)
  },
  methods: {
    async getFinanceDetailHead(params) {
      this.headLoad = true
      try {
        const { results } = await fhGetFinanceDetailHeader(params)
        this.header = results
      } catch (err) {
        console.log(err)
      }
      this.headLoad = false
    },
    async getFinanceDetailList(params) {
      this.listLoad = true
      params = Object.assign(params, this.query)
      try {
        const { results, count } = await fhGetFinanceDetailList(params)
        this.list = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
      this.listLoad = false
    }
  }
}
</script>

<style scoped lang="scss">
.colCol {
  display: flex;
  flex-flow: column;
  margin-bottom: 12px;
  span {
    font-size: 14px;
    color: #666666;
    margin-bottom: 6px;
  }
  b {
    font-size: 18px;
  }
}
</style>
