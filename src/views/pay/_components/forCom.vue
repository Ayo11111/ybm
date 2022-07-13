<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="right"
      label-width="150px"
      :disabled="disabledForm"
    >
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="超级管理员类型:" prop="contactType">
            <el-select v-model="form.contactType" placeholder="请选择">
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
          <el-form-item label="超级管理员姓名:" prop="contactName">
            <el-input v-model="form.contactName" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="超管身份证号码:" prop="contactIdCardNumber">
            <el-input v-model="form.contactIdCardNumber" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="超管手机号码:" prop="mobilePhone">
            <el-input v-model="form.mobilePhone" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="超管邮箱:" prop="contactEmail">
            <el-input v-model="form.contactEmail" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { validEmail, validPhone, validIdCard } from '@/utils/validate.js'
export default {
  props: {
    disabledForm: {
      type: Boolean,
      default() {}
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    var validEmailFn = (rules, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (validEmail(value)) {
          callback()
        } else {
          callback('邮箱格式不正确')
        }
      }
    }
    var validPhonelFn = (rules, value, callback) => {
      if (validPhone(value)) {
        callback()
      } else {
        callback('手机号码格式不正确')
      }
    }
    return {
      optionsType: [
        { label: '经营者/法人', value: '65' },
        { label: '负责人', value: '66' }
      ],
      rules: {
        contactType: [{ required: true, message: '请选择超级管理员类型' }],
        contactName: [{ required: true, message: '请填写超级管理员姓名' }],
        contactIdCardNumber: [
          { required: true, message: '请填写超管身份证号码' }, { validator: validIdCard }
        ],
        mobilePhone: [{ required: true, message: '请填写超管手机号码' }, { validator: validPhonelFn }],
        contactEmail: [{ required: true, message: '请填写超管邮箱' }, { validator: validEmailFn }]
      }
    }
  },

  created() {
    this.$route.params.organizationType = +window.localStorage.getItem('organizationType')
  },
  mounted() {
    window.fore = this
  },
  methods: {}
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
  margin: 0;
}
.info-text {
  color: #999999;
}
li {
  line-height: 24px;
}
</style>
