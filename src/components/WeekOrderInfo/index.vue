<template>
  <div v-loading="mainLoad" class="item">
    <div class="body mt-12">
      <div style="display: flex">
        <!-- 左侧 -->
        <div class="base base-left">
          <!-- 流水号、送达时间 -->
          <div class="serial-box mb-12">
            <span
              v-if="['retail', 'restaurant'].includes(type)"
              v-show="value.waimaiDaySeq"
              class="serial-number mr-12"
            >
              #{{ value.waimaiDaySeq }}
            </span>
            <span v-else v-show="value.daySeq" class="serial-number mr-12">
              #{{ value.daySeq }}
            </span>
            <!-- <span
              v-if="['retail', 'restaurant'].includes(type)"
              v-show="value.expectedTime"
              class="mr-12"
            >
              {{ value.orderType === 1 ? '外卖' : '自提' }}
            </span> -->
            <a-button
              v-show="value.expectedTime"
              type="link"
              style="padding: 0"
            >
              建议
              <span style="margin: 0 4px">
                {{ value.expectedTime }}
              </span>
              前{{
                ['retail', 'restaurant'].includes(type) ? '送达' : '上门服务'
              }}
            </a-button>
            <a-button
              type="link"
              style="
                float: right;
                line-height: 36px;
                font-size: 14px;
                padding: 0;
              "
              @click="$emit('openStatusDetails', value.orderId)"
            >
              <span>{{ currOrderStatuTxt }}</span>
              <a-icon type="right" style="margin-left: 0" />
            </a-button>
          </div>
          <!-- 收货地址等信息 -->
          <el-row>
            <el-col :span="24" style="margin-bottom: 10px">
              <span style="color: #000; font-size: 18px" class="mr-12">
                {{ value.name }}
              </span>
            </el-col>
            <el-col
              v-for="bi in showInfo"
              v-show="bi.show(value)"
              :key="bi.label"
              :span="24"
              class="gray mb-12"
            >
              <span
                v-if="bi.label == '本单备餐时长' && value.orderStatus === 4"
              >
                {{ bi.label }}：{{ time }}
              </span>
              <span v-if="bi.label !== '本单备餐时长'">
                {{ bi.labelField ? value[bi.labelField] : bi.label }}：
                <span v-if="['retail', 'restaurant'].includes(type)">
                  {{
                    forRender(value, bi.field, bi.suff, bi.render, bi.digits)
                  }}
                </span>
                <span v-else>
                  <span v-if="bi.field === 'birthday'">
                    {{ age(value[bi.field], bi.field) }}
                  </span>
                  <span v-else>{{ value[bi.field] || '未知' }}</span>
                </span>
              </span>
            </el-col>
            <!-- <el-col v-if="riderLabel" :span="12" class="gray mb-12">
            <span>{{ riderLabel }}：{{ riderValue }}</span>
          </el-col> -->
            <!-- <b>备餐状态</b>
          <el-col style="margin: 5px 0 15px 0">
            <span>出餐时间倒计时：</span>
          </el-col> -->
          </el-row>
          <el-col :span="24" style="margin-bottom: 10px">
            <div style="margin-bottom: 5px">
              备注：{{ value.remark || '无' }}
            </div>
            <div
              v-if="['retail', 'restaurant'].includes(type)"
              style="margin-top: 10px"
            >
              餐具份数：{{ value.tablewareNum }}
            </div>
          </el-col>
          <el-col
            v-if="value.orderStatus >= 4"
            :span="24"
            style="margin-bottom: 5px"
          >
            <b
              v-if="['retail', 'restaurant'].includes(type)"
              v-show="value.orderType === 1"
              class="mb-12 title"
            >
              备餐状态
            </b>
          </el-col>
          <el-col
            v-if="
              ['retail', 'restaurant'].includes(type) && value.orderStatus >= 4
            "
            :span="24"
            class="ready"
            style="margin-bottom: 10px;color: #999"
          >
            <div>
              <span style="color: #000">
                {{ value.orderStatus === 4 ? '出餐时间倒计时' : '本单备餐时长' }}：{{
                  value.orderStatus === 4 ? prepareTime : value.upTime
                }}
              </span>
            </div>
            <el-button
              type="primary"
              :loading="readyLoad"
              :disabled="value.orderStatus !== 4"
              class="mr-12"
              @click="ready(value.orderId)"
            >出餐完成</el-button>
          </el-col>
          <b
            v-if="['retail', 'restaurant'].includes(type)"
            v-show="value.orderType === 1"
            class="mb-12 title"
          >
            配送信息
          </b>
          <el-col
            v-if="['retail', 'restaurant'].includes(type)"
            v-show="value.orderType === 1"
            style="margin: 5px 0 15px 0; color: #999"
          >
            <span>{{
              ['', '自配送', '顺丰配送', '蜂鸟配送'][value.deliveryType]
            }}</span>
            <span style="margin: 0 14px">{{ value.riderName }}</span>
            <span>{{ value.riderPhone }}</span>
          </el-col>
        </div>
        <div class="divider" />
        <!-- 右侧 -->
        <div class="base base-right">
          <el-row>
            <el-col
              :span="24"
              class="mb-12 title"
              style="display: flex; justify-content: space-between"
            >
              <div>
                {{
                  ['retail', 'restaurant'].includes(type)
                    ? '商品信息'
                    : '护工信息'
                }}
                <a-button
                  v-if="['retail', 'restaurant'].includes(type)"
                  type="link"
                >
                  {{ value.foodItemVoList.length }}种商品，共{{
                    foodItemVoListNum
                  }}件，本单预计收入￥{{ value.income }}
                </a-button>
              </div>
            </el-col>
            <div>
              <template v-if="['retail', 'restaurant'].includes(type)">
                <el-col
                  v-for="(fi, fk) in value.foodItemVoList"
                  :key="'food-' + fk"
                  :span="24"
                  style="margin-bottom: 10px"
                >
                  <show-info :label="fi.foodName" :value="fi.showOriginalPrice">
                    <template #num>
                      <span v-if="fi.num === 0 || fi.num">x{{ fi.num }}</span>
                    </template>
                  </show-info>
                </el-col>
              </template>
              <el-col v-else class="info" :span="24" style="margin-bottom: 5px">
                <div style="display: flex">
                  <a-avatar :size="62" icon="user" :src="value.nursePhoto" />
                  <div>
                    <div v-show="value.nurseName" class="infoText">
                      <span>
                        {{ value.nurseName }}
                        <a-tag style="margin-left: 5px">
                          {{
                            ['', '普通护理员', '高级护理员'][
                              value.nurseLevel
                            ] || '等级未知'
                          }}
                        </a-tag>
                      </span>
                      <span>
                        {{ value.nurseSexText }}
                        <span>{{ age(value.nurseBirthday) }}</span>
                      </span>
                      <span>手机号 {{ value.nursePhone || '未知' }}</span>
                    </div>
                    <div
                      v-show="!value.nurseName"
                      style="margin-top: 20px; margin-left: 15px"
                    >
                      <span>暂无护工</span>
                    </div>
                  </div>
                </div>
                <div class="bottom">
                  <span>
                    预约服务时间
                    <a-button type="link" style="padding: 0">
                      {{ value.nurseStartTime }} 至
                      {{ value.nurseEndTime }}
                    </a-button>
                    <span>(共{{ value.nurseTotalDay }}天)</span>
                  </span>
                  <span>
                    {{ value.nursePrice || '---' }} 元/天 ×
                    {{ value.nurseTotalDay }}
                  </span>
                </div>
              </el-col>
              <el-col
                v-if="['retail', 'restaurant'].includes(type)"
                :span="24"
                style="margin: 0px 0 10px 0"
              >
                <show-info
                  label="餐盒费"
                  :value="value.packagePrice"
                  style="margin-bottom: 10px"
                />
                <show-info label="配送费" :value="value.deliveryPrice" />
              </el-col>
              <el-col
                v-for="(mi, mk) in showMoneyInfo"
                :key="'moeny-' + mk"
                :span="mi.span || 24"
                :offset="mi.offset || 0"
                :class="`mb-12 ${mi.class}`"
              >
                <show-info
                  :class="mi.class"
                  :label="mi.label"
                  :first="value[mi.first]"
                  :value="forRender(value, mi.field, mi.def, mi.render)"
                />
                <div
                  v-if="mi.field === 'income' && value['refundPrice']"
                  class="bottom"
                >
                  <span>部分退款：</span>
                  <span>￥{{ value['refundPrice'] }}</span>
                </div>
              </el-col>
            </div>
          </el-row>
          <div
            v-if="
              value.refundStatus &&
                value.refundStatus >= 601 &&
                value.refundStatus <= 605
            "
            style="
              margin-top: 10px;
              background: #eee;
              padding: 12px;
              border-radius: 5px;
              margin-bottom: 12px;
            "
          >
            <b class="mb-12 title">退款信息</b>
            <a-timeline style="margin: 15px">
              <a-timeline-item>
                <div>
                  <span>{{
                    value.refundStatus === 605
                      ? '商家直接退款'
                      : '顾客申请全额退款'
                  }}</span><br>
                  <span style="color: #999">
                    退款理由：{{ value.refundReason || '' }}
                  </span>
                </div>
              </a-timeline-item>
              <a-timeline-item
                v-if="time && orderListType !== 3"
                style="padding-bottom: 0"
              >
                {{ time }}后自动退款
                <div
                  v-if="value.refundStatus === 601"
                  style="display: flex; flex-flow: row-reverse"
                >
                  <el-button
                    type="primary"
                    :loading="verifyLoad"
                    @click="confirmVerifyPass(value.orderId)"
                  >
                    同意
                  </el-button>
                  <el-button
                    class="mr-12"
                    :loading="verifyLoad"
                    @click="showWhyNoDig"
                  >
                    拒绝
                  </el-button>
                </div>
              </a-timeline-item>
            </a-timeline>
          </div>
        </div>
      </div>
      <div class="header" style="margin-bottom: 20px">
        <span
          v-if="
            ['retail', 'restaurant'].includes(type) && value.appointStatus === 1
          "
          class="appoint"
        >
          预
        </span>
        <span v-if="['retail', 'restaurant'].includes(type)">
          所属店铺：{{ value.storeName }}
        </span>
        <span v-else>{{ value.storeName || '' }}</span>
        <a-divider type="vertical" style="background: rgba(0, 0, 0, 0.65)" />
        <span>{{ value.createTime || value.payTime }}下单</span>
        <a-divider type="vertical" style="background: rgba(0, 0, 0, 0.65)" />
        <span>订单编号：{{ value.orderId }}</span>
        <!-- <span class="mr-12">订单类型：{{ orderType[value.orderType] }}</span> -->
        <!-- <span class="mr-12" v-if="value.tablePositionName">桌台：{{ value.tablePositionName }}</span> -->
      </div>
      <!-- 按钮功能区 -->
      <div v-if="['retail', 'restaurant'].includes(type)" class="btn-box">
        <el-button
          v-show="!readyAcceprOrder"
          type="primary"
          class="mr-12"
          style="float: left"
          :loading="printLoading"
          @click="comfirmPrint(value.orderId)"
        >
          小票打印
        </el-button>
        <!-- 待接单 -->
        <el-button
          v-show="readyAcceprOrder"
          type="primary"
          :loading="loadAccept"
          class="mr-12"
          @click="accept(value.orderId)"
        >
          接单
        </el-button>
        <el-button
          v-show="readyAcceprOrder"
          class="mr-12"
          @click="dialogReject = true"
        >
          拒绝接单
        </el-button>
        <el-button
          v-show="selfMentionOrder"
          class="mr-12"
          type="primary"
          :loading="pickupload"
          @click="confirmPickup"
        >
          客户已取餐
        </el-button>
        <el-button
          v-show="showSeflDeliveryBtn"
          class="mr-12"
          type="primary"
          @click="showDig('selfDeliveryDig')"
        >
          选择自配送骑手
        </el-button>
        <el-button
          v-show="showChangeDeliveryBtn"
          class="mr-12"
          type="primary"
          @click="showDig('changeDeliveryDig')"
        >
          切换配送方式
        </el-button>
        <!-- <el-button
          v-show="showSelfDeliveryFinishBtn"
          class="mr-12"
          type="primary"
          :loading="finishLoad"
          @click="selfDeliveryFinish"
        >
          已送达
        </el-button> -->
        <el-button
          v-if="refundStatus && orderListType !== 3 && !value.refundStatus"
          class="mr-12"
          :loading="cancelLoad"
          @click="refundShow = true"
        >
          退款
        </el-button>
        <!-- <el-button
          v-if="refundStatus && orderListType !== 3 && !value.refundStatus"
          :loading="cancelLoad"
          @click="handleCancel"
        >
          取消订单
        </el-button> -->
        <!-- <router-link
          :to="{ name: 'OrderDetail', params: { orderId: value.orderId } }"
        >
          <el-button>订单详情</el-button>
        </router-link> -->
      </div>
      <div
        v-else-if="!value.refundStatus && orderListType !== 3"
        class="btn-box"
      >
        <el-button
          v-show="value.orderStatus === 3"
          class="mr-12"
          type="primary"
          :loading="acceptLoad"
          @click="getNurseAccept"
        >
          接单
        </el-button>
        <el-button
          v-show="value.orderStatus === 3"
          class="mr-12"
          @click="dialogReject = true"
        >
          拒绝接单
        </el-button>
        <el-button
          v-show="refundStatus"
          class="mr-12"
          type="primary"
          @click="putNurse"
        >
          调配护工
        </el-button>
        <el-button
          v-if="refundStatus && orderListType !== 3 && !value.refundStatus"
          class="mr-12"
          :loading="cancelLoad"
          @click="refundShow = true"
        >
          退款
        </el-button>
        <!-- <el-button v-show="!value.refundStatus" @click="handleCancel">
          取消订单
        </el-button> -->
      </div>
    </div>
    <self-delivery-dig
      :show.sync="selfDeliveryDig"
      :order-id="value.orderId"
      :rider-id.sync="riderId"
      :is-change.sync="changeDeliveryDig"
      @ok="updateOrder"
    />
    <change-delivery-dig
      :show.sync="changeDeliveryDig"
      :order-id="value.orderId"
      :delivery-type="value.deliveryType"
      :rider-id.sync="riderId"
      @ok="updateOrder"
    />
    <el-dialog
      append-to-body
      title="拒绝接单"
      :visible.sync="dialogReject"
      width="35%"
      :before-close="handleClose"
    >
      <span style="display: inline-block; padding: 10px 0 10px 4px">
        订单号: <span>{{ value.orderId }} </span>
      </span>
      <el-form
        ref="rejectForm"
        :model="rejectForm"
        :rules="rejectRules"
        label-width="4em"
      >
        <el-form-item prop="reason" label="理由">
          <el-input
            v-model="rejectForm.reason"
            :rows="2"
            type="textarea"
            placeholder="请输入拒绝理由"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          :loading="loadRejectAccept"
          @click="submitReject"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
    <a-divider />
    <WhyNo :order-id="value.orderId" :visible.sync="visible" />
    <Reason
      :visible.sync="show"
      :verify-load.sync="verifyLoad"
      @cancelOerder="cancelOerder"
      @putNurseDirectRefund="putNurseDirectRefund"
    />
    <Refund
      :value="value"
      :loading.sync="refundLoad"
      :visible.sync="refundShow"
      @putRefundPartial="putRefundPartial"
      @cancelOerder="cancelOerder"
      @putNurseDirectRefund="putNurseDirectRefund"
    />
  </div>
</template>

<script>
import {
  fhReady,
  fhPickup,
  fhGetCurrOrders,
  fhSelfDeliveryFinish,
  fhAccept,
  fhRejectAccept,
  fhVerifyRefundOrder,
  fhCancelOerder,
  fhPutNurseDirectRefund,
  fhPutNurseRefundAudit,
  fhPutNurseAccept,
  fhPutOrderRefundPartial,
  fhPutNurseOrderRefundPartial,
  fhPrintOrder
} from '@/api/orders'
import {
  orderType,
  baseInfo,
  nurseFoodInfo,
  moneyInfo,
  orderStatusMap,
  riderMap,
  parseTime,
  nurseInfo,
  nurseOrderStatusMap
} from './utils'
import { forRender } from '@/utils'
import ShowInfo from './ShowInfo'
import SelfDeliveryDig from '@/components/SelfDeliveryDig'
import ChangeDeliveryDig from './_components/ChangeDeliveryDig'
import { getUserInfo } from '@/utils/auth'
import WhyNo from './_components/why-no'
import Reason from './_components/reason'
import Refund from './_components/refund'
export default {
  name: 'WeekOrderInfo',
  components: {
    ShowInfo,
    SelfDeliveryDig,
    ChangeDeliveryDig,
    WhyNo,
    Reason,
    Refund
  },
  props: {
    rawValue: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: 'restaurant'
    },
    orderListType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      rejectForm: {},
      img: '',
      rejectRules: {
        reason: [
          {
            required: true,
            message: '请输入拒绝理由',
            trigger: ['blur', 'change']
          }
        ]
      },
      dialogReject: false,
      loadAccept: false,
      loadRejectAccept: false,
      value: {},
      orderStatusMap,
      nurseOrderStatusMap,
      orderType,
      baseInfo,
      moneyInfo,
      nurseFoodInfo,
      nurseInfo,
      readyLoad: false,
      selfDeliveryDig: false,
      pickupload: false,
      mainLoad: false,
      riderInderOrderId: null,
      verifyLoad: false,
      visible: false,
      orderId: null,
      timeing: '',
      changeDeliveryDig: false,
      nurseShow: false,
      riderId: null,
      finishLoad: false,
      cancelLoad: false,
      show: false,
      riderMapJson: {
        1: '等待骑手接单',
        2: '可切换配送方式',
        3: '骑手已接单',
        '-1': ''
      },
      acceptLoad: false,
      refundShow: false,
      refundLoad: false,
      refundTi: null,
      time: '',
      printLoading: false,
      prepareTi: null,
      prepareTime: '',
      preareStatus: false
    }
  },
  computed: {
    orderTypeStatusMap() {
      if (['retail', 'restaurant'].includes(this.type)) {
        return orderStatusMap
      } else {
        return nurseOrderStatusMap
      }
    },
    foodItemVoListNum() {
      const { foodItemVoList } = this.value
      let count = 0
      foodItemVoList.forEach(item => {
        const { num } = item
        count += num
      })
      return count
    },
    refundStatus() {
      const { orderStatus } = this.value
      const status = [2, 3, 10, 302, 601, 501, 602, 502, 604, 605, 606]
      if (status.indexOf(orderStatus) !== -1) {
        return false
      } else {
        return true
      }
    },
    age() {
      return (day, field) => {
        const age = this.$moment().diff(this.$moment(day), 'years')
        return day
          ? `${age}岁`
          : `${field === 'birthday' ? '未知' : '年龄未知'}`
      }
    },
    currOrderStatuTxt() {
      const {
        orderTypeStatusMap,
        value: { orderStatus, refundStatus }
      } = this
      const key =
        refundStatus && refundStatus !== 603 ? refundStatus : orderStatus
      return orderTypeStatusMap.get(key)
    },
    showSeflDeliveryBtn() {
      const { orderStatus, deliveryType, refundStatus } = this.value
      return (
        (!refundStatus || refundStatus === 603) &&
        orderStatus === 5 &&
        deliveryType === 1
      )
    },
    showReadyBtn() {
      const { orderStatus, refundStatus } = this.value
      return (!refundStatus || refundStatus === 603) && orderStatus === 4
    },
    selfMentionOrder() {
      const { orderStatus, refundStatus } = this.value
      return (!refundStatus || refundStatus === 603) && orderStatus === 6
    },
    readyAcceprOrder() {
      return this.value.orderStatus === 3
    },
    riderLabel() {
      const { riderStatus } = this.value
      return riderMap.get(riderStatus)
    },
    riderValue() {
      const { riderName, riderPhone, riderStatus } = this.value
      if (riderStatus === 1) this.riderInter()
      return riderStatus === 1
        ? `待接单(${this.timeing})`
        : riderStatus === 3
          ? `${riderName} ${riderPhone}`
          : ''
    },
    showChangeDeliveryBtn() {
      return (
        !this.value.refundStatus &&
        this.value.riderStatus === 2 &&
        !this.value.refundStatus
      )
    },
    showSelfDeliveryFinishBtn() {
      const { orderStatus, deliveryType, refundStatus } = this.value
      return (
        (!refundStatus || refundStatus === 603) &&
        orderStatus === 301 &&
        deliveryType === 1
      )
    },
    showInfo() {
      return ['retail', 'restaurant'].includes(this.type)
        ? this.baseInfo
        : this.nurseInfo
    },
    showMoneyInfo() {
      return ['retail', 'restaurant'].includes(this.type)
        ? this.moneyInfo
        : this.nurseFoodInfo
    }
  },
  watch: {
    'value.orderStatus'(value) {
      if (value === 4) {
        // this.cookTime()
      } else {
        clearInterval(this.timer || {})
      }
    },
    rawValue: {
      handler: function (v) {
        this.value = v
        this.refundTime()
        if (this.value.orderStatus === 4 && !this.preareStatus) {
          this.downTime()
        }
      },
      immediate: true,
      deep: true
    }
  },
  beforeDestroy() {
    if (this.riderInterId) clearInterval(this.riderInterId)
    this.timer = null
    clearInterval(this.timre)
  },
  created() {
    window.info = this
    this.$on('beforeDestroy')
  },
  methods: {
    async putRefundPartial(params) {
      this.refundLoad = true
      try {
        const { backUserId } = await getUserInfo()
        params.managerId = backUserId[('retail', 'restaurant')].includes(
          this.type
        )
          ? await fhPutOrderRefundPartial(this.value.orderId, params)
          : await fhPutNurseOrderRefundPartial(this.value.orderId, params)
        this.$message.success('退款成功')
        this.refundShow = false
        this.updateList()
      } catch (err) {
        console.log(err)
      }
      this.refundLoad = false
    },
    async verifyRefundOrderFn(orderId) {
      this.verifyLoad = true
      try {
        const { backUserId } = await getUserInfo()
        const params = {
          managerId: backUserId,
          isPass: true,
          reason: ''
        }
        if (['retail', 'restaurant'].includes(this.type)) {
          await fhVerifyRefundOrder(orderId, params)
        } else {
          await fhPutNurseRefundAudit(orderId, params)
        }
        this.$message.success('审核成功')
        this.updateList()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.verifyLoad = false
    },
    async cancelOerder(params) {
      this.refundLoad = true
      try {
        await fhCancelOerder(this.value.orderId, params)
        this.show = false
        this.$message.success('退款成功')
        this.updateList()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.refundLoad = false
    },
    async putNurseDirectRefund(params, type) {
      this.refundLoad = true
      try {
        await fhPutNurseDirectRefund(this.value.orderId, params)
        this.show = false
        if (!type) {
          this.$message.success('退款成功')
          this.updateList()
        }
      } catch (err) {
        console.log(err)
      }
      this.refundLoad = false
    },
    async getNurseAccept() {
      this.acceptLoad = true
      try {
        await fhPutNurseAccept(this.value.orderId)
        this.$message.success('接单成功')
        this.updateList()
      } catch (err) {
        console.log(err)
      }
      this.acceptLoad = false
    },
    cookTime() {
      this.timer = setInterval(() => {
        var current = +new Date(
          this.getProgress(this.value.orderProgressList, 4, 'operationTime')
        )
        const aa = +new Date() - current
        this.time = parseTime(aa, '{h}时{i}分{s}秒')
        return this.time
      }, 1000)
    },
    getProgress(value, status, key) {
      const arr = value.filter(val => {
        return val.orderStatus === status
      })
      const obj = arr[0]
      return obj ? obj[key] : ''
    },
    cancel() {
      this.dialogReject = false
      this.$refs.rejectForm.resetFields()
    },
    submitReject() {
      this.$refs.rejectForm.validate(async valid => {
        if (valid) {
          this.loadRejectAccept = true
          try {
            ['retail', 'restaurant'].includes(this.type)
              ? await fhRejectAccept(this.value.orderId, this.rejectForm)
              : await this.putNurseDirectRefund(this.rejectForm, 1)
            this.$message.success('成功拒绝接单')
            this.updateList()
            this.dialogReject = false
          } catch (e) {
            console.log(e)
          }
          this.loadRejectAccept = false
        } else {
          this.$message.error('请填写完整')
        }
      })
    },
    handleClose() {
      this.dialogReject = false
    },
    // 接单
    async accept(id) {
      this.loadAccept = true
      try {
        await fhAccept(id)
        this.$message.success('接单成功')
        this.updateList()
      } catch (e) {
        console.log(e)
      }
      this.loadAccept = false
    },
    // 拒绝接单
    async rejectAccept(id) {
      this.dialogReject = true
    },
    forRender,
    // 备餐完成
    async ready(id) {
      this.readyLoad = true
      // const { orderType } = this.value
      try {
        const { results } = await fhReady(id)
        const { salfDelivery } = results
        this.preareStatus = true
        if (!this.timePlayReady) {
          this.selfDeliveryDig = salfDelivery
        }
        this.$message.success('备餐成功')
        // this.value.orderStatus = orderType === 1 ? 5 : 6
        this.updateList()
      } catch (e) {
        console.log('debug', e)
      }
      this.readyLoad = false
    },
    // 确认用户取餐
    confirmPickup() {
      this.$confirm(
        `请确认取餐用户的取餐码是否为：${this.value.pickupCode}`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.pickup()
        })
        .catch(() => {})
    },
    // 用户取餐
    async pickup() {
      this.pickupload = true
      try {
        await fhPickup(this.value.orderId)
        this.$message.success('用户取餐成功')
        this.updateList()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.pickupload = false
    },
    showDig(key) {
      this[key] = true
    },
    showSelfDeliveryDig() {
      this.selfDeliveryDig = true
    },
    showChangeDeliveryDig() {
      this.changeDeliveryDig = true
    },
    updateOrderStatus(status) {
      this.value.orderStatus = status
    },
    updateList() {
      this.$emit('updateList')
    },
    async updateOrder() {
      this.mainLoad = true
      try {
        const { results } = await fhGetCurrOrders({
          orderId: this.value.orderId,
          pageNumber: 1,
          pageSize: 99,
          pageType: '1'
        })
        if (this.riderInterId) clearInterval(this.riderInterId)
        results[0].openStatus = true
        this.value = results[0]
      } catch (e) {
        console.log('debug', e)
      }
      this.mainLoad = false
    },
    // 计时
    riderInter() {
      if (this.riderInderOrderId) return
      this.riderInderOrderId = this.value.orderId
      const { callDeliveryTime } = this.value
      const tempSimp = new Date(callDeliveryTime).valueOf()
      this.riderInterId = setInterval(() => {
        const now = new Date().valueOf()
        const difference = now - tempSimp
        if (difference > 903000 && this.value.riderStatus === 1) {
          this.updateOrder()
        }
        this.timeing = parseTime(difference, '{i}分{s}秒')
      }, 1000)
    },
    async selfDeliveryFinish() {
      this.finishLoad = true
      const { orderId } = this.value
      try {
        await fhSelfDeliveryFinish(orderId)
        this.$message.success(`订单${orderId}成功送达`)
        this.updateList()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.finishLoad = false
    },
    confirmVerifyPass(orderId) {
      this.$confirm('此操作将通过用户的退款审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.verifyRefundOrderFn(orderId)
        })
        .catch(() => {})
    },
    showWhyNoDig() {
      this.visible = true
    },
    handleCancel() {
      this.show = true
    },
    putNurse() {
      this.$emit('openPutNurse', this.value.orderId, this.value.nurseId)
    },
    refundTime() {
      const { refundTime } = this.value
      if (refundTime && this.$moment(refundTime) > this.$moment(new Date())) {
        const endTime = new Date(refundTime)
        if (this.refundTi) {
          clearInterval(this.refundTi)
        }
        this.refundTi = setInterval(() => {
          const newTime = new Date()
          const lastTime = parseInt(endTime - newTime) / 1000
          if (lastTime > 0) {
            const day = parseInt(lastTime / 60 / 60 / 24)
            const time = parseInt((lastTime / 60 / 60) % 24)
            const branch = parseInt((lastTime / 60) % 60)
            const secomd = parseInt(lastTime % 60)
            this.time = `${day}天${time}时${branch}分${secomd}秒`
          } else {
            clearInterval(this.refundTi)
            this.time = refundTime
          }
        })
      } else {
        this.time = refundTime
      }
    },
    downTime() {
      const { prepareTime, orderId } = this.value
      if (prepareTime && new Date(prepareTime) > new Date()) {
        const endTime = new Date(prepareTime)
        if (this.prepareTi) {
          clearInterval(this.refundTi)
        }
        this.prepareTi = setInterval(() => {
          const newTime = new Date()
          const lastTime = parseInt(endTime - newTime) / 1000
          if (lastTime > 0) {
            const time = parseInt((lastTime / 60 / 60) % 24)
            const branch = parseInt((lastTime / 60) % 60)
            const secomd = parseInt(lastTime % 60)
            this.prepareTime = `${time}时${branch}分${secomd}秒`
          } else {
            clearInterval(this.prepareTi)
            this.prepareTime = prepareTime
            if (this.value.orderStatus === 4 && !this.preareStatus) {
              this.preareStatus = true
              this.timePlayReady = true
              this.ready(orderId)
            }
          }
        })
      } else {
        this.prepareTime = prepareTime
      }
    },
    // 二次确认是否打印
    comfirmPrint(id) {
      this.$confirm('此操作将重新打印该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(action => {
          this.printOrder(id)
        })
        .catch(() => {})
    },
    // 再次打印订单
    async printOrder(id) {
      this.printLoading = true
      try {
        await fhPrintOrder(id)
        this.$message.success('重新打印小票成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.printLoading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.blue {
  color: #cfa978;
}

.fr {
  float: right;
}

// .body {
//   display: flex;
// }

.item {
  width: auto;
  background: #fff;

  .header {
    background: rgba(242, 242, 242, 1);
    padding: 6px 12px;
    display: flex;
    align-items: center;

    .appoint {
      background: #ff9933;
      color: white;
      border-radius: 3px;
      font-size: 12px;
      padding: 3px;
      margin-right: 12px;
    }

    span {
      font-size: 14px;
      font-weight: 700;
    }
  }
  .info {
    margin-bottom: 20px;
    .img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-size: cover;
      background-position: center;
    }
    .infoText {
      margin-left: 20px;
      display: flex;
      flex-flow: column;
    }
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }
  .body {
    .title {
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
    }
    .base-left {
      flex: 1;
    }
    .base-right {
      flex: 1;
    }
    .divider {
      width: 1px;
      margin: 0 30px;
      background: #e8e8e8;
    }
    .remarkBox {
      background: rgba(242, 242, 242, 1);
      margin: 10px 0 15px 0;
      padding: 10px 10px;
    }
    .serial-box {
      line-height: 40px;
      .serial-number {
        background: rgb(63, 61, 61);
        padding: 5px 10px;
        border-radius: 3px;
        color: #fff;
      }
    }
  }

  .btn-box {
    height: 36px;
    text-align: right;
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
.ready {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

::v-deep .el-dialog__body {
  padding-top: 10px;
}
</style>
