<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-03-03 09:36:50
 * @LastEditors: CJH
 * @LastEditTime: 2021-03-03 18:21:40
-->
<template>
  <div class="info">
    <div class="summary">分众助力引流，推荐爆品进行社群营销</div>
    <a-divider dashed />
    <div class="main">
      <div class="title">活动开启时间</div>
      <div class="date">
        <span class="label">活动周期:</span>
        <span class="option">{{ weekList }}</span>
      </div>
      <div class="time">
        <span class="label">活动时段:</span>
        <span class="option">{{ timeList }}</span>
      </div>
      <div class="time">
        <span class="label">参与店铺:</span>
        <span class="option">{{ storeList }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      weekList: '',
      timeList: '',
      storeList: ''
    }
  },
  created() {
  },
  mounted() {
    window.info = this
  },

  methods: {
  }
}
</script>

<style lang="scss" scoped>
.info {
  background: #fff;
  padding: 24px 34px;
  border-radius: 6px;
}
.summary {
  color: #999;
}

.main {
  .title {
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 20px;
    color: #333333;
  }
  .date,
  .time {
    line-height: 38px;
    font-weight: 400;
    font-size: 14px;
    .label {
      color: #272727;
      margin-right: 16px;
    }
    .option {
      color: #5a5a5a;
    }
  }
}
</style>
