<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-26 11:18:38
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-14 11:50:13
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
            type="daterange"
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
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :loading="loadingTable"
    >
      <div slot="day" slot-scope="scope">
        {{ scope.startTime.slice(0, 10) }} 至 {{ scope.endTime.slice(0, 10) }}
      </div>
      <div slot="status" slot-scope="scope">
        <a-badge
          :text="['', '待生效', '进行中', '已结束'][scope]"
          :status="['', 'processing', 'success', 'error'][scope]"
        />
      </div>
      <div slot="weekCycle" slot-scope="scope">
        <span v-if="scope.length === 7">每天</span>
        <template v-else>
          <span v-for="(item, index) in scope" :key="index"
            ><span v-if="index === scope.length - 1">{{ item }}</span>
            <span v-else>{{ item }}、</span></span
          >
        </template>
      </div>
      <div slot="allDayFlag" slot-scope="scope, row">
        <span v-if="scope">全天</span>
        <template v-else>
          <span v-for="(item, index) in row.actPeriodList" :key="index">
            <template v-if="index === row.actPeriodList.length - 1"
              ><div>{{ item.startTime }}~{{ item.endTime }}</div>
            </template>
            <template v-else>
              <div>{{ item.startTime }}~{{ item.endTime }}、</div></template
            >
          </span>
        </template>
      </div>
      <div slot="discountFoodTemplateRspList" slot-scope="scope">
        <span v-for="(item, index) in scope" :key="index">
          <span v-if="index < scope.length - 1">{{ item.name }}、</span>
          <span v-else>{{ item.name }}</span>
        </span>
      </div>
      <div slot="upStatus" slot-scope="scope, item">
        <a-switch
          :checked="scope"
          checked-children="启用"
          un-checked-children="禁用"
          :loading="item.loadingSwitch"
          @change="handleStatus(item, $event)"
        />
      </div>
      <div slot="edit" slot-scope="scope, item, index">
        <router-link
          :to="{ name: 'reductionDetail', params: { id: scope.activityId } }"
        >
          <span class="edit-item">详情</span>
        </router-link>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定要删除该活动吗?"
          ok-text="确定"
          cancel-text="再想想"
          @confirm="handleDelete(scope.activityId, index)"
        >
          <span class="delete-item">删除</span>
        </a-popconfirm>
      </div>
    </a-table>
    <el-pagination
      style="margin-top: 20px"
      :current-page="searchForm.pageNumber"
      :page-sizes="[10, 20, 50]"
      :page-size="searchForm.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import {
  fhGetOverflow,
  fhDelOverflow,
  fhStatusOverflow
} from '@/api/marketing/reduction'
import { arraysMap } from '@/utils'
export default {
  name: 'AB',
  data() {
    return {
      loadingTable: false,
      total: 0,
      tableData: [],
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
      ],
      columns: [
        {
          title: '活动名称',
          dataIndex: 'activityName'
        },
        {
          title: '活动日期',
          dataIndex: '',
          scopedSlots: { customRender: 'day' }
        },
        {
          title: '活动状态',
          dataIndex: 'actStatus',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '生效周期',
          dataIndex: 'weekCycle',
          scopedSlots: { customRender: 'weekCycle' }
        },
        {
          title: '生效时段',
          dataIndex: 'allDayFlag',
          scopedSlots: { customRender: 'allDayFlag' }
        },
        {
          title: '活动内容',
          dataIndex: 'summary'
        },
        {
          title: '启\禁用',
          dataIndex: 'upStatus',
          scopedSlots: { customRender: 'upStatus' }
        },
        {
          title: '操作',
          dataIndex: '',
          scopedSlots: { customRender: 'edit' }
        }
      ]
    }
  },
  created() {
    this.getReduction()
    window.app = this
  },
  methods: {
    // 重置
    handleReset() {
      this.searchForm = {
        activityName: '',
        date: '',
        pageNumber: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        status: null
      }
      this.getReduction()
      this.currentStatus = 'all'
    },
    // 搜索
    handleSearch() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.getReduction()
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
        await fhStatusOverflow(id, query)
        this.$message.success(`${event ? '启用' : '禁用'}成功`)
        row.upStatus = event ? 1 : 0
      } catch (e) {
        console.log(`${event ? '启用' : '禁用'}失败：${e}`)
      }
      row.loadingSwitch = false
    },
    // 获取列表
    async getReduction() {
      this.loadingTable = true
      const params = Object.assign({}, this.searchForm)
      const time = params.date
      params.startTime = time.length > 0 ? time[0] : null
      params.endTime = time.length > 0 ? time[1] : null
      delete params.date
      try {
        const { results, count } = await fhGetOverflow(params)
        this.buttonArr[this.currentIndex].num = count
        this.total = count
        const tableData = Object.assign([], results)
        tableData.forEach(element => {
          element.loadingSwitch = false
          const sou = element.weekCycle.split('').reverse()
          element.weekCycle = arraysMap(undefined, sou, '1')
        })
        this.tableData = tableData
        // code
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
        await fhDelOverflow(id)
        this.$message({ type: 'success', message: '删除成功' })
        // 删除最后一条 当前页-1
        if (index === 0 && this.searchForm.pageNumber > 1) {
          --this.searchForm.pageNumber
        }
        this.getReduction()
      } catch (e) {
        console.log(e)
      }
    },
    // 分页(){},
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.getReduction()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNumber = val
      this.getReduction()
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
        this.getReduction()
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
  color: #52acff;
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
