<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-26 09:33:04
 * @LastEditors: DXY
 * @LastEditTime: 2020-10-26 11:06:59
-->
<template>
  <div v-loading="loading" class="container" style="min-height: 0">
    <b style="font-size: 16px">基本信息</b>
    <span
      v-if="Json === null"
      class="info"
    >支付信息还没设置，<router-link
      class="go"
      :to="{ name: 'paySetting' }"
    >请前往设置</router-link></span>
    <el-form
      label-position="left"
      label-width="90px"
      :model="Json"
      style="margin-top: 20px"
    >
      <el-form-item label="结算周期" style="margin-bottom: 12px">
        <!-- 1天周期结算 -->
        {{ (Json && Json.billingCycle) || '---' }}
      </el-form-item>
      <el-form-item label="银行卡号" style="margin-bottom: 12px">
        {{ (Json && Json.accountNumber) || '---' }}
      </el-form-item>
      <el-form-item label="开户行" style="margin-bottom: 12px">
        {{ (Json && Json.accountBank) || '---' }}
      </el-form-item>
      <el-form-item label="户名" style="margin-bottom: 12px">
        {{ (Json && Json.accountName) || '---' }}
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fhGetAccountInfo } from '@/api/finance'
export default {
  data() {
    return {
      labelPosition: 'right',
      Json: {},
      loading: false
    }
  },
  created() {
    this.getAccountInfo()
    window.app = this
  },
  methods: {
    async getAccountInfo() {
      try {
        const { results } = await fhGetAccountInfo()
        this.Json = results
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  &::v-deep .el-form-item__label {
    color: #999999;
  }
  .info {
    color: #999;
    margin-left: 24px;
    font-size: 14px;
    font-weight: 600;
    .go {
      color: #52ACFF;
    }
  }
}
</style>
