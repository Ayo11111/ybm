<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-27 14:24:39
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-09 13:48:02
-->
<template>
  <div class="flex outer-box">
    <!-- 左侧的树 -->
    <div v-loading="treeLoading" class="mr-24">
      <show-tree
        :source-data="treeData"
        :tree-option="treeOption"
        @handlerGet="handlerGet"
      />
    </div>
    <!-- 中间选中的内容 -->
    <div
      v-loading="childrenLoading"
      class="scroll-box"
      style="overflow-x: hidden"
    >
      <el-scrollbar
        wrap-style="color:'#fff';fontSize:'14px';"
        view-style="color:'#fff';fontSize:'14px';"
        :native="true"
      >
        <el-checkbox
          v-show="children.length > 0"
          label="all"
          :value="choosedAll"
          :indeterminate="indeterminate"
          @change="chooseAll"
        >
          全选
        </el-checkbox>
        <template v-for="(i, k) in children">
          <children-list
            :key="k"
            :source-data="[i]"
            :option="childrenOption"
            :choosed-ids.sync="chooedIds"
            @choosed="addChoosed"
            @cancel="cancelChoosed"
          />
        </template>
      </el-scrollbar>
    </div>
    <!-- 右侧选中 -->
    <div class="scroll-box choosed-box">
      <div class="flex show-box">
        <span>已选商品 ({{ chooeds.length }})</span>
        <el-button type="text" style="padding: 0" @click="chooseAll(false)">
          清空
        </el-button>
      </div>
      <el-scrollbar
        wrap-style="color:'#fff';fontSize:'14px';"
        view-style="color:'#fff';fontSize:'14px';"
        :native="true"
      >
        <div v-for="(i, k) in chooeds" :key="k" class="flex show-box">
          <template>
            <span>{{ i.name }}</span>
            <i class="el-icon-close" @click="cancelChoosed(i)" />
          </template>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
// TODO 请求出错重置数据
import ShowTree from './_components/ShowTree'
import ChildrenList from './_components/ChildrenList'
import { deepClone } from '@/utils'
export default {
  name: 'TreeSelect',
  components: {
    ShowTree,
    ChildrenList
  },
  props: {
    treeLoading: {
      type: Boolean,
      default: false
    },
    treeData: {
      type: Array,
      default: () => []
    },
    treeOption: {
      type: Object,
      default: () => {}
    },
    getChildrenFn: {
      type: Function,
      default: () => {}
    },
    childrenOption: {
      type: Object,
      default: () => {}
    },
    model: {
      type: [Array],
      default: () => []
    }
  },
  data() {
    return {
      childrenLoading: false,
      children: [],
      chooeds: [],
      chooedIds: []
    }
  },
  computed: {
    choosedAll() {
      return (
        this.chooedIds.length > 0 &&
        this.chooedIds.length === this.children.length
      )
    },
    indeterminate() {
      return (
        this.chooedIds.length > 0 &&
        this.chooedIds.length < this.children.length
      )
    }
  },
  methods: {
    handlerGet(checked, query, call) {
      const { id } = query
      if (!id) return
      this.getChildren(checked, query, call)
    },
    differenceChildren(A, B) {
      B.forEach(i => {
        const { id: bId } = i
        A = A.filter(j => {
          const { id: aId } = j
          if (aId !== bId) {
            return j
          }
        })
      })
      return A
    },
    // 获取子数据
    async getChildren(type, query = {}, call) {
      this.childrenLoading = true
      const { id } = query
      try {
        const { results } = await this.getChildrenFn({ id })
        // TODO 思考如何使用set或map方法优化
        this.children = type
          ? this.children.concat(results)
          : this.differenceChildren(this.children, results)

        call && call(true)
      } catch (e) {
        console.log('debug axios', e)
        call && call(false)
      }
      this.childrenLoading = false
    },
    // 全选
    chooseAll(e) {
      const temp = deepClone(this.children)
      this.chooeds = e ? temp : []
      this.chooedIds = e
        ? temp.map(i => {
            return i.id
          })
        : []
      this.$emit('update:model', this.chooedIds)
    },
    // 选中
    addChoosed(item) {
      this.chooeds.push(item)
      this.chooedIds.push(item.id)
      this.$emit('update:model', this.chooedIds)
    },
    // 取消选中
    cancelChoosed(item) {
      const index = this.chooeds.findIndex(i => i.id === item.id)
      this.chooeds.splice(index, 1)
      this.chooedIds.splice(index, 1)
      this.$emit('update:model', this.chooedIds)
    }
  }
}
</script>

<style lang="scss" scoped>
.outer-box {
  min-height: 60vh;

  & > div {
    flex: 1;
  }
  .show-box {
    justify-content: space-between;
    padding: 6px 18px;

    .el-icon-close {
      cursor: pointer;
    }
  }
}

.scroll-box {
  &::v-deep .el-scrollbar__wrap {
    margin-right: -12px !important;
    height: 63vh !important;
    overflow-x: hidden;
    padding-bottom: 24px;
  }
}

.choosed-box {
  &::v-deep .el-scrollbar__wrap {
    height: 60vh !important;
    padding-bottom: 24px;
  }
}
</style>
