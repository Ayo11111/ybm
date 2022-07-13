<template>
  <div v-loading="mainLoad" class="container">
    <div class="base-box topInfo">
      <!-- <img src="@/assets/u10230.png"> -->
      <div class="topRight">
        <div class="l flex">
          <div style="display: flex">
            <b>订单号：{{ detailData.orderId }}</b>
            <span v-if="detailData.appointStatus === 1" class="appoint">
              预
            </span>
          </div>
          <el-row>
            <el-col class="col" :span="12">
              下单用户：{{ detailData.name }}
            </el-col>
            <el-col class="col" :span="12">
              订单类型：{{ orderType[detailData.orderType] }}
            </el-col>
            <el-col class="col" :span="12">
              下单时间：{{ detailData.createTime }}
            </el-col>
            <el-col class="col" :span="12">
              店铺：{{ detailData.storeName }}
            </el-col>
            <el-col v-if="false" class="col" :span="12">
              {{
                detailData.orderType === 1 ? '预计送达时间' : '预计出餐时间'
              }}：{{ detailData.estimatedTime }}
            </el-col>
          </el-row>
        </div>
        <div class="r flex" style="align-items: flex-end">
          <div
            class="flex mb-12"
            style="
              flex-direction: row;
              align-items: flex-end;
              justify-content: flex-end;
            "
          >
            <el-button
              v-if="showCancel"
              :loading="cancelLoad"
              @click="handleCancel"
            >
              取消订单
            </el-button>
            <el-button v-if="detailData.pickupCode" type="primary">
              取餐码 {{ detailData.pickupCode }}
            </el-button>
          </div>
          <div style="display: flex">
            <div class="flex end mr-12">
              <span style="font-size: 13px; margin-bottom: 4px">状态</span>
              <span style="font-size: 20px">{{ detailData.status }}</span>
            </div>
            <div class="flex end" style="margin-left: 20px">
              <span style="font-size: 13px; margin-bottom: 4px">订单金额</span>
              <span style="font-size: 20px">¥ {{ detailData.income }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="base-box">
      <b>流程进度</b>
      <el-divider />
      <el-steps :active="currStep" align-center>
        <el-step
          v-for="(i, k) in detailData.orderProgressList"
          :key="k"
          :title="i.progressName"
        >
          <template #description>
            <p>{{ detailData.orderProgressList[k].operationTime }}</p>
            <el-button
              v-show="btnShow(currStep, k, 6, detailData)"
              type="primary"
              :loading="pickupload"
              @click="confirmPickup"
            >
              用户已取餐
            </el-button>
            <el-button
              v-show="btnShow(currStep, k, 4, detailData)"
              type="primary"
              :loading="readyLoad"
              @click="ready"
            >
              备餐完成
            </el-button>
            <el-button
              v-show="
                btnShow(currStep, k, 5, detailData) &&
                  detailData.deliveryType === '自配送'
              "
              type="primary"
              :loading="pickupload"
              @click="showSelfDeliveryDig"
            >
              选择自配送骑手
            </el-button>
          </template>
        </el-step>
      </el-steps>
    </div>
    <div
      v-if="
        detailData.refundInfo !== null && detailData.refundInfo !== undefined
      "
      class="base-box"
    >
      <b>退款信息</b>
      <el-divider />
      <div class="block">退款前节点：配送中</div>
      <div class="block">
        退款原因：{{ detailData.refundInfo.refundReason }}
      </div>
      <div v-if="detailData.refundInfo.images !== null" class="image">
        <template v-for="(i, k) in refundImags">
          <el-image :key="k" :src="i" />
        </template>
      </div>
      <div v-if="verifyRefundOrder">
        <el-button
          type="primary"
          :loading="verifyLoad"
          @click="confirmVerifyPass"
        >
          退款审核通过
        </el-button>
        <el-button @click="showWhyNoDig">不通过</el-button>
      </div>
      <el-divider v-if="detailData.refundStatus !== 601" />
      <div v-if="detailData.refundStatus !== 601" class="bottom">
        <b>审核结果：</b>
        <span>{{ refundLog.result ? '通过' : '不通过' }}</span>
        <b>审核人：</b>
        <span>{{ refundLog.auditMan }}</span>
        <b>审核时间：</b>
        <span>{{ refundLog.auditTime }}</span>
      </div>
    </div>
    <div v-if="detailData.refundReason" class="base-box">
      <b style="font-size: 15px">退款信息</b>
      <el-divider />
      <div>
        <span style="font-weight:600"> 订单取消原因：</span><span>{{ detailData.refundReason }}</span>
      </div>
    </div>
    <div v-if="detailData.rejectReason" class="base-box">
      <b style="font-size: 15px">拒绝接单理由</b>
      <el-divider />
      <div>
        <span style="font-weight:600"> 拒绝原因：</span><span>{{ detailData.rejectReason }}</span>
      </div>
    </div>
    <div class="base-box">
      <b style="font-size: 15px">订单信息</b>
      <el-divider />
      <el-row class="row">
        <el-col :span="8">用户名称：{{ detailData.memberName }}</el-col>
        <el-col :span="8">联系电话：{{ detailData.phone }}</el-col>
        <el-col :span="8">
          性别：
          <span v-if="detailData.sex===0">保密</span>
          <span v-if="detailData.sex===1">男</span>
          <span v-if="detailData.sex===2">女</span>
        </el-col>
      </el-row>
      <el-row class="row">
        <el-col :span="8">会员ID：{{ detailData.memberId }}</el-col>
        <el-col :span="8">会员等级：{{ detailData.levelName }} </el-col>
      </el-row>
      <b style="font-size: 14px">订单列表</b>
      <div class="title">
        <b>菜品信息</b>
      </div>
      <div class="box">
        <el-row :gutter="150">
          <el-col
            v-for="item in detailData.foodItemVoList"
            :key="item.id"
            class="col"
            :span="8"
          >
            <div style="display: flex; align-items: center">
              <img :src="item.image" style="width: 56px; height: 39px">
              <div class="rBox">
                <span>{{ item.foodName }} x{{ item.num }}</span>
                <div
                  style="
                    display: flex;
                    font-size: 12px;
                    justify-content: space-between;
                  "
                >
                  <span>{{ item.skuName }}</span>
                  <span>¥{{ item.price }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="title" style="margin-top: 20px">
        <b>支付信息</b>
      </div>
      <el-row style="padding: 0 20px; margin-top: 20px">
        <el-col class="col" :span="8">
          <span>支付方式：
            <template v-if="detailData.payType===1">微信支付</template>
            <template v-if="detailData.payType===2">钱包支付</template></span>
        </el-col>
        <el-col class="col" :span="8">
          <span>菜品数量：{{ detailData.foodCount }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>菜品金额：{{ detailData.foodPrice }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>应付金额： {{ detailData.receivableWithoutDeliveryFee }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>优惠券抵扣： {{ detailData.couponPrice }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>积分优惠： {{ detailData.pointPrice }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>超值换购优惠： {{ detailData.exchangeFoodReducePrice }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>实付金额：{{ detailData.income }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>退款金额：{{ detailData.refundPrice }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>钱包实充金额抵扣：{{ detailData.useWalletMoney }}</span>
        </el-col>
        <el-col class="col" :span="8">
          <span>钱包赠送金额抵扣：{{ detailData.useGiftMoney }}</span>
        </el-col>
        <el-col class="col" :span="8">
          备注：{{ !detailData.remark ? '无' : detailData.remark }}
        </el-col>
      </el-row>
    </div>
    <div class="base-box">
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        "
      >
        <b style="font-size: 15px">订单日志</b>
      </div>
      <el-divider />
      <Table :data="detailData.orderProgressList" />
    </div>
    <WhyNo
      v-if="verifyRefundOrder"
      :order-id="detailData.orderId"
      :visible.sync="visible"
    />
    <self-delivery-dig
      :show.sync="selfDeliveryDig"
      :order-id="detailData.orderId"
      @ok="getOrderDetail"
    />
    <Reason
      :visible.sync="show"
      :verify-load.sync="verifyLoad"
      @cancelOerder="cancelOerder"
    />
  </div>
</template>

<script>
import Table from './_components/table'
import { orderStatusMap, btnShow, orderType } from './_utils'
import {
  fhReady,
  fhPickup,
  fhGetOrderDetail,
  fhGetOrderRefunds,
  fhVerifyRefundOrder,
  fhCancelOerder
} from '@/api/orders'
import WhyNo from './_components/why-no'
import Reason from './_components/reason'
import SelfDeliveryDig from '@/components/SelfDeliveryDig'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'OrderDetail',
  components: {
    Table,
    WhyNo,
    SelfDeliveryDig,
    Reason
  },
  data() {
    return {
      detailData: {},
      value: '',
      id: null,
      visible: false,
      mainLoad: false,
      verifyParams: {},
      verifyLoad: false,
      pickupload: false,
      readyLoad: false,
      selfDeliveryDig: false,
      cancelLoad: false,
      show: false,
      btnShow,
      orderType
    }
  },
  computed: {
    showPickupCode() {
      return (
        this.detailData.orderType === '外卖' &&
        this.detailData.appointStatus !== 1
      )
    },
    refundImags() {
      return this.detailData.refundInfo.images.split(',')
    },
    verifyRefundOrder() {
      return this.detailData.refundStatus === 601
    },
    refundLog() {
      const { refundLog, refundInfo } = this.detailData
      return refundLog || refundInfo || {}
    },
    currStep() {
      const { orderProgressList } = this.detailData
      return orderProgressList ? orderProgressList.length : 0
    },
    showCancel() {
      return ![602, 603, 604, 605].includes(this.detailData.orderStatus)
    }
  },
  created() {
    window.de = this
    const { orderId } = this.$route.params
    this.orderId = orderId
    this.$nextTick(() => {
      this.getOrderDetail()
    })
  },
  methods: {
    async getOrderDetail() {
      this.mainLoad = true
      try {
        const { results } = await fhGetOrderDetail(this.orderId)
        switch (results.deliveryType) {
          case 1:
            results.deliveryType = '自配送'
            break
          case 2:
            results.deliveryType = '顺丰配送'
            break
          case 3:
            results.deliveryType = '蜂鸟配送'
            break
          case 4:
            results.deliveryType = '美团配送'
            break
          case 5:
            results.deliveryType = '达达'
            break
          case 6:
            results.deliveryType = '闪送'
            break
        }
        const { refundStatus, orderStatus } = results
        const key =
          refundStatus && refundStatus !== 603 ? refundStatus : orderStatus
        results.status = orderStatusMap.get(key)
        this.detailData = results
      } catch (err) {
        console.log(err)
      }
      this.mainLoad = false
    },
    async getOrderRefunds() {
      try {
        const { results } = await fhGetOrderRefunds()
        console.log(results)
      } catch (err) {
        console.log(err)
      }
    },
    showWhyNoDig() {
      this.visible = true
    },
    updateOrderStatu(statu) {
      this.detailData.orderStatus = statu
    },
    confirmVerifyPass() {
      this.$confirm('此操作将通过用户的退款审核, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.verifyRefundOrderFn()
        })
        .catch(() => {})
    },
    // 退款订单审核
    async verifyRefundOrderFn() {
      this.verifyLoad = true
      try {
        const { backUserId: managerId } = await getUserInfo()
        const params = {
          managerId,
          isPass: true,
          reason: ''
        }
        await fhVerifyRefundOrder(this.detailData.orderId, params)
        this.$message.success('审核成功')
        this.getOrderDetail()
        this.handleClose()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.verifyLoad = false
    },
    // 备餐完成
    async ready() {
      this.readyLoad = true
      try {
        const { results } = await fhReady(this.detailData.orderId)
        const { salfDelivery } = results
        this.selfDeliveryDig = salfDelivery
        this.$message.success('备餐成功')
        this.getOrderDetail()
      } catch (e) {
        console.log('debug', e)
      }
      this.readyLoad = false
    },
    // 确认用户取餐
    confirmPickup() {
      this.$confirm(
        `请确认取餐用户的取餐码是否为：${this.detailData.pickupCode}`,
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
        await fhPickup(this.detailData.orderId)
        this.$message.success('用户取餐成功')
        this.getOrderDetail()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.pickupload = false
    },
    // 选择自配送员
    showSelfDeliveryDig() {
      this.selfDeliveryDig = true
    },
    handleCancel() {
      this.show = true
    },
    // 店铺直接退单
    async cancelOerder(params) {
      this.verifyLoad = true
      try {
        await fhCancelOerder(this.detailData.orderId, params)
        this.show = false
        this.$message.success('取消订单成功')
        this.getOrderDetail()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.verifyLoad = false
    }
  }
}
</script>

<style scoped lang="scss">
.topInfo {
  display: flex;
  img {
    width: 28px;
    height: 28px;
    margin-right: 18px;
  }
  .topRight {
    flex: 1;
    display: flex;
    justify-content: space-between;
    .flex {
      display: flex;
      flex-flow: column;
    }
    .end {
      align-items: flex-end;
    }
    .col {
      margin-bottom: 7px;
      font-size: 13px;
    }
    .l {
      width: 600px;
      b {
        font-size: 18px;
        margin-bottom: 8px;
      }
      .appoint {
        width: 22px;
        height: 22px;
        background: #ff9933;
        color: white;
        line-height: 22px;
        text-align: center;
        border-radius: 3px;
        font-size: 14px;
        margin-left: 8px;
        margin-top: 2.2px;
      }
    }
    .r {
      margin-right: 30px;
      text-align: center;
      .tag {
        margin-bottom: 9px;
        width: 130px;
        height: 36px;
        line-height: 35px;
        border-radius: 4px;
        background: #CFA978;
        color: #ffffff;
      }
      .tagt {
        margin-bottom: 9px;
        width: 130px;
        height: 36px;
        line-height: 35px;
        border-radius: 4px;
      }
    }
  }
}
.row {
  margin-bottom: 14px;
  font-size: 13px;
}
.title {
  height: 45px;
  line-height: 44px;
  background: rgba(250, 250, 250, 1);
  border: 0.5px solid #cccccc;
  border-radius: 1px;
  padding-left: 20px;
  margin: 14px 0;
}
.box {
  padding: 0 20px;
  margin-top: 10px 0;
  .rBox {
    flex: 1;
    display: flex;
    flex-flow: column;
    margin-left: 10px;
  }
  .col {
    margin: 12px 0;
  }
}
.col {
  margin-bottom: 15px;
}
.block {
  margin-bottom: 8px;
}
.bottom {
  span {
    margin-right: 50px;
  }
}
.image {
  img {
    width: 84px;
    height: 84px;
    margin-top: 5px;
    margin-right: 20px;
  }
}
.container {
  &::v-deep .el-step__title.is-finish {
    color: rgba(0, 0, 0, 0.65);
  }
  &::v-deep .el-step__description.is-finish {
    color: rgba(0, 0, 0, 0.65);
  }
}
.base-box{
  margin:0 24px 24px 0
}
</style>
