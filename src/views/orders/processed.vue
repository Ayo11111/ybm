<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-20 11:31:11
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-16 09:50:00
-->
<template>
  <div class="container">
    <div style="display: flex">
      <div style="flex: 1">
        <div
          v-show="['retail', 'restaurant'].includes(merchantManagerType)"
          class="filter base-box"
          style="margin-bottom: 20px"
        >
          <el-form :model="query" inline>
            <el-form-item label="订单号:">
              <el-input
                v-model="query.orderId"
                placeholder="订单号"
                style="width: 255px; margin-right: 10px"
              />
            </el-form-item>
            <el-form-item label="收货人:">
              <el-input
                v-model="query.memberName"
                placeholder="收货人"
                style="width: 255px; margin-right: 10px"
              />
            </el-form-item>
            <el-form-item label="手机号码:">
              <el-input
                v-model="query.phone"
                placeholder="手机号码"
                style="width: 255px; margin-right: 10px"
              />
            </el-form-item>
            <el-form-item label="订单类型:">
              <el-radio-group
                v-model="query.orderType"
                style="margin-right: 10px"
              >
                <el-radio-button label="null">全部</el-radio-button>
                <el-radio-button label="2">自提</el-radio-button>
                <el-radio-button label="1">外卖</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="orderLoad" @click="queryFn">
                查询
              </el-button>
              <el-button :loading="orderLoad" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div
          v-loading="orderLoad"
          class="order-info base-box mt-24"
          style="margin-top: 0"
        >
          <el-tabs v-model="currTab" @tab-click="changeTab">
            <template v-for="(i, index) in menusData">
              <el-tab-pane :key="index" :name="i.id" :label="i.label" lazy>
                <template #label>
                  <el-badge :value="i.num" :hidden="i.num < 1" class="badge">
                    {{ i.label }}
                  </el-badge>
                </template>
                <template v-for="oi in orders">
                  <order-info
                    v-if="i.id === currTab"
                    :key="'info-' + oi.orderId"
                    :raw-value="oi"
                    :self-delivery="!!self"
                    :type="merchantManagerType"
                    @openStatusDetails="openStatusDetails"
                    @openPutNurse="openPutNurse"
                    @updateList="updateList"
                    @setNum="setNum"
                  />
                </template>
                <a-empty v-show="orders.length <= 0" />
                <Pagination
                  v-show="orders.length > 0"
                  :total="total"
                  :cur-page.sync="query.pageNumber"
                  :page-size.sync="query.pageSize"
                  @pagination="pagination"
                />
              </el-tab-pane>
            </template>
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
            <a-button
              v-show="['retail', 'restaurant'].includes(merchantManagerType)"
              type="link"
              class="btn"
              @click="openSetStore(0)"
            >
              <span>预订单设置</span>
              <div>
                <a-icon type="right" />
              </div>
            </a-button>
            <a-button
              v-show="['retail', 'restaurant'].includes(merchantManagerType)"
              type="link"
              class="btn"
              @click="openSetStore(1)"
            >
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
    <putNurse
      v-if="!resetPutNurse"
      :visible.sync="showNurse"
      :order-id="orderId"
      :active-nurse="activeNurse"
    />
    <putStoreInfo :visible.sync="infoVisible" :type="type" />
  </div>
</template>

<script>
import {
  fhGetCurrOrders,
  fhGetNurseNewOrders,
  fhGetNurseProcessOrders,
  fhGetNurseRefundOrders,
  fhGetNurseWaitOrders
} from '@/api/orders'
import { menus, nurseMenus } from './_utils'
import OrderInfo from '@/components/OrderInfo'
import Pagination from '@/components/Pagination'
import { getUserInfo, getStoreId } from '@/utils/auth'
import CurrOrderDetails from './_components/currOrderDetails'
import putNurse from './_components/putNurse'
import { getMerchantManagerType } from '@/utils/auth'
import putStoreInfo from './_components/putStoreInfo.vue'
import { deepClone } from '@/utils'

export default {
  name: 'Processed',
  components: {
    OrderInfo,
    Pagination,
    CurrOrderDetails,
    putNurse,
    putStoreInfo
  },
  data() {
    return {
      change: false,
      currTab: '1',
      menus,
      nurseMenus,
      orders: [],
      query: {
        pageNumber: 1,
        pageSize: 10,
        pageType: '1',
        keyword: null,
        orderType: null
      },
      visible: false,
      resetPutNurse: false,
      orderId: null,
      self: 1,
      total: 0,
      orderLoad: false,
      menuNum: new Map([]),
      showNurse: false,
      storeId: null,
      merchantId: null,
      menuKey: null,
      merchantManagerType: '',
      orderMode: 0,
      infoVisible: false,
      type: 1,
      activeNurse: null,
      timePlayReady: false,
      axiosArr: [
        '',
        'getNurseNewOrders',
        'getNurseProcessOrders',
        'getNurseRefundOrders',
        'getNurseWaitOrders'
      ],
      tabIdToType: {
        1: 2,
        4: 9,
        2: 1,
        3: 8
      },
      tabIdToIndex: {
        1: 0,
        4: 1,
        2: 2,
        3: 3
      }
    }
  },
  computed: {
    menu() {
      return this.$store.state.order.menu
    },
    menusData() {
      let newMenu = ['retail', 'restaurant'].includes(this.merchantManagerType)
        ? deepClone(menus)
        : deepClone(nurseMenus)
      newMenu = newMenu.filter(item => {
        return !item.hidden
      })
      let changeMenu
      if (['retail', 'restaurant'].indexOf(this.merchantManagerType) !== -1) {
        if (newMenu[0].num !== Number(this.menu[1])) {
          changeMenu = 1
        } else if (newMenu[1].num !== Number(this.menu[8])) {
          changeMenu = 8
        }
        newMenu[0].num = Number(this.menu[1])
        newMenu[1].num = Number(this.menu[8])
      } else {
        if (newMenu[0].num !== Number(this.menu[2])) {
          changeMenu = 1
        } else if (newMenu[1].num !== Number(this.menu[9])) {
          changeMenu = 4
        } else if (newMenu[2].num !== Number(this.menu[1])) {
          changeMenu = 2
        } else if (newMenu[3].num !== Number(this.menu[8])) {
          changeMenu = 3
        }
        newMenu[0].num = Number(this.menu[2])
        newMenu[1].num = Number(this.menu[9])
        newMenu[2].num = Number(this.menu[1])
        newMenu[3].num = Number(this.menu[8])
      }
      if (this.change && changeMenu && changeMenu == this.currTab) {
        if (['retail', 'restaurant'].indexOf(this.merchantManagerType) !== -1) {
          this.getCurrOrders(this.currTab)
        } else {
          const requestName = this.axiosArr[this.currTab]
          this[requestName]()
        }
      }
      if (['retail', 'restaurant'].indexOf(this.merchantManagerType) === -1) {
        if (changeMenu === 8 && Number(this.currTab) !== 8) {
          this.getNurseNewOrders()
        }
      }
      return newMenu
    }
  },
  watch: {
    menus: {
      // eslint-disable-next-line space-before-function-paren
      handler: async function(v, ov) {
        if (!ov) return
        const temp = v.map(i => {
          const { id, num } = i
          return [id, num]
        })
        // await this.$local.setItem(this.menuKey, temp)
      },
      immediate: true,
      deep: true
    },
    menusData() {}
  },
  created() {
    this.getManagerType()
  },
  async mounted() {
    window.app = this
    const { merchantId } = await getUserInfo()
    this.merchantId = merchantId
    this.storeId = (await getStoreId()) || null
    this.$nextTick(() => {
      ['retail', 'restaurant'].includes(this.merchantManagerType)
        ? this.getCurrOrders('1')
        : this.getNurseNewOrders()
      // this.getSubscribe()
    })
    // const { menu } = this.$store.state.order
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
    async getNurseNewOrders(params) {
      this.orderLoad = true
      try {
        const { results } = await fhGetNurseNewOrders(params)
        results.results.forEach(item => {
          item.openStatus = true
          item.sexText = item.sex === 1 ? '男' : !item.sex ? '未知' : '女'
          item.nurseSexText =
            item.nurseSex === 1 ? '男' : !item.nurseSex ? '性别未知' : '女'
        })
        if (this.isChange) {
          this.setNumTo0(this.tabIdToType[this.currTab])
        }
        this.total = results.count
        this.orders = results.results
        this.$forceUpdate()
      } catch (err) {
        console.log(err)
      }
      this.isChange = false
      this.change = true
      this.orderLoad = false
    },
    async getNurseProcessOrders(params) {
      this.orderLoad = true
      try {
        const { results } = await fhGetNurseProcessOrders(params)
        results.results.forEach(item => {
          item.openStatus = true
          item.sexText = item.sex === 1 ? '男' : !item.sex ? '未知' : '女'
          item.nurseSexText =
            item.nurseSex === 1 ? '男' : !item.nurseSex ? '性别未知' : '女'
        })
        if (this.isChange) {
          this.setNumTo0(this.tabIdToType[this.currTab])
        }
        this.total = results.count
        this.orders = results.results
        this.$forceUpdate()
      } catch (err) {
        console.log(err)
      }
      this.isChange = false
      this.orderLoad = false
    },
    async getNurseRefundOrders(params) {
      this.orderLoad = true
      try {
        const { results } = await fhGetNurseRefundOrders(params)
        results.results.forEach(item => {
          item.openStatus = true
          item.sexText = item.sex === 1 ? '男' : !item.sex ? '未知' : '女'
          item.nurseSexText =
            item.nurseSex === 1 ? '男' : !item.nurseSex ? '性别未知' : '女'
        })
        if (this.isChange) {
          this.setNumTo0(this.tabIdToType[this.currTab])
        }
        this.total = results.count
        this.orders = results.results
        this.$forceUpdate()
      } catch (err) {
        console.log(err)
      }
      this.isChange = false
      this.orderLoad = false
    },
    async getNurseWaitOrders(params) {
      this.orderLoad = true
      try {
        const { results } = await fhGetNurseWaitOrders(params)
        results.results.forEach(item => {
          item.openStatus = true
          item.sexText = item.sex === 1 ? '男' : !item.sex ? '未知' : '女'
          item.nurseSexText =
            item.nurseSex === 1 ? '男' : !item.nurseSex ? '性别未知' : '女'
        })
        if (this.isChange) {
          this.setNumTo0(this.tabIdToType[this.currTab])
        }
        this.total = results.count
        this.orders = results.results
        this.$forceUpdate()
      } catch (err) {
        console.log(err)
      }
      this.isChange = false
      this.orderLoad = false
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
    queryFn() {
      this.query = Object.assign({}, this.query, {
        pageNumber: 1,
        pageSize: 10
      })
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        this.getCurrOrders()
      } else {
        const requestName = this.axiosArr[this.currTab]
        this[requestName]()
      }
    },
    // 获取当前订单
    async getCurrOrders(rawIndex) {
      this.orderLoad = true
      const index = +rawIndex || +this.currTab
      try {
        const { results, count } = await fhGetCurrOrders(
          Object.assign({}, this.query, { merchantId: this.merchantId })
        )
        results.forEach(item => {
          item.openStatus = true
        })
        this.total = count
        this.orders = results
        if (this.isChange) {
          this.setNumTo0(index)
        }
        this.$forceUpdate()
      } catch (e) {
        this.currTab = this.tempMenuId || '0'
        console.log('debug', e)
      }
      this.isChange = false
      this.change = true
      this.orderLoad = false
    },
    // 切换分页
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        this.$nextTick(() => this.getCurrOrders())
      } else {
        this.$nextTick(() => {
          const requestName = this.axiosArr[this.currTab]
          this[requestName](v)
        })
      }
    },
    // 切换标签
    changeTab(e) {
      const { name } = e
      this.query = Object.assign({}, this.query, {
        pageNumber: 1,
        pageSize: 10,
        pageType: name
      })
      this.isChange = true
      this.tempMenuId = this.currTab
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        this.$nextTick(() => this.getCurrOrders(name))
      } else {
        this.$nextTick(() => {
          const requestName = this.axiosArr[this.currTab]
          this[requestName]()
        })
      }
    },
    // 接收websocket信息
    getSubscribe() {
      this.$goEasy.subscribe({
        channel: `ybm_store_${this.storeId}`,
        // eslint-disable-next-line space-before-function-paren
        onMessage: message => {
          const { content } = message
          const msg = JSON.parse(content)
          msg.forEach(i => {
            const { eventType, body } = i
            this.compoutedAngleThe(eventType, body)
            setTimeout(() => {
              ;(body === 1 && eventType === 1) ||
                (body === 1 && eventType === 2 && this.$audio.play())
              this.getCurrOrders()
            }, 1000)
          })
        }
      })
    },
    // 计算角标数量
    compoutedAngleThe(id, body, setNum) {
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        switch (id) {
          case '2':
          case '1':
          case 2:
          case 1:
            this.$store.commit('order/reduceCount', this.menusData[0].num)
            this.$store.commit('order/countTo0', 1)
            this.menusData[0].num = setNum
            break
          case '8':
          case 8:
            this.$store.commit('order/reduceCount', this.menusData[1].num)
            this.$store.commit('order/countTo0', 8)
            this.menusData[1].num = setNum
            break
        }
      } else {
        this.$store.commit(
          'order/reduceCount',
          this.menusData[this.tabIdToIndex[this.currTab]].num
        )
        this.$store.commit('order/countTo0', id)
        this.menusData[this.tabIdToIndex[this.currTab]].num = setNum
      }
    },
    speckText(str) {
      var url =
        'http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&text=' +
        encodeURI(str)
      new Audio(url).play()
    },
    // 已读数量为0
    setNumTo0(index) {
      this.compoutedAngleThe(index, 0, 0)
    },
    openStatusDetails(id) {
      this.visible = true
      this.orderId = id
    },
    openPutNurse(orderId, nurseId) {
      this.resetPutNurse = false
      this.$nextTick(() => {
        this.showNurse = true
        this.activeNurse = nurseId
        this.orderId = orderId
      })
    },
    updateList() {
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        this.getCurrOrders()
      } else {
        const requestName = this.axiosArr[this.currTab]
        this[requestName]()
      }
      setTimeout(() => {
        this.resetPutNurse = true
      }, 500)
    },
    openSetStore(type) {
      this.type = type
      this.infoVisible = true
    },
    /**
     * num:1 待处理订单
     */
    setNum(num) {
      this.setNumTo0(num)
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
