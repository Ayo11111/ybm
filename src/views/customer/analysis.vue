<template>
  <div class="analysis">
    <div class="container" style="min-height: 0; margin-bottom: 0" v-if="false">
      <span style="margin-right: 5px">选择要查看的店铺：</span>
      <el-button
        :loading="loading"
        :type="currentType === 'all' ? 'primary' : ''"
        @click="allStore"
        >全部店铺</el-button
      >
      <template>
        <el-button
          :loading="loading"
          :type="currentType === 'part' ? 'primary' : ''"
          @click="visible = true"
          >自定义店铺</el-button
        >
        <span
          v-if="SelectStoreID.length > 0"
          style="margin-left: 10px; color: #52acff; vertical-align: bottom"
          >已选{{ SelectStoreID.length }}家店铺</span
        >
      </template>
    </div>
    <div v-loading="loading" class="container">
      <div class="top">
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="setdate"
        />
        <div>
          <span :class="{ color: Index === 1 }" @click="getdate('1')">
            每日数据
          </span>
          <el-divider class="divider" direction="vertical" />
          <span :class="{ color: Index === 2 }" @click="getdate('2')">
            每周数据
          </span>
          <el-divider class="divider" direction="vertical" />
          <span :class="{ color: Index === 3 }" @click="getdate('3')">
            每月数据
          </span>
        </div>
      </div>
      <div style="margin: 30px 0 10px 0">成交顾客数</div>
      <div>
        <b style="font-size: 28px; margin-right: 20px">{{
          data.memberCount
        }}</b>
        <span>店铺平均：{{ data.storeAvg }}</span>
      </div>
      <div
        id="myChart"
        :style="{ width: '100%', height: '300px' }"
        style="margin-bottom: 8px"
      />
      <div class="title">
        <b>详情信息</b>
        <el-button type="primary" :loading="btnLoad" @click="download">
          导出数据
        </el-button>
      </div>
      <AnalysisTable :data="store" style="margin-top: 35px" />
      <Pagination
        :auto-scroll="autoScroll"
        :total="total"
        @pagination="pageList"
      />
    </div>
  </div>
</template>

<script>
import AnalysisTable from './_components/analysisTable'
import {
  fhGetStoreAnalyze,
  fhGetMemberAnalyze,
  fhGetDownloadAnalyze
} from '@/api/customer'
import Pagination from '@/components/Pagination'
import { downloadFile } from '@/utils/download'
export default {
  components: {
    AnalysisTable,
    Pagination
  },
  data() {
    return {
      currentType: 'all',
      SelectStoreID: [],
      date: [
        this.$moment(new Date()).subtract(1, 'months').format('YYYY-MM-DD'),
        this.$moment(new Date()).format('YYYY-MM-DD')
      ],
      store: [{}],
      Index: 1,
      visible: false,
      x: [],
      y: [],
      data: {},
      Json: {
        startTime: this.$moment(new Date())
          .subtract(1, 'months')
          .format('YYYY-MM-DD'),
        endTime: this.$moment(new Date()).format('YYYY-MM-DD'),
        dateType: 1,
        storeIds: null
      },
      loading: false,
      total: 0,
      btnLoad: false,
      autoScroll: false
    }
  },
  async created() {
    const params = Object.assign(this.Json, {
      pageNumber: 1,
      pageSize: 10
    })
    this.getStoreAnalyze(params)
    this.getMemberAnalyze(this.Json)
  },
  methods: {
    async getStoreAnalyze(params) {
      this.loading = true
      try {
        const { results, count } = await fhGetStoreAnalyze(params)
        console.log(results)
        results.forEach(item => {
          item.oldNewPct === -1 ? (item.oldNewPct = '-') : item.oldNewPct
          item.rePurchasePct === -1
            ? (item.rePurchasePct = '-')
            : item.rePurchasePct
        })
        this.store = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async getMemberAnalyze(params) {
      this.loading = true
      try {
        const { results } = await fhGetMemberAnalyze(params)
        this.data = results
        this.x = []
        this.y = []
        results.itemList.forEach(item => {
          this.y.push(item.count)
          const arr = item.date.split(' ')
          this.x.push(arr[0])
        })
      } catch (err) {
        console.log(err)
      }
      this.drawLine()
      this.loading = false
    },
    async getDownloadAnalyze(params) {
      this.btnLoad = true
      try {
        const results = await fhGetDownloadAnalyze(params)
        var uint8_msg = new Uint8Array(results)
        var decodedString = String.fromCharCode.apply(null, uint8_msg)
        if (decodedString.indexOf('success') !== -1) {
          var decoded = decodeURIComponent(escape(decodedString))
          var data = JSON.parse(decoded)
          this.$message.error(data.message)
        } else {
          downloadFile(results, '店铺分析')
          this.$message.success('数据导出成功')
        }
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    getdate(dateType) {
      this.Json['dateType'] = dateType
      this.Index = parseInt(dateType)
      this.getMemberAnalyze(this.Json)
    },
    setdate(val) {
      if (val !== null) {
        this.Json['startTime'] = val[0]
        this.Json['endTime'] = val[1]
        this.getStoreAnalyze(this.Json)
        this.getMemberAnalyze(this.Json)
      }
    },
    allStore() {
      this.SelectStoreID = []
      this.currentType = 'all'
      this.Json['storeIds'] = null
      this.getStoreAnalyze(this.Json)
      this.getMemberAnalyze(this.Json)
    },
    individual(name, id) {
      this.SelectStoreID = id
      console.log('id', id)
      id = id.join(', ')
      this.currentType = 'part'
      this.Json['storeIds'] = id
      this.getStoreAnalyze(this.Json)
      this.getMemberAnalyze(this.Json)
    },
    pageList(params) {
      params = Object.assign(this.Json, params)
      this.getStoreAnalyze(params)
    },
    download() {
      this.getDownloadAnalyze(this.Json)
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        trigger: 'axis',
        color: ['#52ACFF'],
        xAxis: {
          type: 'category',
          data: this.x
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '成交顾客数',
            data: this.y,
            barWidth: '50%',
            type: 'line'
          }
        ],
        tooltip: {
          // 鼠标悬停提示内容
          trigger: 'item', // 触发类型，默认数据触发，可选为：'axis' item
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          textStyle: {
            align: 'left'
          },
          formatter(params) {
            const res = `
            <div style="display: flex;flex-flow: column;margin-top: 5px">
               <span style="margin-bottom: 0px">${params.name}</span>
               <div style="display: flex;align-items: center;">
                  <div style="width: 10px;height: 10px;border-radius: 50%;background: #52ACFF;margin-right: 5px"></div>
                  ${params.seriesName}：<span>${params.data}</span>
               </div>
            </div>
                  `
            return res
          }
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.analysis {
  display: flex;
  flex-flow: column;
}
.container {
  padding: 0;
  margin: 0;
  min-height: auto;
}
.top {
  width: 100%;
  background: white;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    cursor: pointer;
  }
}
.divider {
  margin: 0 20px;
}
.color {
  color: #52acff;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
