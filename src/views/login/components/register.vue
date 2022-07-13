<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-04 14:09:18
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-29 17:16:55
-->
<template>
  <div class="login-position _pa_center">
    <div class="login-box">
      <div class="login-header">
        <span class="title">账户注册</span>
        <el-link type="primary" :underline="false" @click="blackLogin">
          使用已有账户登录
        </el-link>
      </div>
      <el-form
        ref="loginForm"
        class="login-form"
        :model="loginForm"
        :rules="loginRules"
      >
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            @blur="checkAccountInfo"
            placeholder="请输入账号"
          >
            <template #prefix>
              <i class="el-icon-user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            type="password"
            placeholder="请输入登录密码"
            auto-complete="new-password"
          >
            <!-- @keyup.enter.native="handleLogin" -->
            <template #prefix>
              <i class="el-icon-lock" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="repeatPassword">
          <el-input
            v-model="loginForm.repeatPassword"
            show-password
            type="password"
            placeholder="请重复输入登录密码"
            auto-complete="new-password"
          >
            <!-- @keyup.enter.native="handleLogin" -->
            <template #prefix>
              <i class="el-icon-lock" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="loginForm.email" placeholder="请输入邮箱">
            <!-- @keyup.enter.native="handleLogin" -->
            <template #prefix>
              <i class="el-icon-message" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="loginForm.phone" placeholder="请输入手机号">
            <!-- @keyup.enter.native="handleLogin" -->
            <template #prefix>
              <i class="el-icon-phone-outline" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="verificationCode">
          <div class="codeBox" style="display: flex">
            <el-input
              style="flex: 1"
              v-model.number="loginForm.verificationCode"
              placeholder="请输入验证码"
            />
            <el-button
              type="default"
              size="large"
              style="margin-left: 10px"
              :loading="getCodeLoad"
              :disabled="timeCount !== '获取验证码'"
              @click="openCode"
            >
              {{ timeCount }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <a-button
        :loading="nextLoad"
        type="primary"
        class="login-btn"
        @click="setRegisterInfo"
      >
        注册
      </a-button>
    </div>
  </div>
</template>

<script>
import {
  fhGetPhoneCode,
  fhPostCheckInfoNext,
  fhGetCheckAccountInfo
} from '@/api/users'
export default {
  props: {
    managerAccount: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      const { phone } = this.loginForm
      const regular_str = /[a-z]/i
      if (phone) {
        let matching_str = phone.match(regular_str)
        if (phone.length === 11 && !matching_str) {
          callback()
        } else {
          callback(new Error('请输入正确的手机格式'))
        }
      } else {
        callback(new Error('请输入手机号'))
      }
    }
    var validatePass = (rule, value, callback) => {
      const { repeatPassword, password } = this.loginForm
      const regular_num = /[0-9]/
      const regular_str = /[a-z]/i
      if (repeatPassword) {
        let length = repeatPassword.length < 6 || repeatPassword.length > 16
        let matching_num = repeatPassword.match(regular_num)
        let matching_str = repeatPassword.match(regular_str)
        if (repeatPassword === password) {
          callback()
        } else {
          if (length || !matching_num || !matching_str) {
            callback(new Error('6-16位,必须包含数字和字母'))
          } else {
            callback(new Error('请输入一样的密码'))
          }
        }
      } else {
        callback(new Error('请输入密码'))
      }
    }
    var validatatePassword = (rule, value, callback) => {
      const { password } = this.loginForm
      const regular_num = /[0-9]/
      const regular_str = /[a-z]/i
      if (password) {
        let length = password.length < 6 || password.length > 16
        let matching_num = password.match(regular_num)
        let matching_str = password.match(regular_str)
        if (length || !matching_num || !matching_str) {
          callback(new Error('6-16位,必须包含数字和字母'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入密码'))
      }
    }

    var validateAccount = (rule, value, callback) => {
      const { account } = this.loginForm
      if (account) {
        if (account.length < 5 || account.length > 20) {
          callback(new Error('5-20位数字,字母或下划线'))
        } else {
          if (!this.accountCheck) {
            callback()
          } else {
            callback(new Error('账号已被注册'))
          }
        }
      } else {
        callback(new Error('请输入账号'))
      }
    }

    return {
      loginForm: {
        account: '',
        password: '',
        verificationCode: ''
      },
      nextLoad: false,
      loginRules: {
        account: [{ validator: validateAccount, trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        password: [{ validator: validatatePassword, trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        repeatPassword: [{ validator: validatePass, trigger: 'blur' }]
      },
      getCodeLoad: false,
      timeCount: '获取验证码',
      accountCheck: false
    }
  },
  watch: {
    managerAccount: {
      handler(newVal) {
        if (!newVal.managerAccount) {
          this.loginFrom = {}
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    window.reg = this
  },
  methods: {
    async postCheckInfoNext() {
      this.nextLoad = true
      try {
        const { results } = await fhPostCheckInfoNext(1, {
          managerAccount: { ...this.loginForm, webType: 'merchant' }
        })
        this.$emit('update:managerAccount', {
          id: results.id,
          managerAccount: { ...this.loginForm, webType: 'merchant' }
        })
        this.$parent.isRegister = true
      } catch (err) {
        console.log(err)
      }
      this.nextLoad = false
    },
    async openCode() {
      try {
        this.$refs.loginForm.validateField('phone', async valid => {
          if (!valid) {
            this.getPhoneCode()
          }
        })
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    checkAccountInfo() {
      if (this.loginForm.account) {
        this.getCheckAccountInfo(this.loginForm.account)
      }
    },
    async getCheckAccountInfo(account) {
      try {
        await fhGetCheckAccountInfo(account)
      } catch (err) {
        this.accountCheck = true
        console.log(err)
      }
      this.$refs.loginForm.validateField('account')
    },
    async getPhoneCode() {
      this.getCodeLoad = true
      try {
        await fhGetPhoneCode({
          mobile: this.loginForm.phone
        })
        this.getCodeLoad = false
        this.$message.success('验证码发送成功，请注意查收')
        this.timeNum = 60
        this.timeCount = '60s'
        this.timer = setInterval(() => {
          if (this.timeNum <= 0) {
            clearInterval(this.timer)
            this.timeNum = 60
            this.timeCount = '获取验证码'
            return
          }
          --this.timeNum
          this.timeCount =
            (this.timeNum.length < 2 ? '0' + this.timeNum : this.timeNum) + 's'
        }, 1000)
      } catch (err) {
        console.log(err)
      }
      this.getCodeLoad = false
    },
    blackLogin() {
      this.$parent.isLogin = true
    },
    setRegisterInfo() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.postCheckInfoNext()
          // this.$emit('update:managerAccount', {
          //   managerAccount: this.loginForm
          // })
          // this.$parent.isRegister = true
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
$main-color: #52acff;
.login-position {
  position: absolute;
  z-index: 99;
  width: 500px;
  //   min-height: 476px;
  border-radius: 10px;
  background: #fff;

  .login-box {
    padding: 35px;
    .login-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-size: 24px;
        color: $main-color;
      }
      .sign {
        display: flex;
        align-items: center;
      }
      .codeBox {
        display: flex;
        justify-items: flex-end;
      }
      .settle-in {
        $height: 7px;
        $width: 7px;
        position: relative;
        font-size: 16px;
        color: #bebebe;

        span {
          margin-right: $width + 8;
        }

        &::after {
          content: ' ';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          border: {
            top: $height solid transparent;
            bottom: $height solid transparent;
            left: $width solid #bebebe;
          }
        }
      }
    }

    .login-form {
      padding-top: 22px;
      &::v-deep .el-input__prefix {
        color: $main-color;
        line-height: 40px;
        height: 40px;

        i {
          font-size: 20px;
        }
      }

      &::v-deep .el-input__inner {
        border: none;
        border-bottom: 1px solid #eeeeee;
        line-height: 47px;
        height: 47px;
        padding-bottom: 22px;
      }

      &::v-deep .el-input--prefix {
        .el-input__inner {
          padding-left: 35px;
        }
      }
    }

    .login-btn {
      width: 100%;
      height: 50px;
    }

    .login-fn {
      display: flex;
      justify-content: space-between;
      color: $main-color;
      margin-bottom: 56px;

      &::v-deep .el-checkbox__label {
        color: $main-color;
      }
    }
  }
}
</style>
