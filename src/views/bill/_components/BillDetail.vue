<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-24 17:09:03
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-16 09:34:10
-->
<template>
  <el-dialog
    title="交易详情"
    :visible="visible"
    width="600px"
    top="10vh"
    center
    :before-close="handleClose"
  >
    <div v-loading="loading" class="body">
      <a-divider />
      <!-- 商品列表 -->
      <div
        v-if="
          ['retail', 'restaurant'].includes(merchantInfo.merchantManagerType)
        "
      >
        <div class="title-box">
          <span class="title">商品总价</span>
          <span class="value">￥{{ data.foodPrice }}</span>
        </div>
        <el-row v-for="(item, index) in data.orderItems" :key="index">
          <el-col class="col flex" :span="24">
            <span>{{ item.foodName }}</span>
            <div style="display: flex; align-items: center">
              <span style="margin-right: 50px">x{{ item.foodNum }}</span>
              <span style="margin-top: 1.8px">¥{{ item.originalPrice }}</span>
            </div>
          </el-col>
        </el-row>
        <el-row style="margin: 8px 0">
          <el-col class="col flex" :span="24">
            <span>包装费 x1</span>
            <span>¥{{ data.packagePrice }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="col flex" :span="24">
            <span>取货费</span>
            <span>
              <span
                v-if="data.origin_nurse_delivery_price"
                style="margin-right: 35px"
              >
                原价 <s>¥{{ data.origin_nurse_delivery_price || 0 }} </s>
              </span>
              ¥{{ data.nurse_delivery_price || 0 }}
            </span>
          </el-col>
        </el-row>

        <el-row style="margin: 8px 0">
          <el-col class="col flex" :span="24">
            <span>配送费</span>
            <span>
              ¥{{ data.realDeliveryPrice || 0 }}
            </span>
          </el-col>
        </el-row>
      </div>
      <!-- 护工商品 -->
      <div v-else>
        <div>{{ data.username }}</div>
        <div class="mb-12">
          <for-render :config="patientCfg" :source="data" />
        </div>
        <div>护工信息</div>
        <nurse-info :value="data" />
        <!-- 预约服务时间 -->
        <div class="time-box">
          <div>
            <span>预约服务时间</span>
            <span class="times">
              {{ fixTime(data.nurseStartTime) }} 至
              {{ fixTime(data.nurseEndTime) }}
            </span>
            <span>（共{{ data.nurseTotalDay }}天）</span>
          </div>
          <div>
            <span>{{ data.nursePrice }}元/天 </span>
            <span> x{{ data.nurseTotalDay }}</span>
          </div>
        </div>
        <!-- 实际服务时间 -->
        <div class="time-box">
          <div>
            <span>实际服务时间</span>
            <span class="times">
              {{ fixTime(data.actualNurseStartTime) }} 至
              {{ fixTime(data.actualNurseEndTime) }}
            </span>
            <span>（共{{ data.nurseCompletedDay }}天）</span>
          </div>
          <div>
            <span>{{ data.nursePrice }}元/天 </span>
            <span> x{{ data.nurseCompletedDay }}</span>
          </div>
        </div>
      </div>
      <!-- 商家活动支出 -->
      <div v-if="data.orderType !== 3">
        <a-divider />
        <div class="title-box">
          <span class="title">商家活动支出</span>
          <span class="value red">-￥{{ data.merchantActivityFee }}</span>
        </div>
        <!-- 膳食商家的活动 -->
        <el-row>
          <el-col class="colTwo" :span="24">
            <div class="colBox">
              <!-- <b>满10.00元减{{ data.meetReducePrice }}元</b> -->
              <b>满减活动</b>
              <span>
                （商家承担￥{{ data.meetReducePrice || 0 }}，平台承担￥{{ 0 }}）
              </span>
            </div>
            <span>-￥{{ data.meetReducePrice }}</span>
          </el-col>
          <el-col class="colTwo" :span="24">
            <div class="colBox">
              <!-- <b>减配送费{{ data.deliveryPrice - data.deliveryPriceDiscount }}元 -->
              <!-- </b> -->
              <b>折扣活动</b>
              <span> （商家承担￥{{ data.secKillPrice }}，平台承担￥0） </span>
            </div>
            <span>-￥{{ data.secKillPrice }}</span>
          </el-col>
          <el-col class="colTwo" :span="24">
            <div class="colBox">
              <!-- <b>减配送费{{ data.deliveryPrice - data.deliveryPriceDiscount }}元 -->
              <!-- </b> -->
              <b>取货费活动</b>
              <span>
                （商家承担￥0，平台承担￥{{
                  data.nurse_delivery_price_discount || 0
                }}）
              </span>
            </div>
            <span>
              -￥{{
                data.originNurseDeliveryPrice - data.nurseDeliveryPrice || 0
              }}
            </span>
          </el-col>
        </el-row>
      </div>
      <a-divider />
      <!-- 平台抽佣 -->
      <div>
        <div class="title-box">
          <span class="title">平台服务费</span>
          <span class="value red">-￥{{ data.platformServiceFee }}</span>
        </div>
        <div style="font-size: 10px">
          <div style="font-weight: 700; color: #000">服务费</div>
          <span>
            平台服务费 =【商品小计-商家活动支出】*
            {{ data.platformProfitsharingPct || 0 }}%
          </span>
        </div>
      </div>
      <a-divider />
      <!-- 结算金额 -->
      <div>
        <div class="title-box">
          <span class="title">结算金额</span>
          <span class="value">+￥{{ data.settleAccountsFee }}</span>
        </div>
        <div class="mb-24" style="font-size: 10px">
          商家结算金额 = 商品原价+包装费-商家活动支出-平台服务费
        </div>
      </div>
      <!-- 订单基础信息 -->
      <div class="order-info">
        <div>
          <span>{{ data.createTime }} 下单 </span>
          <a-divider type="vertical" />
          <!-- <span> TODO对接订单完成时间 订单完成 </span> -->
          <!-- <a-divider type="vertical" /> -->
          <span> {{ type[data.deliveryType] }}</span>
        </div>
        <div>
          <span>订单编号</span>
          <span>{{ data.orderId }}</span>
        </div>
      </div>
    </div>
    <a-divider />
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('update:visible', false)">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { patientCfg } from '../_utils.js'
import NurseInfo from '@/components/NurseInfo'
import ForRender from '@/components/ForRender'
export default {
  name: 'BillDetail',
  components: { NurseInfo, ForRender },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
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
      patientCfg
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    fixTime(time) {
      return typeof time === 'string' ? time.split(' ')[0] : time
    }
  }
}
</script>

<style lang="scss" scoped>
.size {
  font-size: 13px;
  margin-bottom: 12px;
}

.flex {
  display: flex;
  justify-content: space-between;
}

.order-info {
  text-align: center;
  font-size: 10px;
  color: #7f7f7f;
  &::v-deep .ant-divider {
    margin: 0 0;
  }
}

.colTwo {
  font-size: 13px;
  margin-bottom: 22px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .colBox {
    display: flex;
    flex-flow: column;
    span {
      color: #999;
      margin-top: 5px;
    }
  }
}

::v-deep .ant-divider {
  margin: 12px 0;
}

.title-box {
  width: 100%;
  margin-bottom: 8px;
  .title {
    font-weight: 700;
    color: #000000;
  }
  .value {
    float: right;
  }
  .red {
    color: #d9001b;
  }
}

.time-box {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  .times {
    color: #f59a23;
  }
}
</style>
