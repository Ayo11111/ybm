<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-26 10:00:56
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-29 10:27:05
-->
<template>
  <div
    v-loading.fullscreen.lock="loading || mainLoad"
    element-loading-text="加载中..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="container"
  >
    <el-form ref="form" label-position="right" :model="formData" :rules="rules">
      <div v-for="(item, index) in business" :key="index">
        <b v-if="item.title">{{ item.title }}</b>
        <el-divider v-if="item.type === 'hr'" />
        <el-form-item
          :label="item.label"
          :prop="item.field"
          label-width="140px"
        >
          <div v-if="item.type === 'ossUpload'" class="ossBox">
            <OssUpload
              class="oss"
              :files="
                formData[item.field]
                  ? [
                      {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: formData[item.field]
                      }
                    ]
                  : []
              "
              :success="v => ossUpdateField(v, item.field)"
              @delImg="v => ossUpdateField(v, item.field)"
            />
            <div class="remarks" v-html="item.remarks" />
          </div>

          <div v-if="item.type === 'input'">
            <el-input
              v-model="formData[item.field]"
              style="width: 400px"
              :placeholder="item.placeholder"
            />
          </div>

          <div v-if="item.type === 'date'">
            <el-date-picker
              v-model="formData[item.field]"
              style="width: 400px"
              type="date"
              format="yyyy-MM-dd"
              :placeholder="item.placeholder"
              :picker-options="item.oiptions || {}"
            />
          </div>

          <a-radio-group
            v-if="item.type === 'radioTime'"
            v-model="formData[item.field]"
            :default-value="true"
          >
            <a-radio :value="true"> 长期有效 </a-radio>
            <a-radio :value="false"> 固定有效期 </a-radio><br />
            <el-date-picker
              v-show="!formData[item.field]"
              v-model="formData.businessLicenseDate"
              style="width: 350px; margin-top: 15px"
              :type="item.dateType"
              :placeholder="`请选择固定有效期`"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="getBusinessLicenseTime"
            />
          </a-radio-group>

          <div v-if="item.type === 'textarea'">
            <el-input
              v-model="formData[item.field]"
              style="width: 400px"
              :rows="4"
              type="textarea"
            />
          </div>

          <div v-if="item.type === 'select'">
            <FilterSelect
              vk="label"
              vl="label"
              vv="label"
              :data="type"
              :value.sync="value"
            />
          </div>
        </el-form-item>
      </div>
    </el-form>
    <el-button type="primary" :loading="editLoad" @click="save">保存</el-button>
    <el-button @click="getStoreDetail">取消</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fhGetStoreDetail } from '@/api/setting'
import { fhEditStore } from '@/api/stores'
import { business } from './business.js'
import OssUpload from '@/components/OssUpload'
import FilterSelect from '@/components/FilterSelect'
import {
  fhEditMerchantDetail,
  fhGetMerchantDetail
} from '@/api/merchant/index.js'
export default {
  components: {
    OssUpload,
    FilterSelect
  },
  data() {
    const rules = {}
    var validateField = (field, label, behavior) => {
      return (rule, value, callback) => {
        if (
          !this.formData[field] &&
          this.formData[field] !== false &&
          this.formData[field] !== 0
        ) {
          callback(`请${behavior}${label}`)
        } else if (this.formData[field].length === 0) {
          callback(`请${behavior}${label}`)
        } else {
          callback()
        }
      }
    }
    business.forEach(item => {
      if (item.label) {
        let r
        if (
          (item.type === 'input' && item.validate !== false) ||
          (item.type === 'textarea' && item.validate !== false)
        ) {
          r = {
            required: true,
            message: `请输入${item.label}`,
            trigger: 'blur'
          }
        } else if (item.validate === false) {
          r = null
        } else {
          r = {
            validator: validateField(item.field, item.label, item.behavior),
            trigger: 'change'
          }
        }
        r && (rules[item.field] = [r])
      }
    })
    return {
      rules,
      business,
      loading: false,
      formData: {},
      type: [
        {
          label: '食品经营许可证'
        }
      ],
      value: '食品经营许可证',
      editLoad: false,
      mainLoad: false
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    async getAllData() {
      this.mainLoad = true
      this.formData = {}
      try {
        await this.getStoreDetail()
        await this.getMerchantDetail(this.merchantInfo.merchantId)
      } catch (e) {
        console.error('获取数据错误 error:', e)
      }
      this.mainLoad = false
    },
    async getStoreDetail() {
      this.loading = true
      try {
        const { results } = await fhGetStoreDetail()
        this.formData = {
          ...this.formData,
          ...results
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async editStore() {
      this.editLoad = true
      const params = {
        ...this.formData,
        storeStatus: this.formData.storeStatus ? 1 : 0
      }
      try {
        await fhEditStore(this.formData.id, params)
        await fhEditMerchantDetail(this.merchantInfo.merchantId, params)
        this.$message.success('修改成功')
        this.getAllData()
      } catch (err) {
        console.log(err)
      }
      this.editLoad = false
    },
    async getMerchantDetail(merchantId) {
      this.loading = true
      try {
        const { results } = await fhGetMerchantDetail(merchantId)
        this.formData = {
          ...this.formData,
          ...results
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    ossUpdateField(v, key) {
      let src
      if (v) {
        src = v.src
      } else {
        src = v
      }
      this.formData[key] = src
      this.$refs.form.validateField(key)
    },
    getBusinessLicenseTime(v) {},
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editStore()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  margin: 0;
}
.ossBox {
  display: flex;
  .oss {
    &::v-deep.clearfix {
      flex: none;
    }
  }
  .remarks {
    background: #f2f2f2;
    display: flex;
    flex-flow: column;
    padding: 10px;
    height: 102px;
    line-height: 25px;
    margin-left: 10px;
  }
}
</style>
