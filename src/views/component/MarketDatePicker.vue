<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-24 09:42:42
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-07 15:18:37
-->
<template>
  <div>
    <el-row>
      <el-col :sm="12" :md="11" :lg="12" :xl="10">
        <el-date-picker
          v-model="value"
          :type="dateOption.type"
          start-placeholder="活动开始时间"
          end-placeholder="活动结束时间"
          :picker-options="pickerOptions"
          :default-time="['00:00:00', '23:59:59']"
          @change="chooseTime"
        >
        </el-date-picker>
      </el-col>
      <el-col :sm="8" :md="8" :lg="8" :offset="1" :xl="8">
        <span
          v-for="(i, k) in expressTime"
          :key="k"
          :class="[
            'express-time-box',
            'ml-12',
            i.time === currExpTime ? 'curr-exp-time' : ''
          ]"
          @click="chooseExpTime(i)"
        >
          {{ i.label }}
        </span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parseTime } from '@/utils'

export default {
  props: {
    dateOption: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      currExpTime: 0,
      value: '',
      expressTime: [
        {
          label: '7天',
          time: 7
        },
        {
          label: '30天',
          time: 30
        },
        {
          label: '90天',
          time: 90
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 1 * 60 * 60 * 1000
        }
      }
    }
  },

  mounted() {
    window.mdp = this
  },

  methods: {
    chooseTime(v, e) {
      this.value = v
      const start = v && parseTime(v[0])
      const end = v && parseTime(v[1])
      const exp =
        e ||
        ((new Date(end).valueOf() - new Date(start).valueOf()) / 24) *
          3600 *
          1000
      this.currExpTime = exp
      this.$emit('chooseTimeS', v, start, end)
    },
    chooseExpTime(v) {
      const { time } = v
      this.createExpressTime(time)
    },
    createExpressTime(v) {
      const time = new Date()
      const hour = time.getHours()
      const mimutes = time.getMinutes()
      const second = time.getSeconds()
      const useTime = (hour * 3600 + mimutes * 60 + second) * 1000
      const nowRaw = new Date().valueOf() - useTime
      const day = 24 * 3600 * 1000
      const now = parseTime(nowRaw)
      // 多一天减一秒
      const end = parseTime(nowRaw + day * (v + 1) - 1000)
      this.chooseTime([now, end], v)
    }
  }
}
</script>

<style lang="scss" scoped>
.express-time-box {
  display: inline-block;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 18px;
  height: 36px;
  cursor: pointer;
}

.curr-exp-time {
  background: #52acff;
  color: #fff;
}
::v-deep .el-date-editor {
  width: 100%;
}
</style>
