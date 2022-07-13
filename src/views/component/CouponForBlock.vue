<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-08 16:24:27
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-08 16:32:49
-->
<template>
  <div class="wrap">
    <div class="coupon">
      <div class="coupon-left">
        <div class="top">
          <span class="icon">￥</span>
          <span class="count">{{ coupon.value }}</span>
        </div>
        <div class="bot">
          <span v-if="coupon.noThreshold||coupon.threshold===0">
            单品券
          </span>
          <span v-else> 满{{ coupon.threshold }}可用 </span>
        </div>
      </div>
      <div class="coupon-con">
        <div class="top">
          <span>{{ coupon.name }}</span>
        </div>
        <div class="bot">
          <span class="expired">有效期{{ coupon.validPeriod }}天</span>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    coupon: {
      type: Object,
      default: () => {
        return { value: '',
          noThreshold: '',
          threshold: '',
          name: '',
          validPeriod: '' }
      }
    }
  },
  data() {
    return {
    }
  },

  mounted() {
    window.app = this
  },

  methods: {
  }

}
</script>

<style lang='scss' scoped>
.wrap{
  width:420px
}
.coupon{
  display:inline-block;
  overflow:hidden;
  border-radius:10px;
}
.coupon-left{
  float:left;
  width:120px;
  height:120px;
  position:relative;
}
.coupon-left::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right:0;
  height:50%;
  background:radial-gradient(circle at right top, transparent 10px, #fff 10px, #fff 10px)
}
.coupon-left::after{
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right:0;
  height:50%;
  background:radial-gradient(circle at right bottom, transparent 10px, #fff 10px, #fff 10px)
}
.coupon-con{
  float:left;
  width:300px;
  height:120px;
  position:relative;
}
.coupon-con::before{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right:0;
  height:50%;
  background:radial-gradient(circle at left top, transparent 10px, #252525 10px, #fff 10px)
}
.coupon-con::after{
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right:0;
  height:50%;
  background:radial-gradient(circle at left bottom, transparent 10px, #252525 10px, #fff 10px)
}
</style>
