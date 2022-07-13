<template>
  <div>
    <div class="date">
      <OfferDate :radio.sync="radio" :date.sync="date" />
      <el-button
        type="primary"
        :loading="exportLoad"
        @click="getExcel"
      >订单报表导出</el-button>
    </div>

    <div class="trade">
      <div class="title">
        交易数据
      </div>
      <div class="content">
        <Tag
          v-loading="loadingHeader"
          :tag-list="tagList"
          :tag-data="tagData"
        />
      </div>
    </div>
    <el-divider />
    <div class="rank">
      <div class="title">
        店铺排行
      </div>
      <div class="content">
        <Table
          v-loading="loadingTable"
          :columns="columns"
          row-key="rank"
          :table-data="tableData"
        />
        <Pagination
          :cur-page.sync="page.pageNumber"
          :page-size.sync="page.pageSize"
          :total="total"
          :page-sizes="[10,30,50,200]"
          @pagination="pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import OfferDate from '@/components/OfferDate'
import Tag from './Tag'
import Table from './Table'
import { fhGroupStat, fhGroupOrder, fhFlowExcel } from '@/api/group'
import { downloadFile } from '@/utils/download'
import Pagination from '@/components/Pagination'

const columns = [
  {
    title: '排名',
    dataIndex: 'rank',
    key: 'rank'
  },
  {
    title: '店铺名称',
    dataIndex: 'storeName',
    key: 'storeName'
  },
  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
    width: '200px'
  },
  {
    title: '社群订单数',
    dataIndex: 'focusOrderCount',
    key: 'focusOrderCount',
    sorter: (a, b) => a.focusOrderCount - b.focusOrderCount

  },
  {
    title: '社群订单金额',
    dataIndex: 'focusOrderPrice',
    key: 'focusOrderPrice',
    sorter: (a, b) => a.focusOrderPrice - b.focusOrderPrice

  }
]
const tagList = [
  { label: '店铺数', value: 'storeCount', field: 'storeCount', prefix: null, suffix: '家' },
  { label: '社群订单', value: 'focusOrderCount', field: 'focusOrderCount', prefix: null, suffix: '笔' },
  { label: '订单金额', value: 'focusOrderPrice', field: 'focusOrderPrice', prefix: '￥', suffix: null }
]
export default {
  components: {
    OfferDate,
    Tag,
    Table,
    Pagination
  },
  data() {
    return {
      columns: columns,
      total: 0,
      tagList: tagList,
      tagData: {},
      loadingHeader: false,
      exportLoad: false,
      loadingTable: false,
      tableData: [],
      radio: 0,
      date: null,
      query: {},
      page: { pageNumber: 1, pageSize: 10 }
    }
  },
  watch: {
    date: {
      handler(v) {
        console.log(v)
        if (v === null) {
          return
        }
        this.query = { startTime: v[0], endTime: v[1] }
        this.getHeader()
        this.getTable()
      }
    }
  },

  mounted() {
    window.de = this
  },

  methods: {
    async getHeader() {
      this.loadingHeader = true
      try {
        const { results } = await fhGroupStat(this.query)
        this.tagData = results
      } catch (error) {
        console.log(error)
      }
      this.loadingHeader = false
    },
    async getTable() {
      this.loadingTable = true
      try {
        const { results, count } = await fhGroupOrder(
          Object.assign({}, this.query, this.page)
        )
        this.tableData = results
        this.total = count
      } catch (error) {
        console.log(error)
      }
      this.loadingTable = false
    },
    pagination(v) {
      Object.assign(this.query, v)
      this.getTable()
    },
    // 导出excel
    async getExcel() {
      this.exportLoad = true
      try {
        const results = await fhFlowExcel(this.query)
        var uint8_msg = new Uint8Array(results)
        var decodedString = String.fromCharCode.apply(null, uint8_msg)
        if (decodedString.indexOf('success') !== -1) {
          var decoded = decodeURIComponent(escape(decodedString))
          var data = JSON.parse(decoded)
          this.$message.error(data.message)
        } else {
          const { startTime, endTime } = this.query
          downloadFile(results, `分众社群营销效果统计报表_${startTime}至${endTime}`)
          this.$message.success('分众社群营销效果统计报表导出成功')
        }
      } catch (e) {
        console.log('debug axios', e)
      }
      this.exportLoad = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-col {
  margin-bottom: 16px;
}
.date {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.title {
  margin-bottom: 20px;
  font-size: 20px;
  color: #333333;
  font-weight: 400;
  border-left: 4px solid #52ACFF;
  padding-left: 4px;
  line-height: 20px;
}
.content {
  padding: 10px;
}
</style>
