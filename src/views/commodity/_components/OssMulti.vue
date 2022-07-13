<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-25 15:06:22
 * @LastEditors: DXY
 * @LastEditTime: 2020-10-09 16:09:01
-->
<template>
  <div>
    <div class="clearfix">
      <a-upload
        :file-list="fileList"
        :remove="handleRemove"
        :before-upload="beforeUpload"
      >
        <a-progress
          v-if="percent !== 0"
          type="circle"
          :percent="percent"
          style="display:block"
          stroke-color="#52ACFF"
        />
        <a-button v-if="fileList.length === 0" type="primary">
          <a-icon type="upload" />选择上传文件
        </a-button>
      </a-upload>
      <a-button
        v-if="fileList.length > 0"
        type="primary"
        :disabled="fileList.length === 0"
        :loading="uploadingType"
        style="margin-top: 16px"
        @click="handleUpload"
      >
        {{ uploadingType ? '上传中' : '确认上传' }}
      </a-button>
    </div>
  </div>
</template>

<script>
import DB from '../_utils/indexLib'
import { creatuuid } from '@/utils/index.js'
var OSS = require('ali-oss')

export default {
  props: {
    uploading: {
      type: Boolean,
      default() {}
    }
  },
  data() {
    return {
      fileList: [],
      percent: 0,
      successUp: false,
      uploadingType: this.uploading || false
    }
  },
  watch: {
    uploading(v) {
      this.uploadingType = v
    }
  },
  async mounted() {
    window.ossmulti = this
    // 断点续传
    const result = await DB.getCats()
    if (result.length > 0) {
      const { file, name, checkpoint } = result[0]
      this.multipartUpload(name, file, checkpoint)
    }
  },
  methods: {
    // 分片上传进度
    progress(p, _checkpoint) {
      console.log('ppp', p)
      console.log(_checkpoint)
      this.percent = parseInt(p * 100)
      if (_checkpoint) {
        DB.saveCat({
          id: 1,
          checkpoint: _checkpoint,
          file: _checkpoint.file,
          name: _checkpoint.name
        })
      }
    },
    async multipartUpload(name, file, checkpoint = null) {
      console.log('after', file)
      try {
        const client = new OSS({
          region: 'oss-cn-shenzhen',
          accessKeyId: 'LTAI4FqC3vDNm6wfZsjNhXBK',
          accessKeySecret: 'Y3rBsXOe9cFciohV6xFYJGktrpsmCN',
          bucket: 'top50-dev'
          // region: 'oss-cn-beijing',
          // accessKeyId: 'LTAI4FgdMgX7AZ9FCAynxguU',
          // accessKeySecret: 'NAVKasLiXaYyCyw4EgQtLX2ybWjG2W',
          // bucket: 'main-test'
        })
        const result = await client.multipartUpload(name, file, {
          progress: this.progress,
          checkpoint,
          meta: {
            year: 2020,
            people: 'test'
          }
        })
        console.log(result)
        const head = await client.head(name)
        console.log({ head })
        DB.deleteCat(1)
        return Promise.resolve({ status: 'success', code: 200, result: result })
      } catch (e) {
        // 捕获超时异常。
        if (e.code === 'ConnectionTimeoutError') {
          console.log('TimeoutError')
          // do ConnectionTimeoutError operation
        }
        console.log(e)
        return Promise.reject(e)
      }
    },

    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    async handleUpload() {
      if (this.successUp && this.pathName) {
        this.$emit('fileUp', this.pathName)
      } else {
        this.uploadingType = true
        const { fileList } = this
        const formData = new FormData()
        fileList.forEach(async file => {
          formData.append('files[]', file)
          console.log('before', file)
          const name = `top50/merchant/food/${creatuuid(25)}_${file.name}`
          const { status, result } = await this.multipartUpload(name, file)
          if (status === 'success') {
            this.successUp = true
            this.pathName = result.name
            this.$emit('fileUp', result.name)
            this.uploadingType = false
          } else {
            this.uploadingType = false
            this.$message.error(`上传失败:${result}`)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .anticon-check {
  color: #52ACFF;
}
</style>
