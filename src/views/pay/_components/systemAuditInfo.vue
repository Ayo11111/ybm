<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-29 16:32:05
 * @LastEditors: HJ
 * @LastEditTime: 2021-06-30 11:30:30
-->
<template>
  <div class="system-audit-info flex">
    <div class="base-info">
      <div>
        <span>进件状态：</span>
        <span class="status">{{ statusText }}</span>
      </div>
      <div>
        <span>商户ID：</span>
        <span>{{ value.merchantId }}</span>
      </div>
      <div>
        <span>提交时间：</span>
        <span>{{ value.createTime }}</span>
      </div>
      <div v-show="value.applymentState === 'REJECTED'">
        <span>审核失败原因：</span>
        <span style="color: red">{{ value.rejectReason }}</span>
      </div>
    </div>
    <div>
      <el-button @click="refreshStatus">刷新状态</el-button>
    </div>
  </div>
</template>

<script>
import { statusEnum } from '../_utils/index'
export default {
  name: 'SystemAuditInfo',
  props: {
    refresh: {
      type: Function,
      default: () => {}
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    statusText() {
      return statusEnum[this.value.applymentState]
    }
  },
  methods: {
    refreshStatus() {
      this.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.system-audit-info {
  padding: 20px 24px;
  background: #f2f2f2;
  .base-info {
    flex: 1;
    .status {
      color: #f59a23;
      font-weight: 600;
      font-size: 16px;
    }
  }
}
</style>
