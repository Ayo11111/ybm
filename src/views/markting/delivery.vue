<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-26 11:21:19
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-13 14:05:48
-->
<template>
  <div class="wrap">
    <div class="search">
      <el-row :gutter="40">
        <el-col class="col" :span="11">
          <span>活动名称：</span>
          <el-input v-model="searchForm.activityName" style="flex: 1" />
        </el-col>
        <el-col class="col" :span="11">
          <span>活动日期：</span>
          <el-date-picker
            v-model="searchForm.date"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="flex: 1"
          />
        </el-col>
        <el-col class="col" :span="24">
          <span>活动状态：</span>
          <el-button-group>
            <el-button
              v-for="(item, index) in buttonArr"
              :key="index"
              type="plain"
              :loading="item.loading"
              :class="{ actived: currentStatus === item.label }"
              style="width:25%"
              @click="toggleStatus(item, index)"
            >
              {{ item.name }}
              <span v-if="false">({{ item.num }})</span>
            </el-button>
          </el-button-group>
          <el-button
            :loading="loadingSearch"
            type="primary"
            style="margin-left: 16px"
            @click="handleSearch"
          >
            查 询
          </el-button>
          <el-button @click="handleReset">重 置</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  fhGetDelivery,
  fhDelDelivery,
  fhStatusDelivery
} from '@/api/marketing/delivery'
import { arraysMap } from '@/utils'

export default {
  name: 'AB',
  data() {
    return {
      loadingTable: false,
      total: 0,
      tableData: [{}],
      currentStatus: 'all',
      currentIndex: 0,
      loadingSearch: false,
      searchForm: {
        activityName: null,
        date: '',
        pageNumber: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        status: null
      },
      buttonArr: [
        { name: '全部', label: 'all', num: null, loading: false },
        { name: '进行中', label: 'now', num: null, loading: false },
        { name: '待生效', label: 'waiting', num: null, loading: false },
        { name: '已结束', label: 'over', num: null, loading: false }
      ]
    }
  },
  created() {
    this.getDelivery()
  },

  methods: {
    // 重置
    handleReset() {
      this.searchForm = {
        activityName: null,
        date: '',
        pageNumber: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        status: null
      }
      this.getDelivery()
      this.currentStatus = 'all'
    },
    // 搜索
    handleSearch() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getDelivery()
    },
    // 切换启禁用
    handleStatus(row, event) {
      this.$confirm(`确定要${event ? '启用' : '禁用'}该活动吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '再想想',
        type: 'warning'
      })
        .then(() => {
          this.upStatus(row, event)
        })
        .catch(() => {})
    },
    handleType(type) {
      let aType
      switch (type) {
        case 'now':
          aType = 'primary'
          break
        case 'over':
          aType = 'warning'
          break
        case 'waiting':
          aType = 'success'
          break
        default:
          aType = 'info'
      }
      return aType
    },
    // 请求切换启禁用
    async upStatus(row, event) {
      row.loadingSwitch = true
      const id = row.activityId
      const query = { status: event ? 1 : 0 }
      try {
        await fhStatusDelivery(id, query)
        this.$message.success(`${event ? '启用' : '禁用'}成功`)
        row.upStatus = event ? 1 : 0
      } catch (e) {
        console.log(`${event ? '启用' : '禁用'}失败：${e}`)
      }
      row.loadingSwitch = false
    },
    // 获取列表
    async getDelivery() {
      this.loadingTable = true
      const params = Object.assign({}, this.searchForm)
      const time = params.date
      params.startTime = time.length > 0 ? time[0] : null
      params.endTime = time.length > 0 ? time[1] : null
      delete params.date
      try {
        const { results, count } = await fhGetDelivery(params)
        this.buttonArr[this.currentIndex].num = count
        this.total = count
        const tableData = Object.assign([], results)
        tableData.forEach(element => {
          element.loadingSwitch = false
          const sou = element.weekCycle.split('').reverse()
          element.weekCycle = arraysMap(undefined, sou, '1')
        })
        this.tableData = tableData
      } catch (e) {
        //
      }
      this.loadingTable = false
    },
    // 删除
    handleDelete(id, index) {
      this.delOverflow(id, index)
    },
    async delOverflow(id, index) {
      try {
        await fhDelDelivery(id)
        this.$message({ type: 'success', message: '删除成功' })
        // 删除最后一条 当前页-1
        if (index === 0 && this.searchForm.pageNumber > 1) {
          --this.searchForm.pageNumber
        }
        this.getDelivery()
      } catch (e) {
        console.log(e)
      }
    },
    // 分页,
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getDelivery()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNumber = val
      this.getDelivery()
    },
    toggleStatus(item, index) {
      this.currentStatus = item.label
      if (index !== this.currentIndex) {
        this.currentIndex = index
        switch (item.label) {
          case 'all':
            this.searchForm.status = null
            break
          case 'now':
            this.searchForm.status = 2
            break
          case 'waiting':
            this.searchForm.status = 1
            break
          case 'over':
            this.searchForm.status = 3
            break
        }
        this.getDelivery()
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor {
  width: 100%;
}
.wrap {
  background: #fff;
  padding: 24px 34px;
}
.actived {
  color:#52ACFF;
  background: #fff;
  // border: 0.5px solid #52ACFF;
}
.search {
  margin-bottom: 28px;
}
.col {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
