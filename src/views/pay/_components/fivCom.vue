<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-10 09:48:09
 * @LastEditors: DXY
 * @LastEditTime: 2020-10-19 15:44:49
-->
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
      <div style="margin-left:22px;line-height:40px"><span class="info-text">营业执照/登记证书号码不是18位时必填以下组织架构代码证信息</span></div>
      <el-form-item prop="organizationCopy" label="组织架构代码照片:">
        <OssUpload
          :files="fileBLCopy"
          :disabled="disabledForm"
          style="margin-top: 10px"
          :set-size="setSize"
          @beforeUpload="beforeUpload"
          @delImg="delImg"
        />
      </el-form-item>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="organizationNumber" label="组织机构代码:">
            <el-input v-model="form.organizationNumber" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="证件有效期类型:" required>
            <el-radio-group v-model="radio" @change="changeTime">
              <el-radio :label="true">定期</el-radio>
              <el-radio :label="false">长期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item :prop="`organizationTime[0]`" label="证件生效日期:" :rules="{required:true,message:'请填写证件生效日期'}">
            <el-date-picker
              v-model="form.organizationTime[0]"
              :picker-options="pickerOptionsStart"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="changeStartTime"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="radio" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item :prop="`organizationTime[1]`" label="证件失效日期:" :rules="rules.organizationEndTime">
            <el-date-picker
              v-model="form.organizationTime[1]"
              :picker-options="pickerOptions"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import OssUpload from '@/components/OssUpload'
export default {
  components: {
    OssUpload
  },
  props: {
    disabledForm: {
      type: Boolean,
      default() {}
    },
    form: {
      type: Object,
      default() {
        return { }
      }
    }
  },
  data() {
    const organizationEndTimeV = (rules, value, callback) => {
      if (!this.form.organizationTime[0] && this.form.organizationTime[1]) { callback() }
      if (this.form.organizationTime[1] === '长期') {
        callback()
      } else {
        const start = +new Date(this.form.organizationTime[0])
        const end = +new Date(this.form.organizationTime[1])
        const flag = ((end - start) / 60 / 60 / 1000 / 24) > 60 // 大于60天
        console.log('flag', flag)
        if (flag) {
          callback()
        } else {
          callback('有效期必须大于60天')
        }
      }
    }
    return {
      fileBLCopy: [],
      radio: true,
      setSize: true,
      rules: {
        organizationCopy: [{ required: true, message: '请上传组织架构代码照片' }],
        organizationNumber: [{ required: true, message: '请填写组织机构代码' }],
        organizationEndTime: [{ required: true, message: '请填写证件失效日期', trigger: 'blur' }, { validator: organizationEndTimeV, trigger: 'blur' }]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 24 * 1 * 60 * 60 * 1000)
        }
      },
      pickerOptionsStart: { // 禁用未来时间
        disabledDate(time) {
          return time.getTime() > (Date.now() - 24 * 1 * 60 * 60 * 1000)
        }
      }
    }
  },
  created() {
    const organizationTime = typeof this.form.organizationTime === 'string' ? JSON.parse(this.form.organizationTime) : JSON.parse(JSON.stringify(this.form.organizationTime))
    this.form.organizationTime = organizationTime
    if (this.form.organizationTime[1] === '长期') {
      this.radio = false
    }
  },
  mounted() {
    window.fiv = this
    if (this.form.organizationCopy) {
      this.fileBLCopy = [{ name: 'image.png', url: this.form.organizationCopy, uid: '-1' }]
    }
  },
  methods: {
    changeStartTime() { // 改变生效日期
      this.form.organizationTime[1] && this.$refs.form.validateField('organizationTime[1]')
    },
    changeTime(val) {
      val ? this.$set(this.form.organizationTime, 1, '') : this.$set(this.form.organizationTime, 1, '长期')
    },
    beforeUpload(file) {
      this.form.organizationCopy = file.host + '/' + file.filePath
      this.$refs.form.validateField('organizationCopy')
    },
    delImg() {
      this.form.organizationCopy = ''
      this.$refs.form.validateField('organizationCopy')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-date-editor{
  width:100%
}
ul {
  padding: 0;
}
.info-text{
  color:#999999
}
li{
  line-height:24px
}
</style>
