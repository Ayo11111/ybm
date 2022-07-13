<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-19 21:14:25
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-24 11:30:48
-->
<template>
  <div>
    <!-- 实时数据 -->
    <div class="container mb-24">
      <!-- 标题 -->
      <div class="mb-24">
        <span class="title mr-12">实时数据</span>
        <span>{{ updateTime }}更新</span>
      </div>
      <div v-loading="baseLoad">
        <template v-for="(i, k) in cards">
          <statistic-card
            :key="k"
            :name="i.name"
            :active="active"
            :config="i"
            :value="baseRealTimeData"
            @select="handleSelect"
          />
        </template>
      </div>
      <!-- 趋势图 -->
      <div v-loading="trendLoad">
        <div id="trend" />
      </div>
    </div>
    <!-- 历史数据概览 -->
    <div v-loading="historicalLoad" class="container mb-24">
      <!-- 标题 -->
      <div class="mb-24">
        <span class="title mr-12">历史数据概览</span>
      </div>
      <!-- 选择时间 -->
      <div class="mb-12">
        <ranger-time
          use-fast
          use-custom
          fast-position="left"
          format-str="YYYY-MM-DD"
          :start.sync="historyQuery.startTime"
          :end.sync="historyQuery.endTime"
        />
        <div v-show="historyQuery.startTime" style="margin-top: 6px">
          已选时间：{{ selectTime }}
        </div>
      </div>
      <!-- 副标题 -->
      <div class="sub-title mb-12">营业分析</div>
      <div>收入 = 营业额 - 支出</div>
      <div class="mb-12">
        营业额 = 有效订单 × 实付单均价
        {{ isRestaurant ? '+ 店铺自配送费' : '' }}
      </div>
      <div class="business-box">
        <statistic
          :tag-list="historicalConfig"
          :col-config="colConfig"
          :tag-data="historicalData"
        />
      </div>
    </div>
    <!-- 商品分析 -->
    <div v-loading="rankLoad" class="container mb-24">
      <!-- 标题 -->
      <div class="mb-24">
        <span class="title mr-12">
          {{ isRestaurant ? '商品分析' : '护工分析' }}
        </span>
      </div>
      <el-row>
        <el-col :span="12">
          <div class="rank-box mr-24">
            <span>{{ isRestaurant ? '销量最好' : '护理天数' }}</span>
            <rank-table :source="bestRank" :type="type" />
          </div>
        </el-col>
        <el-col v-show="topSixRank.length > 0" :span="12">
          <div class="rank-box mr-24">
            <span>{{ isRestaurant ? '销量最好' : '护理天数' }}</span>
            <rank-table :source="topSixRank" :type="type" :no-start="4" />
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import StatisticCard from '@/components/StatisticCard'
import Statistic from '@/components/Statistic'
import RangerTime from '@/components/RangerTime'
import RankTable from './_components/RankTable'
import {
  fhGetCommodityStatistics,
  fhGetHistoricalStatistics,
  fhGetRealTimeStatistics,
  fhGetRealTimeTrend
} from '@/api/management'
import { typeEnum } from './_utils'
import { deepClone } from '@/utils'
import mixin from './_mixin'
export default {
  name: 'Overview',
  components: { StatisticCard, Statistic, RankTable, RangerTime },
  mixins: [mixin],
  data() {
    return {
      // 实时数据配置
      cards: [
        {
          name: 'income',
          label: '收入',
          tip: '统计时间内，包含所有费用的实际收入',
          prefix: '￥',
          field: 'todayIncome',
          children: [
            {
              label: '比昨日同时段',
              field: 'yesterdayIncome'
            }
          ]
        },
        {
          name: 'turnover',
          label: '营业额',
          tip: this.isRestaurant
            ? '统计时间内，包含商品原价、包装费、自配送/跑腿配送的配送费'
            : '统计时间内，包含护工的总陪护费用',
          prefix: '￥',
          field: 'todayTurnover',
          children: [
            {
              label: '比昨日同时段',
              field: 'yesterdayTurnover'
            }
          ]
        },
        {
          name: 'effective',
          label: '有效订单',
          tip: '统计时间内，已接单且未被取消（包含用户取消和商家取消）的订单数',
          suffix: '单',
          field: 'todayQuantity',
          children: [
            {
              label: '比昨日同时段',
              field: 'yesterdayQuantity'
            }
          ]
        }
      ],
      // 当前选择的卡片
      active: 'income',
      // 卡片中的数据
      baseRealTimeData: {},
      // 实时统计数据趋势图
      trendData: [],
      // 实时数据loading
      trendLoad: false,
      // 卡片数据loading
      baseLoad: false,
      // 历史数据配置
      historicalConfig: [
        {
          label: '收入',
          tip: '统计时间内，包含所有费用的实际收入',
          field: 'income',
          prefix: '￥'
        },
        {
          label: '营业额',
          tip: this.isRestaurant
            ? '统计时间内，包含商品原价、包装费、自配送/跑腿配送的配送费'
            : '统计时间内，包含护工的总陪护费用',
          field: 'turnover',
          prefix: '￥'
        },
        {
          label: '支出',
          tip: '统计时间内，包含所有费用的实际支出',
          field: 'expenses',
          prefix: '￥'
        },
        {
          label: '有效订单',
          tip: '统计时间内，已接单且未被取消（包含用户取消和商家取消）的订单数',
          field: 'quantity',
          suffix: '单'
        },
        {
          label: '实付单均价',
          tip: '统计时间内，平均每单顾客实际支付的价格',
          field: 'averagePrice',
          prefix: '￥'
        },
        {
          label: '活动补贴',
          tip: '统计时间内，补贴总额（包含商家补贴和平台补贴）',
          field: 'activityFee',
          prefix: '￥'
        }
      ],
      // 历史数据分行配置
      colConfig: {
        span: 8
      },
      // 历史数据
      historicalData: {},
      // 历史数据loading
      historicalLoad: false,
      // 最好的排行榜
      bestRank: [],
      // 最差的排行榜
      topSixRank: [],
      // 商品分析load
      rankLoad: false,
      // 历史数据概览查询条件
      historyQuery: null
    }
  },
  computed: {
    updateTime() {
      const { updateTime } = this.baseRealTimeData
      return this.$moment(updateTime).format('MM-DD hh:mm')
    },
    // 已经选择的时间
    selectTime() {
      const { startTime, endTime } = this.historyQuery
      return startTime === endTime ? startTime : `${startTime} 至 ${endTime}`
    }
  },
  watch: {
    historyQuery: {
      handler(query) {
        if (query) this.getHistoricalStatistics()
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    const moment = this.$moment
    const startTime = moment().subtract(1, 'days').format('YYYY-MM-DD')
    const endTime = startTime
    this.historyQuery = {
      startTime,
      endTime
    }
    const { activeName } = this.$route.query
    this.$nextTick(() => {
      this.getRealTimeStatistics()
      if (activeName) {
        this.active = activeName
        this.getRealTimeTrend(typeEnum[activeName])
      } else {
        this.getRealTimeTrend(1)
      }
      this.getHistoricalStatistics()
      this.getCommodityStatistics(true)
      this.getCommodityStatistics(false)
    })
  },
  methods: {
    handleSelect(name) {
      this.active = name
      this.$nextTick(() => {
        this.getRealTimeTrend(typeEnum[name])
      })
    },
    // 获取实时统计数据
    async getRealTimeStatistics() {
      this.baseLoad = true
      try {
        const { results } = await fhGetRealTimeStatistics()
        this.baseRealTimeData = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.baseLoad = false
    },
    // 获取实时数据趋势图
    async getRealTimeTrend(type) {
      this.trendLoad = true
      try {
        const { results } = await fhGetRealTimeTrend({ type })
        this.trendData = results
        this.renderTrend(results)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.trendLoad = false
    },
    // 渲染趋势图
    renderTrend(data) {
      const { todayTrend, yesterdayTrend } = data
      const xAxis = []
      const todayTrendY = []
      const yesterdayTrendY = []
      todayTrend.forEach(i => {
        xAxis.push(i.x + ':00')
        todayTrendY.push(i.y)
      })
      yesterdayTrend.forEach(i => {
        yesterdayTrendY.push(i.y)
      })

      if (!this.trendChart) {
        const chartDom = document.getElementById('trend')
        const myChart = this.$echarts.init(chartDom)
        this.trendChart = myChart
      }

      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['今日', '昨日']
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
            name: '今日',
            type: 'line',
            data: todayTrendY
          },
          {
            name: '昨日',
            type: 'line',
            data: yesterdayTrendY
          }
        ]
      }

      option && this.trendChart.setOption(option)
    },
    // 获取历史数据统计
    async getHistoricalStatistics() {
      this.historicalLoad = true
      try {
        let query = deepClone(this.historyQuery)
        query = {
          ...query,
          startTime: query.startTime + ' 00:00:00',
          endTime: query.endTime + ' 23:59:59'
        }
        const { results } = await fhGetHistoricalStatistics(query)
        this.historicalData = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.historicalLoad = false
    },
    // 获取菜品排行
    async getCommodityStatistics(saleAsc = false) {
      this.rankLoad = true
      try {
        const { results } = await fhGetCommodityStatistics({
          pageNumer: 1,
          pageSize: 6
        })
        this.bestRank = results.splice(0, 3)
        this.topSixRank = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.rankLoad = false
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
  #trend {
    width: 100%;
    height: 300px;
  }
}
</style>
