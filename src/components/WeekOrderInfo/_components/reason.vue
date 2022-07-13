<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-24 14:31:10
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-09 12:09:10
-->
<template>
  <el-dialog
    append-to-body
    title="取消原因"
    :visible="visible"
    width="40%"
    :before-close="handleClose"
  >
    <el-input
      v-model="textarea"
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 4 }"
      placeholder="请输入取消原因"
    />
    <span slot="footer" class="dialog-footer">
      <el-button :loading="verifyLoad" @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="verifyLoad" @click="ok">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    verifyLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textarea: ''
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    ok() {
      if (this.textarea) {
        if (['retail', 'restaurant'].includes(this.$parent.type)) {
          this.$emit('cancelOerder', {
            reason: this.textarea
          })
        } else {
          this.$emit('putNurseDirectRefund', {
            reason: this.textarea
          })
        }
      } else {
        this.$message.error('取消原因不能为空')
      }
    }
  }
}
</script>

<style></style>
