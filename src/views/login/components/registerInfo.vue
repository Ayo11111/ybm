<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-04 15:06:20
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-12 13:40:32
-->
<template>
  <div class="outer" v-loading="loading">
    <div class="registered-outer">
      <div class="reg-header">
        <div class="title">医便民平台入驻</div>
        <div>
          <span class="to-login" @click="blackLogin">使用已有账户登录</span>
        </div>
        <br />
        <div
          class="checkInfo"
          :class="[
            data['checkType'] === 0 ? 'checkInfo-success' : 'checkInfo-error'
          ]"
          style=""
          v-if="this.accountId && data.finishStatus && !this.ok"
        >
          <a-icon
            type="close-circle"
            style="color: red"
            v-show="data['checkType'] !== 0"
          />
          <span style="margin-left: 8px">
            审核结果: {{ data['checkType'] === 0 ? '审核中' : '审核失败' }}
            <span v-show="data['checkType'] !== 0" style="margin-left: 18px;">
              审核意见：{{ data['checkOpinion'] }}
            </span>
          </span>
        </div>
        <a-steps :current="currStep" style="margin: 12px 0">
          <a-step v-for="(i, k) in upStep" :key="k" :title="i.title" />
        </a-steps>
      </div>
      <div class="registered-box">
        <transition-group>
          <div v-show="currStep === 0" :key="0" class="step1">
            <div class="info">
              <a-icon type="exclamation-circle" />
              <span style="margin-left: 8px">
                准确填写地址和联系方式，便于业务经理联系上您
              </span>
            </div>
            <b style="font-size: 22px;">店铺信息</b>
            <Step1 ref="step1" :data="data" :disabled="data.finishStatus && data.checkType !== 2" style="margin-top: 25px" />
            <div class="btn">
              <el-button
                type="primary"
                :loading="nextLoad"
                @click="nextStep('step1', 2)"
              >
                下一步
              </el-button>
            </div>
          </div>
          <div v-show="currStep === 1" :key="1" class="step2">
            <div class="info">
              <a-icon type="exclamation-circle" />
              <span style="margin-left: 8px">
                齐全有效的合规资质可一次过审～
              </span>
            </div>
            <b style="font-size: 22px;">法人信息</b>
            <Step2 ref="step2" :data="data" :disabled="data.finishStatus && data.checkType !== 2" style="margin-top: 25px" />
            <div class="btn">
              <el-button @click="prodStep()"> 上一步 </el-button>
              <el-button
                type="primary"
                :loading="nextLoad"
                @click="nextStep('step2', 3)"
              >
                下一步
              </el-button>
            </div>
          </div>
          <div v-show="currStep === 2" :key="2" class="step2">
            <div class="info">
              <a-icon type="exclamation-circle" />
              <span style="margin-left: 8px">
                齐全有效的合规资质可一次过审～
              </span>
            </div>
            <b style="font-size: 22px;">营业执照</b>
            <Step3 ref="step3" :data="data" :disabled="data.finishStatus && data.checkType !== 2" style="margin-top: 25px" />
            <div class="btn">
              <el-button @click="prodStep()"> 上一步 </el-button>
              <el-button
                type="primary"
                :loading="nextLoad"
                @click="nextStep('step3', 3)"
              >
                下一步
              </el-button>
            </div>
          </div>
          <div v-show="currStep === 3" :key="3" class="step3">
            <b style="font-size: 22px;">合作方案</b>
            <Step4 ref="step4" :data="data" :disabled="data.finishStatus && data.checkType !== 2" style="margin-top: 20px" />
            <div class="btn" style="margin-top: 20px">
              <el-button @click="prodStep()"> 上一步 </el-button>
              <el-button
                :loading="nextLoad"
                type="primary"
                @click="nextStep('step4', 4)"
              >
                {{
                  data['finishStatus'] && data['checkType'] !== 2
                    ? '确认'
                    : '确认提交'
                }}
              </el-button>
            </div>
          </div>
          <div v-show="currStep === 4" :key="4" class="step3">
            <Step5 ref="step5" :data="data" style="margin-top: 20px" />
            <div class="btn" style="margin-top: 20px">
              <el-button :loading="nextLoad" type="primary" @click="blackLogin">
                返回登陆页面
              </el-button>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script>
import { fhPostCheckInfoNext, fhGetNextInfo } from '@/api/users'
import Step1 from './step1'
import Step2 from './step2'
import Step3 from './step3'
import Step4 from './step4'
import Step5 from './step5'

export default {
  name: 'Register',
  components: {
    Step1,
    Step2,
    Step3,
    Step4,
    Step5
  },
  props: {
    managerAccount: {
      type: Object,
      default: () => {}
    },
    accountId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      currStep: 0,
      steps: [
        {
          title: '店铺信息'
        },
        {
          title: '法人信息'
        },
        {
          title: '营业执照'
        },
        {
          title: '合作方案'
        }
      ],
      // 上传资料
      subLoad: false,
      nextLoad: false,
      subData: {},
      data: {},
      step2Data: {},
      ok: false
    }
  },
  created() {
    if (this.accountId) {
      this.getNextInfo()
    }
  },
  mounted() {
    window.reg = this
  },
  computed: {
    upStep() {
      let newStep = []
      if (this.accountId) {
        const { checkType, finishStatus } = this.data
        if (finishStatus && checkType !== 2) {
          newStep = this.steps
        } else {
          newStep = [...this.steps]
          newStep.splice(4, 0, {
            title: '完成'
          })
        }
      } else {
        newStep = [...this.steps]
        newStep.splice(4, 0, {
          title: '完成'
        })
      }
      return newStep
    }
  },
  methods: {
    async getNextInfo() {
      this.loading = true
      try {
        const { results } = await fhGetNextInfo(this.accountId)
        this.subData = results
        this.data = results
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async postCheckInfoNext(step) {
      this.nextLoad = true
      try {
        const { results } = await fhPostCheckInfoNext(step, this.subData)
        if (step === 4) {
          this.ok = true
        }
        ++this.currStep
        this.subData = results
      } catch (err) {
        console.log(err)
      }
      this.nextLoad = false
    },
    async nextStep(key, stepVal) {
      try {
        const step = this.$refs[key]
        try {
          let data = await step.validateForm()
          const { checkType, finishStatus } = this.data
          let stepParams = {}
          if (key === 'step1') {
            stepParams = {
              merchantBusinessInfo: data
            }
          } else if (key === 'step2') {
            const { legalRep, idCardCopy, idCardNational } = data
            this.step2Data = {
              legalRep,
              idCardCopy,
              idCardNational
            }
          } else if (key === 'step3') {
            stepParams = {
              legalPersonAndQualificationInformation: Object.assign(
                {},
                data,
                this.step2Data
              )
            }
          } else {
            stepParams = {
              cooperationInfo: data
            }
          }
          window.localStorage.setItem(key, JSON.stringify(data))
          this.subData = Object.assign(
            {},
            this.managerAccount,
            this.subData,
            stepParams
          )
          if (finishStatus && checkType !== 2) {
            if (this.currStep === 3) {
              this.$parent.isLogin = true
              this.blackLogin()
            } else {
              ++this.currStep
            }
          } else {
            if (key === 'step2') {
              ++this.currStep
            } else if (key === 'step5') {
              this.$parent.isLogin = true
              this.blackLogin()
            } else {
              this.postCheckInfoNext(stepVal)
            }
          }
        } catch (e) {
          console.log('debug', e)
        }
      } catch (e) {
        console.log('debug', e)
      }
    },
    prodStep() {
      --this.currStep
    },
    toLogin() {
      this.$parent.isLogin = true
      this.currStep = 0
      this.resetRegForm()
    },
    blackLogin() {
      this.$emit('update:accountId', null)
      this.$parent.isRegister = false
      this.$parent.isLogin = true
    },
    resetRegForm() {
      const { step1, step2, step3 } = this.$refs
      step1.resetForm()
      step2.resetForm()
      step3.resetForm()
    },
    clearValidate() {
      this.$refs.step1.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
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
}

.middle {
  text-align: center;
  margin: 0;
}

.registered-outer {
  width: 55vw;
  // height: 65vh;
  background: #fff;
  border-radius: 7px;
  margin: 10vh 0;
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
    margin-bottom: 12px;
    color: #52acff;
    cursor: pointer;
  }
}

.checkInfo {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 25px;
  margin-top: 20px;
}

.checkInfo-success {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
}

.checkInfo-error {
  background: #fff1f0;
  border: 1px solid #ffa39e;
}

.registered-box {
  position: relative;
  background: #fff;
  padding: 0 85px 24px;
  margin-bottom: 24px;
  border-radius: 7px;
  .success {
    min-height: 40vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .info {
    display: flex;
    align-items: center;
    padding: 10px;
    background: rgba(251, 241, 225, 1);
    color: #797979;
    margin-bottom: 20px;
  }

  .success-0,
  .success-1 {
    margin: 10px 0;
  }

  .success-0 {
    font-weight: 650;
    font-style: normal;
    font-size: 24px;
  }

  .success-1 {
    font-weight: 400;
    font-style: normal;
    color: rgba(0, 0, 0, 0.44);
    text-align: center;
  }

  &::v-deep .el-input__inner {
    color: #000;
  }

  &::v-deep .el-form {
    width: 100%;
    display: inline-block;
  }

  &::v-deep .el-input-group__prepend {
    width: 120px;
  }

  &::v-deep .el-cascader {
    width: 100%;
  }
}

.step1,
.step2,
.step3 {
  .btn {
    text-align: center;
  }
}

.step2 {
  margin-top: 3vh;

  &::v-deep .ant-tag {
    padding: 3px 12px;
    margin-bottom: 16px;
  }

  .btn {
    margin-top: 32px;
  }
}

::v-deep.el-icon-document::before {
  content: '';
}

/* 滚动槽 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  border-radius: 3px;
  background: #fff;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.08);
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 3px;
  background: rgb(180, 179, 179);
  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
