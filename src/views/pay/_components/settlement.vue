<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :disabled="disabled"
      label-position="right"
      label-width="150px"
    >
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="账户类型:" prop="bank_account_type">
            <el-select
              v-model="form.bank_account_type"
              class="elSelect"
              popper-class="el-selectDropdown"
              :popper-append-to-body="false"
              placeholder="请选择"
            >
              <el-option
                v-for="item in optionsType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="开户名称:" prop="open_bank_name">
            <el-input
              v-model="form.open_bank_name"
              placeholder="请输入开户名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="开户行:" prop="direct_bank_type">
            <el-select
              v-model="form.direct_bank_type"
              class="elSelect"
              popper-class="el-selectDropdown"
              :popper-append-to-body="false"
              placeholder="请选择开户行"
              filterable
            >
              <el-option
                v-for="item in bankOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="开户支行:" prop="bank_branch_name">
            <el-row>
              <el-col :span="10">
                <el-cascader
                  v-model="form.bank_branch_province_and_city"
                  :options="provinceAndCityData"
                  style="width: 100%"
                  @change="cascaderChange"
                />
              </el-col>
              <el-col :span="14">
                <el-input
                  v-model="form.bank_branch_name"
                  placeholder="请输入开户支行"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="bank_branch_code" label="开户支行联行号:">
            <el-input
              v-model="form.bank_branch_code"
              placeholder="请输入开户支行联行号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="bank_card_id" label="银行账号:">
            <el-input
              v-model="form.bank_card_id"
              placeholder="请输入银行账号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="bank_account" label="开户人:">
            <el-input
              v-model="form.bank_account"
              placeholder="请输入开户人"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-tooltip
          style="transform: translate(13px, 10px)"
          effect="dark"
          content="如选择“对公账户”,开户人信息需填写公司名称，与开户名称一致"
        >
          <i class="el-icon-info" />
        </el-tooltip>

        <el-col
          v-if="form.bank_mobile || !formId || form.applymentState === '2'"
          :xs="24"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
          style="margin-top:-20px"
        >
          <el-form-item label="结算人手机号:">
            <el-input
              v-model="form.bank_mobile"
              placeholder="请输入结算人手机号"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="bank_cert_no" label="结算人身份证号:">
            <el-input
              v-model="form.bank_cert_no"
              placeholder="请输入结算人身份证号"
              clearable
            />
          </el-form-item>
        </el-col>

        <div v-if="true">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="bank_cert_no" label="开户许可证:">
              <OssUpload
                style="margin-top: 10px"
                :disabled="disabled"
                :files="
                  form.openingPermit
                    ? [
                      {
                        name: 'image',
                        url: form.openingPermit,
                        uid: '-1'
                      }
                    ]
                    : []
                "
                :limit-size="0.5"
                accept=".jpeg,.jpg,.png,.bmp,.gif"
                :success="({ src }) => success(src, 'openingPermit')"
                @delImg="delImg('openingPermit')"
              />
              <li class="info-text">请上传开户许可证电子照片。</li>
              <li class="info-text">
                图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内
              </li>
            </el-form-item>
          </el-col>
        </div>

        <div v-if="mch_type !== 1">
          <el-col
            v-if="form.bank_account_type === 0"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="bank_cert_no" label="结算银行卡正面照:">
              <OssUpload
                style="margin-top: 10px"
                :disabled="disabled"
                :files="
                  form.bankCardFrontUrl
                    ? [
                      {
                        name: 'image',
                        url: form.bankCardFrontUrl,
                        uid: '-1'
                      }
                    ]
                    : []
                "
                :limit-size="0.5"
                accept=".jpeg,.jpg,.png,.bmp,.gif"
                :success="({ src }) => success(src, 'bankCardFrontUrl')"
                @delImg="delImg('bankCardFrontUrl')"
              />
              <li class="info-text">
                请上传结算银行卡正面照，银行卡上的信息需清晰可见。
              </li>
              <li class="info-text">
                图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内
              </li>
            </el-form-item>
          </el-col>

          <el-col
            v-if="form.bank_account_type === 0"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="bank_cert_no" label="结算银行卡反面照:">
              <OssUpload
                style="margin-top: 10px"
                :disabled="disabled"
                :files="
                  form.bankCardBackUrl
                    ? [
                      {
                        name: 'image',
                        url: form.bankCardBackUrl,
                        uid: '-1'
                      }
                    ]
                    : []
                "
                :limit-size="0.5"
                accept=".jpeg,.jpg,.png,.bmp,.gif"
                :success="({ src }) => success(src, 'bankCardBackUrl')"
                @delImg="delImg('bankCardBackUrl')"
              />
              <li class="info-text">
                请上传结算银行卡反面照，银行卡上的信息需清晰可见。
              </li>
              <li class="info-text">
                图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内
              </li>
            </el-form-item>
          </el-col>

          <el-col
            v-if="form.bank_account_type === 0"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item
              prop="bank_cert_no"
              label="结算银行卡所有者手持银行卡正面照:"
            >
              <OssUpload
                style="margin-top: 10px"
                :disabled="disabled"
                :files="
                  form.handheldOfBankCardUrl
                    ? [
                      {
                        name: 'image',
                        url: form.handheldOfBankCardUrl,
                        uid: '-1'
                      }
                    ]
                    : []
                "
                :limit-size="0.5"
                accept=".jpeg,.jpg,.png,.bmp,.gif"
                :success="({ src }) => success(src, 'handheldOfBankCardUrl')"
                @delImg="delImg('handheldOfBankCardUrl')"
              />
              <li class="info-text">
                必须结算银行卡所有者本人手持结算银行卡正面，人脸和银行卡上的信息清晰可见。
              </li>
              <li class="info-text">
                图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内
              </li>
            </el-form-item>
          </el-col>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { bank, bankOptions } from '../_utils/bank'
import {
  provinceAndCityData,
  CodeToText,
  TextToCode
} from 'element-china-area-data'
import OssUpload from '@/components/OssUpload'
import { rules } from '../_utils/index'
import { deepClone } from '@/utils'
export default {
  components: {
    OssUpload
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    formId: {
      type: [String, Number],
      default: null
    },
    mch_type: {
      type: Number,
      default: 0
    }
  },
  data() {
    // 校验开户支行
    const validBankBranch = (rule, value, cb) => {
      const { bank_province, bank_city } = this.form
      if (!bank_province || !bank_city) cb('请选择开户支行的省市')
      else if (!value) cb('请输入开户支行')
      else cb()
    }
    return {
      form: {},
      bankOptions,
      provinceAndCityData,
      optionsBank: bank,
      optionsType: [
        { label: '对公账户', value: 1 },
        { label: '对私账户', value: 0 }
      ],
      rules: {
        ...rules,
        bank_branch_name: [
          { required: true, message: '请填写开户银行支行名称' },
          { validator: validBankBranch, trigger: ['change', 'blur'] }
        ]
      }
    }
  },
  watch: {
    value: {
      handler(v) {
        let { direct_bank_type } = v
        const {
          bank_account_type,
          bank_province,
          bank_city,
          open_bank_name,
          bank_branch_name,
          bank_branch_code,
          bank_card_id,
          bank_account,
          bank_mobile,
          bank_cert_no,
          openingPermit,
          bankCardFrontUrl,
          bankCardBackUrl,
          handheldOfBankCardUrl,
          applymentState
        } = v
        const bank_branch_province_and_city = bank_province
          ? [
            TextToCode[bank_province].code,
            TextToCode[bank_province][bank_city].code
          ]
          : null

        if (direct_bank_type) {
          direct_bank_type = direct_bank_type + ''
        }

        this.form = deepClone({
          bank_account_type,
          bank_province,
          bank_city,
          open_bank_name,
          direct_bank_type,
          bank_branch_name,
          bank_branch_code,
          bank_card_id,
          bank_account,
          bank_mobile,
          bank_cert_no,
          bank_branch_province_and_city,
          openingPermit,
          bankCardFrontUrl,
          bankCardBackUrl,
          handheldOfBankCardUrl,
          applymentState
        })
        this.$forceUpdate()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    cascaderChange(values) {
      const [province, city] = values
      this.form.bank_province = CodeToText[province]
      this.form.bank_city = CodeToText[city]
    },
    success(src, field) {
      this.form[field] = src
      const form = this.$refs.form
      src ? form.clearValidate(field) : form.validateField(field)
    },
    delImg(field) {
      this.form[field] = ''
      this.$refs.form.validateField(field)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor {
  width: 100%;
}
.el-select {
  width: 100%;
}
ul {
  padding: 0;
}
.info-text {
  color: #999999;
}
li {
  line-height: 24px;
}
.elSelect {
  &::v-deep .el-selectDropdown {
    z-index: 990 !important;
  }
}
</style>
