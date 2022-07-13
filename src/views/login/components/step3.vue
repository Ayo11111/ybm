<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-06 10:07:12
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-12 13:42:31
-->
<template>
  <el-form
    ref="step2"
    :rules="formRule"
    :model="formData"
    label-width="14em"
    size="small"
  >
    <el-row :gutter="30">
      <el-col v-for="(i, k) in step3Form" :key="k" :span="i.span || 24">
        <!-- <b v-if="i.label === '法人姓名'">
          法人信息
        </b> -->
        <!-- <div v-if="i.label === '营业执照电子照'">
          <a-divider />
          <b>营业执照</b>
        </div> -->
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

          <el-input-number
            v-if="i.type == 'number'"
            v-model.number="formData[i.field]"
            style="width: 100%"
            :min="0"
            :disabled="disabled"
          />

          <el-date-picker
            v-if="i.type === 'time' && i.field !== 'businessEndDate'"
            v-model="formData[i.field]"
            style="width: 100%"
            :type="i.dateType"
            :placeholder="`请选择${i.label}`"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="i.oiptions || {}"
            :disabled="disabled"
          />

          <div v-if="i.type === 'upload'">
            <oss-upload
              style="margin-bottom: 0"
              :model.sync="formData[i.field]"
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
              :before-upload="i.valid"
              path="register"
              :limit-size="i.limitSize"
              :success="v => ossUploadSuccess(v, i.field)"
              :disabled="disabled"
            >
            </oss-upload>
            <div v-if="i.remarks" class="gray" style="margin-top: -10px">
              {{ i.remarks }}
            </div>
          </div>

          <a-radio-group
            v-model="formData.businessLicenseStatus"
            v-if="i.type === 'radioTime'"
            :default-value="true"
            @change="$refs.step2.validateField(i.field)"
            :disabled="disabled"
          >
            <a-radio :value="true">
              长期有效
            </a-radio>
            <a-radio :value="false"> 固定有效期 </a-radio><br />
            <el-date-picker
              v-show="!formData.businessLicenseStatus"
              v-model="formData.businessDate"
              style="width: 350px;;margin-top: 10px"
              :type="i.dateType"
              :placeholder="`请选择固定有效期`"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="getBusinessLicenseTime"
              :disabled="disabled"
            />
          </a-radio-group>

          <el-cascader
            v-if="i.type == 'cascader'"
            :options="i.options || regionData"
            :props="i.props || {}"
            style="width: 100%"
            @change="item => cascaderChange(item, i.key)"
            :disabled="disabled"
          />
        </el-form-item>
        <el-form-item
          label=""
          v-if="i.field === 'businessEndDate'"
          v-show="end === '1'"
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
  </el-form>
</template>

<script>
import { regionData, CodeToText } from 'element-china-area-data'
import OssUpload from '@/components/OssUpload'
import FilterSelect from '@/components/FilterSelect'
import { step3Form } from './_utils'
import { deepClone, parseTime } from '@/utils'
// import { regStep1 } from '@/utils/tempjson'
export default {
  name: 'Step2',
  components: {
    OssUpload,
    FilterSelect
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
    const formRule = {}
    const formData = {}
    var validateLicenseEnd = (rule, value, callback) => {
      if (this.end === '1' && !this.formData.businessEndDate) {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    }
    var validateBusinessLicense = (rule, value, callback) => {
      if (this.formData.businessLicenseStatus) {
        callback()
      } else {
        if (this.formData.businessStartDate && this.formData.businessEndDate) {
          callback()
        } else {
          callback(new Error('请选择营业执照有效期'))
        }
      }
    }
    step3Form.forEach(i => {
      let r
      if (i.field === 'businessLicenseStatus') {
        r = {
          validator: validateBusinessLicense,
          trigger: ['blur', 'change']
        }
      } else {
        r = {
          required: true,
          message: `请${i.type === 'upload' ? '上传' : '输入'}${i.label}`,
          trigger: 'change'
        }
      }
      if (i.field !== 'businessEndDate' && i.field !== 'auxCates') {
        formRule[i.field] = [r]
        formData[i.field] = ''
        i.rules && formRule[i.field].push(i.rules)
      } else if (i.field === 'businessEndDate') {
        formData[i.field] = ''
      }
      if (i.field === 'businessLicenseStatus') {
        formData[i.field] = true
      }
    })
    this.tempData = deepClone(formData)
    return {
      regionData,
      step3Form,
      formRule,
      formData,
      time: 1,
      catOption: [],
      end: '1',
      pickerOptions: {
        disabledDate: date => {
          const time = new Date().valueOf()
          return time > date.valueOf()
        }
      },
      validateLicenseEnd
    }
  },
  watch: {
    data(newVal) {
      const { businessStartDate, businessEndDate } = newVal
      newVal.businessDate = [businessStartDate || '', businessEndDate || '']
      this.formData = Object.assign({}, newVal)
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
    window.step2 = this
  },
  methods: {
    cascaderChange(item, key) {
      switch (key) {
        case 'region':
          this.handlerPCD(item)
          break
        case 'standardCategory':
          this.handlerSC(item)
          break
      }
    },
    handlerPCD(item) {
      let temp = ''
      const field = ['province', 'city', 'district']
      item.forEach((i, k) => {
        temp += CodeToText[i] + '/'
        this.formData[field[k]] = CodeToText[i]
      })
      this.formData.region = temp.slice(0, -1)
    },
    handlerSC(item) {
      this.formData.standardCategory = item
    },
    getBusinessLicenseTime(v) {
      if (v) {
        const [startTime, endTime] = v
        this.formData.businessStartDate = startTime
        this.formData.businessEndDate = endTime
      } else {
        this.formData.businessStartDate = null
        this.formData.businessEndDate = null
      }
      this.$forceUpdate()
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.step2.validate(valid => {
          if (valid) {
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
    // 设置分类
    setAuxCates(i, v) {
      !this.formData.catName && (this.formData.catName = [])
      this.formData.catName[i] = v.label
    },
    resetForm() {
      this.formData = deepClone(this.tempData)
    },
    clearValidate() {
      this.$refs.step2.clearValidate()
    },
    ossUploadSuccess(v, key) {
      this.$message.success('上传成功')
      this.$refs.step2.clearValidate(key)
    }
  }
}
</script>
