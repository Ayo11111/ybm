<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-28 14:17:51
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-16 15:34:52
-->
<template>
  <div class="container">
    <el-steps :active="active" finish-status="success" class="mb-12">
      <el-step title="提交进件申请" />
      <el-step title="平台审核" />
      <el-step title="完成" />
    </el-steps>
    <!-- 状态区 -->
    <system-audit-info
      v-if="statueInfo"
      :refresh="getApplyments"
      :value="statueInfo"
    />
    <!-- 表单区 -->
    <div
      v-loading.fullscreen.lock="loading"
      :element-loading-text="loadingText"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <detail-block title="经营信息">
        <business
          ref="business"
          :value.sync="form"
          :disabled="formDisabled"
          :mch_type.sync="mch_type"
        />
      </detail-block>
      <detail-block title="法人信息">
        <identity
          ref="identity"
          :value.sync="form"
          :disabled="formDisabled"
          :mch_type.sync="mch_type"
        />
      </detail-block>

      <detail-block title="受益人信息">
        <beneficiary
          ref="beneficiary"
          :value.sync="form"
          :disabled="formDisabled"
        />
      </detail-block>

      <detail-block title="联系人信息">
        <contact
          ref="contact"
          :value.sync="form"
          :disabled="formDisabled"
          :mch_type.sync="mch_type"
        />
      </detail-block>
      <detail-block title="结算账户信息">
        <settlement
          ref="settlement"
          :value.sync="form"
          :form-id="formId"
          :disabled="formDisabled"
          :mch_type.sync="mch_type"
        />
      </detail-block>
    </div>
    <!-- 功能区 -->
    <div v-show="!formDisabled" style="text-align: center">
      <!-- <el-button>返回</el-button> -->
      <el-button @click="getDraft">读取草稿</el-button>
      <el-button @click="saveToDraft()">保存草稿</el-button>
      <el-button type="primary" @click="verifyForm">提交审核</el-button>
    </div>
  </div>
</template>

<script>
import DetailBlock from '@/components/DetailBlock'
import business from './_components/business.vue'
import contact from './_components/contact.vue'
import identity from './_components/identity.vue'
import beneficiary from './_components/beneficiary.vue'
import settlement from './_components/settlement.vue'
import systemAuditInfo from './_components/systemAuditInfo.vue'
import { getBinaryDraft, setBinaryDraft } from '@/utils/auth'
import { fhPostApplyments, fhGetApplyments } from '@/api/finance'
import { deepClone } from '@/utils'

const _AUTO_SAVE_TIME = 30 * 1000

export default {
  name: 'PayBinary',
  components: {
    business,
    identity,
    settlement,
    DetailBlock,
    systemAuditInfo,
    contact,
    beneficiary
  },
  data() {
    return {
      form: { businessTermType: 1, idCardTimeType: 1 },
      formId: null,
      loading: false,
      active: 0,
      statueInfo: null,
      loadingText: '加载中...',
      mch_type: 0
    }
  },
  computed: {
    formDisabled() {
      const { applymentState = '-1' } = this.statueInfo || {}
      return ['1', '0', 1, 0].includes(applymentState)
    }
  },
  mounted() {
    window.app = this

    this.getApplyments()
  },
  methods: {
    // 查询当前进件情况
    async getApplyments() {
      this.loadingText = '查询进件状态中...'
      this.loading = true
      try {
        const { results } = await fhGetApplyments()
        const { applydata } = results || {}
        this.formId = results.id
        this.form = deepClone({
          applymentState: results.applymentState,
          businessTermType: 1,
          idCardTimeType: 1,
          ...applydata
        })
        if (results.id) {
          this.$store.commit('binary/setShowTips', false)
        }
        this.statueInfo = results
        if (results) {
          this.active = results.applymentState === '1' ? 3 : 1
        }
        this.$nextTick(() => {
          !this.formDisabled &&
            (this.timer = setInterval(() => {
              this.saveToDraft(1)
            }, _AUTO_SAVE_TIME))
        })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 校验方法
    valify(childComponents) {
      return new Promise((resolve, reject) => {
        childComponents.$refs.form.validate(valid => {
          if (valid) {
            resolve(childComponents.form)
          } else {
            reject()
          }
        })
      })
    },
    // 获取所有表单组件的实例
    getComponents() {
      const business = this.$refs.business
      const identity = this.$refs.identity
      const settlement = this.$refs.settlement
      const contact = this.$refs.contact
      const beneficiary = this.$refs.beneficiary
      return {
        business,
        identity,
        settlement,
        contact,
        beneficiary
      }
    },
    // 表单校验
    async verifyForm() {
      const forms = this.getComponents()

      let flag = false
      let form = {}
      for (const i in forms) {
        try {
          const formData = await this.valify(forms[i])
          form = deepClone({ ...form, ...formData })
          flag = false
        } catch (e) {
          flag = true
        }
        if (flag) break
      }
      if (!flag) {
        if (form.shareHolder.length >= 2) {
          form.shareHolder.pop()
        }
        this.form = deepClone(form)
        this.$nextTick(() => {
          console.log(this.form)
          this.submit()
        })
      } else {
        this.$message.warning('请检查表单是否填写完整')
      }
    },
    // 提交表单
    async submit() {
      this.loadingText = '提交进件信息中，请稍等...'
      this.loading = true
      try {
        await fhPostApplyments(this.form)
        this.$message.success('申请进件成功')
        this.getApplyments()
      } catch (e) {
        console.log('提交支付进件 error:', e)
      }
      this.loading = false
    },
    // 保存为草稿
    saveToDraft(isAuto = false) {
      const forms = this.getComponents()
      let form = {}
      for (const i in forms) {
        const tmep = forms[i].form || {}
        form = { ...form, ...tmep }
      }
      this.$nextTick(() => {
        setBinaryDraft(form)
        !isAuto && this.$message.success(`保存草稿成功`)
      })
    },
    // 获取草稿
    async getDraft() {
      const tempForm = (await getBinaryDraft()) || {}
      this.form = deepClone({ ...this.form, ...tempForm })
      this.$nextTick(() => {
        this.$message.success('获取本地草稿成功')
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    this.timer && clearInterval(this.timer)
    next()
  }
}
</script>

<style lang="scss" scoped></style>
