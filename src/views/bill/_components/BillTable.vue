<template>
  <a-table
    :columns="columns"
    :data-source="source"
    :scroll="{ x: 1310 }"
    :pagination="false"
    :loading="loading"
  >
    <template slot="allFeeTitle">
      <span>商家订单金额（应付）</span>
      <el-tooltip
        class="item"
        effect="dark"
        content="订单的商品售价金额 + 配送费"
        placement="top"
      >
        <i class="el-icon-warning" />
      </el-tooltip>
    </template>
    <template slot="totalPriceTitle">
      <span>商家订单金额（实付）</span>
      <el-tooltip
        class="item"
        effect="dark"
        content="订单的商品售价金额 + 配送费 - 商家活动补贴"
        placement="top"
      >
        <i class="el-icon-warning" />
      </el-tooltip>
    </template>
    <div slot="type" slot-scope="scope">
      <span style="color: rgba(0, 153, 0, 0.647058823529412)">
        + {{ scope }}
      </span>
    </div>
    <div slot="action" slot-scope="scope">
      <router-link :to="`/bill/order/${scope.storeId}/${$route.params.date}`">
        <a-button type="link"> 详情 </a-button>
      </router-link>
    </div>
  </a-table>
</template>

<script>
export default {
  name: 'BillTable',
  components: {},
  props: {
    source: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns: [
        {
          title: '店铺名称',
          width: 150,
          dataIndex: 'storeName',
          key: 'storeName',
          fixed: 'left'
        },
        {
          title: '订单笔数',
          dataIndex: 'orderCount',
          key: 'orderCount',
          width: 200
        },
        {
          dataIndex: 'allFee',
          key: 'allFee',
          width: 180,
          scopedSlots: { title: 'allFeeTitle' }
        },
        {
          title: '商家活动补贴',
          dataIndex: 'merchantActivityFee',
          key: 'merchantActivityFee',
          width: 150
        },
        {
          title: '平台活动补贴',
          dataIndex: 'platformActivityFee',
          key: 'platformActivityFee',
          width: 150
        },
        {
          dataIndex: 'totalPrice',
          key: 'totalPrice',
          width: 180,
          scopedSlots: { title: 'totalPriceTitle' }
        },
        {
          title: '配送费',
          dataIndex: 'actualFee',
          key: 'actualFee',
          width: 150
        },
        {
          title: '导流佣金',
          dataIndex: 'helpEachOtherPrice',
          key: 'helpEachOtherPrice',
          customRender: item => {
            return item ? item : '---'
          },
          width: 150
        },
        {
          title: '平台服务费',
          dataIndex: 'platFormServiceFee',
          key: 'platFormServiceFee',
          width: 150
        },
        {
          title: '结算金额',
          dataIndex: 'platformSettleAccounts',
          key: 'platformSettleAccounts',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作',
          dataIndex: '',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
