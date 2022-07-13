<template>
  <div>
    <div v-loading="amountLoad" class="container" style="min-height: 0">
      <div class="l">
        <div class="lt">
          <el-avatar
            shape="square"
            :size="72"
            :src="Amount.merchantLogo"
          />
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
        <div style="flex: 1;margin-left: 80px;margin-top: 5px">
          <el-row>
            <el-col class="col" :span="6">
              <span>账户余额</span> <br>
              <b>¥ {{ Amount.totalAmount }}</b>
            </el-col>
            <el-col class="col" :span="12">
              <span>可提现余额</span> <br>
              <b>¥ {{ Amount.availableAmount }}</b>
              <el-button
                type="primary"
                :disabled="Amount.availableAmount === 0"
                style="margin-left: 35px"
                @click="play"
              >提现</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div class="container">
      <b style="font-size: 20px">余额提现记录</b>
      <div class="date">
        <el-radio-group v-model="day" @change="getDay">
          <el-radio-button label="0">今天</el-radio-button>
          <el-radio-button label="1">近7天</el-radio-button>
          <el-radio-button label="2">近30天</el-radio-button>
          <el-radio-button label="3">自定义</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-show="day === '3' ? true : false"
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="margin-left: 16px"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getDate"
        />
      </div>
      <Table
        style="margin-top: 25px"
        :data="withdrew"
        :loading="withdrewLoad"
      />
      <Pagination :total="total" @pagination="pagination" />
    </div>
    <Withdrawal :money.sync="Amount.availableAmount" :tail.sync="Amount.phoneEnd" :visible.sync="visible" @getOnlineAmount="getOnlineAmount" />
  </div>
</template>

<script>
import { fhGetOnlineAmount, fhPostWithdrew } from '@/api/finance'
import Pagination from '@/components/Pagination'
import Withdrawal from './_components/Withdrawal'
import Table from './_components/recordTable'
export default {
  components: {
    Table,
    Pagination,
    Withdrawal
  },
  data() {
    return {
      day: 0,
      date: null,
      withdrew: [{}],
      Amount: {},
      amountLoad: false,
      withdrewLoad: false,
      total: 0,
      Json: {
        startTime: this.$moment(new Date()).format('YYYY-MM-DD'),
        endTime: this.$moment(new Date()).format('YYYY-MM-DD')
      },
      visible: false
    }
  },
  created() {
    this.getOnlineAmount()
    this.postWithdrew(this.Json)
  },
  methods: {
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
    async postWithdrew(params) {
      this.withdrewLoad = true
      try {
        const { results, count } = await fhPostWithdrew(params)
        results.forEach(item => {
          item.date = item.createTime.split(' ')[0]
        })
        this.withdrew = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
      this.withdrewLoad = false
    },
    getDay(val) {
      if (val !== '3') {
        switch (val) {
          case '0':
            this.Json['startTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
            this.Json['endTime'] = this.$moment(new Date()).format('YYYY-MM-DD')
            break
          case '1':
            this.Json['startTime'] = this.$moment()
              .subtract('days', 7)
              .format('YYYY-MM-DD')
            this.Json['endTime'] = this.$moment()
              .subtract('days', 1)
              .format('YYYY-MM-DD')
            break
          case '2':
            this.Json['startTime'] = this.$moment()
              .subtract('days', 30)
              .format('YYYY-MM-DD')
            this.Json['endTime'] = this.$moment()
              .subtract('days', 1)
              .format('YYYY-MM-DD')
            break
        }
        this.postWithdrew(this.Json)
      }
    },
    getDate(val) {
      if (val !== null) {
        this.Json['startTime'] = val[0]
        this.Json['endTime'] = val[1]
      } else {
        this.Json['startTime'] = null
        this.Json['endTime'] = null
      }
      this.postWithdrew(this.Json)
    },
    pagination(params) {
      params = Object.assign(params, this.Json)
      this.postWithdrew(this.Json)
    },
    play() {
      this.visible = true
    }
  }
}
</script>

<style scoped lang="scss">
.l {
  padding: 10px 0;
  display: flex;
  .lt {
    display: flex;
    .info {
      margin-left: 16px;
      padding-top: 8px;
      b {
        font-size: 18px;
      }
      p {
        margin-top: 10px;
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
      font-size: 22px;
    }
  }
}
.date {
  margin-top: 20px;
  display: flex;
  align-items: center;
}
</style>
