<!--
 * @Descripttion:
 * @Company:
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-10-28 16:00:45
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-01-21 10:40:06
-->
<template>
  <a-select
    v-model="select_value"
    v-bind="$attrs"
    :style="{ width, marginLeft }"
    :placeholder="placeholder"
    :allow-clear="allowClear"
    :disabled="disabled"
    @change="handleChange"
  >
    <a-select-option
      v-for="(item, index) in dataSource"
      :key="index"
      :value="typeof item === 'string' ? item : item[optionValue]"
    >
      {{ item[optionLabel] || item }}
    </a-select-option>
  </a-select>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Boolean, undefined],
      default: undefined
    },
    width: {
      type: String,
      default: '183px'
    },
    marginLeft: {
      type: String,
      default: '0'
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    optionValue: {
      type: String,
      default: 'id'
    },
    optionLabel: {
      type: String,
      default: 'name'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      select_value: undefined
    }
  },
  watch: {
    value: {
      handler(value) {
        if (value !== this.select_value) {
          this.select_value = value
        }
      },
      immediate: true,
      deep: true
    },
    select_value(value) {
      this.$emit('update:value', value)
    }
  },
  methods: {
    handleChange(v) {
      if (typeof v === 'string') {
        this.$emit('change', v)
      } else {
        const select_option = this.dataSource.filter(
          item => item[this.optionValue] === v
        )[0]
        this.$emit('change', select_option)
      }
    }
  }
}
</script>

<style></style>
