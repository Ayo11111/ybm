<template>
  <div class="quan">
    <div class="quanBox">
      <div class="left">
        <div style="color: #FF9933">
          <template v-if="couponType === 'MJQ'">
            <span>¥ </span>
            <span style="font-size: 30px">{{ reductionAmount }}</span>
          </template>
          <template v-if="couponType === 'ZKQ'">
            <span>折 </span>
            <span style="font-size: 30px">{{ discountValue }}</span>
          </template>
        </div>
        <small v-if="!thresholdStatus">无门槛</small>
        <small v-else>满{{ priceThreshold }}可用</small>
      </div>
      <div class="right">
        <span class="name">{{ name }}</span>
        <span v-if="validDay">有效期 {{ validDay }} 天</span>
        <span v-else style="font-size: 12px">
          有效期 {{ startTime || '' }} -
          {{ endTime || '' }}</span>
      </div>
      <div class="mask top" />
      <div class="mask bottom" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    thresholdStatus: {
      type: Boolean,
      default() {}
    },
    couponType: {
      type: String,
      default: null
    },
    validDay: {
      type: Number,
      default: null
    },
    priceThreshold: {
      type: Number,
      default: null
    },
    reductionAmount: {
      type: Number,
      default: null
    },
    discountValue: {
      type: [Number, String],
      default: null
    },
    startTime: {
      type: String,
      default: null
    },
    endTime: {
      type: String,
      default: null
    }
  }
}
</script>

<style scoped lang="scss">
.quan {
  width: 520px;
  height: 180px;
  background: #f7faf8;
  display: flex;
  align-items: center;
  justify-content: center;
}
.quanBox {
  width: 435px;
  height: 110px;
  background: white;
  display: flex;
  position: relative;
}
.left {
  flex: 0.8;
  border-right: 1px dashed #cccccc;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
}
.right {
  flex: 1;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  .name{
    font-weight: 600;
    font-size:16px
  }
}
.mask {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f7faf8;
  position: absolute;
  left: 39.5%;
}
.top {
  top: -10px;
}
.bottom {
  bottom: -10px;
}
</style>
