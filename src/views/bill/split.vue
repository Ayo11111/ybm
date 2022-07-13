<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-12-07 15:27:38
 * @LastEditors: HJ
 * @LastEditTime: 2020-12-15 09:53:57
-->
<template>
  <div style="padding: 24px">
    <!-- 查询 -->
    <div class="base-box mb-24" :span="merchantName">
      <el-form inline>
        <el-form-item label="账单日期">
          <ranger-time
            use-fast
            format-str="YYYY-MM-DD"
            :start.sync="query.startTime"
            :end.sync="query.endTime"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="queryFn">
            查询
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表单 -->
    <div v-show="header.time" class="base-box">
      <!-- 操作 -->
      <div class="mb-12">
        <el-button :loading="exportLoad" @click="getSplitExcel">
          导出Excal文档
        </el-button>
        <el-button
          icon="el-icon-question"
          type="text"
          @click="controlSplitRule(true)"
        >
          分佣规则
        </el-button>
      </div>
      <!-- 头部统计 -->
      <div v-loading="loading" class="header-box mb-12">
        <for-render :source="header" :config="splitHeaderConfig" />
      </div>
      <div v-loading="tableLoad">
        <el-table :data="list">
          <el-table-column label="订单号">
            <template #default="{ row }">{{ row.orderId }}</template>
          </el-table-column>
          <el-table-column label="订单实收金额">
            <template #default="{ row }">{{ row.cashFee }}</template>
          </el-table-column>
          <el-table-column label="用户实付配送费">
            <template #default="{ row }">{{ row.deliveryFee }}</template>
          </el-table-column>
          <el-table-column label="配送情况">
            <template #default="{ row }">{{ row.deliveryType }}</template>
          </el-table-column>
          <el-table-column label="真实配送费">
            <template #default="{ row }">{{
              row.originalDeliveryFee
            }}</template>
          </el-table-column>
          <el-table-column label="分佣比例">
            <template #default="{ row }">{{
              row.profitsharingPct + '%'
            }}</template>
          </el-table-column>
          <el-table-column label="分佣金额">
            <template #default="{ row }">{{ row.profitsharingFee }}</template>
          </el-table-column>
          <el-table-column label="线上分账金额">
            <template #default="{ row }">
              {{ row.wechatProfitsharingFee }}
            </template>
          </el-table-column>
          <el-table-column label="待线下结算金额">
            <template #default="{ row }">
              {{ row.otherProfitsharingFee }}
            </template>
          </el-table-column>
        </el-table>
      </div>
      <pagination :total="total" @pagination="pagination" />
    </div>
    <!-- 分佣规则 -->
    <el-dialog title="分账规则" width="700px" :visible="splitRule">
      <p class="pb-12">
        注 : <span style="color: red">订单实收金额</span> =
        <span style="font-weight: 600">订单实付金额</span> -
        <span style="font-weight: 600">微信手续费(0.3%)</span>
      </p>
      <p>微信线上分拥最多只能分订单实收金额 x 30%，所以会存在以下两种情况：</p>
      <p>1、如果分佣金额小于订单实收金额30%比例 : 分佣金额直接线上分佣</p>
      <p>
        2、如果分佣金额高于订单实收金额30%比例 :
        分拥金额采用微信线上分拥+线下人工分拥结算两部分
      </p>
      <p class="pb-12">线下分拥金额=分拥金额 - 微信线上分拥金额</p>
      <p>蜂鸟配送分账情况</p>
      <p class="pb-12">
        分佣金额 = (订单实收金额 - 用户实付配送费) x 平台比例 +
        蜂鸟真实配送费(真实配送费后续获取)
      </p>
      <p>顺丰配送分账情况</p>
      <p class="pb-12">
        分佣金额 = (订单实收金额 - 用户实付配送费) x 平台比例 + 顺丰真实配送费
      </p>
      <p>自配送分账情况</p>
      <p class="pb-12">
        分佣金额 = (订单实付金额 - 用户实付配送费 ) x 平台比例
      </p>
      <p>自提分账情况</p>
      <p>分佣金额 =订单实付金额 x 平台比例</p>
      <template #footer>
        <el-button @click="controlSplitRule(false)">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// components
import RangerTime from '@/components/RangerTime'
import ForRender from '@/components/ForRender'
import Pagination from '@/components/Pagination'
// utils
import { splitHeaderConfig } from './_utils'
import { downloadFile } from '@/utils/download'
// api
import {
  fhGetSplitHeader,
  fhGetSplitList,
  fhGetSplitExcel
} from '@/api/finance'
import { parseTime } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'FinanceSplit',
  components: { RangerTime, ForRender, Pagination },
  data() {
    return {
      merchantOptions: [],
      header: {},
      list: [],
      total: 0,
      splitHeaderConfig,
      query: {
        pageNumber: 1,
        pageSize: 10
      },
      loading: false,
      tableLoad: false,
      exportLoad: false,
      splitRule: false
    }
  },
  computed: {
    ...mapGetters(['merchantName'])
  },
  mounted() {
    const now = new Date().valueOf()
    const endTime = parseTime(now - 3600 * 24 * 1000, '{y}-{m}-{d}')
    const startTime = parseTime(now - 3600 * 24 * 1000 * 2, '{y}-{m}-{d}')
    this.query = {
      startTime,
      endTime,
      pageNumber: 1,
      pageSize: 10
    }
    this.$nextTick(() => {
      this.queryFn()
    })
  },
  methods: {
    // 查询
    queryFn() {
      if (!this.query.startTime) {
        this.$message.error('选择账单日期')
        return
      }
      this.getSplitHeader()
      this.getSplitList()
    },
    // 获取头部信息
    async getSplitHeader() {
      this.loading = true
      try {
        const { results } = await fhGetSplitHeader(this.query)
        this.header = Object.assign({}, results, {
          time: `${this.query.startTime}至${this.query.endTime}`,
          merchantName: this.merchantName
        })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 获取列表信息
    async getSplitList() {
      this.tableLoad = true
      try {
        const { results, count } = await fhGetSplitList(this.query)
        this.total = count
        this.list = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.tableLoad = false
    },
    // 切换页码
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      this.$nextTick(() => this.getSplitList())
    },
    // 导出excel
    async getSplitExcel() {
      this.exportLoad = true
      try {
        const results = await fhGetSplitExcel(this.query)
        var uint8_msg = new Uint8Array(results)
        var decodedString = String.fromCharCode.apply(null, uint8_msg)
        if (decodedString.indexOf('success') !== -1) {
          var decoded = decodeURIComponent(escape(decodedString))
          var data = JSON.parse(decoded)
          this.$message.error(data.message)
        } else {
          const { startTime, endTime } = this.query
          downloadFile(
            results,
            `商家${this.merchantName}的分账记账单_${startTime}至${endTime}`
          )
          this.$message.success('分账记账单导出成功')
        }
      } catch (e) {
        console.log('debug axios', e)
      }
      this.exportLoad = false
    },
    // 显示分佣规则
    controlSplitRule(flag) {
      this.splitRule = flag
    }
  }
}
</script>

<style lang="scss" scoped>
.header-box {
  padding: 12px;
  border: 1px solid #52ACFF;
  background: #52ACFF3b;
}
p {
  margin: 0;
}
</style>
