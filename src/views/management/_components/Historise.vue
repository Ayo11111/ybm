<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-21 21:57:15
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-22 03:58:35
-->
<template>
  <div v-loading="loading" class="container">
    <span style="color: #7f7f7f">导出文件仅保留30天，请尽快下载</span>
    <el-table border :data="histories" class="mt-12">
      <el-table-column label="文件名称" prop="name" />
      <el-table-column label="操作时间" prop="createTime" />
      <el-table-column label="操作">
        <template slot-scope="{ row: { url } }">
          <a v-if="url" :href="url" style="color: #52acff">下载</a>
          <span v-else style="color: #7f7f7f">已失效</span>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      auto-scroll
      :total="total"
      v-bind="query"
      @pagination="pagination"
    />
  </div>
</template>

<script>
import { fhGetExportRecord } from '@/api/management'
import Pagination from '@/components/Pagination'
export default {
  name: 'Historise',
  components: { Pagination },
  data() {
    return {
      // 下载记录
      histories: [],
      // 下载记录的查询条件
      query: {
        pageNumber: 1,
        pageSize: 10
      },
      // 下载记录的总条数
      total: 0,
      // 加载记录load
      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    // 初始化
    init() {
      this.query = {
        pageNumber: 1,
        pageSize: 10
      }
      this.$nextTick(() => {
        this.getExportRecord()
      })
    },
    // 获取下载历史记录
    async getExportRecord() {
      this.loading = true
      try {
        const { count, results } = await fhGetExportRecord(this.query)
        this.total = count
        this.histories = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 切换页码
    pagination(val) {
      this.query = {
        ...this.query,
        ...val
      }
      this.$nextTick(() => {
        this.getExportRecord()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 0;
}
</style>
