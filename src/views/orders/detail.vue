<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-22 15:30:09
 * @LastEditors: HJ
 * @LastEditTime: 2020-07-22 16:08:43
-->
<template>
  <div class="container">
    <div class="base-box">
      <svg-icon icon-class="letter" class-name="svg-letter" />
      <span class="order-box">订单号：{{ detail.orderId }}</span>
    </div>
  </div>
</template>

<script>
import { forRender } from '@/utils'
import { fhGetOrderDetail } from '@/api/orders'
export default {
  name: 'OrderDetail',
  data() {
    return {
      detail: {}
    }
  },
  mounted() {
    const {
      params: { orderId }
    } = this.$route
    if (orderId) this.getOrderDetail(orderId)
    else {
      this.$message.error('没有找到订单号')
      this.$router.go(-1)
    }
  },
  methods: {
    forRender,
    async getOrderDetail(id) {
      try {
        const { results } = await fhGetOrderDetail(id)
        this.detail = results
      } catch (e) {
        console.log('debug', e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  background: transparent;
}

.svg-letter {
  font-size: 36px;
}

.order-box {
  vertical-align: middle;
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
}
</style>
