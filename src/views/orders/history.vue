<template>
  <div
    class="container"
    style="background: #eee; margin: 0; padding: 20px 20px"
  >
    <div style="display: flex">
      <div style="flex: 1">
        <div class="filter base-box" style="min-height: 0; margin-bottom: 20px">
          <el-form
            v-if="['retail', 'restaurant'].includes(merchantManagerType)"
            :model="Json"
            inline
          >
            <el-form-item label="订单信息:">
              <el-input
                v-model="Json['keyword']"
                style="flex: 1; width: 255px; margin-right: 10px"
                placeholder="订单号/手机号码"
              />
            </el-form-item>
            <el-form-item label="订单状态:">
              <el-select
                v-model="Json['orderStatus']"
                placeholder="请选择"
                clearable
                style="flex: 1; width: 255px; margin-right: 10px"
              >
                <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="订单日期:">
              <el-date-picker
                v-model="day"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="flex: 1; margin-right: 10px"
                @change="date"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="select">
                查询
              </el-button>
              <el-button :loading="loading" @click="cancel">重置</el-button>
            </el-form-item>
          </el-form>
          <el-form v-else :model="Json" inline>
            <el-form-item label="订单状态:">
              <a-radio-group v-model="Json.pageType" :default-value="null">
                <a-radio :value="null"> 全部 </a-radio>
                <a-radio :value="7"> 已退款 </a-radio>
                <a-radio :value="8"> 已取消 </a-radio>
                <a-radio :value="9"> 已完成 </a-radio>
              </a-radio-group>
            </el-form-item>
            <el-form-item label="订单日期:">
              <el-date-picker
                v-model="time"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="getOrderTime"
              />
            </el-form-item>
            <el-form-item label="护工姓名:">
              <el-input v-model="Json.nurseName" />
            </el-form-item>
            <el-form-item label="护工手机号:">
              <el-input v-model="Json.nursePhone" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="select">
                查询
              </el-button>
              <el-button :loading="loading" @click="cancel">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-loading="loading" class="order-info base-box mt-24">
          <Item
            ref="item"
            :json="Json"
            :order-status-json="orderStatusJson"
            class="item"
            :type="merchantManagerType"
            @load="load"
          />
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
    <putStoreInfo :visible.sync="infoVisible" :type="type" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Item from './_components/historyItem'
import { historyOrderStatus,statusArray } from './_utils'
import { getMerchantManagerType } from '@/utils/auth'
import putStoreInfo from './_components/putStoreInfo.vue'
export default {
  components: {
    Item,
    putStoreInfo
  },
  data() {
    return {
      activeName: 'first',
      orderStatusJson: {},
      Json: {
        orderType: null,
        storeId: null,
        startTime: null,
        endTime: null,
        orderStatus: null,
        keyword: null
      },
      merchantManagerType: '',
      StatusJson: {},
      options: [],
      orderStatus: null,
      storeIdOption: [],
      day: null,
      loading: false,
      status: false,
      time: [],
      orderMode: 0,
      infoVisible: false,
      type: 1
    }
  },
  created() {
    this.getManagerType()
    window.app = this
    statusArray.forEach(item => {
      this.orderStatusJson[item[0]] = item[1]
      this.StatusJson[item[1]] = [item[0]]
      const json = {}
      json['id'] = item[0]
      json['name'] = item[1]
      this.options.push(json)
    })
  },
  async mounted() {
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
    date(value) {
      this.Json['startTime'] = value ? `${value[0]}` : null
      this.Json['endTime'] = value ? `${value[1]}` : null
    },
    select() {
      this.$refs.item.select()
    },
    cancel() {
      for (const i in this.Json) {
        this.Json[i] = null
      }
      this.day = null
      this.time = []
      this.$refs.item.select()
    },
    load(val) {
      this.loading = val
    },
    getOrderTime(v) {
      if (v) {
        const [startTime, endTime] = v
        this.Json.startTime = `${startTime}`
        this.Json.endTime = `${endTime}`
      } else {
        this.Json.startTime = null
        this.Json.endTime = null
      }
    },
    openSetStore(type) {
      this.type = type
      this.infoVisible = true
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'Home' && to.query.date === 'today') {
        // 时间格式化
        const date = parseTime(+new Date(), '{y}-{m}-{d}')
        const start = `${date}`
        const end = `${date}`
        vm.day = [start, end]
        vm.Json.startTime = start
        vm.Json.endTime = end
        vm.Json.orderStatus = 605
        // 请求
        vm.select()
      }
    })
  }
}
</script>

<style scoped lang="scss">
.order-list {
  background: transparent;
  padding: 0;
}
.flex {
  display: flex;
  align-items: center;
}
.col {
  margin-bottom: 20px;
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
</style>
