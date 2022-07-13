<!--
 * @Descripttion: 注册的第二步
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-16 10:50:23
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-12 13:41:06
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
      <el-col v-for="(i, k) in step2Form" :key="k" :span="i.span || 24">
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
              :disabled="disabled"
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
            >
            </oss-upload>
            <div v-if="i.remarks" class="gray" style="margin-top: -10px">
              {{ i.remarks }}
            </div>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import OssUpload from '@/components/OssUpload'
import { step2Form } from './_utils'
import { deepClone } from '@/utils'
export default {
  name: 'Step2',
  components: {
    OssUpload
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
    step2Form.forEach(i => {
      let r = {
        required: true,
        message: `请${i.type === 'upload' ? '上传' : '输入'}${i.label}`,
        trigger: 'change'
      }
      formRule[i.field] = [r]
    })
    this.tempData = deepClone(formData)
    return {
      step2Form,
      formRule,
      formData
    }
  },
  watch: {
    data(newVal) {
      this.formData = Object.assign({}, newVal)
    }
  },
  mounted() {
    window.step2 = this
  },
  methods: {
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
