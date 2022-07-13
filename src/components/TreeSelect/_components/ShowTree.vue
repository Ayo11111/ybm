<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-27 14:29:51
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-30 10:48:52
-->
<template>
  <div class="tree-box">
    <el-input
      v-model="filterText"
      class="mb-24"
      placeholder="输入关键字进行过滤"
    />
    <el-scrollbar
      wrap-style="color:'#fff';fontSize:'14px';height: 30vh"
      view-style="color:'#fff';fontSize:'14px';"
      :native="true"
    >
      <el-tree
        ref="tree"
        class="filter-tree"
        show-checkbox
        :data="sourceData"
        :props="treeOption"
        node-key="id"
        default-expand-all
        :filter-node-method="filterNode"
        @check="handleCheck"
      >
        <template slot-scope="{data}">
          <span v-if="isNaN(data.foodTemplateCount) && isNaN(data.foodCount)">
            {{ data.name }}
          </span>
          <span v-else>{{ data.name }}({{ data.foodTemplateCount || data.foodCount }})</span>

        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'ShowTree',
  props: {
    sourceData: {
      type: Array,
      default: () => []
    },
    treeOption: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {},
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data[this.treeOption.label].indexOf(value) !== -1
    },
    handleCheck(data, checkInfo) {
      const { checkedKeys } = checkInfo
      const { id } = data
      const checked = checkedKeys.includes(id)
      this.$emit('handlerGet', checked, data, res => {
        if (!res) {
          this.$refs.tree.setChecked(id, !checked)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tree-box {
  &::v-deep .el-scrollbar__wrap {
    margin-right: -12px !important;
    height: 55vh !important;
    overflow-x: hidden;
  }
}
</style>
