<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-20 11:31:11
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-19 11:31:36
-->
<template>
  <div class="container">
    <div style="display: flex">
      <div style="flex:1">
        <div class="filter base-box">
          <el-form :model="query" inline>
            <el-form-item label="订单信息:">
              <el-input
                v-model="query.phone"
                placeholder="手机号码"
                style="width: 255px;margin-right: 10px"
              />
            </el-form-item>
            <el-form-item label="订单类型:">
              <el-radio-group
                v-model="query.orderType"
                style="margin-right: 10px"
              >
                <el-radio-button label="null">全部</el-radio-button>
                <el-radio-button label="2">取餐</el-radio-button>
                <el-radio-button label="1">外卖</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                :loading="orderLoad"
                @click="getCurrOrders"
              >
                查询
              </el-button>
              <el-button :loading="orderLoad" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div v-loading="orderLoad" class="order-info base-box mt-24">
          <el-tabs v-model="currTab" @tab-click="changeTab">
            <el-tab-pane
              v-for="i in menus"
              v-if="!i.hidden"
              :key="i.name"
              :name="i.id"
              :label="i.label"
            >
              <template #label>
                <el-badge :value="i.num" :hidden="i.num < 1" class="badge">
                  {{ i.label }}
                </el-badge>
              </template>
              <template v-for="(oi, ok) in orders">
                <order-info
                  :key="'info-' + ok"
                  :raw-value="oi"
                  @openStatusDetails="openStatusDetails"
                />
              </template>
              <a-empty v-show="orders.length <= 0" class="empty_margin" />
              <Pagination
                v-show="orders.length > 0"
                :total="total"
                :cur-page="query.pageNumber"
                :page-size="query.pageSize"
                @pagination="pagination"
                @updateList="updateList"
              />
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="order-info mt-24 relevant">
        <div class="box base-box">
          <b style="font-size: 18px">订单相关设置</b>
          <div class="btnBox">
            <!-- <a-button type="link" class="btn" v-sho>
              <span>消息与铃声设置</span>
              <div>
                <a-icon type="right" />
              </div>
            </a-button> -->
            <a-button type="link" class="btn" @click="openSetStore(0)">
              <span>预订单设置</span>
              <div>
                <a-icon type="right" />
              </div>
            </a-button>
            <a-button type="link" class="btn" @click="openSetStore(1)">
              <span>出餐时间设置</span>
              <div>
                <a-icon type="right" />
              </div>
            </a-button>
            <a-button v-if="orderMode === 0" type="link" class="btn" @click="openSetStore(2)">
              <span>接单方式设置</span>
              <div>
                <a-icon type="right" />
              </div>
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <CurrOrderDetails
      :type="merchantManagerType"
      :visible.sync="visible"
      :order-id="orderId"
    />
    <putStoreInfo :visible.sync="infoVisible" :type="type" />
  </div>
</template>

<script>
import { getUserInfo } from '@/utils/auth'
import { fhGetOrderAppoint } from '@/api/orders'
import { advanceMenus } from './_utils'
import OrderInfo from '@/components/OrderInfo'
import Pagination from '@/components/Pagination'
import CurrOrderDetails from './_components/currOrderDetails'
import putStoreInfo from './_components/putStoreInfo.vue'
import { getMerchantManagerType } from '@/utils/auth'
export default {
  name: 'Processed',
  components: {
    OrderInfo,
    Pagination,
    CurrOrderDetails,
    putStoreInfo
  },
  data() {
    return {
      currTab: '3',
      menus: advanceMenus,
      orders: [],
      query: {
        pageNumber: 1,
        pageSize: 10,
        orderType: null,
        pageType: '3'
      },
      total: 0,
      orderLoad: false,
      visible: false,
      orderId: null,
      orderMode: 0,
      infoVisible: false,
      type: 1,
      merchantManagerType: ''
    }
  },
  created() {
    this.getManagerType()
  },
  async mounted() {
    this.getCurrOrders('1')
    this.getSubscribe()
    this.orderMode = this.$store.getters.orderMode
  },
  methods: {
    async getManagerType() {
      try {
        const results = await getMerchantManagerType()
        this.merchantManagerType = results
      } catch (err) {
        console.log(err)
      }
    },
    reset() {
      const { pageType } = this.query
      this.query = {
        pageNumber: 1,
        pageSize: 10,
        orderType: null,
        pageType
      }
      this.$nextTick(() => this.getCurrOrders())
    },
    async getCurrOrders(rawIndex) {
      this.orderLoad = true
      const index = +rawIndex || +this.currTab
      try {
        const { results, count } = await fhGetOrderAppoint(this.query)
        results.forEach(item => {
          item.openStatus = true
        })
        this.total = count
        this.orders = results
        this.setNumTo0(index)
      } catch (e) {
        this.currTab = this.tempMenuId || '0'
        console.log('debug', e)
      }
      this.orderLoad = false
    },
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      this.$nextTick(() => this.getCurrOrders())
    },
    updateList() {
      this.getCurrOrders()
    },
    changeTab(e) {
      const { name } = e
      this.query = Object.assign({}, this.query, {
        pageNumber: 1,
        pageSize: 10,
        pageType: name
      })
      this.tempMenuId = this.currTab
      this.$nextTick(() => this.getCurrOrders(name))
    },
    // 接收websocket信息
    async getSubscribe() {
      const { storeId } = (await getUserInfo()) || {}
      this.$goEasy.subscribe({
        channel: `store_${storeId}`,
        // eslint-disable-next-line space-before-function-paren
        onMessage: message => {
          const { content } = message
          const msg = JSON.parse(content)
          msg.forEach(i => {
            const { eventType, body } = i
            this.menus[eventType - 1].num += body ? 1 : -1
            eventType === 2 || eventType === 1 && body && this.$audio.play()
            this.getCurrOrders(this.currTab)
          })
        }
      })
    },
    // 已读数量为0
    setNumTo0(index) {
      this.menus[index - 1] && (this.menus[index - 1].num = 0)
    },
    openStatusDetails(id) {
      this.visible = true
      this.orderId = id
    },
    openSetStore(type) {
      this.type = type
      this.infoVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: transparent;
  padding: 0;

  .order-info {
    min-height: calc(100vh - 344px);
    &::v-deep {
      .el-tabs__nav-wrap {
        overflow: unset;
      }
      .el-tabs__nav-scroll {
        overflow: unset;
        height: 40px;
      }

      .badge {
        z-index: 99;
      }
    }
  }
  .relevant {
    width: 387px;
    margin-left: 15px;
    margin-top: 0;
    .box {
      width: 387px;
      height: 600px;
      background: #fff;
      position: fixed;
      // border-radius: 5px;
      .btnBox {
        display: flex;
        flex-flow: column;
        margin-top: 12px;
        .btn {
          width: 100%;
          display: flex;
          padding: 0;
          justify-content: space-between;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
