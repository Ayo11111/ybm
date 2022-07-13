<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-14 15:15:00
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-20 11:29:16
-->
<template>
  <div class="scroll-box">
    <div v-for="(i, k) in sourceData" :key="k" class="item">
      <el-checkbox
        :value="choosedIds.includes(i.id)"
        @change="e => handlerChoose(e, i)"
      >
        {{ i[option.label] }}
      </el-checkbox>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChildrenList',
  props: {
    getChildrenFn: {
      type: Function,
      default: () => {}
    },
    sourceData: {
      type: Array,
      default: () => []
    },
    option: {
      type: Object,
      default: () => {
        return {
          label: 'label'
        }
      }
    },
    choosedIds: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handlerChoose(type, item) {
      this.$emit(type ? 'choosed' : 'cancel', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-box {
  .item {
    padding: 6px;
  }
}
</style>
