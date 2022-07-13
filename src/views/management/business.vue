<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-19 21:14:25
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-24 11:42:03
-->
<template>
  <div>
    <!-- 实时数据 -->
    <div class="container mb-24">
      <!-- 选择时间 -->
      <div class="mb-12">
        <ranger-time
          key="business"
          use-fast
          use-custom
          fast-position="left"
          format-str="YYYY-MM-DD"
          :start.sync="query.startTime"
          :end.sync="query.endTime"
        />
        <div v-show="query.startTime" style="margin-top: 6px">
          已选时间：{{ selectTime }}
        </div>
      </div>
      <div v-loading="baseLoad">
        <template v-for="(i, k) in cards">
          <statistic-card
            :key="k"
            :name="i.name"
            :active="active"
            :config="i"
            :value="businessData"
            @select="handleSelect"
          />
        </template>
      </div>
      <!-- 趋势图 -->
      <div v-loading="trendLoad">
        <div id="business-trend" />
      </div>
    </div>
    <!-- 订单分布 -->
    <div class="container mb-24">
      <!-- 标题 -->
      <div class="mb-24">
        <span class="title mr-12">订单分布</span>
      </div>
      <div class="mb-12">
        <el-radio-group v-if="isRestaurant" v-model="activeOrderType">
          <el-radio-button label="periodTime">按时段</el-radio-button>
          <el-radio-button label="actuallyPaid">按订单实付价</el-radio-button>
        </el-radio-group>
        <el-button v-else type="primary">
          按订单实付价
        </el-button>
      </div>
      <!-- 订单表单 -->
      <div v-loading="distributionLoad">
        <el-table
          v-show="activeOrderType === 'periodTime'"
          border
          :data="periodTimeData"
        >
          <el-table-column label="时段" prop="x" />
          <el-table-column label="订单量" prop="y" />
        </el-table>
        <el-table
          v-show="activeOrderType === 'actuallyPaid'"
          border
          :data="actuallyPaidData"
        >
          <el-table-column label="订单实付价" prop="x" />
          <el-table-column label="订单量" prop="y" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import StatisticCard from '@/components/StatisticCard'
import RangerTime from '@/components/RangerTime'
import {
  fhGetHistoricalStatistics,
  fhGetHistoricalTrend,
  fhGetOrderPriceDistribution,
  fhGetOrderTimeDistribution
} from '@/api/management'
import { deepClone } from '@/utils'
import { typeEnum, typeEnumName } from './_utils'
import mixin from './_mixin'
export default {
  name: 'Overview',
  components: { StatisticCard, RangerTime },
  mixins: [mixin],
  data() {
    return {
      cards: [
        {
          name: 'income',
          label: '收入',
          tip: '统计时间内，包含所有费用的实际收入',
          prefix: '￥',
          field: 'income'
        },
        {
          name: 'turnover',
          label: '营业额',
          tip: this.isRestaurant
            ? '统计时间内，包含商品原价、包装费、自配送/跑腿配送的配送费'
            : '统计时间内，包含护工的总陪护费用',
          prefix: '￥',
          field: 'turnover'
        },
        {
          name: 'realPay',
          label: '顾客实付',
          tip: '统计时间内，顾客实际支付的费用',
          prefix: '￥',
          field: 'totalPrice'
        },
        {
          name: 'effective',
          label: '有效订单',
          tip: '统计时间内，已接单且未被取消（包含用户取消和商家取消）的订单数',
          suffix: '单',
          field: 'quantity'
        },
        {
          name: 'averagePriceActuallyPaid',
          label: '实付单均价',
          tip: '统计时间内，平均每单顾客实际支付的价格',
          prefix: '￥',
          field: 'averagePrice'
        }
      ],
      active: 'income',
      // 营业数据
      businessData: {},
      // 卡片部分数据的loading
      baseLoad: false,
      // 趋势图load
      trendLoad: false,
      // 查询条件
      query: null,
      // 订单分布类型
      activeOrderType: null,
      // 按时段分布的订单数据
      periodTimeData: [],
      // 按订单实付价分布的订单数据
      actuallyPaidData: [],
      // 订单分布load
      distributionLoad: false
    }
  },
  computed: {
    // 已经选择的时间
    selectTime() {
      const { startTime, endTime } = this.query
      return startTime === endTime ? startTime : `${startTime} 至 ${endTime}`
    }
  },
  watch: {
    activeOrderType(type) {
      if (!this.isMounted) return
      type === 'periodTime'
        ? this.getOrderTimeDistribution()
        : this.getOrderPriceDistribution()
    },
    query: {
      handler(query) {
        if (query) {
          const { startTime, endTime } = deepClone(query)
          const send = {
            startTime: startTime + ' 00:00:00',
            endTime: endTime + ' 23:59:59',
            type: typeEnum[this.active]
          }
          this.$nextTick(() => {
            this.getHistoricalStatistics(send)
            this.getRealTimeTrend(send)
          })
        }
      },
      immediate: true,
      deep: true
    },
    active(active) {
      if (active) {
        const { startTime, endTime } = deepClone(this.query)
        const send = {
          startTime: startTime + ' 00:00:00',
          endTime: endTime + ' 23:59:59',
          type: typeEnum[active]
        }
        this.getRealTimeTrend(send)
      }
    },
    isRestaurant(flag) {
      this.activeOrderType = flag ? 'periodTime' : 'actuallyPaid'
    }
  },
  created() {
    const moment = this.$moment
    const startTime = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const endTime = startTime
    const { activeName } = this.$route.query
    let params = {}
    if (activeName) {
      this.active = activeName
      params.type = typeEnum[activeName]
    }
    this.query = {
      startTime,
      endTime
    }
  },
  mounted() {
    this.isMounted = true
    this.activeOrderType = this.isRestaurant ? 'periodTime' : 'actuallyPaid'
    this.$nextTick(() => {
      this.activeOrderType === 'periodTime'
        ? this.getOrderTimeDistribution()
        : this.getOrderPriceDistribution()
    })
  },
  methods: {
    handleSelect(name) {
      this.active = name
    },
    // 获取历史数据
    async getHistoricalStatistics(send) {
      this.baseLoad = true
      try {
        const { results } = await fhGetHistoricalStatistics(send)
        this.businessData = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.baseLoad = false
    },
    // 获取实时数据趋势图
    async getRealTimeTrend(send) {
      this.trendLoad = true
      try {
        const { results } = await fhGetHistoricalTrend(send)
        this.renderTrend(results)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.trendLoad = false
    },
    // 获取订单分布
    async getOrderTimeDistribution() {
      this.distributionLoad = true
      try {
        const { results } = await fhGetOrderTimeDistribution()
        this.periodTimeData = results || []
      } catch (e) {
        console.log('debug axios', e)
      }
      this.distributionLoad = false
    },
    // 获取订单实付分布
    async getOrderPriceDistribution() {
      this.distributionLoad = true
      try {
        const { results } = await fhGetOrderPriceDistribution()
        this.actuallyPaidData = results || []
      } catch (e) {
        console.log('debug axios', e)
      }
      this.distributionLoad = false
    },
    // 渲染趋势图
    renderTrend(data) {
      const xAxis = data ? [] : [...new Array(24).keys()].map(i => i + ':00')
      let todayTrendY = []
      data
        ? data.forEach(i => {
            xAxis.push(i.x)
            todayTrendY.push(i.y)
          })
        : (todayTrendY = new Array(24).fill(0))

      if (!this.trendChart) {
        const chartDom = document.getElementById('business-trend')
        const myChart = this.$echarts.init(chartDom)
        this.trendChart = myChart
      }

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: typeEnumName[this.active],
            type: 'line',
            data: todayTrendY
          }
        ]
      }

      option && this.trendChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #fff !important;
  margin: 12px 0 0;
  padding: 24px !important;
  min-height: auto;
  .title {
    font-weight: 900;
    font-size: 22px;
  }
  .sub-title {
    font-weight: 700;
    font-size: 16px;
  }
  .business-box {
    background: #eee;
    padding: 24px;
    min-width: 505px;
    width: 50%;
  }
  .rank-box {
    max-width: 600px;
  }
  #business-trend {
    width: 100%;
    height: 300px;
  }
}
</style>
