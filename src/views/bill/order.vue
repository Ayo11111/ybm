<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-08 13:42:35
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-10 14:49:37
-->
<template>
  <div class="container" style="min-height: 0">
    <el-date-picker
      v-model="query.startTime"
      value-format="yyyy-MM-dd"
      type="date"
      placeholder="选择日期"
      class="mb-12"
      @change="timeChange"
    />
    <div
      v-show="header.totalPrice || header.totalPrice === 0"
      class="mb-12"
      style="font-size: 10px"
    >
      {{ query.startTime }}日 {{ financeType === 'clsd' ? '已' : '未' }}汇入余额
    </div>
    <div v-show="header.totalPrice || header.totalPrice === 0">
      <span style="font-size: 10px">￥</span>
      <span style="font-size: 18px; font-weight: 700">
        {{ header.totalPrice }}
      </span>
    </div>
    <a-divider dashed />
    <div>
      <b style="font-size: 18px">
        {{
          merchantInfo.merchantManagerType === 'nurse'
            ? '护工订单'
            : '外卖订单'
        }}
      </b>
      <span style="float: right">单位：元</span>
    </div>
    <Table :source="list" :loading="listLoad" style="margin-top: 20px" />
    <Pagination
      :auto-scroll="autoScroll"
      :total="total"
      @pagination="getOrderDetailList"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fhGetFinanceDetailHeader, fhGetOrderDetailList } from '@/api/finance'
import Table from './_components/orderTable'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Table,
    Pagination
  },
  data() {
    return {
      total: 0,
      header: {},
      list: [{}],
      headLoad: false,
      listLoad: false,
      autoScroll: false,
      query: {
        pageSize: 10,
        pageNumber: 1
      },
      financeType: 'clsd'
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  created() {
    const { id, date } = this.$route.params
    const { type } = this.$route.query
    this.financeType = type
    this.query = {
      ...this.query,
      storeId: id,
      startTime: date,
      endTime: date,
      billStatus: type === 'clsd'
    }
    this.$nextTick(() => {
      this.getFinanceDetailHead(this.query)
      this.getOrderDetailList(this.query)
    })
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
    async getOrderDetailList(params) {
      this.listLoad = true
      params = Object.assign({}, this.query, params)
      try {
        const { results, count } = await fhGetOrderDetailList(params)
        this.list = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
      this.listLoad = false
    },
    timeChange(time) {
      this.query = {
        ...this.query,
        startTime: time,
        endTime: time
      }
      this.$nextTick(() => {
        this.getFinanceDetailHead(this.query)
        this.getOrderDetailList(this.query)
      })
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
