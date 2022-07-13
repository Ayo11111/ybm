<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-11-03 21:09:31
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-21 22:40:29
-->
<template>
  <div class="ranger-time-box" :span="curr">
    <div v-show="!useCustom || currBtn === 'custom'" class="time-picker">
      <a-range-picker
        v-model="time"
        :default-value="[start, end]"
        :value-format="formatStr"
        clearable
      />
    </div>
    <div class="fast-box">
      <a-radio-group
        v-if="useFast"
        :value="currBtn"
        button-style="solid"
        @change="fastTime"
      >
        <a-radio-button v-for="i in config" :key="i.day" :value="i.day">
          {{ i.label }}
        </a-radio-button>
      </a-radio-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RangerTime',
  props: {
    start: {
      type: String,
      default: null
    },
    end: {
      type: String,
      default: null
    },
    useFast: {
      type: Boolean,
      default: false
    },
    fastConfig: {
      type: Array,
      default: () => [
        {
          label: '昨天',
          day: 0
        },
        {
          label: '近7天',
          day: 6
        },
        {
          label: '近30天',
          day: 29
        }
      ]
    },
    fastPosition: {
      type: String,
      default: 'right'
    },
    formatStr: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    useCustom: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currBtn: null,
      time: []
    }
  },
  computed: {
    curr() {
      const { start, end } = this
      const moment = this.$moment

      const diff = moment(end).diff(moment(start), 'days')
      ;(() => {
        this.currBtn = typeof this.currBtn === 'string' ? this.currBtn : diff
      })(this)
      return diff
    },
    config() {
      const { useCustom, fastConfig } = this
      return fastConfig.concat(
        useCustom
          ? [
              {
                label: '自定义',
                day: 'custom'
              }
            ]
          : []
      )
    }
  },
  watch: {
    time(v) {
      const flag = v && v.length > 0
      this.$emit('update:start', flag ? v[0] : null)
      this.$emit('update:end', flag ? v[1] : null)
    },
    start(v) {
      if (!v) {
        this.time = []
        this.currBtn = ''
      } else {
        this.time[0] = v
      }
    },
    end(v) {
      if (!v) {
        this.time = []
        this.currBtn = ''
      } else {
        this.time[1] = v
      }
    }
  },
  methods: {
    fastTime(e) {
      const { value } = e.target
      this.currBtn = value

      if (value === 'custom') {
        return
      }
      const moment = this.$moment
      if (value === 'today') {
        const startDate = moment().format(this.formatStr)
        const endDate = moment().format(this.formatStr)
        this.time = [startDate, endDate]
        return
      }

      const startDate = moment()
        .subtract(value + 1, 'days')
        .format(this.formatStr)
      const endDate = moment().subtract(1, 'days').format(this.formatStr)
      this.time = [startDate, endDate]
    }
  }
}
</script>
<style lang="scss" scoped>
.ranger-time-box {
  display: flex;
  div:first-child {
    margin-right: 12px;
  }

  .time-picker {
    order: 1;
  }
  .fast-box {
    order: -1;
  }
}
</style>
