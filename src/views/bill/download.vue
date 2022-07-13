<template>
  <div>
    <div class="container">
      <div>
        <b style="font-size: 18px">导出记录</b>
      </div>
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        value-format="yyyy-MM-dd"
        style="margin-top: 12px"
        @change="getDate"
      />
      <Table style="margin-top: 22px" :data="BillLog" />
      <Pagination :total="total" @pagination="pagination" />
    </div>
  </div>
</template>

<script>
import Table from './_components/downTable'
import Pagination from '@/components/Pagination'
import { fhGetBillLog } from '@/api/finance'
export default {
  components: {
    Table,
    Pagination
  },
  data() {
    return {
      date: null,
      Json: {
        startTime: null,
        endTime: null
      },
      BillLog: [{}],
      total: 0,
      status: false
    }
  },
  created() {
    this.getBillLog()
  },
  methods: {
    async getBillLog(params) {
      try {
        const { results, count } = await fhGetBillLog(params)
        this.BillLog = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
    },
    getDate(val) {
      if (val !== null) {
        this.Json['startTime'] = val[0]
        this.Json['endTime'] = val[1]
        this.status = true
      } else {
        this.Json['startTime'] = null
        this.Json['endTime'] = null
        this.status = false
      }
      this.getBillLog(this.Json)
    },
    pagination(params) {
      var Json = params
      if (this.status) {
        Json = Object.assign(params, this.Json)
      }
      this.getBillLog(Json)
    }
  }
}
</script>

<style scoped>
.col {
  margin: 15px 0 6px 0;
}
</style>
