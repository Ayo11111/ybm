<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="data"
      :scroll="{ x: 1800 }"
      :pagination="false"
    >
      <div slot="delivery" slot-scope="scope">
        {{ type[scope] }}
      </div>
      <div slot="type" slot-scope="scope">
        <span style="color: rgba(0, 153, 0, 0.647058823529412)">
          + {{ scope }}
        </span>
      </div>
      <div v-if="JSON.stringify(item) !== '{}'" slot="action" slot-scope="item">
        <a-button type="link" @click="detail"> 详情 </a-button>
      </div>
    </a-table>
    <BillDetail
      :visible.sync="visible"
      :data="detailData"
      :loading="detailLoad"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BillDetail from './BillDetail'
import { fhGetBillDeail } from '@/api/finance'
export default {
  components: {
    BillDetail
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    orderId: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      type: [
        '',
        '自配送',
        '顺丰配送',
        '蜂鸟配送',
        '餐道聚合配送',
        '达达',
        '闪送'
      ],
      columns: [
        {
          title: '订单日期',
          width: 200,
          dataIndex: 'createTime',
          key: 'createTime',
          fixed: 'left'
        },
        {
          title: '店铺',
          dataIndex: 'storeName',
          key: 'storeName',
          width: 200
        },
        {
          title: '订单类型',
          dataIndex: 'orderType',
          key: 'orderType',
          width: 180,
          customRender: text => {
            return this.merchantInfo.merchantManagerType === 'nurse'
              ? '护工订单'
              : '外卖订单'
          }
        },
        {
          title: '商品总价',
          dataIndex: 'foodPrice',
          key: 'foodPrice',
          width: 150
        },
        {
          title: '餐盒费',
          dataIndex: 'packagePrice',
          key: 'packagePrice',
          width: 150
        },
        {
          title: '商家活动支出',
          dataIndex: 'merchantActivityFee',
          key: 'merchantActivityFee',
          width: 180
        },
        {
          title: '平台服务费',
          dataIndex: 'platformServiceFee',
          key: 'platformServiceFee',
          width: 150
        },
        {
          title: '配送方式',
          dataIndex: 'deliveryType',
          key: 'deliveryType',
          width: 150,
          scopedSlots: { customRender: 'delivery' }
        },
        {
          title: '配送费',
          dataIndex: 'deliveryPrice',
          key: 'deliveryPrice',
          width: 150
        },
        {
          title: '结算金额',
          dataIndex: 'settleAccountsFee',
          key: 'settleAccountsFee',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '操作',
          dataIndex: '',
          fixed: 'right',
          width: 100,
          scopedSlots: { customRender: 'action' }
        }
      ],
      visible: false,
      detailData: {},
      detailLoad: false
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  methods: {
    async fhGetBillDeail(orderId) {
      this.detailLoad = true
      try {
        const { results } = await fhGetBillDeail(orderId)
        this.detailData = results || []
      } catch (err) {
        console.log(err)
      }
      this.detailLoad = false
    },
    detail() {
      this.visible = true
      this.fhGetBillDeail(this.orderId)
    }
  }
}
</script>

<style scoped></style>
