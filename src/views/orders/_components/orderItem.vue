<template>
  <div class="order-list">
    <div v-for="(i, k) in orderList" :key="k" class="order-col">
      <div v-for="item in i" :key="item.orderId" class="order-item">
        <div class="item">
          <div class="info">
            <div style="display: flex; align-items: center">
              <span class="appoint">预</span>
              <span>店铺：{{ item.storeName }}</span>
              <el-divider direction="vertical" />
              <span>{{ item.createTime }} 下单 </span>
              <el-divider direction="vertical" />
              <span>订单编号：{{ item.orderId }}</span>
              <el-divider direction="vertical" />
              <span>订单类型：{{ item.orderType }}</span>
            </div>
            <span style="justify-self: flex-end">
              订单状态：{{ item.status }}
            </span>
          </div>
          <div class="box">
            <div class="left">
              <el-row>
                <el-col :span="24" style="margin-bottom: 15px">
                  <el-tag type="info">#122</el-tag>
                  <span style="margin: 10px">立即送达 </span>
                  <span>预计送达时间 {{ item.estimatedTime }}</span>
                </el-col>
                <el-col :span="24" class="col">
                  <span style="font-size: 18px">{{ item.name }} </span>
                  <span>客户电话：{{ item.phone }}</span>
                </el-col>
                <el-col v-if="false" :span="24" class="col">
                  <span style="line-height: 22px">
                    收货地址：{{ item.shippingAddress }}
                  </span>
                </el-col>
                <el-col :span="24" class="col">
                  <span>
                    备注：{{ item.remark === '' ? '无' : item.remark }}
                  </span>
                </el-col>
                <el-col :span="24" class="col">
                  <span>
                    餐具份数：
                    <span v-if="item.tablewareNum !== 0">
                      {{ item.tablewareNum }}
                    </span>
                    <span v-else>无需餐具</span>
                  </span>
                </el-col>
                <el-col :span="24" class="col">
                  <span>商家接单时间：{{ item.createTime }}</span>
                </el-col>
              </el-row>
              <el-button
                v-if="item.orderStatus === 4"
                type="primary"
                style="margin-right: 5px"
              >
                提醒骑手取餐
              </el-button>
              <router-link :to="`/orders/detail/${item.orderId}`">
                <el-button>订单详情</el-button>
              </router-link>
            </div>
            <div class="right">
              <el-row style="margin-bottom: 8px">
                <el-col :span="24">商家信息</el-col>
              </el-row>
              <el-row :gutter="25" style="margin-bottom: 8px">
                <el-col
                  v-for="(item, index) in item.foodItemVoList"
                  :key="index"
                  :span="12"
                  class="flex co"
                >
                  <span>
                    {{ item.foodName }}{{ item.num }}{{ item.skuName }}
                  </span>
                  <span>¥{{ item.originalPrice }}</span>
                </el-col>
                <el-col :span="12" class="flex co">
                  <span>餐盒费</span>
                  <span>¥{{ item.packagePrice }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="25" class="row">
                <el-col :span="12" class="flex" style="float: right">
                  <span>菜品金额小计</span>
                  <span>¥{{ item.originFoodPrice }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="25" class="row">
                <el-col :span="12" class="flex" style="float: right">
                  <span>商家优惠</span>
                  <span>
                    <span v-if="item.preferentialPrice !== 0">-</span>
                    ¥{{ item.preferentialPrice }}
                  </span>
                </el-col>
                <el-col :span="12" class="flex" style="float: right">
                  <span>配送费</span>
                  <span>¥{{ item.deliveryPrice }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="25" class="row">
                <el-col :span="12" class="flex" style="float: right">
                  <span>客户实际支付</span>
                  <span>¥{{ item.totalPrice }}</span>
                </el-col>
              </el-row>
              <el-row :gutter="25" class="row">
                <el-col :span="12" class="flex" style="float: right">
                  <span>平台服务费</span>
                  <span>¥{{ item.serviceFee }}</span>
                </el-col>
                <el-col :span="12" class="flex" style="float: right">
                  <span>商家预计收入</span>
                  <span>¥{{ item.income }}</span>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Pagination
      v-if="total !== 0"
      ref="pagination"
      :total="total"
      :page-sizes="[12, 15, 18]"
      style="background: transparent"
      @pagination="getOrderAppoint"
    />
  </div>
</template>

<script>
import { fhGetOrderAppoint } from '@/api/orders'
import { orderStatusMap } from '../_utils'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  props: {
    type: {
      type: Number,
      default: null
    },
    Json: {
      type: Object,
      default: () => {}
    },
    orderStatusJson: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      orderList: [],
      total: 0,
      status: false
    }
  },
  created() {
    this.getOrderAppoint({
      pageType: this.type
    })
  },
  methods: {
    async getOrderAppoint(params) {
      if (this.status) {
        params = Object.assign(params, this.Json)
      }
      this.$emit('load', true)
      try {
        const { results, count } = await fhGetOrderAppoint(params)
        const tempArr = []
        results.forEach((item, index) => {
          switch (item.orderType) {
            case 1:
              item.orderType = '外卖'
              break
            case 2:
              item.orderType = '取餐'
              break
          }
          item.status = orderStatusMap.get(item.orderStatus)
          const column = index % 3
          !tempArr[column] && (tempArr[column] = [])
          tempArr[column].push(item)
        })
        this.total = count
        this.orderList = tempArr
      } catch (err) {
        console.log(err)
      }
      this.$emit('load', false)
    },
    select() {
      this.status = true
      const type = {
        pageType: this.type
      }
      const params = Object.assign(type, this.Json)
      this.getOrderAppoint(params)
    },
    cancel() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped lang="scss">
.order-list {
  background: transparent;
  display: flex;
  justify-content: space-between;
  .order-col {
    width: 31.5%;
  }
}

.item {
  margin-bottom: 30px;
}

.info {
  width: 100%;
  height: 41px;
  background: rgba(204, 204, 204, 0.149019607843137);
  padding: 0 20px;
  color: #999999;
  margin-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .appoint {
    width: 22px;
    height: 22px;
    display: block;
    background: #ff9933;
    color: white;
    line-height: 22px;
    text-align: center;
    border-radius: 3px;
    font-size: 14px;
    margin-right: 8px;
  }
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
