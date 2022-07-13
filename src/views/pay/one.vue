<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-10 09:48:09
 * @LastEditors: HJ
 * @LastEditTime: 2021-05-11 15:57:10
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-position="left"
      label-width="auto"
      hide-required-asterisk
    >
      <el-form-item prop="fileList" label="营业执照扫描件:">
        <OssUpload
          style="margin-top: 10px"
          :set-size="setSize"
          :limit-size="2"
          @beforeUpload="beforeUpload"
          @delImg="delImg"
        />
        <ul>
          <li v-for="(item, index) in titleArr" :key="index" class="info-text">{{ item }}</li>
        </ul>
      </el-form-item>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="zhucehao" label="证件注册号:">
            <el-input v-model="form.zhucehao" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="name" label="商户名称:" style="margin-bottom:0">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <div class="info-text">个体工商户/党政、机关及事业单位，不能以“公司”结尾。若营业执照上商户名称为空或为“无”，请填写"个体户+经营者姓名"，如“个体户张三”</div>
      </el-form-item>
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="faren" label="经营者/法人姓名:">
            <el-input v-model="form.fileList" />
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
    form: {
      type: Object,
      default() {
        return { fileList: '', zhucehao: '', name: '', faren: '' }
      }
    }
  },
  data() {
    return {
      setSize: true,
      rules: {
        fileList: [{ required: true, message: '请上传图片' }],
        zhucehao: [{ required: true, message: '请输入吧' }],
        name: [{ required: true, message: '请输入吧' }],
        faren: [{ required: true, message: '请输入吧' }]
      },
      titleArr: [
        '（1）请上传证件的彩色扫描件或彩色数码拍摄件，黑白复印件需加盖公章（公章信息需完整） 。',
        '（2）不得添加无关水印（非微信支付商户申请用途的其他水印）。.',
        '（3）需提供证件的正面拍摄件，完整、照面信息清晰可见。信息不清晰、扭曲、压缩变形、反光、不完整均不接受.',
        '（4）不接受二次剪裁、翻拍、PS的证件照片。'
      ]
    }
  },

  mounted() {
    window.one = this
  },

  methods: {
    beforeUpload(file) {
      this.form.fileList = file
    },
    delImg() {
      this.form.fileList = ''
      this.$refs.form.validateField('fileList')
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
}
.info-text{
  color:#999999
}
</style>
