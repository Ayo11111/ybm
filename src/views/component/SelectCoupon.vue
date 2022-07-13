<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-04 11:46:54
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-09 09:44:58
-->
<template>
  <div>
    <el-dialog
      title="选择优惠券"
      :visible.sync="dialogVisibleType"
      width="60%"
      @close="$emit('update:dialogVisible', false)"
    >
      <div class="query-coupon">
        <el-form ref="queryCForm" :model="queryCForm" label-width="100px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="优惠券类型">
                <el-select
                  v-model="searchForm.type"
                  placeholder="代金券/单品券"
                  clearable
                  @change="handelCouponChange"
                >
                  <el-option
                    v-for="item in couponOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col style="float:right;width:50px">
              <el-tooltip
                v-if="false"
                class="item"
                effect="dark"
                content=""
                placement="top"
              >
                <a-icon type="exclamation-circle" />
                <div slot="content">
                  <div>开屏红包是不区分店铺的，所以不是全店铺通用</div>
                  <div>以及有限领次数的优惠券不显示</div>
                </div>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table-coupon" style="margin-bottom:20px">
        <el-table
          ref="multipleTable"
          v-loading="loadingTable"
          :header-cell-style="getRowClass"
          :data="tableData"
          highlight-current-row
          tooltip-effect="dark"
          style="width: 100%"
          @select="selectC"
          @select-all="selectCAll"
        >
          <el-table-column v-if="radioOrCheckbox==='radio'" label="选择" width="50">
            <template slot-scope="{ row }">
              <el-checkbox
                v-model="row.checked"
                :label="true"
                @change="changeRadioB(row)"
              ><span /></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column
            v-if="radioOrCheckbox==='checkbox'"
            type="selection"
            width="50"
          />
          <el-table-column label="优惠券名称" min-width="25%" prop="name" />
          <el-table-column label="类型" min-width="25%" prop="type">
            <template slot-scope="{ row }">
              <span v-if="row.type === 1">单品券</span>
              <span v-if="row.type === 2">代金券</span>
            </template>
          </el-table-column>
          <el-table-column v-if="false" label="适用店铺" min-width="30%">
            <template slot-scope="{ row }">
              <span v-if="row.isAllApplicableStore">全店铺</span>
              <template v-else>
                <span
                  v-for="(item, index) in row.storeNameArray"
                  :key="item.id"
                >
                  <span
                    v-if="index != row.storeNameArray.length - 1"
                  >{{ item.storeName }}、</span>
                  <span v-else>{{ item.storeName }}</span>
                </span>
                <span v-if="row.allChosen">全店铺</span>
              </template>
            </template></el-table-column>
          <el-table-column label="库存" min-width="15%" prop="stock" />
          <el-table-column v-if="false" label="限领次数" min-width="15%">
            <template slot-scope="{ row }">
              <span v-if="row.isLimitGrantNum === 1">{{
                row.limitGrantNum
              }}</span>
              <span v-else>不限制</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          :current-page.sync="pageNumber"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
      <div v-if="false" class="info">
        <el-row>
          <div
            v-if="couponTemplate[clickIndex] && couponTemplate[clickIndex].name"
          >
            您选择了
            <span class="edit-item">{{ couponTemplate[clickIndex].name }}</span>
          </div>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="false"
          @click="$emit('update:dialogVisible', false)"
        >取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fhGetCoupon } from '@/api/marketing/coupon'
import setRowStyle from '@/utils/tableHeaderClass'
import getRowClass from '@/utils/tableHeaderClass'

export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    queryCForm: {
      type: Object,
      default() {
        return {}
      }
    },
    couponOptions: {
      type: Array,
      default() {
        return [
          { value: 2, label: '代金券' },
          { value: 1, label: '单品券' }
        ]
      }
    },
    radioOrCheckbox: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      dialogVisibleType: this.dialogVisible,
      pageNumber: 1,
      selectedCouponibleType: this.dialogVisible,
      selectedCoupon: {},
      selection: [],
      pageSize: 10,
      total: 0,
      searchForm: {
        type: null
      },
      loadingTable: false,
      tableData: []
    }
  },
  watch: {
    dialogVisible(val) {
      this.dialogVisibleType = val
    }
  },
  mounted() {
    window.selectCoupon = this
    this.getCouponData()
  },

  methods: {
    selectC(selection, row) {
      this.selection = selection
    },
    selectCAll(selection) {
      this.selection = selection
    },
    changeRadioB(row) {
      console.log(row.checked)
      this.tableData.forEach((el, index) => {
        if (el.id !== row.id) {
          el.checked = false
        }
      })
      this.selectedCoupon = row
    },
    submit() {
      if (this.radioOrCheckbox === 'radio') {
        const hasSelected = Object.keys(this.selectedCoupon).length > 0
        if (hasSelected) {
          this.$emit('selectCoupon', this.selectedCoupon)
          this.$emit('update:dialogVisible', false)
        } else {
          this.$message({ type: 'error', message: '请选择优惠券' })
        }
      } else {
        if (this.selection.length > 0) {
          this.$emit('selectCoupon', this.selection)
          this.$emit('update:dialogVisible', false)
        } else {
          this.$message({ type: 'error', message: '请选择优惠券' })
          return
        }
      }
    },
    handelCouponChange(val) {
      this.pageSize = 10
      this.pageNumber = 1
      val === ''
        ? ((this.searchForm.type = null), this.getCouponData())
        : this.getCouponData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getCouponData()
    },
    handleCurrentChange(val) {
      this.pageNumber = val
      this.getCouponData()
    },
    // 请求优惠券列表
    async getCouponData() {
      this.query = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        type: this.searchForm.type,
        status: true
      }
      this.loadingTable = true
      try {
        const { results, count } = await fhGetCoupon(this.query)
        this.total = count
        const tableData = Object.assign([], results)
        tableData.forEach(el => {
          el.checked = false
        })
        this.tableData = tableData
      } catch (e) {
        console.log(e)
      }
      this.loadingTable = false
    },
    getRowClass,
    setRowStyle
  }
}
</script>

<style lang="scss" scoped>

</style>
