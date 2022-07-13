<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-07 17:01:53
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-30 14:44:33
-->
<template>
  <div>
    <el-tabs v-model="effectDay" type="card" @tab-click="handleClick">
      <el-tab-pane label="全部" name="0" />
      <el-tab-pane label="昨日" name="1" />
      <el-tab-pane label="近7日" name="7" />
      <el-tab-pane label="近30日" name="30" />
    </el-tabs>
    <b>活动效果数据</b>
    <div class="infoBox">
      <div
        v-for="(item, index) in info"
        :key="index"
        v-loading="statsLoad"
        class="item"
      >
        <span>{{ item.title }}</span>
        <b>
          <span v-if="item.front">
            {{ item.front }}
          </span>
          {{ statsData[item.field] || 0 }}
        </b>
      </div>
    </div>
    <b>明细数据</b>
    <div style="margin: 16px 0">
      <el-radio-group v-model="trendType" @change="trendTypeChange">
        <el-radio-button label="turnover">活动营业额</el-radio-button>
        <el-radio-button label="orders"> 活动订单数 </el-radio-button>
      </el-radio-group>
    </div>
    <!-- 趋势图 -->
    <div v-loading="trendLoad">
      <div id="trend" />
    </div>
  </div>
</template>

<script>
import {
  fhGetAactiveStats,
  fhGetOrderCountLineChart,
  fhGetTurnoverLineChart
} from '@/api/marketing/reduction'
import { info, typeEnumName } from './effect'
import { deepClone } from '@/utils'
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    activeId: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      info,
      // 卡片数据
      statsData: {},
      // 卡片数据是否加载
      statsLoad: false,
      // 折线图类型
      trendType: 'turnover',
      // 时间
      effectDay: '0',
      // 查询条件
      query: {},
      // 折线图是否加载中
      trendLoad: false
    }
  },
  watch: {
    activeId(id) {
      if (id) {
        this.query.activityId = id
      }
    },
    data: {
      handler(newVal) {
        if (Object.keys(newVal).length > 0) {
          this.$nextTick(() => {
            this.selcetTime(0)
          })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 切换不同类型的折线图
    trendTypeChange(value) {
      this.getData(value)
    },
    // 获取不同类型的数据
    async getData(type) {
      this.trendLoad = true
      try {
        await (type === 'turnover'
          ? this.getOverFlowLineChart()
          : this.getOrderCountLineChart())
      } catch (e) {
        console.error('获取折线图数据出错 error', e)
      }
      this.trendLoad = false
    },
    // 获取满减活动折线图数据
    async getOverFlowLineChart() {
      try {
        const { results } = await fhGetTurnoverLineChart(this.query)
        this.renderTrend(results)
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    // 获取满减活动订单数折线图数据
    async getOrderCountLineChart() {
      try {
        const { results } = await fhGetOrderCountLineChart(this.query)
        this.renderTrend(results)
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    // 获取活动卡片统计数据
    async getStatsLineChart() {
      this.statsLoad = true
      try {
        const { results } = await fhGetAactiveStats(this.query)
        this.statsData = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.statsLoad = false
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
        const chartDom = document.getElementById('trend')
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
            name: typeEnumName[this.trendType],
            type: 'line',
            data: todayTrendY
          }
        ]
      }

      option && this.trendChart.setOption(option)
    },
    // 切换时间
    handleClick(tab, event) {
      const { name } = tab
      this.selcetTime(+name)
    },
    // 快速选择时间
    selcetTime(day) {
      let { startTime, endTime } = this.data
      if (day !== 0) {
        const moment = this.$moment
        startTime = moment()
          .subtract(day, 'days')
          .format('YYYY-MM-DD 00:00:00')
        endTime = moment()
          .subtract(1, 'days')
          .format('YYYY-MM-DD 23:59:59')
      }
      this.query = {
        ...this.query,
        startTime,
        endTime
      }
      this.$nextTick(() => {
        this.getData(this.trendType)
        this.getStatsLineChart()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.infoBox {
  display: flex;
  margin: 16px 0 30px 0;
  .item {
    width: 155px;
    height: 90px;
    background: rgba(242, 242, 242, 0.811764705882353);
    padding: 16px 14px;
    display: flex;
    flex-flow: column;
    margin-right: 23px;
    b {
      font-size: 18px;
      margin-top: 4px;
    }
  }
}
#trend {
  width: 100%;
  height: 300px;
}
</style>
