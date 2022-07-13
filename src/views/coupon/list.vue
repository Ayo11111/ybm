<template>
  <div class="container">
    <div class="content">
      <div class="search">
        <el-form ref="form" :model="searchForm" label-width="96px">
          <el-row>
            <el-col :md="12" :sm="14" :lg="10" :xl="8">
              <el-form-item label="优惠券类型:">
                <el-select
                  v-model="searchForm.type"
                  placeholder="代金券/单品券"
                  clearable
                  style="width:100%"
                >
                  <el-option label="代金券" value="2" />
                  <el-option label="单品券" value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="10" :sm="8" :lg="8" :xl="6">
              <el-form-item label-width="10px">
                <el-button
                  type="primary"
                  :loading="loadingSearch"
                  @click="handerSearch"
                >搜 索</el-button>
                <el-button
                  :loading="loadingReset"
                  @click="handelReset"
                >重 置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="btn" style="margin-bottom:30px">
        <el-dropdown>
          <el-button type="primary">
            新增优惠券
            <i class="el-icon-arrow-down el-icon--right" />
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <router-link
                :to="{ name: 'addCoupon', params: { type: 2 } }"
              >代金券</router-link>
            </el-dropdown-item>
            <el-dropdown-item>
              <router-link
                :to="{ name: 'couponFood', params: { type: 1 } }"
              >单品券</router-link>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          v-loading="loadingTable"
          :data="tableData"
          tooltip-effect="dark"
          boarder
          size="large"
          style="width: 100%"
          :header-cell-style="$getRowClass"
          @selection-change="handleSelectionChange"
        >
          <template slot="empty">
            <TmEmpty />
          </template>
          <el-table-column label="优惠券名称" min-width="25%" prop="name" />
          <el-table-column prop="typeName" label="类型" min-width="25%">
            <template slot-scope="{ row }">
              <span v-if="row.type === 2">代金券</span>
              <span v-if="row.type === 1">单品券</span>
            </template>
          </el-table-column>
          <el-table-column prop="number" label="已领取/剩余" min-width="20%">
            <template slot-scope="{ row }">
              <span>{{ row.sendNum }}</span>/
              <span>{{ row.stock }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="转换金额"
            min-width="15%"
            prop="conversionAmount"
          />
          <el-table-column
            label="核销数量"
            min-width="15%"
            prop="usedNum"
          />

          <el-table-column label="启|禁用" min-width="15%">
            <template slot-scope="{ row }">
              <a-switch
                :checked="row.status"
                checked-children="启用"
                :loading="row.loadingSwitch"
                un-checked-children="禁用"
                default-checked
                @change="handelStatusChange(row, $event)"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="10%">
            <template slot-scope="{ row }">
              <router-link
                :to="{ name: 'couponDetail', params: { id: row.id } }"
                class="edit-item"
              >详 情</router-link>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定要删除该优惠券吗?"
                ok-text="确定"
                cancel-text="再想想"
                @confirm="handleDelete(row.id)"
                @cancel="cancelDeleteFood(row.id)"
              >
                <a href="#" class="delete-item">删 除</a>
              </a-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          :current-page="pageNumber"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import getRowClass from '@/utils/tableHeaderClass'
import {
  fhGetCoupon,
  fhDelCoupon,
  fhStatusCoupon
} from '@/api/marketing/coupon'
// import { setRowStyle } from '@/utils/table'
import { setLocalStorage, removeLocalStorage } from '@/utils/localstorage'

export default {
  data() {
    return {
      pageNumber: JSON.parse(localStorage.getItem('pageNumber')) || 1,
      dialogVisible: false,
      loadingSearch: false,
      loadingReset: false,
      loadingTable: false,

      ruleForm: {
        integral: ''
      },
      searchForm: JSON.parse(localStorage.getItem('searchForm')) || {
        type: null
      },
      rules: {
        integral: [{ required: true, message: '积分必填', trigger: 'blur' }]
      },
      tableData: [],
      // 分页
      pageSize: 10,
      total: 1
    }
  },
  mounted() {
    this.getCouponData()
    window.coupon = this
  },
  methods: {
    // 搜索按钮
    handerSearch() {
      this.loadingSearch = true
      this.pageNumber = 1
      this.pageSize = 10
      this.getCouponData()
    },
    // 重置按钮
    handelReset() {
      this.loadingReset = true
      this.searchForm = { type: '' }

      this.pageNumber = 1
      this.pageSize = 10
      this.getCouponData()
    },
    // 切换状态
    handelStatusChange(row, event) {
      this.updateCouponStatusData(row, event)
    },
    // 请求切换状态
    async updateCouponStatusData(row, event) {
      row.loadingSwitch = true
      const id = row.id
      const query = { status: event }
      try {
        await fhStatusCoupon(id, query)
        this.$message.success(`${event ? '启用' : '禁用'}成功`)
      } catch (e) {
        console.log(`${event ? '启用' : '禁用'}失败：${e}`)
      }
      row.status = event
      row.loadingSwitch = false
    },
    // 点击删除——删除优惠券
    handleDelete(id) {
      this.deleteCouponData(id) // 删除请求
    },
    // 删除优惠券
    async deleteCouponData(id) {
      this.loadingTable = true
      try {
        await fhDelCoupon(id)
        this.$message({ type: 'success', message: '删除成功' })
        this.getCouponData()
      } catch (e) {
        console.log(e)
      }
      this.loadingTable = false
    },
    // 请求优惠券列表
    async getCouponData() {
      this.query = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        type: this.searchForm.type
      }
      this.loadingTable = true
      try {
        const { results, count } = await fhGetCoupon(this.query)
        console.log('result', results)
        this.total = count
        const tableData = Object.assign([], results)
        tableData.forEach(el => {
          el.disable = el.disable !== 1 // 开关0,1 。1代表禁用
          el.loadingSwitch = false
        })
        this.tableData = tableData
      } catch (e) {
        console.log(e)
      }
      this.loadingTable = false
      this.loadingSearch = false
      this.loadingReset = false
    },
    //  多选
    handleSelectionChange(val) {
      console.log(val)
    },
    // 跳页
    handleSizeChange(val) {
      this.pageSize = val
      this.getCouponData()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getCouponData()
    },
    // 表格表头
    getRowClass

    // 表格行高
    // setRowStyle
  },
  beforeRouteLeave(to, from, next) {
    // 是否跳转到特定的页面
    const flag = /couponDetail/.test(to.name)
    if (flag) {
      // 是 存储当前页码和搜索条件
      const key = ['pageNumber', 'searchForm']
      const searchForm = Object.assign({}, this.query)
      delete searchForm.pageNumber
      delete searchForm.pageSize
      const value = [this.pageNumber, searchForm]
      setLocalStorage(value, key)
    } else {
      // 否 清楚本地存储
      const key = ['pageNumber', 'searchForm']
      removeLocalStorage(key)
    }

    next()
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: calc(100vh - 102px);
  .content {
    display: flex;
    flex-direction: column;
    .table {
      margin-bottom: 20px;
    }
  }
}
</style>
