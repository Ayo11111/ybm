<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="source"
      :scroll="{ x: 1570 }"
      :pagination="false"
      :loading="loading"
    >
      <span slot="createTimeTitle">
        <span>日期</span>
        <a-tooltip>
          <template slot="title">
            显示的日期为下单日期及当天的订单序号
          </template>
          <a-icon type="exclamation-circle" style="margin-left: 5px" />
        </a-tooltip>
      </span>
      <span slot="originFoodPriceTitle">
        <span>商品总价</span>
        <a-tooltip>
          <template slot="title">
            订单中商品金额总计,并包含赠品原价 、包装费：餐盒和打包袋费用
          </template>
          <a-icon type="exclamation-circle" style="margin-left: 5px" />
        </a-tooltip>
      </span>
      <span slot="packagePriceTitle">
        <span>包装费用</span>
        <a-tooltip>
          <template slot="title">
            餐盒和打包袋费用
          </template>
          <a-icon type="exclamation-circle" style="margin-left: 5px" />
        </a-tooltip>
      </span>
      <span slot="preferentialPriceTitle">
        <span>商家活动支出</span>
        <a-tooltip>
          <template slot="title">
            订单中商家补贴活动款总计，包括商家代金券补贴
          </template>
          <a-icon type="exclamation-circle" style="margin-left: 5px" />
        </a-tooltip>
      </span>
      <span slot="platformServiceFeeTitle">
        <span>平台服务费</span>
      </span>
      <span slot="totalPriceTitle">
        <span>订单支付金额</span>
        <a-tooltip>
          <template slot="title">
            顾客实际支付的订单金额
          </template>
          <a-icon type="exclamation-circle" style="margin-left: 5px" />
        </a-tooltip>
      </span>
      <div slot="date" slot-scope="scope, item">
        {{ scope }} #{{ item.waimai_day_seq || '---' }}
      </div>
      <div slot="type" slot-scope="scope">
        {{ type[scope] }}
      </div>
      <div slot="cancel" slot-scope="scope">
        <span> {{ scope || '---' }} </span>
      </div>
      <div slot="secKillPrice" slot-scope="scope">
        <span>- {{ scope }}</span>
      </div>
      <div slot="deliveryPriceDiscount" slot-scope="scope">
        <span>- {{ scope }}</span>
      </div>
      <div slot="couponPrice" slot-scope="scope">
        <span>- {{ scope }}</span>
      </div>
      <div slot="platformServiceFee" slot-scope="scope">
        <span>- {{ scope }}</span>
      </div>
      <div slot="secKillPrice" slot-scope="scope">
        <span>- {{ scope }}</span>
      </div>
      <div slot="Fee" slot-scope="scope">
        <span style="color: rgba(0, 153, 0, 0.647058823529412)">
          + {{ scope }}
        </span>
      </div>
      <div slot="refund" slot-scope="scope">
        <span>- {{ scope }}</span>
      </div>
      <div slot="action" slot-scope="{ orderId }">
        <a-button v-if="orderId" type="link" @click="detail(orderId)">
          详情
        </a-button>
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
import { orderTableCfg } from '../_utils'
export default {
  name: 'BillTable',
  components: {
    BillDetail
  },
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
      type: [
        '',
        '自配送',
        '顺丰配送',
        '蜂鸟配送',
        '餐道聚合配送',
        '达达',
        '闪送'
      ],
      visible: false,
      detailData: {},
      detailLoad: false
    }
  },
  computed: {
    ...mapGetters(['merchantInfo']),
    columns() {
      let { merchantManagerType } = this.merchantInfo
      if (merchantManagerType === 'retail') merchantManagerType = 'restaurant'
      console.log(merchantManagerType)
      return orderTableCfg[merchantManagerType]
    }
  },
  methods: {
    async getBillDeail(orderId) {
      this.detailLoad = true
      try {
        const { results } = await fhGetBillDeail(orderId)
        this.detailData = results
      } catch (err) {
        console.log(err)
      }
      this.detailLoad = false
    },
    detail(orderId) {
      this.visible = true
      this.getBillDeail(orderId)
    }
  }
}
</script>
