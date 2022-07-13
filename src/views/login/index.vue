<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:42:16
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-08 14:24:17
-->
<template>
  <div class="login-container">
    <!-- <img class="bg" src="@/assets/login_bg.svg" alt="bg" /> -->
    <div v-show="isLogin" class="mask">
      <el-form
        v-show="!isFoget"
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">TOP50商家系统平台</h3>
        </div>

        <div class="change-box">
          <p :class="{ curr: isLogin }" @click="changeIsLogin(true)">
            商家登录
          </p>
          <p :class="{ curr: !isLogin }" @click="changeIsLogin(false)">
            商家入驻
          </p>
        </div>

        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="loginCode"
            v-model="loginForm.account"
            placeholder="请输入账户名"
            name="loginCode"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
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
                class="code-img"
                :src="codeImg"
                alt=""
                @click="getCodeImgData"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <div style="margin-bottom: 14px;margin-top: -10px">
          <el-button type="text" @click="changeForget">忘记密码？</el-button>
          <el-button type="text" style="float: right;" @click="getCodeImgData">
            看不清?换一张
          </el-button>
        </div>
        <el-button
          :loading="loading"
          type="primary"
          style="width: 100%; margin-bottom: 30px"
          @click.native.prevent="handleLogin"
        >
          登录
        </el-button>
      </el-form>
      <!-- 忘记密码 -->
      <el-form
        v-show="isFoget"
        ref="forgetForm"
        :rules="forgetFormRules"
        :model="forgetForm"
        class="login-form"
      >
        <div class="title-container">
          <h3 class="title">TOP50商家系统平台</h3>
          <p style="text-align: center">忘记密码</p>
        </div>
        <el-form-item prop="phone">
          <span class="svg-container">
            <svg-icon icon-class="phone" />
          </span>
          <el-input v-model="forgetForm.phone" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item prop="code">
          <span class="svg-container">
            <svg-icon icon-class="message" />
          </span>
          <el-input
            v-model="forgetForm.code"
            style="width: 60%"
            placeholder="请输入验证码"
          />
          <el-button
            :loading="getCodeLoad"
            :disabled="timeCount !== '获取验证码'"
            style="float: right; margin: 6px"
            @click="getPhoneCode"
          >
            {{ timeCount }}
          </el-button>
        </el-form-item>
        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="forgetForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
        <el-tooltip
          v-model="capsTooltip"
          content="Caps lock is On"
          placement="right"
          manual
        >
          <el-form-item prop="password2">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="forgetForm.password2"
              :type="passwordType"
              placeholder="请再次输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
        </el-tooltip>
        <div class="forgetBtn">
          <el-button
            style="width: 208px"
            type="primary"
            :loading="subForgetLoad"
            @click="subForget"
          >
            提交
          </el-button>
          <el-button type="text" @click="changeForget">返回登录</el-button>
        </div>
      </el-form>
    </div>
    <div v-show="!isLogin">
      <Register ref="register" />
    </div>
    <div class="dialog">
      <el-dialog :visible.sync="dialogVisible" width="40%">
        <div style="font-size: 24px; margin-bottom: 16px">
          <a-icon type="exclamation-circle" theme="twoTone" />&nbsp;帮助提示
        </div>
        <div
          style="
            color: #868e92;
            margin-left: 30px;
            font-size: 18px;
            margin-bottom: 16px;
          "
        >
          {{ title }}
        </div>
        <div
          v-if="authUrl"
          style="font-size: 18px; margin-left: 30px; color: #52ACFF"
        >
          <a class="a-button" :href="authUrl">前往授权</a>
        </div>

        <span v-if="authUrl" slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { fhResetPw, fhResetPhoneC, fhGetCodeImg } from '@/api/users'
import { validPhone } from '@/utils/validate'
import Register from './components/register'

export default {
  name: 'Login',
  components: { Register },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value !== this.forgetForm.password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      // 图形验证码
      codeImg: '',
      codeImgLoad: false,
      dialogVisible: false,
      title: '',
      authUrl: '', // 跳转链接
      isLogin: true,
      isFoget: false,
      roles: [
        { name: '商家管理员', id: 0 }
        // { name: '其他', id: 1 }
      ],
      loginForm: {
        role: '',
        account: '',
        password: '',
        captchaCode: ''
      },
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
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      // 忘记密码
      forgetForm: {
        phone: '',
        code: '',
        password: '',
        password2: ''
      },
      forgetFormRules: {
        phone: [
          { required: true, trigger: 'change', message: '请输入手机号' },
          { required: true, trigger: 'change', validator: validatePhone }
        ],
        code: [{ required: true, trigger: 'change', message: '请输入验证码' }],
        password: [
          { required: true, trigger: 'change', message: '请输入密码' }
        ],
        password2: [
          { required: true, trigger: 'change', message: '请再次输入账密码' },
          { required: true, trigger: 'change', validator: validatePass }
        ]
      },
      timeCount: '获取验证码',
      getCodeLoad: false,
      subForgetLoad: false
    }
  },
  watch: {
    $route: {
      handler(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    window.login = this
    this.getCodeImgData()
    if (this.loginForm.loginCode === '') {
      this.$refs.loginCode.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && key >= 'a' && key <= 'z') ||
          (!shiftKey && key >= 'A' && key <= 'Z')
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginForm.uuid = this.$store.state.user.uuid
          this.loginForm.webType = 'merchant'
          this.loading = true
          this.$store
            .dispatch(
              'user/login',
              Object.assign({}, this.loginForm, {
                webType: 'merchant'
              })
            )
            .then(res => {
              if (res.code === 3032) {
                this.getCodeImgData()
                this.$message.error('图形验证码错误，请重试')
                this.loading = false
                return
              }
              window.location.reload()
              // this.loading = false
            })
            .catch(err => {
              this.$message.error(err || '')
              this.getCodeImgData()
              this.loading = false
            })
        } else {
          console.log('请检查输入')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    changeIsLogin(type) {
      this.isLogin = type
      !type && this.$refs.register.clearValidate()
    },
    // 忘记密码——验证码
    async getPhoneCode() {
      if (!this.forgetForm.phone) {
        this.$message.error('请输入你的手机号')
      } else {
        this.getCodeLoad = true
        const data = await fhResetPhoneC({ mobile: this.forgetForm.phone })
        if (data.code === 200) {
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
              (this.timeNum.length < 2 ? '0' + this.timeNum : this.timeNum) +
              's'
          }, 1000)
        } else {
          this.$message.error(data.message)
        }
        this.getCodeLoad = false
      }
    },
    // 提交忘记密码信息
    subForget() {
      this.subForgetLod = true
      this.$refs.forgetForm.validate(valid => {
        if (valid) {
          this.subForgetLod = false
          this.fhResetPwData()
        } else {
          this.$message.error('请检查您的输入')
          return false
        }
      })
    },
    // 请求忘记密码
    async fhResetPwData() {
      const data1 = {
        loginCode: this.forgetForm.phone,
        password: this.forgetForm.password,
        verifyCode: this.forgetForm.code
      }
      const data = await fhResetPw(data1)
      if (data.code === 200) {
        this.$message.success('密码重置成功,重新登录吧')
        this.changeForget()
      } else {
        this.$message.error(`密码重置失败：${data.message}`)
      }
    },
    changeForget() {
      this.isFoget = !this.isFoget
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
    }
  }
}
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #000;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  overflow: hidden;

  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &::v-deep .el-input__inner {
    color: #000;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);

    &::v-deep .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        height: 47px;
      }
    }

    &::v-deep .el-select {
      .el-input {
        width: 100%;
      }
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      // background: rgba(0, 0, 0, 0.1);
      background: #fff;
      border-radius: 5px;
      color: #000;
    }
  }

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #000;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}

.change-box {
  display: flex;
  justify-content: space-around;
  font-weight: 400;
  font-style: normal;
  font-size: 16px;
  color: #000;

  .curr {
    position: relative;
    color: #52acff;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #52acff;
    }
  }

  p {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 136px;
    height: 46px;
    cursor: pointer;
    margin-bottom: 1em;
  }
}

.forgetBtn {
  display: flex;
  justify-content: space-between;
}

::v-deep .el-dialog__header {
  padding: 0;
  padding-bottom: 0;
}
::v-deep .el-dialog {
  margin-top: 20vh !important;
}

.code-img {
  float: right;
  margin-right: 3px;
  height: 47px;
  width: auto;
}
</style>
