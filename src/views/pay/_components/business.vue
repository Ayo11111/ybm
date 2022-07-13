<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-10 09:48:09
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-04-28 16:29:07
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
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="mch_type" label="商户类型:">
            <filter-select
              vv="value"
              vk="value"
              vl="label"
              style="width: 100%"
              :data="merchantTypeEnum"
              :value.sync="form.mch_type"
              @change="getValue"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="company" label="公司名称:">
            <el-input
              v-model="form.company"
              placeholder="请输入公司名称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="short_name" label="公司简称:">
            <el-input
              v-model="form.short_name"
              placeholder="请输入公司简称"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="address" label="公司地址:">
            <el-cascader
              v-model="form.companyAddress"
              :options="regionData"
              style="width: 100%; margin-bottom: 20px"
              @change="cascaderChange"
            />
            <el-input
              v-model="form.address"
              placeholder="请输入公司地址"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="form.mch_type !== 2">
        <el-form-item :label="licenceTip" prop="licence">
          <OssUpload
            :files="fileBLCopy"
            style="margin-top: 10px"
            :set-size="setSize"
            :limit-size="0.5"
            accept=".jpeg,.jpg,.png,.bmp,.gif"
            :success="({ src }) => success(src, 'licence')"
            :disabled="disabled"
            @delImg="delImg('licence')"
          />
          <template v-if="form.mch_type !== 2">
            <li
              v-for="(item, index) in titleArr"
              :key="index"
              class="info-text"
            >
              {{ item }}
            </li>
          </template>
        </el-form-item>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item :label="licIdTip" prop="lic_id">
              <el-input v-model="form.lic_id" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item label="营业期限:" required>
              <el-radio-group
                v-model="form.businessTermType"
                @change="changeTime('businessTermType')"
              >
                <el-radio :label="1">定期</el-radio>
                <el-radio :label="0">长期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
            <el-form-item
              prop="businessStartTime"
              label="证件生效日期:"
              :rules="rules.businessStartTime"
            >
              <el-date-picker
                v-model="form.businessStartTime"
                :picker-options="pickerOptionsStart"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="changeTime('businessStartTime')"
              />
            </el-form-item>
          </el-col>
          <el-col
            v-if="form.businessTermType"
            :xs="24"
            :sm="12"
            :md="12"
            :lg="12"
            :xl="12"
          >
            <el-form-item
              prop="businessEndTime"
              label="证件失效日期:"
              :rules="rules.businessEndTime"
            >
              <el-date-picker
                v-model="form.businessEndTime"
                :picker-options="pickerOptions"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                @change="changeTime('businessEndTime')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item label="门店门头照:" prop="storeFront">
        <OssUpload
          :files="
            form.storeFront
              ? [
                {
                  name: 'image',
                  url: form.storeFront,
                  uid: '-1'
                }
              ]
              : []
          "
          style="margin-top: 10px"
          :set-size="setSize"
          :limit-size="0.5"
          accept=".jpeg,.jpg,.png,.bmp,.gif"
          :success="({ src }) => success(src, 'storeFront')"
          :disabled="disabled"
          @delImg="delImg('storeFront')"
        />
        <li class="info-text">
          请上传门店照片（要求门店招牌清晰可见）。若为停车场、售卖机等无固定门头照片的经营场所，请提供真实的经营现场照片即可；
        </li>
        <li class="info-text">
          图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内
        </li>
      </el-form-item>
      <el-form-item label="店内场景照:" prop="inStoreScene">
        <OssUpload
          :files="
            form.inStoreScene
              ? [
                {
                  name: 'image',
                  url: form.inStoreScene,
                  uid: '-1'
                }
              ]
              : []
          "
          style="margin-top: 10px"
          :set-size="setSize"
          :limit-size="0.5"
          accept=".jpeg,.jpg,.png,.bmp,.gif"
          :success="({ src }) => success(src, 'inStoreScene')"
          :disabled="disabled"
          @delImg="delImg('inStoreScene')"
        />
        <li class="info-text">
          请上传门店内部环境照片。若为停车场、售卖机等无固定门头照片的经营场所，请提供真实的经营现场照片即可；
        </li>
        <li class="info-text">
          图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内
        </li>
      </el-form-item>
      <el-form-item label="收银台照:" prop="checkoutCounter">
        <OssUpload
          :files="
            form.checkoutCounter
              ? [
                {
                  name: 'image',
                  url: form.checkoutCounter,
                  uid: '-1'
                }
              ]
              : []
          "
          style="margin-top: 10px"
          :set-size="setSize"
          :limit-size="0.5"
          accept=".jpeg,.jpg,.png,.bmp,.gif"
          :success="({ src }) => success(src, 'checkoutCounter')"
          :disabled="disabled"
          @delImg="delImg('checkoutCounter')"
        />
        <li class="info-text">
          请上收银台照片。若为停车场、售卖机等无固定收银台的经营场所，请提供真实的经营现场照片即可；
        </li>
        <li class="info-text">
          图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内
        </li>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import OssUpload from '@/components/OssUpload'
import FilterSelect from '@/components/FilterSelect'
import { rules, merchantTypeEnum } from '../_utils/index'
export default {
  components: {
    OssUpload,
    FilterSelect
  },
  props: {
    value: {
      type: Object,
      default() {
        return {
          businessTermType: 0
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 校验营业执照的时间
    const businessEndTimeV = (rules, value, callback) => {
      if (!this.form.businessStartTime && this.form.businessEndTime) {
        callback()
      }
      if (this.form.businessEndTime === '长期') {
        callback()
      } else {
        const start = +new Date(this.form.businessStartTime)
        const end = +new Date(this.form.businessEndTime)
        const flag = (end - start) / 60 / 60 / 1000 / 24 > 60 // 大于60天
        if (flag) {
          callback()
        } else {
          callback('有效期必须大于60天')
        }
      }
    }
    // 校验公司地址
    const valifyAddress = (rules, value, callback) => {
      const { province, city, county_name } = this.form
      if (!province || !city || !county_name) callback('请选择公司地址的省市区')
      else if (!value) callback('请输入公司地址')
      else callback()
    }

    return {
      merchantTypeEnum,
      form: {
        businessTermType: 0
      },
      regionData,
      organizationType: '',
      fileBLCopy: [],
      radio: true,
      setSize: true,
      rules: {
        ...rules,
        address: [
          { required: true, message: '请输入公司地址' },
          { validator: valifyAddress, trigger: 'change' }
        ],
        businessEndTime: [
          { required: true, message: '请填写证件失效日期', trigger: 'blur' },
          { validator: businessEndTimeV, trigger: 'blur' }
        ]
      },
      titleArr: [
        '请上传彩色照片 or 彩色扫描件 or 加盖公章鲜章的复印件，可添加“微信支付”相关水印（如微信支付认证）',
        '图片支持上传格式：jpeg、png、bmp、gif，上传大小限制：500k以内'
      ],
      pickerOptions: {
        // 禁用过去时间
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
  computed: {
    licenceTip() {
      const { mch_type } = this.form
      return mch_type === 2 ? '身份证人像面照片' : '营业执照照片'
    },
    licIdTip() {
      const { mch_type } = this.form
      return mch_type === 2 ? '身份证号码' : '营业执照号'
    }
  },
  watch: {
    value: {
      handler(v) {
        const {
          province,
          city,
          storeFront,
          inStoreScene,
          checkoutCounter,
          county_name,
          licence,
          lic_valid = '',
          mch_type = 0,
          company,
          short_name,
          address,
          lic_id
        } = v
        const companyAddress = province
          ? [
            TextToCode[province].code,
            TextToCode[province][city].code,
            TextToCode[province][city][county_name].code
          ]
          : null

        const tempBusinessTime = lic_valid.split('/')

        const businessStartTime = tempBusinessTime[0]
        const businessEndTime =
          tempBusinessTime.length > 2
            ? tempBusinessTime[1]
            : tempBusinessTime[0]
        const businessTermType = tempBusinessTime.length > 2 ? 1 : 0

        this.form = {
          licence,
          mch_type,
          company,
          short_name,
          address,
          lic_id,
          companyAddress,
          businessStartTime,
          businessEndTime,
          businessTermType,
          province,
          city,
          county_name,
          lic_valid,
          storeFront,
          inStoreScene,
          checkoutCounter
        }
        console.log(this.form)
        if (licence) {
          this.fileBLCopy = [{ name: 'image.png', url: licence, uid: '-1' }]
        }
        this.$forceUpdate()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    changeTime(type) {
      // true 定期
      // false 长期
      const moment = this.$moment
      const { businessTermType, businessEndTime, businessStartTime } = this.form
      let diffTime = null
      if (businessTermType && businessStartTime && businessEndTime) {
        diffTime = moment(businessEndTime).diff(
          moment(businessStartTime),
          'years'
        )
      }
      this.form.lic_valid = `${businessStartTime}/${
        businessTermType ? businessEndTime + '/' + diffTime : '长期'
      }`

      if (['businessEndTime', 'businessStartTime'].includes(type)) {
        this.$refs.form.validateField('businessEndTime')
        this.$refs.form.validateField('businessStartTime')
      }
    },
    success(src, field) {
      this.form[field] = src
      const form = this.$refs.form
      src ? form.clearValidate(field) : form.validateField(field)
    },
    delImg(field) {
      this.form[field] = ''
      this.$refs.form.validateField(field)
    },
    cascaderChange(values) {
      const [province, city, county_name] = values
      this.form = {
        ...this.form,
        province: CodeToText[province],
        city: CodeToText[city],
        county_name: CodeToText[county_name]
      }
    },
    getValue(v) {
      const { value } = v
      this.$emit('update:mch_type', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor {
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
</style>
