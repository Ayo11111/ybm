<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-01 16:25:15
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-12 18:17:13
-->
<template>
  <div v-loading="loading" class="container">
    <el-form :model="query">
      <el-form-item label="护工姓名">
        <filter-select
          :data="nurses"
          vv="id"
          vl="name"
          vk="id"
          :value.sync="nurseId"
        />
      </el-form-item>
      <el-form-item label="订单时间">
        <ranger-time
          clearable
          :start.sync="query.startTime"
          :end.sync="query.endTime"
        />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName">
      <el-tab-pane label="预约陪护" name="escort">
        <el-table :data="escortOrders">
          <el-table-column label="序号" type="index" />
          <!-- <el-table-column label="订单时间">
            <template
              slot-scope="{ row: { payTime, refundTime, nurseEndTime } }"
            >
              {{ nurseEndTime || refundTime || payTime }}
            </template>
          </el-table-column> -->
          <el-table-column label="订单号" prop="orderId" />
          <el-table-column label="实际支付金额" prop="allFee" />
          <el-table-column label="患者信息">
            <template slot-scope="{ row: { name, shippingAddress } }">
              <div>{{ name }}</div>
              <div>{{ shippingAddress }}</div>
            </template>
          </el-table-column>
          <el-table-column label="预约天数" prop="nurseTotalDay" />
          <el-table-column label="开始时间" prop="nurseStartTime" />
          <el-table-column label="结束时间" prop="nurseEndTime" />
          <el-table-column label="订单状态">
            <template slot-scope="{ row: { orderStatus } }">
              {{ nurseOrderStatusMap.get(orderStatus) }}
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="{ row: { remarks } }">
              {{ remarks || '---' }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="escortTotal"
          :current-page="escortQuery.pageNumber"
          :page-size="escortQuery.pageSize"
          @pagination="pagination('escortQuery', $event)"
        />
      </el-tab-pane>
      <el-tab-pane label="取货订单" name="pick">
        <el-table :data="pickOrders">
          <el-table-column label="序号" type="index" />
          <el-table-column label="订单时间" prop="payTime" />
          <el-table-column label="订单号" prop="deliveryOrderId" />
          <el-table-column label="实际支付金额" prop="allFee" />
          <el-table-column label="取货费" prop="deliveryPrice" />
          <el-table-column label="患者信息">
            <template slot-scope="{ row: { name, shippingAddress } }">
              <div>{{ name }}</div>
              <div>{{ shippingAddress }}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品送达时间" prop="deliveryEndTime" />
          <el-table-column label="订单状态">
            <template slot-scope="{ row: { orderStatus } }">
              {{ nurseOrderStatusMap.get(orderStatus) }}
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="{ row: { remarks } }">
              {{ remarks || '---' }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="pickTotal"
          :current-page="pickQuery.pageNumber"
          :page-size="pickQuery.pageSize"
          @pagination="pagination('escortQuery', $event)"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import RangerTime from '@/components/RangerTime'
import Pagination from '@/components/Pagination'
import FilterSelect from '@/components/FilterSelect'
import { nurseOrderStatusMap } from '@/components/OrderInfo/utils'
import { fhGetNurse, fhGetNursePickOrders, fhGetNurses } from '@/api/nurse'
import { fhGetNurseHistory } from '@/api/orders'
export default {
  name: '',
  components: { Pagination, FilterSelect, RangerTime },
  data() {
    return {
      // 查询条件
      query: {},
      // 所有护工
      nurses: [],
      // 加载中
      loading: false,
      // 当前tab
      activeName: 'escort',

      // 护工id
      nurseId: null,
      // 护工陪护订单
      // 查询条件
      escortQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      escortOrders: [],
      escortTotal: 0,
      nurseOrderStatusMap,
      // 护工取货订单
      pickOrders: [],
      pickTotal: 0,
      pickQuery: {
        pageNumber: 1,
        pageSize: 10
      }
    }
  },
  watch: {
    query: {
      handler(v) {
        const query = {
          ...v,
          pageNumber: 1,
          pageSize: 10
        }
        this.escortQuery = {
          ...this.escortQuery,
          ...query
        }
        this.pickQuery = {
          ...this.pickQuery,
          ...query
        }
        this.$nextTick(() => {
          this.getNurse()
          this.getNursePickOrders()
        })
      },
      immediate: true,
      deep: true
    },
    nurseId: {
      handler(v) {
        if (v) {
          this.getNurse()
          this.getNursePickOrders()
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    const { id } = this.$route.query
    this.nurseId = id
    this.$nextTick(() => {
      this.fhGetNurses()
      this.getNurse()
      this.getNursePickOrders()
    })
  },
  methods: {
    // 获取护工列表
    async fhGetNurses() {
      try {
        const {
          results: { results }
        } = await fhGetNurses({ pageNumber: 1, pageSize: 9999 })
        this.nurses = results
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    // 获取护工详情
    async getNurse() {
      this.loading = true
      try {
        const { results } = await fhGetNurse(this.nurseId)
        const { phone } = results
        this.escortQuery = {
          ...this.escortQuery,
          nursePhone: phone
        }
        this.$nextTick(() => this.getEscortOrders())
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 获取护工陪护订单
    async getEscortOrders() {
      this.loading = true
      try {
        const {
          results: { count, results }
        } = await fhGetNurseHistory(this.escortQuery)
        this.escortTotal = count || 0
        this.escortOrders = results || []
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 修改页码
    pagination(type, value) {
      this[type] = {
        ...this[type],
        ...value
      }
      this.$nextTick(() => {
        type === 'escortQuery'
          ? this.getEscortOrders()
          : this.getNursePickOrders()
      })
    },
    // 获取取货订单列表
    async getNursePickOrders() {
      try {
        this.pickQuery = {
          ...this.pickQuery,
          nurseId: this.nurseId
        }
        const { results, count = 0 } = await fhGetNursePickOrders(this.pickQuery)
        this.pickOrders = results
        this.pickTotal = count
      } catch (e) {
        console.log('debug axios', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
