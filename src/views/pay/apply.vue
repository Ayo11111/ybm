<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-09 18:27:46
 * @LastEditors: HJ
 * @LastEditTime: 2021-06-28 14:14:49
-->
<template>
  <div class="container">
    <div class="wrap">
      <div v-for="(item, index) in orgTypeArr" :key="index">
        <div v-if="organizationType === item.value" class="type">
          主体类型：{{ item.label }}
        </div>
      </div>
      <business
        ref="onc"
        :disabled-form="disabledForm"
        :form="businessLicenseInfo"
        :org-type="organizationType"
      />
      <a-divider dashed />
      <!-- 组织架构 -->
      <template v-if="organization">
        <fivCom
          ref="fiv"
          :disabled-form="disabledForm"
          :form="organizationCertInfo"
        />
        <a-divider dashed />
      </template>
      <identity
        ref="sec"
        :disabled-form="disabledForm"
        :form-a.sync="idCardInfo"
        :form-b.sync="idDocInfo"
        :org-type="organizationType"
        :id-doc-type.sync="idDocType"
      />
      <a-divider dashed />
      <settlement
        ref="thr"
        :disabled-form="disabledForm"
        :form.sync="accountInfo"
        :org-type="organizationType"
      />
      <a-divider dashed />
      <forCom
        ref="for"
        :disabled-form="disabledForm"
        :form.sync="contactInfo"
        :org-type="organizationType"
      />
      <a-divider dashed />
      <div class="btn" style="text-align: center">
        <router-link
          v-if="$route.fullPath !== '/pay/index'"
          :to="{ name: 'paySetting' }"
        >
          <el-button>返回</el-button>
        </router-link>
        &nbsp;&nbsp;
        <el-button
          v-if="!disabledForm"
          v-loading="loadingSub"
          type="primary"
          @click="submitFn"
        >
          确认提交
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import business from './_components/business.vue'
import identity from './_components/identity.vue'
import settlement from './_components/settlement.vue'
import forCom from './_components/forCom.vue'
import fivCom from './_components/fivCom.vue'

import { fhPostApplyments, fhResetApplyments } from '@/api/finance/index.js'

export default {
  components: {
    business,
    identity,
    settlement,
    forCom,
    fivCom
  },
  props: {
    applydata: { type: Object, default() {} },
    disabledForm: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      loadingReset: false,
      organizationType: null,
      loadingSub: false,
      orgTypeArr: [
        { label: '个体工商户', value: '4' },
        { label: '企业', value: '2' },
        { label: '党政、机关及事业单位', value: '3' },
        { label: '其他组织', value: '1708' }
      ],
      // 营业执照
      businessLicenseInfo: {
        businessLicenseCopy: '',
        businessLicenseNumber: '',
        merchantName: '',
        legalPerson: '',
        companyAddress: '',
        businessTime: ['', '']
      },
      // 组织架构
      organizationCertInfo: {
        organizationCopy: '', // https://top50-dev.oss-cn-shenzhen.aliyuncs.com/top50-merchant/755855/bannner-img/1582530410713_01ea4a554317980000019ae999aa13.jpg
        organizationNumber: '', // 12345679-A
        organizationTime: ['', '']
      },
      // 法定代表人证件 id_doc_type证件类型
      idDocType: 'IDENTIFICATION_TYPE_MAINLAND_IDCARD',
      idCardInfo: {
        idCardCopy: '',
        idCardNational: '',
        idCardName: '',
        idCardNumber: '',
        idCardValidTime: ''
      },
      // 护照
      idDocInfo: {
        idDocCopy: '',
        idDocNumber: '',
        idDocName: '',
        docPeriodEnd: ''
      },
      // 结算银行账户
      accountInfo: {
        bankAccountType: '',
        accountBank: '',
        accountName: '',
        bankAddressCode: '',
        bankBranchId: '',
        bankName: '',
        accountNumber: ''
      },
      // 超级管理员
      contactInfo: {
        contactType: '',
        contactName: '',
        contactIdCardNumber: '',
        mobilePhone: '',
        contactEmail: ''
      }
    }
  },
  computed: {
    organization() {
      // 是否展示组织架构
      const orgFlag = ['2', '3', '1708'].some(ele => {
        return ele === this.organizationType
      })
      const lengthFlag =
        this.businessLicenseInfo.businessLicenseNumber.trim().length !== 18
      return orgFlag && lengthFlag
    }
  },
  created() {
    if (this.applydata) {
      const {
        businessLicenseInfo,
        idDocType,
        idCardInfo,
        idDocInfo,
        accountInfo,
        contactInfo,
        organizationCertInfo,
        organizationType
      } = this.applydata
      this.businessLicenseInfo = businessLicenseInfo
      this.idDocType = idDocType
      this.idCardInfo = idCardInfo
      this.idDocInfo = idDocInfo
      this.accountInfo = accountInfo
      this.contactInfo = contactInfo
      this.organizationType = organizationType
      this.organizationCertInfo = organizationCertInfo
    } else {
      this.organizationType = window.localStorage.getItem('organizationType')
    }
  },
  mounted() {
    window.apply = this
  },

  methods: {
    // 请求重置
    async reset() {
      this.loadingReset = true
      try {
        await fhResetApplyments()
        this.$router.push({ name: 'paySetting' })
        this.$emit('post', 'success')
        this.$store.commit('binary/setShowTips', false)
      } catch (e) {
        console.log(e)
      }
      this.loadingReset = false
    },
    // 请求提交
    async post() {
      const arr = [
        'businessLicenseInfo',
        'idCardInfo',
        'idDocInfo',
        'organizationCertInfo'
      ]
      arr.forEach((ele, index) => {
        const key = this[ele]
        window[ele] = JSON.parse(JSON.stringify(key))
      })
      window.businessLicenseInfo.businessTime = JSON.stringify(
        window.businessLicenseInfo.businessTime
      )
      window.organizationCertInfo.organizationTime = JSON.stringify(
        window.organizationCertInfo.organizationTime
      )

      const sendData = {
        needAccountInfo: true,
        organizationType: this.organizationType,
        idDocType: this.idDocType,
        businessLicenseInfo: window.businessLicenseInfo,
        idCardInfo: window.idCardInfo,
        idDocInfo: window.idDocInfo,
        accountInfo: this.accountInfo,
        contactInfo: this.contactInfo,
        organizationCertInfo: window.organizationCertInfo
      }
      this.loadingSub = true
      try {
        await fhPostApplyments(sendData)
        this.$message.success('提交成功')
        this.$router.push({ name: 'paySetting' })

        this.$emit('post', 'success')
      } catch (e) {
        console.log(e)
      }
      this.loadingSub = false
    },
    submitFn() {
      const arr = ['onc', 'sec', 'thr', 'for', 'fiv']

      const allValidate = arr.reduce((acc, cur, index) => {
        this.$refs[cur] &&
          acc.push(
            new Promise((resolve, reject) => {
              this.$refs[cur].$refs.form.validate(valid => {
                if (valid) {
                  resolve()
                } else {
                  reject('请填写所有必填资料')
                }
              })
            })
          )
        return acc
      }, [])

      Promise.all(allValidate)
        .then(
          val => {
            // 提交
            this.post()
          },
          rej => {
            this.$message.error(rej)
          }
        )
        .catch(e => {})
    },
    // 更换主体
    selectOrg() {
      this.$confirm(
        '更改主体类型后，将清空所有已保存的资料，并重置申请状态，请确认是否更改?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.reset()
        })
        .catch(() => {})
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name !== 'payApply') {
      window.localStorage.removeItem('organizationType')
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  .type {
    margin-top: 10px;
    color: #333333;
    font-size: 18px;
    font-weight: 500;
    line-height: 18px;
    padding-left: 14px;
    border-left: 4px solid rgba(251, 157, 25, 1);
    margin-bottom: 20px;
  }
}
::v-deep .el-form-item {
  margin-bottom: 30px;
}
</style>
