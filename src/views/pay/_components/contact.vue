<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-10 09:48:09
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-27 16:32:22
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
      <!-- 经营者/联系人证件类型 -->
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="联系人证件类型:" required>
            <el-select
              class="elSelect"
              popper-class="el-selectDropdown"
              :popper-append-to-body="false"
              v-model="idDocTypeO"
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
            <el-form-item prop="attnIDCardFront" label="身份证人像面照片:">
              <OssUpload
                ref="copy"
                :files="fileCopyList"
                style="margin-top: 10px"
                :set-size="setSize"
                :limit-size="2"
                :success="file => uploadSuccess(file, 'attnIDCardFront')"
                :disabled="disabled"
                @delImg="delImg('attnIDCardFront')"
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="attnIDCardBack" label="身份证国徽面照片:">
              <OssUpload
                ref="national"
                :files="fileNaList"
                style="margin-top: 10px"
                :set-size="setSize"
                :limit-size="2"
                :success="file => uploadSuccess(file, 'attnIDCardBack')"
                :disabled="disabled"
                @delImg="delImg('attnIDCardBack')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="contact_idcard" label="身份证号码:">
              <el-input
                v-model="form.contact_idcard"
                placeholder="请输入身份证号码"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="contact_name" label="身份证姓名:">
              <el-input
                v-model="form.contact_name"
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
                v-model="form.contactIdCardTimeType"
                @change="changeTime('contactIdCardTimeType')"
              >
                <el-radio :label="1">定期</el-radio>
                <el-radio :label="0">长期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item prop="contactIdCardStartTime" label="证件生效日期:">
              <el-date-picker
                v-model="form.contactIdCardStartTime"
                :picker-options="pickerOptionsStart"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="changeTime('contactIdCardStartTime')"
              />
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.contactIdCardTimeType"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item prop="contactIdCardEndTime" label="证件失效日期:">
              <el-date-picker
                v-model="form.contactIdCardEndTime"
                :picker-options="pickerOptions"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="changeTime('contactIdCardEndTime')"
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
                :files="fileDocList"
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
      <!-- 联系人 -->
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="联系人手机号:" prop="contact_phone">
            <el-input
              v-model="form.contact_phone"
              placeholder="请输入联系人手机号"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="联系人通信地址:" prop="contact_address">
            <el-input
              v-model="form.contact_address"
              placeholder="请输入联系人通信地址"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="客服电话:" prop="serv_phone">
            <el-input v-model="form.serv_phone" placeholder="请输入客服电话" />
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
          attnIDCardFront,
          attnIDCardBack,
          contact_idcard_valid = '',
          contact_idcard,
          contact_name,
          idDocNumber,
          idDocName,
          docPeriodEnd,
          contact_phone,
          contact_address,
          serv_phone
        } = v
        if (attnIDCardFront) {
          this.fileCopyList = [
            { name: 'image.png', url: attnIDCardFront, uid: '-1' }
          ]
        }
        if (attnIDCardBack) {
          this.fileNaList = [
            { name: 'image.png', url: attnIDCardBack, uid: '-1' }
          ]
        }

        const tempTimes = contact_idcard_valid
          ? contact_idcard_valid.split('/')
          : [null, null]
        const contactIdCardStartTime = tempTimes[0]
        const contactIdCardEndTime =
          tempTimes.length > 2 ? tempTimes[1] : tempTimes[0]
        const contactIdCardTimeType = tempTimes.length > 2 ? 1 : 0

        this.form = {
          attnIDCardFront,
          attnIDCardBack,
          contact_idcard_valid,
          contact_idcard,
          contact_name,
          idDocNumber,
          idDocName,
          docPeriodEnd,
          contact_phone,
          contact_address,
          serv_phone,
          contactIdCardTimeType,
          contactIdCardEndTime,
          contactIdCardStartTime
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
      const {
        contactIdCardTimeType,
        contactIdCardEndTime,
        contactIdCardStartTime
      } = this.form
      let diffTime = null
      if (
        contactIdCardTimeType &&
        contactIdCardStartTime &&
        contactIdCardEndTime
      ) {
        diffTime = moment(contactIdCardEndTime).diff(
          moment(contactIdCardStartTime),
          'years'
        )
      }
      this.form.contact_idcard_valid = `${contactIdCardStartTime}/${
        contactIdCardTimeType ? contactIdCardEndTime + '/' + diffTime : '长期'
      }`

      if (['contactIdCardEndTime', 'contactIdCardStartTime'].includes(type)) {
        this.$refs.form.validateField('contactIdCardEndTime')
        this.$refs.form.validateField('contactIdCardStartTime')
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
