<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-09 16:44:15
 * @LastEditors: DXY
 * @LastEditTime: 2020-10-23 17:14:15
-->
<template>
  <div>
    <div v-loading="loadingSta" class="wrap content top">
      <div class="status">
        支付申请状态：<span class="note" :class="StatusClass">
          {{ results === null ? '待申请' : results.applymentStateDesc }}&nbsp;&nbsp;

          <el-button type="text" style="font-size:24px;vertical-align:middle" circle @click="refresh">
            <a-icon type="sync" :spin="loadingSta" />
          </el-button>
        </span>
      </div>
      <div v-if="results !== null" class="detail">
        <el-row v-if="results.rejectReason">
          <el-col>
            <span class="label">失败原因:</span><span>{{ results.rejectReason }}</span>
          </el-col>
        </el-row>
        <!-- 验证信息 -->
        <div v-if="results.accountValidation" class="validation" style="text-align:left">
          <div class="use_title ">
            请使用申请单中的银行账户往以下账户汇款以完成验证
          </div>
          <div class="account_detail">
            <el-row>
              <el-col v-if="false" :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">付款户名:</span><span>{{ results.accountValidation.accountName }}</span>
              </el-col>
              <el-col
                v-if="results.accountValidation.accountNo"
                :xs="24"
                :sm="12"
                :md="12"
                :lg="8"
                :xl="8"
              >
                <span v-if="false" class="label">付款卡号:</span><span>{{ results.accountValidation.accountNo }}</span>
              </el-col>

              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">收款卡号:</span><span>{{
                  results.accountValidation.destinationAccountNumber
                }}</span>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">收款户名:</span><span>{{
                  results.accountValidation.destinationAccountName
                }}</span>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">开户银行:</span><span>{{ results.accountValidation.destinationAccountBank }}
                </span>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">汇款金额:</span><span>{{ results.accountValidation.payAmount }} 元</span>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">省市信息:</span><span>{{ results.accountValidation.city }} </span>
              </el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">备注信息:</span><span>{{ results.accountValidation.remark }} </span></el-col>
              <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8">
                <span class="label">汇款截止时间:</span><span>{{ results.accountValidation.deadline }} </span></el-col>
            </el-row>
          </div>
        </div>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="7">
            <div v-if="results.signUrl" class="sign">
              <div class="use_title">
                请使用超级管理者的微信扫码打开，完成签约
              </div>
              <div id="sign_code" class="code" />
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="7">
            <div v-if="results.legalValidationUrl" class="sign">
              <div class="use_title">
                请使用商户法人的微信扫码打开，完成账户验证
              </div>
              <div id="validate_url_code" class="code" />
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <span class="label">申请编号:</span><span>{{ results.applydata.outRequestNo }}</span>
          </el-col>
          <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="8">
            <span class="label">申请提交时间:</span>
            <span>{{ results.createTime }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div>
      <div v-if="noyet" v-loading="loadingSta" class="content bot">
        <Card />
      </div>
      <div v-else v-loading="loadingSta" style="margin:0">
        <Apply
          :applydata="applydata"
          :disabled-form="disabledForm"
          @post="afterPost"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Card from './_components/card'
import { fhGetApplyments } from '@/api/finance/index.js'
import Apply from './apply'
import QRCode from 'qrcode2'

export default {
  components: {
    Card,
    Apply
  },
  data() {
    return {
      disabledForm: false,
      loadingSta: true,
      results: null,
      noyet: true,
      applydata: null,
      signCode: '',
      validateCode: ''
    }
  },
  computed: {
    StatusClass() {
      return this.results && this.results.applymentState.toLowerCase()
    }
  },
  created() {
    this.get()
  },
  mounted() {
    window.app = this
  },

  methods: {
    refresh() {
      this.get()
    },
    async get() {
      this.results = null
      try {
        this.loadingSta = true
        const { results } = await fhGetApplyments()
        this.results = results
        this.noyet = results === null
        if (this.noyet) return
        this.applydata = results.applydata
        // results.accountValidation = { name: '123' }
        if (results.applymentState === '1') {
          this.$store.commit('binary/setShowTips', false)
        }
        this.disabledForm =
          results.applymentState === 'FINISHED' ||
          results.applymentState === 'FROZEN' ||
          results.applymentState === 'AUDITING' ||
          results.applymentState === 'CHECKING'
        // this.results.signUrl = 'https://pay.weixin.qq.com/public/apply4ec_sign/s?applymentId=2000002126198476&sign=b207b673049a32c858f3aabd7d27c7ec'
        // this.results.legalValidationUrl = 'https://pay.weixin.qq.com/public/apply4ec_sign/s?applymentId=2000002126198476&sign=b207b673049a32c858f3aabd7d27c7ec'
        this.$nextTick(() => {
          // 签约二维码
          if (results.signUrl) {
            this.qrcodeScan('sign_code', 200, 200, results.signUrl)
          }
          // 待验证二维码
          if (results.legalValidationUrl) {
            this.qrcodeScan('validate_url_code', 200, 200, results.legalValidationUrl)
          }
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loadingSta = false
      }
    },
    afterPost(status) {
      if (status === 'success') {
        this.get()
      }
    },
    // 二维码生成
    qrcodeScan(element, width = 200, height = 200, url) {
      return new QRCode(document.getElementById(element), {
        text: url, // 二维码地址
        width, // 二维码宽度
        height, // 二维码高度
        correctLevel: QRCode.CorrectLevel.H // 二维码容错级别 H M L
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  margin: 34px;
}

.content {
  padding: 24px 34px;
  border-radius: 6px;
  background: #fff;

  .detail {
    .el-row {
      line-height: 34px;
    }
  }
}

.top {
  margin-bottom: 34px;
  .status {
    line-height: 50px;
    font-size: 18px;
    font-weight: 700;
  }
}
.bot {
  padding: 24px 34px;
  margin: 34px;
}
.rejected {
  color: #ff0000;
}
.finished,
.checking {
  color: #00c250;
}
.auditing,
.account_need_verify,
.need_sign {
  color: #52ACFF;
}
.label {
  margin-right: 10px;
  font-weight: 550;
}
.validation,
.sign {
  text-align: center;
  margin-bottom: 10px;
  padding: 10px 24px 20px;
  background: #f3f3f3;
  border-radius: 8px;
  .use_title {
    line-height: 40px;
    font-weight: 700;
    font-size: 16px;
  }
  .el-row {
    line-height: 24px;
  }
}
#sign_code,
#validate_url_code {
  padding: 10px;
  border: 1px solid #333;
  display: inline-table;
}
</style>
