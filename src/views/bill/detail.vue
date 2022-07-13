<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-24 15:47:36
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-22 05:55:39
-->
<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="已结算账单" name="clsd">
        <div class="mb-12">
          <div v-loading="headerLoad" class="header">
            <el-row>
              <el-col class="col flex" :span="24">
                <span>账单周期：</span>
                <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  @change="getdate"
                />
                <el-radio-group
                  v-model="day"
                  style="margin-left: 16px"
                  @change="setDay"
                >
                  <el-radio-button label="1">近7天</el-radio-button>
                  <el-radio-button label="2">近30天</el-radio-button>
                  <el-radio-button label="3">近90天</el-radio-button>
                </el-radio-group>
                <el-button
                  type="primary"
                  style="margin-left: 16px"
                  @click="select"
                >
                  查询
                </el-button>
                <el-button @click="cancel">重置</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <bill-table :loading="detailLoad" :base-info="headerDetail" finance-type="clsd" :data="detailTable" />
        <pagination
          :total="total"
          :auto-scroll="autoScroll"
          @pagination="pagination"
        />
      </el-tab-pane>
      <el-tab-pane label="未结算账单" name="unclsd">
        <div class="mb-12">
          <div v-loading="headerLoad" class="header">
            <el-row>
              <el-col class="col flex" :span="24">
                <span>账单周期：</span>
                <el-date-picker
                  v-model="date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  @change="getdate"
                />
                <el-radio-group
                  v-model="day"
                  style="margin-left: 16px"
                  @change="setDay"
                >
                  <el-radio-button label="1">近7天</el-radio-button>
                  <el-radio-button label="2">近30天</el-radio-button>
                  <el-radio-button label="3">近90天</el-radio-button>
                </el-radio-group>
                <el-button
                  type="primary"
                  style="margin-left: 16px"
                  @click="select"
                >
                  查询
                </el-button>
                <el-button @click="cancel">重置</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <bill-table :loading="detailLoad" :base-info="headerDetail" finance-type="unclsd" :data="detailTable" />
        <pagination
          :total="total"
          :auto-scroll="autoScroll"
          @pagination="pagination"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import BillTable from './_components/BIllDetailTable'
import {
  fhGetFinanceHeader,
  fhGetFinanceList,
  fhGetDownloadFinance
} from '@/api/finance'
import { fhGetSotres } from '@/api/stores'
import { headerKeys } from './_utils'
import { forRender } from '@/utils'
export default {
  name: 'BillDetail',
  components: {
    Pagination,
    BillTable
  },
  data() {
    return {
      activeName: 'clsd',
      headerKeys,
      detailTable: [{}],
      detailLoad: false,
      stores: [],
      headerDetail: {},
      headerLoad: false,
      total: 0,
      date: [
        this.$moment().subtract('days', 7).format('YYYY-MM-DD'),
        this.$moment().subtract('days', 1).format('YYYY-MM-DD')
      ],
      day: 1,
      storeName: [],
      storeId: [],
      visible: false,
      query: {
        startTime: this.$moment().subtract('days', 7).format('YYYY-MM-DD'),
        endTime: this.$moment().subtract('days', 1).format('YYYY-MM-DD'),
        storeIds: null,
        billStatus: true
      },
      btnLoad: false,
      autoScroll: false,
      // 账单查询类型
      financeQuery: {}
    }
  },
  created() {
    this.getData()
  },
  methods: {
    forRender,
    fhGetSotres,
    getData() {
      this.getFinanceList()
      this.getFinanceHeader()
    },
    async getFinanceList() {
      this.detailLoad = true
      try {
        const { count, results } = await fhGetFinanceList(this.query)
        results.forEach(item => {
          item.Name = item.name
          item.orderType = ['', '外卖', '自提'][item.orderType]
        })
        this.detailTable = results
        this.total = count
      } catch (e) {
        console.log('debug axios', e)
      }
      this.detailLoad = false
    },
    // 获取头部详情
    async getFinanceHeader() {
      this.headerLoad = true
      try {
        const { results } = await fhGetFinanceHeader(this.query)
        this.headerDetail = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.headerLoad = false
    },
    async getDownloadFinance() {
      this.btnLoad = true
      try {
        const { results } = await fhGetDownloadFinance(this.query)
        var eleLink = document.createElement('a')
        eleLink.download
        eleLink.href = results
        eleLink.click()
        eleLink.remove()
        this.$message.success('财务对账报表导出成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.btnLoad = false
    },
    setDay(val) {
      switch (val) {
        case '1':
          this.date = [
            this.$moment().subtract('days', 7).format('YYYY-MM-DD'),
            this.$moment().subtract('days', 1).format('YYYY-MM-DD')
          ]
          this.query['startTime'] = this.$moment()
            .subtract('days', 7)
            .format('YYYY-MM-DD')
          this.query['endTime'] = this.$moment()
            .subtract('days', 1)
            .format('YYYY-MM-DD')
          break
        case '2':
          this.date = [
            this.$moment().subtract('days', 30).format('YYYY-MM-DD'),
            this.$moment().subtract('days', 1).format('YYYY-MM-DD')
          ]
          this.query['startTime'] = this.$moment()
            .subtract('days', 30)
            .format('YYYY-MM-DD')
          this.query['endTime'] = this.$moment()
            .subtract('days', 1)
            .format('YYYY-MM-DD')
          break
        case '3':
          this.date = [
            this.$moment().subtract('days', 90).format('YYYY-MM-DD'),
            this.$moment().subtract('days', 1).format('YYYY-MM-DD')
          ]
          this.query['startTime'] = this.$moment()
            .subtract('days', 90)
            .format('YYYY-MM-DD')
          this.query['endTime'] = this.$moment()
            .subtract('days', 1)
            .format('YYYY-MM-DD')
          break
      }
      this.getData()
    },
    getdate(val) {
      this.query['startTime'] = val[0]
      this.query['endTime'] = val[1]
      this.getData()
    },
    relationList(name, id, select) {
      this.storeName = select
      this.storeId = id
      this.query['storeIds'] = id.join(', ')
    },
    handleClose(item) {
      this.$refs.relation.close(item)
    },
    select() {
      this.getData()
    },
    cancel() {
      this.date = [
        this.$moment().subtract('days', 7).format('YYYY-MM-DD'),
        this.$moment().subtract('days', 1).format('YYYY-MM-DD')
      ]
      this.day = 1
      this.query['startTime'] = this.$moment()
        .subtract('days', 7)
        .format('YYYY-MM-DD')
      this.query['endTime'] = this.$moment()
        .subtract('days', 1)
        .format('YYYY-MM-DD')
      this.getData()
    },
    // 切换店铺
    changeStoreId(v) {
      this.query = Object.assign({}, this.query, {
        pageNumber: 1,
        pageSize: 10,
        storeId: v.id
      })

      this.getData()
    },
    // 查询页码
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      this.getData()
    },
    // 切换tabs
    handleClick({ name }) {
      const query = this.financeQuery[name] || { pageSize: 10, pageNumber: 1 }

      this.query = {
        ...this.query,
        billStatus: name === 'clsd',
        ...query
      }

      this.$nextTick(() => this.getData())
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .box {
    padding: 0;
  }

  .money-span {
    font-weight: 700;
    font-size: 20px;
  }

  .red {
    color: red;
  }

  .green {
    color: green;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .col {
    margin-bottom: 25px;
  }
  ::v-deep .el-tag + .el-tag {
    margin-left: 10px;
  }
  ::v-deep .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  ::v-deep .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
}
.colCol {
  display: flex;
  flex-flow: column;
  margin-bottom: 12px;
  span {
    font-size: 14px;
    color: #666666;
    margin-bottom: 6px;
  }
  b {
    font-size: 18px;
  }
}
.container {
  min-height: auto;
}
</style>
