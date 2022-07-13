<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-04-15 15:56:36
 * @LastEditors: CJH
 * @LastEditTime: 2021-04-20 11:19:39
-->
<template>
  <div>
    <el-radio-group v-model="radioValue">
      <el-radio-button
        v-for="(item, index) in radioList"
        :key="index"
        :label="item.value"
      >
        {{ item.label }}
      </el-radio-button>
    </el-radio-group>
    <el-date-picker
      v-if="radioValue === radioList[radioList.length - 1].value"
      v-model="dateValue"
      style="margin-left:10px"
      type="daterange"
      :value-format="formatStr"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="$emit('update:date', dateValue)"
    />
  </div>
</template>

<script>
export default {
  props: {
    radio: { type: [String, Number], default() {} },
    date: { type: [String, Array, Object], default() {} },
    btnList: {
      type: Array,
      default() {
        return [
          { label: '今日', value: 0},
          { label: '昨日', value: 1 },
          { label: '近7天', value: 7 },
          { label: '近30天', value: 30 },
          { label: '自定义', value: 'self' }
        ]
      }
    },
    formatStr: {
      type: String,
      default() {
        return 'yyyy-MM-dd'
      }
    }
  },
  data() {
    return {
      radioValue: this.radio,
      dateValue: this.date,
      radioList: this.btnList
    }
  },
  watch: {
    date(v) {
      this.dateValue = v
    },
    radioValue: {
      handler: 'fastTime',
      immediate: true
    }
  },
  mounted() {
    window.od = this
  },
  methods: {
    fastTime(e) {
      const formatStr = 'yyyy-MM-DD'
      const moment = this.$moment
      if (e === 'self') {
        this.dateValue = null
      } else if (e === 1) {
        const dateA = moment()
          .subtract(e, 'days')
          .format(formatStr)
        this.dateValue = [dateA, dateA]
      } else {
        const dateA = moment()
          .subtract(e, 'days')
          .format(formatStr)
        const dateB = moment().format(formatStr)
        this.dateValue = [dateA, dateB]
      }
      this.$emit('update:date', this.dateValue)
    }
  }
}
</script>

<style lang="scss" scoped></style>
