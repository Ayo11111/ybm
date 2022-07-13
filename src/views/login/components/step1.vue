<!--
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 15:30:57
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-09 09:39:44
-->
<template>
  <el-form
    ref="step1"
    :rules="formRule"
    :model="formData"
    label-width="120px"
    size="small"
  >
    <el-row :gutter="30">
      <el-col v-for="(i, k) in form" :key="k" :span="i.span || 24">
        <el-form-item :label="i.label" :prop="i.field">
          <el-input
            v-if="['textarea', 'input'].includes(i.type)"
            v-model="formData[i.field]"
            :autosize="i.auto"
            :type="i.type"
            :rows="i.rows"
            :maxlength="i.maxlength"
            :placeholder="i.placeholder"
            :disabled="disabled"
          />

          <div v-if="i.type === 'upload'">
            <oss-upload
              style="margin-bottom: 0"
              :model.sync="formData[i.field]"
              :before-upload="i.valid"
              :disabled="disabled"
              path="register"
              :files="
                formData[i.field]
                  ? [
                      {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: formData[i.field]
                      }
                    ]
                  : []
              "
              :limit-size="i.limitSize"
              :success="v => ossUploadSuccess(v, i.field)"
              @delImg="validateField(i.field)"
            />
            <div v-if="i.remarks" class="gray" style="margin-top: -10px">
              {{ i.remarks }}
            </div>
          </div>

          <el-input
            v-if="i.type === 'inputAdr'"
            v-model="formData[i.field]"
            :disabled="disabled"
            @focus="addressFocus"
          />

          <filter-select
            v-if="i.type === 'select'"
            :data="
              i.field === 'merchantManagerType' ? ManagerTypeData : catOption
            "
            :value.sync="formData[i.field]"
            vk="label"
            vl="label"
            :vv="i.field === 'merchantManagerType' ? 'value' : 'label'"
            :disabled="
              disabled
                ? disabled
                : i.field !== 'auxCates'
                ? false
                : formData['merchantManagerType'] === 'restaurant' ||
                  formData['merchantManagerType'] === 'retail'
                ? false
                : true
            "
            clearable
            style="width: 100%"
            @change="selectChange(i.field, formData[i.field])"
          />

          <el-cascader
            v-if="i.type == 'cascader'"
            v-model="formData[i.field]"
            :options="i.options || regionData"
            style="width: 100%"
            :disabled="disabled"
            @change="item => cascaderChange(item, i.key)"
          />
        </el-form-item>
        <el-form-item
          v-if="i.field === 'businessEndDate'"
          v-show="end === '1'"
          label=""
          prop="businessLicenseEnd"
          style="margin-right: 10px"
        >
          <el-date-picker
            v-model="formData.businessEndDate"
            style="width: 180px"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            :picker-options="pickerOptions"
            :disabled="disabled"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <selectAddress
      :map-dialog-show.sync="mapDialogShow"
      :value.sync="formData['adrDetail']"
      :active-cascader.sync="formData.districtArr"
      :city="formData.city"
      @changeCascader="
        v => {
          formData.districtArr = v
        }
      "
      @change="getAddressDetails"
    />
  </el-form>
</template>

<script>
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import OssUpload from '@/components/OssUpload'
import FilterSelect from '@/components/FilterSelect'
import { form } from './_utils'
import { deepClone } from '@/utils'
import { fhCats } from '@/api/merchant'
import selectAddress from './selectAddress.vue'
// import { regStep1 } from '@/utils/tempjson'
export default {
  name: 'Step1',
  components: {
    OssUpload,
    FilterSelect,
    selectAddress
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateMobile = (rule, value, callback) => {
      const { principalMobile } = this.formData
      const regular_str = /[a-z]/i
      if (principalMobile) {
        const matching_str = principalMobile.match(regular_str)
        if (principalMobile.length === 11 && !matching_str) {
          callback()
        } else {
          callback(new Error('请输入正确的手机格式'))
        }
      } else {
        callback(new Error('请输入联系电话'))
      }
    }
    var validateAuxCates = (rule, value, callback) => {
      const { auxCates, mainCates } = this.formData
      if (auxCates) {
        if (auxCates === mainCates) {
          callback('主辅分类不能相同')
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const formRule = {}
    const formData = {
      districtArr: []
    }
    form.forEach(i => {
      let r
      if (i.field === 'principalMobile') {
        r = {
          validator: validateMobile,
          trigger: 'blur'
        }
      } else if (i.field === 'auxCates') {
        r = {
          validator: validateAuxCates,
          trigger: 'change'
        }
      } else {
        r = {
          required: true,
          message: `请${i.type === 'upload' ? '上传' : '输入'}${i.label}`,
          trigger: 'change'
        }
      }
      formRule[i.field] = [r]
      formData[i.field] = ''
      i.rules && formRule[i.field].push(i.rules)
    })
    this.tempData = deepClone(formData)
    return {
      regionData,
      form,
      formRule,
      formData,
      mapDialogShow: false,
      catOption: [],
      ti: null,
      ManagerTypeData: [
        {
          label: '餐饮',
          value: 'restaurant'
        },
        {
          label: '护理',
          value: 'nurse'
        },
        {
          label: '零售',
          value: 'retail'
        }
      ]
    }
  },
  watch: {
    'formData.mainCates'(v) {
      this.setAuxCates(0, v)
    },
    'formData.auxCates'(v) {
      this.setAuxCates(1, v)
    },
    'formData.districtArr'(v) {
      this.setAddress(v)
    },
    data(newVal) {
      if (newVal) {
        const { catName, province, city, district } = newVal
        if (catName && catName[0]) {
          const catNameArr = catName.split(',')
          newVal.mainCates = Array.isArray(catNameArr) ? catNameArr[0] : ''
          newVal.auxCates = Array.isArray(catNameArr) ? catNameArr[1] : ''
          newVal.catName = [catNameArr[0], catNameArr[1]]
          newVal.standardCategory = [catNameArr[0], catNameArr[1]]
        } else {
          delete newVal.catName
        }
        if (province) {
          newVal.districtArr = [
            TextToCode[province].code || null,
            TextToCode[province][city].code || null,
            TextToCode[province][city][district].code || null
          ]
        }
        this.formData = Object.assign({}, newVal)
      }
    }
  },
  created() {
    this.formRule['businessLicenseEnd'] = [
      {
        validator: this.validateLicenseEnd,
        trigger: 'blur'
      }
    ]
  },
  mounted() {
    window.step1 = this
    this.getCats()
  },
  methods: {
    cascaderChange(item, key) {
      this.formData.districtArr = item
    },
    setAddress(item) {
      if (item) {
        let temp = ''
        const field = ['province', 'city', 'district']
        item.forEach((i, k) => {
          temp += CodeToText[i] + '/'
          this.formData[field[k]] = CodeToText[i]
        })
        this.formData.region = temp.slice(0, -1)
        this.validateField('district')
      }
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.step1.validate(valid => {
          if (valid) {
            this.formData.catName = [
              this.formData.mainCates,
              this.formData.auxCates
            ]
            this.formData.standardCategory = [
              this.formData.mainCates,
              this.formData.auxCates
            ]
            resolve(this.formData)
          } else {
            reject('')
          }
        })
      })
    },
    // 设置时间
    setFormTime(keys, v) {
      keys.forEach((i, k) => {
        this.formData[i] = v[k]
      })
    },
    // 获取分类
    async getCats() {
      try {
        const { results } = await fhCats({ pageNumber: 1, pageSize: 9999 })
        this.catOption = results
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 设置分类
    setAuxCates(i, v) {
      !this.formData.catName && (this.formData.catName = [])
      this.formData.catName[i] = v
    },
    resetForm() {
      this.formData = deepClone(this.tempData)
    },
    clearValidate() {
      this.$refs.step1.clearValidate()
    },
    validateField(field) {
      this.$refs.step1.validateField(field)
    },
    ossUploadSuccess(v, key) {
      this.validateField(key)
    },
    addressFocus() {
      this.mapDialogShow = true
    },
    selectChange(field, value) {
      if (field === 'merchantManagerType') {
        if (value !== 'restaurant' && value !== 'retail') {
          this.formData.auxCates = ''
          this.$forceUpdate()
        }
      }
    },
    getAddressDetails(v, options) {
      const { latitude, longitude } = options
      this.formData.latitude = latitude
      this.formData.longitude = longitude
    }
  }
}
</script>
