<template>
  <div :id="id" class="container">
    <div class="step">
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <template v-if="current == 0">
        <div class="steps-content">
          <el-form
            ref="form"
            :model="formData"
            :rules="rules"
            :hide-required-asterisk="true"
          >
            <p class="info">您将通过上传压缩包，快速导入商品信息</p>
            <p class="info">
              请先
              <el-button type="text" @click="downTem">
                下载商品导入模板</el-button>
              <span v-if="false" style="color:#1890FF"> 下载商品导入模板</span>，填写里面excal表格资料；商品详情大图名称放入max文件夹，商品缩略图放入mini文件夹，图片名称必须和相应菜品名称相同一个菜品只能有一张缩略图和一张详情大图；如需添加多张详情大图，请上传完商品信息后在商品详情中添加。
            </p>
            <div class="content">
              <el-form-item>
                <OssUploadText :loading-up="uploading" @upload="fileUps" />
                <el-button v-if="false" type="primary">
                  点击上传商品导入表格
                </el-button>
              </el-form-item>
              <p>一次最多导入300条商品信息</p>
            </div>

          </el-form>

        </div>
      </template>
      <template v-if="current == 1">
        <div class="steps-content">
          <el-form
            ref="form"
            :model="formData"
            :rules="rules"
            :hide-required-asterisk="true"
          />
        </div>
      </template>
      <template v-if="current == 2">
        <div class="steps-content" style="text-align:center">
          <div class="class" style="margin-bottom:30px">
            <img src="@/assets/img/success-act.png" alt="成功">
          </div>
          <div class="success" style="margin-bottom:70px">
            批量上传菜品成功
          </div>
        </div>
      </template>
      <div class="steps-action">
        <a-divider v-if="current === 2" dashed />
        <!-- <a-button v-if="current < steps.length - 2" @click="cancel"> -->
        <a-button v-if="false" @click="cancel"> 取消 </a-button>&nbsp;&nbsp;
        <a-button v-if="false" type="primary" @click="handleNext">
          下一步
        </a-button>
        <a-button
          v-if="false"
          type="primary"
          :loading="loadingSave"
          @click="handleSubmit"
        >
          提交
        </a-button>
        <a-button
          v-if="current > 0 && current < steps.length - 1"
          style="margin-left: 8px"
          @click="prev"
        >
          上一步
        </a-button>
        <div v-if="current === 2">
          <el-button
            v-if="false"
            type="primary"
            @click="handleContinue"
          >继续创建</el-button>
          <el-button
            @click="$router.push({ name: 'Commoditys' })"
          >返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OssUploadText from './_components/OssUploadText'

import { fhImportBatch } from '@/api/foodtemplate'
export default {
  components: {
    OssUploadText
  },
  data() {
    return {
      uploading: false,
      formStore: {
        storeIdList: []
      },
      rulesStore: {},
      checkbox: 'checkbox',
      visibleSetDiscount: false,
      SetDiscountV: 1,
      visibleSetNumber: false,
      SetNumberV: 1,
      isIndeterminate: false,
      id: new Date(), // 重置页面
      // 选择菜品
      activeId: [], // 已选择的菜品id
      activeName: [], // 已选择的菜品name
      dialogVisibleF: false,
      current: 0,
      steps: [
        {
          title: '上传商品信息'
        },
        // {
        //   title: '核对数据'
        // },
        {
          title: '完成'
        }
      ],
      // 其他
      loadingSave: false,
      // 弹框
      dialogVisible: false,
      // 表单
      formData: {},
      rules: {}
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.app = this
  },
  methods: {
    fileUps(file) {
      this.packetPath = file
      this.oploadFn()
    },
    // 请求
    async oploadFn() {
      this.uploading = true
      try {
        const params = { packetPath: this.packetPath }
        await fhImportBatch(params)
        this.$message.success('上传菜品成功')
        this.current = 2
      } catch (e) {
        console.log(e)
      }
      this.uploading = false
    },
    downTem() {
      const a = document.createElement('a')
      a.href =
        process.env.VUE_APP_FOOD_TAMPLATE
      document.body.appendChild(a)
      a.click()
    },
    handel(fn) {
      fn()
    },
    handelCol(fn, row, index) {
      if (fn === 'deleteFood') {
        this.deleteFood(row, index)
      }
    },
    prev() {
      this.current -= 1
    },
    handleNext() {},
    handleContinue() {
      this.id = new Date()
      this.current = 0
    },
    cancel() {
      this.$confirm(
        '此操作将返回到列表页, 且当前输入的内容不会保存, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: auto !important;
  .steps-content {
    padding: 50px;
    background-color: rgba(242, 242, 242, 1);
    .content {
      background-color: #fff;
      padding: 40px 30px;
      text-align: center;
    }
  }
}
.ant-steps {
  margin-bottom: 30px;
}
.success {
  color: rgba(0, 0, 0, 0.847058823529412);
  font-size: 24px;
  font-weight: 650;
}
::v-deep .ant-upload-list-item-name {
  width: auto;
}
</style>
