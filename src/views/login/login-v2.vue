<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-27 17:59:00
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-01-11 17:57:29
-->
<template>
  <div class="outer" :style="{ backgroundImage: 'url(' + imgBg + ')' }">
    <img class="imgWrapper" src="@/assets/logo.png">
    <span class="plat-name">医便民-店铺端</span>
    <div v-show="isLogin && !isForget" class="login-position _pa_center">
      <div class="login-box">
        <div class="login-header">
          <span class="title">登录</span>
          <div class="settle-in _pointer" @click="changeIsLogin(false)">
            <span>店铺入驻</span>
          </div>
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
              placeholder="请输入账号"
              @keyup.enter.native="handleLogin"
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
              @keyup.enter.native="handleLogin"
            >
              <template #prefix>
                <i class="el-icon-lock" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captchaCode">
            <el-row>
              <el-col :span="18">
                <el-input
                  v-model="loginForm.captchaCode"
                  placeholder="请输入图形验证码"
                  @keyup.enter.native="handleLogin"
                />
              </el-col>
              <el-col v-loading="codeImgLoad" :span="6">
                <img
                  alt=""
                  style="margin-left: 15px"
                  :src="codeImg"
                  @click="getCodeImgData"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <div class="login-fn">
          <el-checkbox v-model="isRemember" :label="1">
            记住用户名
          </el-checkbox>
          <span class="_pointer" @click="forget">忘记密码？</span>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          class="login-btn"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </div>
    </div>
    <Register
      v-if="!isLogin && !isRegister"
      :managerAccount.sync="managerAccount"
    />
    <RegisterInfo
      v-if="isRegister"
      :managerAccount="managerAccount"
      :accountId.sync="backUserId"
    />
    <Forget v-if="isForget"></Forget>
  </div>
</template>

<script>
import { setRemember, getRemember, getAccount } from '@/utils/auth'
import { fhGetCodeImg } from '@/api/users'
import { fhGetPhoneCode } from '@/api/users'
import { fhPutPassWord } from '@/api/merchant'
import Register from './components/register'
import RegisterInfo from './components/registerInfo'
import Forget from './components/forget.vue'
const imgBg = require('@/assets/bg.png')
export default {
  name: 'Login',
  components: { Register, RegisterInfo, Forget },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      loginForm: {
        account: '',
        password: '',
        captchaCode: ''
      },
      backUserId: null,
      managerAccount: {},
      loginRules: {
        account: [
          { required: true, trigger: 'change', message: '请输入账户名' }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        captchaCode: [
          { required: true, trigger: 'blur', message: '请输入图形验证码' }
        ]
      },
      forgetForm: {
        phone: null,
        password: '',
        verificationCode: null
      },
      forgetRules: {
        phone: [{ required: true, trigger: 'change', message: '请输入手机号' }],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ],
        verificationCode: [
          { required: true, trigger: 'blur', message: '请输入验证码' }
        ]
      },
      // 图形验证码
      codeImg: '',
      codeImgLoad: false,
      // 背景图片
      imgBg,
      // 是否登录页面
      isLogin: true,
      isRegister: false,
      // 是否记住账号
      isRemember: false,
      isForget: false,
      btnLoad: false,
      disabled: false,
      status: false,
      second: 60,
      putLoad: false
    }
  },
  async created() {
    this.isRemember = await getRemember()
    // eslint-disable-next-line space-before-function-paren
    this.$nextTick(async () => {
      this.isRemember = !!this.isRemember
      if (this.isRemember) {
        this.loginForm.account = await getAccount()
      }
    })
  },
  mounted() {
    window.login = this
    this.getCodeImgData()
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.uuid = this.$store.state.user.uuid
          this.loginForm.webType = 'merchant'
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(async res => {
              if (res.code === 3032) {
                this.getCodeImgData()
                this.$message.error('图形验证码错误，请重试')
              } else if (res.code === 2005) {
                this.isLogin = false
                this.isRegister = true
                this.backUserId = res.backUserId
              } else {
                await setRemember(this.isRemember ? 1 : '')
                window.location.reload()
              }
              this.loading = false
            })
            .catch(err => {
              this.loading = false
              console.log(err)
              setTimeout(() => {
                this.getCodeImgData()
              }, 400)
            })
        } else {
          console.log('请检查输入')
          return false
        }
      })
    },
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
          this.getCode(60, 'forget')
        }
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    async putPassWord(params) {
      this.putLoad = true
      try {
        const { success } = await fhPutPassWord(params)
        if (success) {
          this.forgetForm = {}
          this.isForget = false
          this.$message.success('修改成功')
        }
      } catch (err) {
        console.log(err)
      }
      this.putLoad = false
    },
    handleOk() {
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          this.putPassWord(this.forgetForm)
        } else {
          return false
        }
      })
    },
    goLogin() {
      this.isForget = false
    },
    changeIsLogin(type) {
      this.isLogin = type
    },
    forget() {
      this.isForget = true
    },
    // 获取图形验证码
    async getCodeImgData() {
      this.codeImgLoad = true
      try {
        const results = await fhGetCodeImg()
        const url =
          'data:image/png;base64,' +
          btoa(
            new Uint8Array(results).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ''
            )
          )
        this.codeImg = url
        this.codeImgLoad = false
      } catch (e) {
        console.log(e)
      }
      this.codeImgLoad = false
    },
    getCode(sum, localName) {
      this.status = true
      this.disabled = true
      this.second = sum
      localStorage.setItem(localName, sum)
      this.ti = setInterval(() => {
        if (this.second <= 0) {
          clearInterval(this.ti)
          this.status = false
          this.disabled = false
          localStorage.removeItem(localName, sum)
        } else {
          this.second -= 1
          localStorage.setItem(localName, this.second)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
$main-color: #52acff;

.outer {
  height: 100vh;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  .plat-name {
    position: absolute;
    left: 60px;
    top: 35px;
    font-size: 24px;
    color: black;
  }
}

._pa_center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-bg {
  position: fixed;
  width: 100%;
}

.imgWrapper {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 50%;
  margin-top: 33px;
  margin-left: 10px;
}

.login-position {
  position: absolute;
  z-index: 99;
  width: 500px;
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
