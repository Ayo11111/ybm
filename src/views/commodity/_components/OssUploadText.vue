
<template>
  <div :class="`clearfix ${disabled && 'disabled'}`">
    <slot />
    <a-upload
      class="box"
      :style="uploadStyle"
      :disabled="disabled"
      accept="application/zip"
      :data="oss"
      :action="ossHost"
      :file-list="fileList"
      :before-upload="picBeforeUpload"
      :remove="removeFn"
      @change="handleChange"
    >
      <div v-if="fileList && fileList.length < limit">
        <a-button type="primary"> <a-icon type="upload" /> 选择导入的压缩包 </a-button>
      </div>
    </a-upload>
    <a-button
      v-if="fileList.length > 0"
      type="primary"
      :disabled="fileList.length === 0"
      :loading="loadingUp"
      style="margin-top: 16px"
      @click="handleUpload"
    >
      {{ '确认上传' }}
    </a-button>
  </div>
</template>
<script>
// api
import { fhGetOssSign } from '@/components/OssUpload/_util'
export default {
  name: 'NewUpload',
  props: {
    loadingUp: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    limitSize: {
      type: Number,
      default: 3
    },
    limitWH: {
      type: Object,
      default: () => {
        return {}
      }
    },
    uploadStyle: {
      type: Object,
      default: () => {}
    },
    model: {
      type: String,
      default: ''
    },
    beforeUpload: { type: Function, default: () => {} },
    success: { type: Function, default: () => {} },
    change: { type: Function, default: () => {} },
    remove: { type: Function, default: () => {} },
    dir: { type: String, default: 'top50-public' },
    path: { type: String, default: 'cats', require: true },
    fileName: { type: String, default: null }
  },
  data() {
    return {
      // oss签名
      oss: {},
      ossHost: '',
      fileList: []
    }
  },
  created() {
    window.test = this
  },
  methods: {
    handleUpload() {
      this.$emit('upload', this.src)
    },
    // 上传前的事件
    async picBeforeUpload(opt) {
      const { name, uid } = opt
      const dir = `${this.dir}/${this.path}`
      const filePath = `${dir}/${uid}_${name}`
      try {
        const { results } = await fhGetOssSign({ dir })
        const { accessid: ossAccessKeyId, policy, signature, host } = results
        this.oss = { ossAccessKeyId, policy, signature, key: filePath }
        this.ossHost = host
        this.tempOss = Object.assign({}, results, { filePath })
        results['filePath'] = filePath
        this.$emit('beforeUpload', results)
      } catch (e) {
        console.log('axios bug', e)
        return new Promise((resolve, reject) => reject(Error()))
      }
    },
    handleChange({ file, fileList, event }) {
      this.fileList = fileList
      const { status } = file
      const { filePath } = this.tempOss || {}
      const src = `${filePath}`

      if (status === 'done') {
        this.$emit('update:model', src)
        this.src = src
        this.success(Object.assign({}, this.tempOss, { src }))
      }
      if (status === 'error') {
        this.$message.error('上传出错,请重试')
      } else {
        this.$emit('change', { file, fileList, event })
      }
    },
    removeFn(file) {
      this.$emit('delImg')
      this.remove(file)
    }
  }
}
</script>
<style lang="scss" scoped>
.clearfix {
  flex: auto;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
