<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-26 14:29:32
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-26 15:06:53
-->
<template>
  <div class="container" v-loading="loading">
    <b>账户信息</b>
    <div class="info">
      如有疑问请联系区域经理，电话13599990000
    </div>
    <el-form style="margin-top: 5px;">
      <el-form-item label="账户名称">
        <span>{{ info.accountName }}</span>
      </el-form-item>
      <el-form-item label="结算类型">
        <span>周期结算</span>
      </el-form-item>
      <el-form-item label="结算周期">
        <span v-show="info.billingCycle">{{ info.billingCycle }}天</span>
      </el-form-item>
      <!-- <el-form-item label="支付手续费">
        <span>0.6%</span>
      </el-form-item> -->
      <el-form-item label="平台服务费">
        <span v-show="info.servicePercentage">{{ info.servicePercentage }}%</span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { fhGetAccountInfo } from '@/api/finance'
export default {
  data() {
    return {
      loading: false,
      info: {}
    }
  },
  created() {
    this.getAccountInfo()
  },
  methods: {
    async getAccountInfo() {
      this.loading = true
      try {
        const { results } = await fhGetAccountInfo()
        this.info = results
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0;
}
.info {
  padding: 10px;
  background: #f2f2f2;
  margin: 15px 0 20px 0;
}
</style>
