<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-03-26 20:27:57
 * @LastEditors: HJ
 * @LastEditTime: 2020-07-27 16:40:40
 -->
<template>
  <div :class="{ hidden: hidden }" class="pagination-container mt-24">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="limit"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    curPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 50]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.curPage
      },
      set(val) {
        this.$emit('update:curPage', val)
      }
    },
    limit: {
      get() {
        return this.pageSize
      },
      set(val) {
        this.$emit('update:pageSize', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { pageNumber: this.currentPage, pageSize: val })
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.autoScroll) {
            scrollTo(0, 800)
          }
        }, 500)
      })
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { pageNumber: val, pageSize: this.pageSize })
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.autoScroll) {
            scrollTo(0, 800)
          }
        }, 500)
      })
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  display: flex;
  justify-content: flex-end;
}
.pagination-container.hidden {
  display: none;
}
</style>
