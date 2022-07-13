<template>
  <a-modal
    title="余额提现"
    width="600px"
    :visible="visible"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <el-form ref="form" label-width="100px" :model="Json" :rules="rules">
      <el-form-item label="可提现余额:">
        {{ money }}
      </el-form-item>
      <a-divider dashed />
      <el-form-item label="提现金额:" prop="amount">
        <el-input
          style="width: 230px"
          type="number"
          v-model="Json['amount']"
        ></el-input>
      </el-form-item>
      <el-form-item label="验证码:" prop="code" style="margin-bottom: 6px">
        <el-input
          style="width: 230px;margin-right: 16px"
          v-model="Json['code']"
        ></el-input>
        <el-button
          type="primary"
          @click="getCaptcha"
          :loading="btnLoad"
          :disabled="disabled"
          >获取验证码<span v-show="status">({{ second }}s)</span></el-button
        >
        <br />
      </el-form-item>
      <el-form-item label="">
        <span
          style="color: #999999;font-size: 13px;display: block;margin-top: 5px"
          >将会向商家登录账号（手机号尾号{{ tail }}）发送验证码</span
        >
      </el-form-item>
      <!-- <span style="color: #999999;font-size: 13px;display: block;margin-top: 5px">将会向商家登录账号（手机号尾号1111）发送验证码</span> -->
    </el-form>
  </a-modal>
</template>

<script>
import { fhPostObtain, fhGetCaptcha } from '@/api/finance'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    money: {
      type: Number,
      default: null
    },
    tail: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    // var validateMoney = (rule, value, callback) => {
    //     if (this.Json['money'].length === 0 || !this.Json['money']) {
    //       callback(new Error('请输入提现金额'));
    //     } else {
    //       callback()
    //     }
    //   }
    return {
      Json: {
        amount: null,
        code: null
      },
      second: 60,
      status: false,
      ti: null,
      disabled: false,
      rules: {
        amount: [
          { required: true, message: '请输入提现金额', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      btnLoad: false
    }
  },
  created() {
    if (localStorage.getItem('second')) {
      this.getCode(localStorage.getItem('second'))
    }
  },
  methods: {
    async postObtain(params) {
      this.loading = true
      try {
        const { success } = await fhPostObtain(params)
        if (success) {
          this.$message.success('提现成功')
          this.Json = {}
          this.$emit('getOnlineAmount')
          this.$emit('postWithdrew', {
            pageNumber: 1,
            pageSize: 4
          })
          this.$emit('update:visible', false)
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async getCaptcha() {
      this.btnLoad = true
      try {
        const { success } = await fhGetCaptcha()
        if (success) {
          this.$message.success('验证码已发送')
          this.getCode(60)
        }
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.postObtain(this.Json)
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('update:visible', false)
    },
    getCode(sum) {
      this.status = true
      this.disabled = true
      this.second = sum
      localStorage.setItem('second', sum)
      this.ti = setInterval(() => {
        if (this.second <= 0) {
          clearInterval(this.ti)
          this.status = false
          this.disabled = false
          localStorage.removeItem('second', sum)
        } else {
          this.second -= 1
          localStorage.setItem('second', this.second)
        }
      }, 1000)
    }
  }
}
</script>

<style></style>
