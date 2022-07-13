<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-03-26 19:26:15
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-24 21:43:41
 -->
<template>
  <el-autocomplete
    v-model="result"
    class="inline-input"
    placeholder="请输入"
    :fetch-suggestions="querySearch"
    :value-key="vk"
    @select="handleSelect"
  />
</template>

<script>
export default {
  name: 'AutoComplete',
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: [Object, String],
      default() {
        return {}
      }
    },
    vk: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      result: ''
    }
  },
  watch: {
    result(v) {
      this.$emit('update:value', v)
    }
  },
  methods: {
    // 筛选
    querySearch(queryString, cb) {
      const { data: list } = this
      const results = queryString
        ? list.filter(this.createFilter(queryString))
        : list
      cb(results)
    },
    // 过滤函数
    createFilter(queryString) {
      return item => {
        const temp = this.vk ? item[this.vk] : item
        return temp.toLowerCase().indexOf(queryString.toLowerCase()) !== -1
      }
    },
    // 输入过滤选中
    handleSelect(item) {
      this.$emit('update:value', item)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
