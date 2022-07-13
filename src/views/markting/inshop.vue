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
    <el-table
      v-loading="loadingTable"
      style="margin-bottom:20px;width: 100%"
      :data="tableData"
      stripe
      :header-cell-style="$getRowClass"
    >
      <template slot="empty">
        <TmEmpty />
      </template>
      <el-table-column label="活动名称" width="200" prop="activityName" />
      <el-table-column label="活动日期" width="200">
        <template v-if="row.startTime" slot-scope="{ row }">
          {{ row.startTime.slice(0, 10) }} 至 {{ row.endTime.slice(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column prop="" label="活动状态" width="180">
        <template slot-scope="{ row }">
          <a-badge
            v-if="row.actStatus === 2"
            text="进行中"
            status="processing"
          />
          <a-badge v-if="row.actStatus === 1" text="待生效" status="success" />
          <a-badge v-if="row.actStatus === 3" text="已结束" status="warning" />
        </template>
      </el-table-column>
      <el-table-column label="适用店铺数量" prop="storeNum" />

      <el-table-column prop="" label="生效周期">
        <template v-if="row.weekCycle" slot-scope="{ row }">
          <span v-if="row.weekCycle.length === 7">每天</span>
          <template v-else>
            <span
              v-for="(item, index) in row.weekCycle"
              :key="index"
            ><span v-if="index === row.weekCycle.length - 1">{{ item }}</span>
              <span v-else>{{
                item
              }}、</span></span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="" label="生效时段" width="155">
        <template slot-scope="{ row }">
          <span v-if="row.allDayFlag">全天</span>
          <template v-else>
            <span v-for="(item,index) in row.actPeriodList" :key="index">
              <template v-if="index===row.actPeriodList.length-1">{{ item.startTime }}~{{ item.endTime }}</template>
              <template v-else>{{ item.startTime }}~{{ item.endTime }}、</template>
            </span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="启\禁用">
        <template slot-scope="{ row }">
          <a-switch
            :checked="row.upStatus?true:false"
            checked-children="启用"
            un-checked-children="禁用"
            :loading="row.loadingSwitch"
            @change="handleStatus(row, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作">
        <template slot-scope="{ row ,$index}">
          <router-link :to="{name:'inshopDetail',params:{id:row.activityId}}">
            <span class="edit-item">详情</span>
          </router-link>
          <a-divider type="vertical" />
          <a-popconfirm
            title="确定要删除该活动吗?"
            ok-text="确定"
            cancel-text="再想想"
            @confirm="handleDelete(row.activityId,$index)"
          >
            <span class="delete-item">删除</span>
          </a-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
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
  fhGetInshop,
  fhStatusInshop,
  fhDelInshop
} from '@/api/marketing/inshop'
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
    this.fhGetInshop()
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
      this.currentStatus = 'all'
      this.fhGetInshop()
    },
    // 搜索
    handleSearch() {
      this.searchForm.pageNumber = 1
      this.searchForm.pageSize = 10
      this.fhGetInshop()
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
        await fhStatusInshop(id, query)
        this.$message.success(`${event ? '启用' : '禁用'}成功`)
        row.upStatus = event ? 1 : 0
      } catch (e) {
        console.log(`${event ? '启用' : '禁用'}失败：${e}`)
      }
      row.loadingSwitch = false
    },
    // 获取列表
    async fhGetInshop() {
      this.loadingTable = true
      const params = Object.assign({}, this.searchForm)
      const time = params.date
      params.startTime = time.length > 0 ? time[0] : null
      params.endTime = time.length > 0 ? time[1] : null
      delete params.date
      try {
        const { results, count } = await fhGetInshop(params)
        this.buttonArr[this.currentIndex].num = count
        this.total = count
        const tableData = Object.assign([], results)
        tableData.map(element => {
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
        await fhDelInshop(id)
        this.$message({ type: 'success', message: '删除成功' })
        // 删除最后一条 当前页-1
        if (index === 0 && this.searchForm.pageNumber > 1) {
          --this.searchForm.pageNumber
        }
        this.fhGetInshop()
      } catch (e) {
        console.log(e)
      }
    },
    // 分页(){},
    handleSizeChange(val) {
      this.searchForm.pageSize = val
      this.fhGetInshop()
    },
    handleCurrentChange(val) {
      this.searchForm.pageNumber = val
      this.fhGetInshop()
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
        this.fhGetInshop()
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
.delete-item{
  color:#F56C6C;
  &:hover{
    cursor: pointer;
  }
}
.col {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
</style>
