<template>
  <div v-loading="getLoad">
    <div class="container head" style="min-height: 0">
      <img
        :src="data.logoImage"
      >
      <b>{{ data.storeName }}</b>
      <el-rate
        v-model="data.tasteScore"
        disabled
        show-score
        text-color="#ff9900"
        score-template="{value}"
      />
    </div>
    <div v-loading="loading" class="container" style="min-height: 0">
      <div>
        <b style="font-size: 18px; margin-right: 10px">今日概览</b>
      </div>
      <el-row class="row" :gutter="10">
        <el-col class="col" :span="8">
          <span class="head color">
            今日有效订单
            <a-tooltip>
              <template slot="title"> 交易成功且用户未退款 </template>
              <i class="el-icon-info" />
            </a-tooltip>
          </span>
          <div class="bottom">
            <b style="margin-right: 2px">
              {{ data.todayValidOrdersCount || 0 }}
            </b>
            <router-link
              :to="{ name: 'ManagementAnalysis', query: { activeName: 'effective' }}"
            >
              <span class="color">单</span>
              <i class="el-icon-arrow-right" />
            </router-link>
          </div>
        </el-col>
        <el-col class="col" :span="8">
          <span class="head color">
            今日预计收入
            <a-tooltip>
              <template slot="title">
                扣除相关支出费用（营销活动支出、平台服务费）后的净收入
              </template>
              <i class="el-icon-info" />
            </a-tooltip>
          </span>
          <div class="bottom">
            <b>{{ data.todayExpectIncome || 0 }}</b>
            <router-link
              :to="{ name: 'ManagementAnalysis'}"
            >
              <span class="color">元</span>
              <i class="el-icon-arrow-right" />
            </router-link>
          </div>
        </el-col>
        <el-col class="col" :span="8">
          <span class="head color">
            今日新用户
            <!-- <a-tooltip>
              <template slot="title">
                统计时间内，包含商品原价、包装费、配送费
              </template>
              <i class="el-icon-info" />
            </a-tooltip> -->
          </span>
          <div class="bottom">
            <b>{{ data.newUserCount || 0 }}</b>
            <span class="color" style="margin-top: 5px;">人</span>
          </div>
        </el-col>
      </el-row>
      <el-row class="row" :gutter="15">
        <el-col class="col" :span="8">
          <span class="head color">今日预约订单</span>
          <div class="bottom">
            <b>{{ data.newExpectOrdersCount || 0 }}</b>
            <router-link
              :to="{ name: 'Processed' }"
            >
              <span class="color">单</span>
              <i class="el-icon-arrow-right" />
            </router-link>
          </div>
        </el-col>
        <el-col class="col" :span="8">
          <span class="head color">到期预约订单</span>
          <div class="bottom">
            <b>{{ data.deadLineExpectOrdersCount || 0 }}</b>
            <router-link
              :to="{ name: 'Processed' }"
            >
              <span class="color">单</span>
              <i class="el-icon-arrow-right" />
            </router-link>
          </div>
        </el-col>
        <el-col class="col" :span="8">
          <span class="head color">待回复差评</span>
          <div class="bottom">
            <b>{{ data.badCommentCount || 0 }}</b>
            <router-link
              :to="{
                name: 'customeComment',
                params: { reply: '未回复', score: '差评(1-2)' }
              }"
            >
              <span class="color">个</span>
              <i class="el-icon-arrow-right" />
            </router-link>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="container" style="min-height: 0">
      <div>
        <b style="font-size: 18px; margin-right: 10px">昨日经营分析 </b>
      </div>
      <el-row class="row" :gutter="10">
        <el-col
          v-for="(item, index) in analysis"
          :key="index"
          class="col"
          :span="8"
          style="margin-bottom: 18px"
        >
          <span class="head color">
            {{ item.title }}
            <a-tooltip v-if="item.tooltip">
              <template slot="title"> {{ item.tooltip }} </template>
              <i class="el-icon-info" />
            </a-tooltip>
          </span>
          <div class="bottom">
            <b style="margin-right: 2px">
              {{ data[item.field] || 0 }}
            </b>
            <router-link
              v-if="item.router"
              :to="item.router"
            >
              <span class="color">{{ item.router.text }}</span>
              <i class="el-icon-arrow-right" />
            </router-link>
            <span v-else class="color" style="margin-top: 5px;">{{ item.company }}</span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { analysis } from './utils'
import { getStoreId } from '@/utils/auth'
import { fhGetBusiness, fhGetStorePreview, fhGetManage } from '@/api/home'
export default {
  data() {
    return {
      analysis,
      Business: {},
      total: 0,
      store: [],
      loading: false,
      btnLoad: false,
      storeId: null,
      value: 5,
      getLoad: false,
      data: {}
    }
  },
  async created() {
    window.home = this
    this.storeId = await getStoreId()
    this.getManage()
    // this.getBusiness()
    // this.getStorePreview()
  },
  methods: {
    async getBusiness() {
      try {
        const { results } = await fhGetBusiness()
        this.Business = results
      } catch (err) {
        console.log(err)
      }
    },
    async getStorePreview(params) {
      this.loading = true
      this.btnLoad = true
      try {
        const { results, count } = await fhGetStorePreview(params)
        this.store = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
      this.loading = false
      this.btnLoad = false
    },
    async getManage() {
      this.getLoad = true
      try {
        const { results } = await fhGetManage()
        console.log(results)
        this.data = results || {}
        this.data.avgPrice = results.avgPrice.toFixed(2)
      } catch (err) {
        console.log()
      }
      this.getLoad = false
    }
  }
}
</script>

<style scoped lang="scss">
.color {
  color: #999999;
  font-size: 14px;
}
.row {
  margin-top: 25px;
  .col {
    display: flex;
    flex-direction: column;
    align-items: center;
    .head {
      margin-bottom: 10px;
    }
    .bottom {
      display: flex;
      align-items: center;
      b {
        font-size: 28px;
      }
      a {
        display: flex;
        align-items: center;
        margin-top: 5px;
      }
      i {
        font-size: 15px;
      }
      .color {
        margin-left: 4px;
      }
    }
  }
}
.head {
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
  }
  b {
    font-size: 18px;
    margin-left: 18px;
    margin-right: 8px;
  }
}
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  b {
    font-size: 20px;
  }
}
</style>
