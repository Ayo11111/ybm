<template>
  <div>
    <div class="container head" style="min-height: 0">
      <div v-loading="amountLoad" class="l">
        <div class="lt">
          <el-avatar shape="square" :size="72" :src="Amount.merchantLogo" />
          <div class="info">
            <b>{{ Amount.merchantName }}</b>
            <p>
              <router-link to="/bill/info">
                <el-link
                  type="primary"
                  style="font-size: 16px"
                  :underline="false"
                >账户信息</el-link>
              </router-link>
            </p>
          </div>
        </div>
        <div style="margin-top: 18px">
          <el-row>
            <el-col class="col" :span="9">
              <span>账户余额</span> <br>
              <b>¥ {{ Amount.totalAmount }}</b>
            </el-col>
            <el-col class="col" :span="12">
              <span>可提现余额</span> <br>
              <b>¥ {{ Amount.availableAmount }}</b>
              <el-button
                :disabled="Amount.availableAmount === 0"
                type="primary"
                style="margin-left: 35px"
                @click="play"
              >
                提现
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div v-loading="withdrewLoad" class="r">
        <div class="rhead">
          <span style="font-size: 18px">余额提现记录</span>
          <router-link to="/bill/record">
            <b style="font-size: 16px">
              更多
            </b>
          </router-link>
        </div>
        <ul class="record" style="padding: 0">
          <li v-for="(item, index) in withdrewList" :key="index">
            <span>{{ item.createTime }}</span>
            <span>{{ item.status }}</span>
            <span>- ¥ {{ item.amount }}</span>
          </li>
          <!-- - ¥ 3000.00 / 余额 ¥ 0.00 -->
        </ul>
      </div>
    </div>
    <div class="container">
      <b style="font-size: 20px">账单信息</b>
      <div style="margin: 30px 0 50px 0">
        <p style="font-size: 16px;margin-bottom: 22px">待结算账单</p>
        <Table
          :data="Unsettled"
          :base-info="header"
          finance-type="unclsd"
          :loading="unSettleLoad"
        />
      </div>
      <div>
        <p style="font-size: 16px;margin-bottom: 22px">已结算账单</p>
        <Table
          :data="settlement"
          :base-info="header"
          finance-type="clsd"
          :loading="settleLoad"
        />
        <!-- <Pagination :total="total" @pagination="pagination" /> -->
      </div>
    </div>
    <Withdrawal
      :money.sync="Amount.availableAmount"
      :tail.sync="Amount.phoneEnd"
      :visible.sync="visible"
      @getOnlineAmount="getOnlineAmount"
      @postWithdrew="postWithdrew"
    />
  </div>
</template>

<script>
import {
  fhPostWithdrew,
  fhGetOnlineAmount,
  fhGetProfitsharing,
  fhGetFinanceHeader,
  fhGetFinanceList
} from '@/api/finance'
import Table from './_components/HomeTable'
import Withdrawal from './_components/Withdrawal'
export default {
  components: {
    Table,
    Withdrawal
  },
  data() {
    return {
      withdrewList: [],
      Amount: {},
      settlement: [{}],
      Unsettled: [{}],
      total: 0,
      amountLoad: false,
      withdrewLoad: false,
      settleLoad: false,
      unSettleLoad: false,
      visible: false,
      header: {},
      query: {
        startTime: this.$moment()
          .subtract('days', 30)
          .format('YYYY-MM-DD'),
        endTime: this.$moment()
          .subtract('days', 0)
          .format('YYYY-MM-DD')
      }
    }
  },
  created() {
    this.postWithdrew({
      pageNumber: 1,
      pageSize: 4
    })
    this.getOnlineAmount()
    this.getFinanceList({
      billStatus: true
    })
    this.getFinanceList({
      billStatus: true
    })
    this.getFinanceList({
      billStatus: false
    })
    // this.getProfitsharing({
    //   shareStatus: 0
    // })
    // this.getProfitsharing({
    //   shareStatus: 1
    // })
  },
  methods: {
    async getFinanceList(params) {
      params = Object.assign({}, params, this.query)
      params.billStatus
        ? (this.settleLoad = true)
        : (this.unSettleLoad = true)
      this.detailLoad = true
      try {
        const { count, results } = await fhGetFinanceList(params)
        console.log(results, 'results账单')
        if (params.billStatus) {
          this.settlement = results
        } else {
          this.Unsettled = results
        }
        this.total = count
      } catch (e) {
        console.log('debug axios', e)
      }
      params.billStatus
        ? (this.settleLoad = false)
        : (this.unSettleLoad = false)
    },
    async getFinanceHeader(params) {
      try {
        const { results } = await fhGetFinanceHeader(params)
        this.header = results
      } catch (err) {
        console.log(err)
      }
    },
    async postWithdrew(params) {
      this.withdrewLoad = true
      try {
        const { results } = await fhPostWithdrew(params)
        this.withdrewList = results
      } catch (err) {
        console.log(err)
      }
      this.withdrewLoad = false
    },
    async getOnlineAmount() {
      this.amountLoad = true
      try {
        const { results } = await fhGetOnlineAmount()
        this.Amount = results
      } catch (err) {
        console.log(err)
      }
      this.amountLoad = false
    },
    async getProfitsharing(params) {
      params.shareStatus === 0
        ? (this.unSettleLoad = true)
        : (this.settleLoad = true)
      try {
        const { results, count } = await fhGetProfitsharing(params)
        if (params.shareStatus === 0) {
          this.Unsettled = results
        } else {
          this.settlement = results
          this.total = count
        }
      } catch (err) {
        console.log(err)
      }
      params.shareStatus === 0
        ? (this.unSettleLoad = false)
        : (this.settleLoad = false)
    },
    pagination(params) {
      params = Object.assign(params, {
        shareStatus: 1
      })
      this.getProfitsharing(params)
    },
    play() {
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.head {
  display: flex;
  .l {
    flex: 0.8;
    border-right: 0.5px solid #cccccc;
    padding: 10px 0;
    .lt {
      display: flex;
      .info {
        margin-left: 16px;
        padding-top: 8px;
        b {
          font-size: 18px;
        }
        p {
          margin-top: 9px;
          color: #999999;
        }
      }
    }
    .col {
      line-height: 32px;
      span {
        font-size: 16px;
      }
      b {
        font-size: 20px;
      }
    }
  }
  .r {
    flex: 1;
    padding: 10px 0 10px 50px;
    .rhead {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .record {
      margin-top: 20px;
      li {
        margin-bottom: 15px;
        span {
          font-size: 15px;
          margin-right: 55px;
        }
      }
    }
  }
}
</style>
