<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-24 14:31:10
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-24 18:29:34
-->
<template>
  <el-dialog
    append-to-body
    title="拒绝理由"
    :visible="show"
    width="40%"
    :before-close="handleClose"
  >
    <el-input
      v-model="textarea"
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 4 }"
      placeholder="请输入拒绝理由"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        type="primary"
        :loading="verifyLoad"
        @click="verifyRefundOrder"
      >
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fhVerifyRefundOrder, fhPutNurseRefundAudit } from '@/api/orders'
import { getUserInfo } from '@/utils/auth'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      textarea: '',
      show: false,
      verifyLoad: false
    }
  },
  watch: {
    visible(v) {
      this.show = v
    }
  },
  methods: {
    handleClose() {
      this.textarea = ''
      this.$emit('update:visible', false)
    },
    // 退款订单审核
    async verifyRefundOrder() {
      this.verifyLoad = true
      try {
        const { backUserId } = await getUserInfo()
        const params = {
          managerId: backUserId,
          isPass: false,
          reason: this.textarea
        }
        if (['retail', 'restaurant'].includes(this.$parent.type)) {
          await fhVerifyRefundOrder(this.orderId, params)
        } else {
          await fhPutNurseRefundAudit(this.orderId, params)
        }
        this.$message.success('审核成功')
        this.$parent.updateList()
        this.handleClose()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.verifyLoad = false
    }
  }
}
</script>

<style></style>
