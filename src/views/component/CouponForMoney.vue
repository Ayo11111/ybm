<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-04 11:22:49
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-07 10:24:59
-->
<template>
  <div class="coupon">
    <div class="coupon-left">
      <div class="top">
        <span class="icon">￥</span>
        <span class="count">{{ coupon.value }}</span>
      </div>
      <div class="bot">
        <span v-if="coupon.noThreshold||coupon.threshold===0">
          直减
        </span>
        <span v-else> 满{{ coupon.threshold }}可用 </span>
      </div>
    </div>
    <div class="coupon-right">
      <div class="top">
        <span>{{ coupon.name }}</span>
      </div>
      <div class="bot">
        <span class="expired">有效期{{ coupon.validPeriod }}天</span>
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
  }

}
</script>

<style lang='scss' scoped>
.coupon {
  width: 330px;
  height: 86px;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  display: flex;
}
.coupon:after,
.coupon:before {
  content: '';
  position: absolute;
  display: block;
  width: 10px;
  height: 10px;
  z-index: 2;
  left: 75px;
  background: #fff;
  border-radius: 5px;
}
.coupon:after {
  bottom: -5px;
}
.coupon:before {
  top: -5px;
}
.coupon-left {
  text-align: center;
  width: 80px;
  height: 86px;
  color: #fff;
  background-image: linear-gradient(
    315deg,
    #ff8325 0%,
    #ffc156 60%,
    #ffe06d 100%
  );
  position: relative;
  .top {
    height: 53px;
    line-height: 53px;
    .icon {
    }
    .count {
      font-size: 28px;
    }
  }
  .bot {
    height: 33px;
  }
}
.coupon-left:after {
  content: '';
  position: absolute;
  top: 0;
  display: block;
  width: 4px;
  height: 100%;
  right: 0px;
  z-index: 1;
  background-position: 0px 0px;
  background-color: transparent;
  background-size: 4px 4px;
  background-image: radial-gradient(
    circle at right,
    #fff3ed 2px,
    transparent 0
  );
}
.coupon-right {
  background-color: #fff3ed;
  flex: 1;
  height: 86px;
  padding-left: 20px;
  .top {
    height: 53px;
    line-height: 53px;
    color: rgba(0, 0, 0, 0.8);
    font-size: 16px;
    font-weight: 580;
  }
  .bot {
    height: 33px;
    color: #999999;
  }
}
</style>
