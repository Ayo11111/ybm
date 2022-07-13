<template>
  <div class="container">
    <div class="search mb-12">
      <div :span="9">
        <span>订单日期</span>
        <el-date-picker
          style="width:240px"
          v-model="date"
          type="daterange"
          size="small"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getdate"
        />
      </div>
      <div :span="9">
        <span>用餐日期</span>
        <el-date-picker
          style="width:240px"
          v-model="date"
          type="daterange"
          size="small"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getdate"
        />
        <el-button
          type="primary"
          style="margin-left: 16px"
          @click="select"
        >
          查询
        </el-button>
      </div>
    </div>
    <a-table :loading="loading" :columns="columns" :data-source="data" :pagination="false"></a-table>
    <pagination :total="total" @pagination="pagination"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { fhGetFinanceList } from '@/api/finance'
export default {
  name: 'WeekOrder',
  components: {
    Pagination
  },
  data() {
    return {
      columns: [
        {
          title: 'ID',
          key: 'id',
          dataIndex: 'id'
        },
        {
          title: '订单号',
          key: '',
          dataIndex: ''
        },
        {
          title: '订单时间',
          key: '',
          dataIndex: ''
        },
        {
          title: '餐次',
          key: '',
          dataIndex: ''
        },
        {
          title: '商品名称',
          key: '',
          dataIndex: ''
        },
        {
          title: '商品数量',
          key: '',
          dataIndex: ''
        },
        {
          title: '病区名称',
          key: '',
          dataIndex: ''
        },
        {
          title: '病床号',
          key: '',
          dataIndex: ''
        },
        {
          title: '用户姓名',
          key: '',
          dataIndex: ''
        },
        {
          title: '手机号',
          key: '',
          dataIndex: ''
        },
        {
          title: '订单状态',
          key: '',
          dataIndex: ''
        },
        {
          title: '支付状态',
          key: '',
          dataIndex: ''
        },
        {
          title: '退款状态',
          key: '',
          dataIndex: ''
        }
      ],
      data: [{}],
      loading: false,
      total: 0,
      date: [
        this.$moment().subtract('days', 7).format('YYYY-MM-DD'),
        this.$moment().subtract('days', 1).format('YYYY-MM-DD')
      ],
      query: {
        startTime: this.$moment().subtract('days', 7).format('YYYY-MM-DD'),
        endTime: this.$moment().subtract('days', 1).format('YYYY-MM-DD'),
        storeIds: null,
        billStatus: true
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.getFinanceList()
    },
    async getFinanceList() {
      this.detailLoad = true
      try {
        const { count, results } = await fhGetFinanceList(this.query)
        results.forEach(item => {
          item.Name = item.name
          item.orderType = ['', '外卖', '自提'][item.orderType]
        })
        this.data = results
        this.total = count
      } catch (e) {
        console.log('debug axios', e)
      }
      this.detailLoad = false
    },
    getdate(val) {
      this.query['startTime'] = val[0]
      this.query['endTime'] = val[1]
      this.getData()
    },
    select() {
      this.getData()
    },
    // 查询页码
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: auto;

  .search {
    display: flex;
    align-items: center;
  }
}
</style>
