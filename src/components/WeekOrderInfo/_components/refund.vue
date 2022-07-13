<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-10 14:34:23
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-09 12:09:17
-->
<template>
  <el-dialog
    append-to-body
    title="退款"
    :visible="visible"
    width="40%"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="Json" :rules="rules">
      <el-form-item
        label="订单金额"
        prop="totalPrice"
        style="margin-bottom: 10px"
      >
        ￥{{ value.totalPrice }}
      </el-form-item>
      <el-form-item
        label="退款类型"
        prop="refundPrice"
        style="display: flex; margin-bottom: 10px"
      >
        <a-radio-group v-model="refundType">
          <a-radio :style="radioStyle" :value="1"> 全部退款 </a-radio>
          <!-- <a-radio :style="radioStyle" :value="2" v-if="!value.refundPrice">
            部分退款
            <el-input-number
              :disabled="refundType !== 2"
              v-model.number="Json.refundPrice"
              :max="value.totalPrice"
              :controls="false"
              clearable
              :min="0.01"
              placeholder="请输入退款金额"
              style="width: 150px; margin-left: 10px"
              type="number"
            />
          </a-radio> -->
        </a-radio-group>
      </el-form-item>
      <el-form-item label="退款理由" prop="reason">
        <el-input
          v-model="Json.reason"
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4 }"
          placeholder="请输入退款原因"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="loading" @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="ok">
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
    loading: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    visible(newVal) {
      this.Json = {}
      this.refundType = 1
    }
  },
  data() {
    var validatePrice = (rule, value, callback) => {
      if (this.refundType === 2 && !this.Json.refundPrice) {
        callback(new Error('请输入退款金额'))
      } else {
        callback()
      }
    }
    return {
      Json: {},
      rules: {
        refundPrice: [{ validator: validatePrice, trigger: 'change' }],
        reason: [{ required: true, message: '请输入退款原因', trigger: 'blur' }]
      },
      refundType: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
    },
    ok() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.refundType === 2) {
            this.$emit('putRefundPartial', this.Json)
          } else {
            if (['retail', 'restaurant'].includes(this.$parent.type)) {
              this.$emit('cancelOerder', {
                reason: this.Json.reason
              })
            } else {
              this.$emit('putNurseDirectRefund', {
                reason: this.Json.reason
              })
            }
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style></style>
