<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-10 09:48:09
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-04-29 10:33:49
-->
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
      <!-- 经营者/法人证件类型 -->
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="法人证件类型:" required>
            <el-select
              v-model="idDocTypeO"
              class="elSelect"
              popper-class="el-selectDropdown"
              :popper-append-to-body="false"
              placeholder="请选择"
              @change="changeId"
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
      </el-row>
      <!-- 身份证 -->
      <template v-if="idDocTypeO === 'IDENTIFICATION_TYPE_MAINLAND_IDCARD'">
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="legalIDCardFront" label="身份证人像面照片:">
              <OssUpload
                ref="copy"
                :files="fileCopyList"
                style="margin-top: 10px"
                :set-size="setSize"
                :limit-size="2"
                :success="file => uploadSuccess(file, 'legalIDCardFront')"
                :disabled="disabled"
                @delImg="delImg('legalIDCardFront')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="legalIDCardBack" label="身份证国徽面照片:">
              <OssUpload
                ref="national"
                :files="
                  form.legalIDCardBack
                    ? [
                      {
                        name: 'image',
                        url: form.legalIDCardBack,
                        uid: '-1'
                      }
                    ]
                    : []
                "
                style="margin-top: 10px"
                :set-size="setSize"
                :limit-size="2"
                :success="file => uploadSuccess(file, 'legalIDCardBack')"
                :disabled="disabled"
                @delImg="delImg('legalIDCardBack')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="corp_idcard" label="身份证号码:">
              <el-input
                v-model="form.corp_idcard"
                placeholder="请输入身份证号码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="corp_name" label="身份证姓名:">
              <el-input
                v-model="form.corp_name"
                placeholder="请输入身份证姓名"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="证件有效期限类型:" required>
              <el-radio-group
                v-model="form.idCardTimeType"
                @change="changeTime('idCardTimeType')"
              >
                <el-radio :label="1">定期</el-radio>
                <el-radio :label="0">长期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="idCardStartTime" label="证件生效日期:">
              <el-date-picker
                v-model="form.idCardStartTime"
                :picker-options="pickerOptionsStart"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="changeTime('idCardStartTime')"
              />
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.idCardTimeType"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="idCardEndTime" label="证件失效日期:">
              <el-date-picker
                v-model="form.idCardEndTime"
                :picker-options="pickerOptions"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="changeTime('idCardEndTime')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <!-- 其他证件 -->
      <template v-else>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="idDocCopy" label="证件照片:">
              <OssUpload
                ref="copy"
                :files="
                  form.idDocCopy
                    ? [
                      {
                        name: 'image',
                        url: form.idDocCopy,
                        uid: '-1'
                      }
                    ]
                    : []
                "
                style="margin-top: 10px"
                :set-size="setSize"
                :limit-size="2"
                :success="file => uploadSuccess(file, 'idDocCopy')"
                @delImg="delImg('idDocCopy')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="idDocNumber" label="证件号码:">
              <el-input
                v-model="form.idDocNumber"
                placeholder="请输入证件号码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="idDocName" label="证件姓名:">
              <el-input
                v-model="form.idDocName"
                placeholder="请输入证件姓名"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 时间 -->
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="证件有效期限类型:">
              <el-radio-group v-model="radio" @change="changeTime">
                <el-radio :label="true">定期</el-radio>
                <el-radio :label="false">长期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="radio">
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="docPeriodEnd" label="证件失效日期:">
              <el-date-picker
                v-model="form.docPeriodEnd"
                :picker-options="pickerOptions"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="开户意愿视频:" prop="accountOpeningVideo">
            <OssUpload
              style="margin-top: 10px"
              :files="
                form.accountOpeningVideo
                  ? [
                    {
                      name: 'image',
                      url: form.accountOpeningVideo,
                      uid: '-1'
                    }
                  ]
                  : []
              "
              :set-size="setSize"
              :limit-size="50"
              accept=".mp4,.avi,.rmvb,.wav"
              :disabled="disabled"
              :success="file => uploadSuccess(file, 'accountOpeningVideo')"
              @delImg="delImg('accountOpeningVideo')"
            />
            <li class="info-text">
              法定代表人手持营业执照原件按要求普通话朗读开户声明视频，朗读内容“本视频仅用于（念公司全称）在汇元银通开通特约商户使用，他用无效”
            </li>
            <li class="info-text">
              视频支持上传格式：mp4、avi、rmvb、wav，上传大小限制：50M以内
            </li>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import OssUpload from '@/components/OssUpload'
import { rules } from '../_utils/index'
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
    mch_type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      form: {},
      // start 图片
      fileCopyList: [],
      fileNaList: [],
      fileDocList: [],
      idCard: true,
      idDocTypeO: 'IDENTIFICATION_TYPE_MAINLAND_IDCARD',
      // 时间类型 true为定期
      radio: true,
      optionsType: [
        { label: '身份证', value: 'IDENTIFICATION_TYPE_MAINLAND_IDCARD' }
        // { label: '护照', value: 'IDENTIFICATION_TYPE_OVERSEA_PASSPORT' },
        // {
        //   label: '中国香港居民–来往内地通行证',
        //   value: 'IDENTIFICATION_TYPE_HONGKONG'
        // },
        // {
        //   label: '中国澳门居民–来往内地通行证',
        //   value: 'IDENTIFICATION_TYPE_MACAO'
        // },
        // {
        //   label: '中国台湾居民–来往大陆通行证',
        //   value: 'IDENTIFICATION_TYPE_TAIWAN'
        // }
      ],
      setSize: true,
      rules,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 1 * 60 * 60 * 1000
        }
      },
      pickerOptionsStart: {
        // 禁用未来时间
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 1 * 60 * 60 * 1000
        }
      }
    }
  },
  watch: {
    value: {
      handler(v) {
        const {
          legalIDCardFront,
          legalIDCardBack,
          corp_idcard_valid = '',
          corp_idcard,
          corp_name,
          idDocNumber,
          idDocName,
          docPeriodEnd,
          accountOpeningVideo
        } = v
        if (legalIDCardFront) {
          this.fileCopyList = [
            { name: 'image.png', url: legalIDCardFront, uid: '-1' }
          ]
        }
        if (legalIDCardBack) {
          this.fileNaList = [
            { name: 'image.png', url: legalIDCardBack, uid: '-1' }
          ]
        }

        const tempTimes = corp_idcard_valid.split('/')
        const idCardStartTime = tempTimes[0]
        const idCardEndTime = tempTimes.length > 2 ? tempTimes[1] : tempTimes[0]
        const idCardTimeType = tempTimes.length > 2 ? 1 : 0

        this.form = {
          legalIDCardFront,
          legalIDCardBack,
          corp_idcard_valid,
          corp_idcard,
          corp_name,
          idDocNumber,
          idDocName,
          docPeriodEnd,
          idCardTimeType,
          idCardEndTime,
          idCardStartTime,
          accountOpeningVideo
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 时间类型
    changeTime(type) {
      // true 定期
      // false 长期
      const moment = this.$moment
      const { idCardTimeType, idCardEndTime, idCardStartTime } = this.form
      let diffTime = null
      if (idCardTimeType && idCardStartTime && idCardEndTime) {
        diffTime = moment(idCardEndTime).diff(moment(idCardStartTime), 'years')
      }

      this.form.corp_idcard_valid = `${idCardStartTime}/${
        idCardTimeType ? idCardEndTime + '/' + diffTime : '长期'
      }`

      if (['idCardEndTime', 'idCardStartTime'].includes(type)) {
        this.$refs.form.validateField('idCardEndTime')
        this.$refs.form.validateField('idCardStartTime')
      }
    },
    uploadSuccess({ src }, type) {
      const form = this.$refs.form
      this.form[type] = src
      src ? form.clearValidate(type) : form.validateField(type)
    },
    delImg(type) {
      this.form[type] = ''
      this.$refs.form.validateField(type)
    },
    // 改变证件类型
    changeId() {}
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
