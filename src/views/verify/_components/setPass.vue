<template>
  <a-modal
    title="修改密码"
    width="565px"
    :visible="visible"
    :confirm-loading="loading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <el-form ref="form" label-width="100px" :model="Json" :rules="rules">
      <el-form-item label="手机号:" prop="phone">
        <el-input v-model="Json['phone']" style="width: 220px" disabled />
      </el-form-item>
      <el-form-item label="新密码:" prop="password">
        <el-input v-model="Json['password']" style="width: 220px" />
      </el-form-item>
      <el-form-item label="验证码:" prop="verificationCode">
        <el-input
          v-model="Json['verificationCode']"
          style="width: 220px;margin-right: 15px"
        />
        <el-button
          type="primary"
          :loading="btnLoad"
          :disabled="disabled"
          @click="
            getPhoneCode({
              mobile: Json['phone']
            })
          "
        >获取验证码<span v-show="status">({{ second }}s)</span></el-button>
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script>
import { fhGetPhoneCode } from '@/api/users'
import { fhPutPassWord } from '@/api/merchant'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    phone: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      second: 60,
      status: false,
      ti: null,
      disabled: false,
      loading: false,
      Json: {
        phone: null,
        password: null,
        verificationCode: null
      },
      rules: {
        phone: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        password: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        verificationCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      btnLoad: false
    }
  },
  watch: {
    phone(newVal) {
      this.Json['phone'] = newVal
      this.$forceUpdate()
    }
  },
  methods: {
    async getPhoneCode(params) {
      this.btnLoad = true
      if (!params.mobile) {
        this.btnLoad = false
        this.$message.error('请输入手机号')
        return false
      }
      try {
        const { success } = await fhGetPhoneCode(params)
        if (success) {
          this.$message.success('验证码已发送')
          this.getCode(60)
        }
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    async putPassWord(params) {
      this.loading = true
      try {
        const { success } = await fhPutPassWord(params)
        if (success) {
          this.$emit('update:visible', false)
          this.Json = {}
          this.$emit('getMerchantDetail')
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.putPassWord(this.Json)
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
      localStorage.setItem('code', sum)
      this.ti = setInterval(() => {
        if (this.second <= 0) {
          clearInterval(this.ti)
          this.status = false
          this.disabled = false
          localStorage.removeItem('code', sum)
        } else {
          this.second -= 1
          localStorage.setItem('code', this.second)
        }
      }, 1000)
    }
  }
}
</script>

<style></style>
