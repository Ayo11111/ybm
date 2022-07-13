<template>
  <div>
    <!-- <div class="order-list">
      
    </div> -->
    <div v-for="item in orderList" :key="item.id" class="item">
      <order-info
        :raw-value="item"
        @openStatusDetails="openStatusDetails"
        :type="type"
        :orderListType="3"
      />
    </div>
    <a-empty v-show="orderList.length <= 0" class="empty_margin" />
    <Pagination
      v-if="total !== 0"
      ref="pagination"
      :total="total"
      style="background: transparent"
      @pagination="pagination"
    />
    <CurrOrderDetails
      :type="type"
      :visible.sync="visible"
      :orderId="orderId"
    ></CurrOrderDetails>
  </div>
</template>

<script>
import { fhGetOrderHistory, fhGetNurseHistory } from '@/api/orders'
import OrderInfo from '@/components/OrderInfo'
import Pagination from '@/components/Pagination'
import CurrOrderDetails from './currOrderDetails'
export default {
  components: {
    Pagination,
    OrderInfo,
    CurrOrderDetails
  },
  props: {
    Json: {
      type: Object,
      default: () => {}
    },
    orderStatusJson: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orderList: [],
      total: 0,
      status: false,
      loading: false,
      visible: false,
      orderId: null
    }
  },
  mounted() {
    window.ol = this
  },
  watch: {
    type(newVal) {
      if (['retail', 'restaurant'].includes(newVal)) {
        this.getOrderHistory()
      } else {
        this.getNurseHistory()
      }
    }
  },
  methods: {
    async getOrderHistory(params) {
      if (this.status) {
        params = Object.assign(params, this.Json)
      }
      this.$emit('load', true)
      try {
        const { results, count } = await fhGetOrderHistory(params)
        results.forEach(item => {
          item.openStatus = true
        })
        this.total = count
        this.orderList = results
      } catch (err) {
        console.log(err)
      }
      this.$emit('load', false)
    },
    async getNurseHistory(params) {
      if (this.status) {
        params = Object.assign(params, this.Json)
      }
      this.$emit('load', true)
      try {
        const { results } = await fhGetNurseHistory(params, this.Json)
        results.results.forEach(item => {
          item.openStatus = true
          item.sexText = item.sex === 1 ? '男' : !item.sex ? '未知' : '女'
          item.nurseSexText =
            item.nurseSex === 1 ? '男' : !item.nurseSex ? '性别未知' : '女'
        })
        this.total = results.count
        this.orderList = results.results
      } catch (err) {
        console.log(err)
      }
      this.$emit('load', false)
    },
    updateList() {
      if (['retail', 'restaurant'].includes(this.type)) {
        this.getOrderHistory()
      } else {
        this.getNurseHistory()
      }
    },
    select() {
      this.status = true
      const type = {
        pageType: null
      }
      const params = Object.assign(type, this.Json)
      this.pagination(params)
    },
    cancel() {
      this.currentPage = 1
    },
    openFullScreen2() {
      this.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    close() {
      this.loading.close()
    },
    openStatusDetails(id) {
      this.visible = true
      this.orderId = id
    },
    pagination(v) {
      if (['retail', 'restaurant'].includes(this.type)) {
        this.getOrderHistory(v)
      } else {
        this.getNurseHistory(v)
      }
    }
  }
}
</script>

<style scoped lang="scss">
@for $i from 1 to 4 {
  @media (min-width: 555px * $i + 72px * ($i - 1)) {
    .order-list {
      column-count: $i !important;
    }
  }
}
.order-list {
  background: transparent;
  padding: 0;
  column-count: 3;
  column-gap: 24px;
  .item {
    break-inside: avoid;
    box-sizing: border-box;
  }
}

.item {
  margin-bottom: 30px;
}
.info {
  width: 100%;
  height: 41px;
  background: rgba(204, 204, 204, 0.149019607843137);
  line-height: 41px;
  padding: 0 20px;
  color: #999999;
  margin-top: 15px;
}
.box {
  margin-top: 22px;
  display: flex;
  .col {
    font-size: 13px;
    margin-bottom: 14px;
  }
  .flex {
    display: flex;
    justify-content: space-between;
  }
  .left {
    flex: 0.78;
    border-right: 0.5px solid #cccccc;
    padding: 0 10px;
  }
  .right {
    flex: 1;
    margin-left: 25px;
    font-size: 13px;
  }
  .co {
    margin-bottom: 6px;
  }
  .row {
    margin-bottom: 15px;
  }
}
</style>
