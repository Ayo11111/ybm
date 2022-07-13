<template>
  <div class="container">
    <div class="search mb-12">
      <div class="mr-12">
        <span>用餐日期：</span>
        <el-date-picker v-model="diningDate" style="width:240px" type="daterange" size="small" clearable
          start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
          @change="getDiningDate"
        />
      </div>
      <div class="mr-12">
        <span>餐次：</span>
        <el-select v-model="query.shitangMealsId" placeholder="请选择" size="small" clearable>
          <el-option v-for="item in mealList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </div>
      <div class="mr-12">
        <span>用户姓名：</span>
        <el-input v-model="query.memberName" style="width:140px" placeholder="请输入用户姓名" size="small" clearable />
      </div>
      <div class="mr-12">
        <span>用户手机号：</span>
        <el-input v-model="query.phone" style="width:140px" placeholder="请输入用户手机号" size="small" clearable />
      </div>
    </div>
    <div class="search mb-12">
      <div class="mr-12">
        <span>病区：</span>
        <el-select v-model="query.sickAreaId" placeholder="请选择" size="small" clearable>
          <el-option v-for="item in sickAreaList" :key="item.id" :label="item.sickAreaName" :value="item.id" />
        </el-select>
      </div>
      <div class="mr-12">
        <span>订单号：</span>
        <el-input v-model="query.orderId" style="width:200px" placeholder="请输入订单号" size="small" clearable />
      </div>
      <div class="mr-12">
        <span>订单状态：</span>
        <el-select v-model="query.orderStatus" style="width:140px" placeholder="请选择" size="small" clearable>
          <el-option v-for="(name, id) in orderStatusObject" :key="id" :label="name" :value="id" />
        </el-select>
      </div>
      <div class="mr-12">
        <span>支付状态：</span>
        <el-select v-model="query.payStatus" style="width:140px" placeholder="请选择" size="small" clearable>
          <el-option v-for="(name, id) in payStatusObject" :key="id" :label="name" :value="id" />
        </el-select>
      </div>
      <div>
        <el-button type="primary" style="margin-left: 16px" @click="onSearch">查询</el-button>
      </div>
    </div>
    <div>
      <a-button :disabled="!hasSelected" @click="handleDelivery">订单配送</a-button>
    </div>
    <week-delivery-dig :show.sync="weekDeliveryDig" :order-ids="orderIds" @ok="getData" />
    <a-table
      :loading="loading" :columns="columns" :data-source="data" :pagination="false" :scroll="{ x: 1000 }"
      :row-selection="{ selectedRowKeys: selectedRowKeys, getCheckboxProps: getCheckboxProps, onChange: onSelectChange }"
    >
      <div slot="foodItemVoList" slot-scope="{foodItemVoList}">
        <div v-for="food in foodItemVoList" :key="food.foodId" style="white-space:nowrap;">{{ food.foodName }} x {{ food.num }}</div>
      </div>
      <div slot="orderStatus" slot-scope="{orderStatus}">
        {{ orderStatusObject[orderStatus] }}
      </div>
      <div slot="payStatus" slot-scope="{payStatus}">
        {{ payStatusObject[payStatus] }}
      </div>
      <div slot="refundStatus" slot-scope="{refundStatus}">
        {{ refundStatusObject[refundStatus] }}
      </div>
      <span slot="action" slot-scope="row" class="view" @click="onView(row)">查看</span>
    </a-table>
    <pagination :total="total" @pagination="pagination" />
    <order-detail ref="orderDetail" :visible.sync="orderDetail" />
  </div>
</template>

<script>
import OrderDetail from './_components/orderDetail'
import WeekDeliveryDig from '@/components/WeekDeliveryDig'
import Pagination from '@/components/Pagination'
import { getStoreId } from '@/utils/auth'
import { fhGetMeals } from '@/api/week'
import { fhGetSickAreaList, fhGetOrderList } from '@/api/week-order'
export default {
  name: 'WeekOrder',
  components: {
    OrderDetail,
    WeekDeliveryDig,
    Pagination
  },
  data() {
    return {
      columns: [
        { title: '用餐时间', key: 'diningDate', dataIndex: 'diningDate', width: 90 },
        { title: '餐次', key: 'shitangMealsName', dataIndex: 'shitangMealsName', width: 50 },
        { title: '订单号', key: 'orderId', dataIndex: 'orderId', width: 110 },
        { title: '商品名称', key: 'foodItemVoList', scopedSlots: { customRender: 'foodItemVoList' }, width: 100 },
        { title: '数量', key: 'count', dataIndex: 'count', width: 50, align: 'center' },
        { title: '病区名称', key: 'sickAreaName', dataIndex: 'sickAreaName', width: 90 },
        { title: '病房号', key: 'bingfangName', dataIndex: 'bingfangName', width: 90 },
        { title: '病床号', key: 'bedNumber', dataIndex: 'bedNumber', width: 60, align: 'center' },
        { title: '用户姓名', key: 'name', dataIndex: 'name', width: 80 },
        { title: '手机号', key: 'phone', dataIndex: 'phone', width: 110 },
        { title: '退款金额(元)', key: 'refundPrice', dataIndex: 'refundPrice', width: 100, align: 'center' },
        { title: '打包费(元)', key: 'packagePrice', dataIndex: 'packagePrice', width: 90, align: 'center' },
        { title: '配送费(元)', key: 'deliveryPrice', dataIndex: 'deliveryPrice', width: 90, align: 'center' },
        { title: '订单金额(元)', key: 'totalPrice', dataIndex: 'totalPrice', width: 100, align: 'center' },
        { title: '订单状态', key: 'orderStatus', scopedSlots: { customRender: 'orderStatus' }, width: 90 },
        { title: '支付状态', key: 'payStatus', scopedSlots: { customRender: 'payStatus' }, width: 90 },
        { title: '退款状态', key: 'refundStatus', scopedSlots: { customRender: 'refundStatus' }, width: 90 },
        { title: '操作', key: 'operation', fixed: 'right', scopedSlots: { customRender: 'action' }, width: 60 }
      ],
      diningDate: [
        this.$moment().format('YYYY-MM-DD'),
        this.$moment().format('YYYY-MM-DD')
      ],
      mealList: [],
      sickAreaList: [],
      orderStatusObject: { 1: '待支付', 2: '已取消', 4: '备餐中', 301: '配送中', 302: '已完成', 601: '退款审核中', 602: '退款成功', 603: '退款失败', 605: '商家直接退款' },
      payStatusObject: { 0: '未支付', 1: '已支付' },
      refundStatusObject: { 0: '未退款', 601: '退款审核中', 602: '退款成功', 603: '退款失败', 605: '商家直接退款' },
      data: [],
      loading: false,
      total: 0,
      query: {
        startTime: this.$moment().format('YYYY-MM-DD'),
        endTime: this.$moment().format('YYYY-MM-DD'),
        shitangMealsId: null,
        memberName: null,
        phone: null,
        // pageType: 1,
        sickAreaId: null,
        orderId: null,
        orderType: 8,
        orderStatus: null,
        payStatus: null
      },
      weekDeliveryDig: false,
      selectedRowKeys: [],
      orderIds: '',
      orderDetail: false,
      detail: {}
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    }
  },
  created() {
    this.getMealList()
    this.getSickAreaList()
    this.getData()
  },
  methods: {
    async getMealList() {
      const { results } = await fhGetMeals(await getStoreId())
      this.mealList = results
    },
    async getSickAreaList() {
      const { results } = await fhGetSickAreaList()
      this.sickAreaList = results
    },
    async getData() {
      this.loading = true
      try {
        const { count, results } = await fhGetOrderList(this.query)
        this.data = results.map(item => {
          const numArr = item.foodItemVoList.map(foodItem => foodItem.num)
          // 餐品数量
          item.count = numArr.reduce((prev, cur, index, array) => {
            return prev + cur
          })
          return item
        })
        this.total = count
        this.selectedRowKeys = []
        this.orderIds = ''
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    getDiningDate(val) {
      this.query['startTime'] = val[0]
      this.query['endTime'] = val[1]
    },
    onSearch() {
      this.query = JSON.parse(JSON.stringify(this.query).replace(/""/g, null))
      this.getData()
    },
    // 查询页码
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      this.getData()
    },
    getCheckboxProps(record) {
      return ({
        props: {
          disabled: record.orderStatus !== 4
        }
      })
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.orderIds = selectedRows.map(item => item.orderId).join(',')
    },
    handleDelivery() {
      this.weekDeliveryDig = true
      // this.selectedRowKeys = []
    },
    onView(row) {
      this.$refs.orderDetail.onOpen(row)
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
  .view {
    color: #7ac3ff;
    cursor: pointer;
  }
}
::v-deep .ant-table-thead > tr > th,
::v-deep .ant-table-tbody > tr > td {
  padding: 16px 8px;
}
</style>
