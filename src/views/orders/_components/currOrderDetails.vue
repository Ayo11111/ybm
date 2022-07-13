<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-09 17:26:35
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-09 12:10:36
-->
<template>
  <el-dialog
    title="订单跟踪"
    :visible.sync="visible"
    width="40%"
    :show-close="false"
    center
  >
    <div class="box" v-loading="loading">
      <div class="item" v-for="item in list" :key="item.id">
        <span>{{ item.progressName }}</span>
        <span>{{ item.operationTime }}</span>
      </div>
      <!-- <div class="item">
        <span>订单已提交</span>
        <span>4月2日 11:49:00</span>
      </div>
      <div class="item">
        <span>订单已提交</span>
        <span>4月2日 11:49:00</span>
      </div> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="$emit('update:visible', false)">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { orderStatusMap } from '../_utils'
import {
  fhGetOrdersStatusProgress,
  fhGetNurseOrdersStatusProgress
} from '@/api/orders'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: [Number, String],
      default: null
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      orderStatusMap,
      list: [],
      loading: false
    }
  },
  watch: {
    orderId(newVal) {
      if (['retail', 'restaurant'].includes(this.type)) {
        this.getOrdersStatusProgress(newVal)
      } else {
        this.getNurseOrdersStatusProgress(newVal)
      }
    }
  },
  methods: {
    async getOrdersStatusProgress(id) {
      this.loading = true
      try {
        const { results } = await fhGetOrdersStatusProgress(id)
        this.list = results
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async getNurseOrdersStatusProgress(id) {
      this.loading = true
      try {
        const { results } = await fhGetNurseOrdersStatusProgress(id)
        this.list = results
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-flow: column;
  .item {
    display: flex;
    justify-content: space-around;
    margin-bottom: 25px;
  }
}
</style>
