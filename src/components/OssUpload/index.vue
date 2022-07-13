<!--
 * @Descripttion: 小番茄商城
 * @version: 1.0.0
 * @Author: 何吉
 * @Date: 2020-05-18 21:00:56
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-16 16:59:38
-->
<template>
  <div :class="`clearfix ${disabled && 'disabled'}`">
    <slot />
    <a-upload
      v-loading="loading"
      class="box"
      :style="uploadStyle"
      :disabled="disabled"
      list-type="picture-card"
      :accept="accept"
      :data="oss"
      :action="ossHost"
      :file-list="fileList"
      :before-upload="picBeforeUpload"
      :remove="removeFn"
      :show-upload-list="showUploadList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList && fileList.length < limit">
        <a-icon type="plus" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage">
    </a-modal>
  </div>
</template>
<script>
// api
import { fhGetOssSign } from './_util'
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      return resolve(reader.result)
    }
    reader.onerror = error => onerror(error)
  })
}
function getFile(file) {
  return new Promise((resolve, reject) => {
    const Img = new Image()
    Img.onload = function () {
      const size = getImgByteSize(this.src)
      this.size = size
      resolve(this)
    }
    Img.onerror = error => reject(error)
    Img.src = file
  })
}
function getImgByteSize(base64url) {
  // 获取base64图片大小，返回KB数字
  var str = base64url.replace('data:image/png;base64,', '')
  var equalIndex = str.indexOf('=')
  if (str.indexOf('=') > 0) {
    str = str.substring(0, equalIndex)
  }
  var strLength = str.length
  var fileLength = parseInt(strLength - (strLength / 8) * 2)
  // 由字节转换为KB
  var size = ''
  size = (fileLength / 1024).toFixed(2)
  var sizeStr = size + '' // 转成字符串
  var index = sizeStr.indexOf('.') // 获取小数点处的索引
  var dou = sizeStr.substr(index + 1, 2) // 获取小数点后两位的值
  if (dou === '00') {
    // 判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
  }
  return +size
}
export default {
  name: 'NewUpload',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    },
    // 单位 M
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
    files: {
      type: Array,
      default: () => []
    },
    uploadStyle: {
      type: Object,
      default: () => {}
    },
    id: {
      type: Number,
      default: null
    },
    status: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: null
    },
    Index: {
      type: Number,
      default: null
    },
    setSize: {
      type: Boolean,
      default: false
    },
    // 允许上传的类型
    accept: {
      type: String,
      default: 'image/*'
    },
    beforeUpload: { type: Function, default: null },
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
      previewVisible: false,
      previewImage: '',
      fileList: [],
      loading: false,
      // 显示预览或删除的配置
      showUploadList: {
        showPreviewIcon: true,
        showRemoveIcon: true
      }
    }
  },
  watch: {
    files(v) {
      let flag = true
      if (Array.isArray(v) && v.length > 0) {
        for (let i = 0; i < v.length; i++) {
          const { url } = v[i]
          flag = /png|jpg|jpeg|JPEG|JPG/.test(url || '')
        }
      }
      this.showUploadList.showPreviewIcon = flag
      this.showUploadList.showDownloadIcon = !flag
      this.fileList = v
    }
  },
  mounted() {
    this.fileList = this.files
  },
  methods: {
    // 上传前的事件
    async picBeforeUpload(opt) {
      this.loading = true
      if (this.beforeUpload) {
        const file = await getBase64(opt)
        const rawFile = await getFile(file)
        const flag = await this.beforeUpload(rawFile)
        if (flag) {
          this.loading = false
          this.$message.error(flag.message)
          return new Promise((resolve, reject) => reject(Error()))
        }
      }
      // eslint-disable-next-line prefer-const
      let { size, name, uid } = opt
      const limitSize = this.limitSize * 1024 * 1024
      if (size > limitSize) {
        this.loading = false
        this.$message.error(`上传的文件大于${this.limitSize}M, 请重新上传`)
        return new Promise((resolve, reject) => reject(Error()))
      }
      const dir = `${this.dir}/${this.path}`
      const extTemp = name.split('.')
      const extLn = extTemp.length - 1
      const ext = extTemp[extLn]
      if (this.fileName) {
        name = `${this.fileName}.${ext}`
      }
      const acceptArray = this.accept.split(',')
      if (this.accept !== 'image/*' && acceptArray.indexOf(`.${ext}`) === -1) {
        this.loading = false
        this.$message.error(`上传的文件格式不支持, 请重新上传`)
        return new Promise((resolve, reject) => reject(Error()))
      }

      const filePath = `${dir}/${uid}_${name}`
      try {
        const { results } = await fhGetOssSign({ dir })
        const { accessid: ossAccessKeyId, policy, signature, host } = results
        this.oss = { ossAccessKeyId, policy, signature, key: filePath }
        this.ossHost = host
        this.tempOss = Object.assign({}, results, { filePath })
        results['filePath'] = filePath
        this.$emit('beforeUpload', results, this.id, this.Index)
      } catch (e) {
        console.log('axios bug', e)
        this.loading = false
        return new Promise((resolve, reject) => reject(Error()))
      }
      this.loading = false
    },
    handleCancel() {
      this.previewVisible = false
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        // eslint-disable-next-line require-atomic-updates
        file.preview = await getBase64(file.originFileObj)
      }
      this.previewImage = file.url || file.preview
      this.previewVisible = true
    },
    handleChange({ file, fileList }) {
      this.fileList = fileList
      const { name, status } = file
      const { host, filePath } = this.tempOss || {}
      const src = `${host}/${filePath}`
      if (status === 'error') {
        this.$message.error('上传出错,请重试')
      } else if (status === 'done') {
        this.$emit('update:model', src)
        this.success(Object.assign({}, this.tempOss, { src, name }), this.id)
        this.$emit('change', { file, fileList, src })
      } else if (status === 'removed') {
        this.$emit('change', { file, fileList, src: '' })
      }
    },
    // 清空上传的文件
    cleanFileList() {
      this.fileList = []
    },
    removeFn(file) {
      if (this.setSize) {
        this.$emit('delAddImg', this.id, this.Index)
      }
      this.$emit('delImg')
      this.fileList = []
      this.remove(file)
    }
  }
}
</script>
<style lang="scss" scoped>
// .disabled {
//   & ::v-deep .ant-upload-list-item-actions {
//     &:hover {
//     }
//   }
// }

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.box {
  & ::v-deep.ant-upload.ant-upload-select-picture-card {
    width: 145px;
  }
  & ::v-deep .ant-upload-list-picture-card .ant-upload-list-item {
    width: 145px;
  }
}
</style>
