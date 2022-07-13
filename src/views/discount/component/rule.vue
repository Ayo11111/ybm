<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-07 17:02:08
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-14 14:14:23
-->
<template>
  <el-form>
    <el-form-item label="活动日期">
      {{ $moment(data.startTime).format('YYYY-MM-DD') }} -
      {{ $moment(data.endTime).format('YYYY-MM-DD') }}
    </el-form-item>
    <el-form-item label="生效周期">
      {{ weekCycle }}
    </el-form-item>
    <el-form-item label="生效时段">
      {{ period }}
    </el-form-item>
    <el-form-item label="创建时间">
      {{ data.createTime }}
    </el-form-item>
    <el-form-item label="活动成本" style="margin-bottom: 6px"></el-form-item>
    <div class="table">
      <div class="box" style="border-bottom: 1px solid;background: #F2F2F2">
        <div class="item" style="border-right: 1px solid">
          <span>活动内容</span>
        </div>
        <div class="item">
          <span>商家承担</span>
        </div>
      </div>
      <div class="box" v-for="(item, index) in summaryArr" :key="index" :class="{border: index !== summaryArr.length - 1}">
        <div class="item" style="border-right: 1px solid">
          {{ item }}
        </div>
        <div class="item">0</div>
      </div>
    </div>
  </el-form>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    weekCycle() {
      let { weekCycle } = this.data
      let week = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      let weekText = []
      if (weekCycle) {
        weekCycle = weekCycle
          .split('')
          .map(Number)
          .reverse()
        weekCycle.forEach((item, index) => {
          if (item === 1) {
            weekText.push(week[index])
          }
        })
        return weekText.join('、')
      } else {
        return '每天'
      }
    },
    period() {
      let { actPeriodList } = this.data
      if (!actPeriodList || actPeriodList.length === 0) {
        return '全天'
      } else {
        let periodArr = []
        actPeriodList.forEach(item => {
          const { startTime, endTime } = item
          periodArr.push(`${startTime}-${endTime}`)
        })
        return periodArr.join('、')
      }
    },
    summaryArr() {
      let { summary } = this.data
      if (summary) {
        return summary.split(',')
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 300px;
  display: flex;
  flex-flow: column;
  border: 1px solid;
  .box {
    display: flex;
    height: 40px;
    .item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .border {
    border-bottom: 1px solid;
  }
}
</style>
