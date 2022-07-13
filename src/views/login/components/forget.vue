<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-04 14:09:18
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-18 19:48:16
-->
<template>
  <div class="outer">
    <div class="registered-outer">
      <div class="reg-header">
        <div class="title">忘记密码</div>
        <span class="to-login" @click="blackLogin">返回登陆</span>
        <a-steps :current="currStep" style="margin: 12px 0">
          <a-step v-for="(i, k) in steps" :key="k" :title="i.title" />
        </a-steps>
      </div>
      <div class="registered-box">
        <el-form
          ref="loginForm"
          class="login-form"
          :model="loginForm"
          :rules="rules"
          label-width="100px"
        >
          <div v-show="currStep === 0">
            <el-form-item prop="mobile" label="手机号">
              <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
            </el-form-item>
            <el-form-item prop="captcha" label="短信验证码">
              <div class="codeBox" style="display: flex">
                <el-input
                  v-model="loginForm.captcha"
                  style="flex: 1"
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
          </div>
          <div v-show="currStep === 1" v-loading="userLoad">
            <el-form-item
              prop="backUserId"
              label="请选择需要设置密码的账户"
              label-width="200px"
            >
              <a-radio-group v-model="loginForm.backUserId">
                <a-radio
                  v-for="(item, index) in userData"
                  :key="index"
                  :value="item.id"
                  style="margin-bottom: 15px"
                >
                  {{ item.account }}
                </a-radio>
              </a-radio-group>
            </el-form-item>
          </div>
          <div v-show="currStep === 2">
            <el-form-item prop="password" label="新密码">
              <el-input
                v-model="loginForm.password"
                style="flex: 1"
                show-password
                auto-complete="new-password"
                placeholder="请输入新密码"
              />
            </el-form-item>
            <el-form-item prop="repeatPassword" label="确认密码">
              <el-input
                v-model="loginForm.repeatPassword"
                style="flex: 1"
                show-password
                auto-complete="new-password"
                placeholder="请输入确认密码"
              />
            </el-form-item>
          </div>
          <div v-show="currStep === 3" class="step3">
            <span>新密码已经设置成功</span>
            <span>请重新登录系统</span>
          </div>
          <div class="btn">
            <el-button type="primary" :loading="nextLoad" @click="nextStep">
              {{ currStep !== 3 ? '下一步' : '重新登陆' }}
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fhGetForgetCaptcha,
  fhPostCheckForgetCaptcha,
  fhGetMobileUsers,
  fhPutUserPassword
} from '@/api/users/forget'
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      const { mobile } = this.loginForm
      const regular_str = /[a-z]/i
      if (mobile) {
        const matching_str = mobile.match(regular_str)
        if (mobile.length === 11 && !matching_str) {
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
        const length = repeatPassword.length < 6 || repeatPassword.length > 16
        const matching_num = repeatPassword.match(regular_num)
        const matching_str = repeatPassword.match(regular_str)
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
        const length = password.length < 6 || password.length > 16
        const matching_num = password.match(regular_num)
        const matching_str = password.match(regular_str)
        if (length || !matching_num || !matching_str) {
          callback(new Error('6-16位,必须包含数字和字母'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入密码'))
      }
    }
    return {
      loading: false,
      loginForm: {},
      getCodeLoad: false,
      timeCount: '获取验证码',
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      currStep: 0,
      rules: {
        mobile: [{ validator: validatePhone, trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        backUserId: [
          { required: true, message: '请选择账户', trigger: 'blur' }
        ],
        password: [{ validator: validatatePassword, trigger: 'blur' }],
        repeatPassword: [{ validator: validatePass, trigger: 'blur' }]
      },
      steps: [
        {
          title: '验证手机号'
        },
        {
          title: '选择账户'
        },
        {
          title: '重设密码'
        },
        {
          title: '完成'
        }
      ],
      ti: null,
      nextLoad: false,
      userLoad: false,
      userData: []
    }
  },
  methods: {
    async getForgetCaptcha() {
      this.getCodeLoad = true
      try {
        await fhGetForgetCaptcha(this.loginForm)
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
    async postCheckForgetCaptcha() {
      try {
        const { results } = await fhPostCheckForgetCaptcha(this.loginForm)
        this.loginForm.token = results
        this.currStep += 1
        this.getMobileUsers()
      } catch (err) {
        console.log(err)
      }
      this.nextLoad = false
    },
    async getMobileUsers() {
      this.userLoad = true
      try {
        const { results } = await fhGetMobileUsers(this.loginForm)
        this.userData = results
      } catch (err) {
        console.log(err)
      }
      this.userLoad = false
    },
    async putUserPassword() {
      try {
        await fhPutUserPassword(this.loginForm)
        this.currStep += 1
        this.$message.success('密码设置成功')
      } catch (err) {
        console.log(err)
      }
      this.nextLoad = false
    },
    blackLogin() {
      this.$parent.isLogin = true
      this.$parent.isForget = false
    },
    nextStep() {
      const { currStep } = this
      if (currStep < 3) {
        const files = [
          ['mobile', 'captcha'],
          'backUserId',
          ['password', 'repeatPassword']
        ][currStep]
        this.validateStep(files, currStep)
      } else {
        this.blackLogin()
      }
    },
    validateStep(files, currStep) {
      if (currStep !== 1 && currStep !== 3) {
        this.nextLoad = true
      }
      this.$refs.loginForm.validateField(files, valid => {
        if (!valid) {
          if (this.ti) {
            clearTimeout(this.ti)
          }
          this.ti = setTimeout(() => {
            if (currStep !== 1 && currStep !== 3) {
              const func = ['postCheckForgetCaptcha', '', 'putUserPassword'][
                currStep
              ]
              this[func]()
            } else {
              this.currStep += 1
            }
          }, 400)
        }
      })
    },
    openCode() {
      try {
        this.$refs.loginForm.validateField('mobile', valid => {
          if (!valid) {
            this.getForgetCaptcha()
          }
        })
      } catch (e) {
        console.log('debug axios', e)
      }
    }
  }
}
</script>

<style scoped lang="scss">
$main-color: #52acff;
.outer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  .registered-outer {
    height: auto;
    max-width: 700px;
    background: #fff;
    border-radius: 7px;
    margin: 10vh 0;
    padding: 24px;
    flex: none;
  }
  .reg-header {
    padding: 0 85px 12px;

    .title {
      font-size: 24px;
      color: #52acff;
      text-align: center;
      padding: 32px 0 18px;
    }
    .to-login {
      float: right;
      margin-bottom: 15px;
      color: #52acff;
      cursor: pointer;
    }
  }
  .registered-box {
    position: relative;
    background: #fff;
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    border-radius: 7px;
    margin-top: 20px;
    padding: 24px;
  }
  .btn {
    text-align: center;
  }
  .step3 {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    span {
      margin-bottom: 8px;
    }
  }
}
</style>
