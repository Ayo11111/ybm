<template>
  <div>
    <div class="container" style="min-height: 145px">
      <el-row :gutter="20">
        <el-col :span="8" class="flex col">
          <span>订单信息：</span>
          <el-input style="flex: 1" placeholder="订单号/手机号码" />
        </el-col>
        <el-col :span="8" class="flex">
          <span>订单类型：</span>
          <el-radio-group
            v-model="Json['orderType']"
            style="flex: 1; display: flex"
          >
            <el-radio-button label="null">全部</el-radio-button>
            <el-radio-button label="2">取餐</el-radio-button>
            <el-radio-button label="1">外卖</el-radio-button>
          </el-radio-group>
        </el-col>
        <el-col :span="8" class="flex">
          <span>选择店铺：</span>
          <el-select
            v-model="Json['storeId']"
            style="flex: 1"
            placeholder="全部"
          >
            <el-option
              v-for="item in storeIdOption"
              :key="item.id"
              :value="item.id"
              :label="item.storeName"
            />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="9" class="flex">
          <span>订单日期：</span>
          <el-date-picker
            v-model="day"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="flex: 1"
            @change="date"
          />
        </el-col>
        <el-col :span="9" class="flex">
          <span>订单状态：</span>
          <el-select
            v-model="Json['orderStatus']"
            placeholder="请选择"
            style="flex: 1"
          >
            <el-option
              v-for="(item, index) in options"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" :loading="loading" @click="select">
            查询
          </el-button>
          <el-button :loading="loading" @click="cancel">重置</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="container order-list">
      <el-tabs v-model="activeName">
        <el-tab-pane label="进行中" name="first">
          <Item
            ref="conduct"
            class="item"
            :type="1"
            :json="Json"
            :order-status-json="orderStatusJson"
            @upload="upload"
          />
        </el-tab-pane>
        <el-tab-pane label="预订单" name="second">
          <Item
            ref="reserve"
            class="item"
            :type="2"
            :json="Json"
            :order-status-json="orderStatusJson"
            @upload="upload"
          />
        </el-tab-pane>
        <el-tab-pane label="历史订单" name="third">
          <Item
            ref="history"
            class="item"
            :type="3"
            :json="Json"
            :order-status-json="orderStatusJson"
            @upload="upload"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Item from './_components/orderItem'
import { orderStatusMap } from './_utils'
import { fhGetStores } from '@/api/stores'
export default {
  components: {
    Item
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
        orderStatus: null
      },
      StatusJson: {},
      options: [],
      orderStatus: null,
      storeIdOption: [],
      day: null,
      loading: false
    }
  },
  created() {
    orderStatusMap.forEach(item => {
      this.orderStatusJson[item[0]] = item[1]
      this.StatusJson[item[1]] = [item[0]]
      const json = {}
      json['id'] = item[0]
      json['name'] = item[1]
      this.options.push(json)
    })
    this.GetStores()
  },
  methods: {
    async GetStores() {
      try {
        const { results } = await fhGetStores()
        this.storeIdOption = results
      } catch (err) {
        console.log(err)
      }
    },
    setType(value) {
      switch (value) {
        case '全部':
          this.Json['orderType'] = 'null'
          break
        case '取餐':
          this.Json['orderType'] = 2
          break
        case '外卖':
          this.Json['orderType'] = 1
          break
      }
    },
    date(value) {
      this.Json['startTime'] = value[0]
      this.Json['endTime'] = value[1]
    },
    select() {
      this.$refs.conduct.select()
      this.$refs.reserve.select()
      this.$refs.history.select()
    },
    cancel() {
      console.log(this.Json['orderType'])
      for (const i in this.Json) {
        this.Json[i] = null
      }
      this.day = null
      this.$refs.conduct.select()
      this.$refs.reserve.select()
      this.$refs.history.select()
    },
    upload() {
      this.loading = false
    }
  }
}
</script>

<style scoped lang="scss">
@for $i from 1 to 4 {
  @media (min-width: 555px * $i + 48px * ($i - 1)) {
    .order-list {
      column-count: $i;
    }
  }
}
.order-list {
  background: transparent;
  padding: 0;
  column-count: 3;
  column-gap: 24px;
  .item {
    break-inside: avoid;
    box-sizing: border-box;
  }
}
.flex {
  display: flex;
  align-items: center;
}
.col {
  margin-bottom: 20px;
}
</style>
