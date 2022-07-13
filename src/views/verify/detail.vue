<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-24 17:56:59
 * @LastEditors: HJ
 * @LastEditTime: 2021-04-25 17:26:01
-->
<template>
  <div v-loading="mainLoad" class="container">
    <el-form ref="form" :rules="formRule" :model="formData" label-width="8em">
      <el-row :gutter="30">
        <el-col v-for="(i, k) in form" :key="k" :span="i.span || 12">
          <el-form-item :label="i.label" :prop="i.field">
            <el-input
              v-if="['textarea', 'input'].includes(i.type) && i.edit"
              v-model="formData[i.field]"
              :autosize="i.auto"
              :type="i.type"
              :rows="i.rows"
              :maxlength="i.maxlength"
              :placeholder="i.placeholder"
            />

            <el-input
              v-if="['textarea', 'input'].includes(i.type) && !i.edit"
              v-model="formData[i.field]"
              :disabled="disabled"
            />

            <el-input-number
              v-if="i.type == 'number'"
              v-model.number="formData[i.field]"
              style="width: 100%"
              :min="0"
            />

            <oss-upload
              v-if="i.type === 'upload'"
              :model.sync="formData[i.field]"
              :files="ossImgs(formData[i.field])"
              :limit-size="i.limitSize"
              path="register"
            >
              <div v-if="i.remarks" class="gray">{{ i.remarks }}</div>
            </oss-upload>

            <el-date-picker
              v-if="i.type === 'time'"
              v-model="formData[i.field]"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />

            <filter-select
              v-if="i.type === 'select'"
              :data="catOption"
              :value.sync="formData[i.field]"
              vk="label"
              vl="label"
              style="width: 100%"
              disabled="true"
            />

            <el-cascader
              v-if="i.type == 'cascader'"
              v-model="formData[i.field]"
              :options="i.options || regionData"
              :props="i.props || {}"
              style="width: 100%"
              @change="item => cascaderChange(item, i.key)"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <a-divider dashed style="margin-top: 0" />
    <p>账号信息</p>
    <el-row>
      <el-col class="col" :span="8">
        <span>商家账户：{{ formData.account }}</span>
        <!-- <a-button type="link">修改</a-button> -->
      </el-col>
      <el-col class="col" :span="8">
        <span>密码：{{ formData.password }}</span>
        <a-button type="link" @click="setPass">修改</a-button>
      </el-col>
      <el-col :span="8">
        <el-form inline :model="formData">
          <el-form-item
            label="邮箱："
            prop="email"
            :rules="[
              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
              {
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              v-model="formData.email"
              style="display: inline"
              placeholder="请输入邮箱"
            />
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <a-divider dashed style="margin-top: 0" />
    <p>配送设置</p>
    <el-form ref="form" :model="formData" label-width="120px">
      <el-row>
        <!-- <el-col :span="8">
          <el-form-item label="启用配送自提柜：">
            <el-radio-group v-model="carry">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="启用自配送：" style="margin-bottom: 5px">
            <el-radio-group v-model="self">
              <el-radio :label="1">开启</el-radio>
              <el-radio :label="0">关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="self === 1 ? true : false"
            label="自配送配送费："
            prop="deliveryPrice"
            :rules="{
              required: true,
              message: '请输入',
              trigger: ['blur', 'change']
            }"
          >
            <el-input-number
              v-model="formData.deliveryPrice"
              style="width: 120px"
              :min="0"
              :precision="2"
              :controls="false"
            />
            元
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <a-divider dashed />
    <el-button type="primary" :loading="saveLoad" @click="editMerchantDetail">
      保存
    </el-button>
    <el-dialog destroy-on-close title="新增标签" :visible="newTagDigShow">
      <el-form>
        <el-form-item label="输入标签：">
          <auto-complete :data="newTags" :value.sync="newTag" vk="label" />
          <el-input v-model="newTag" placeholder="请输入标签名" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: left">
        <el-button @click="hideNewTagDig">取 消</el-button>
        <el-button type="primary" @click="addTag"> 确 定 </el-button>
      </div>
    </el-dialog>
    <SetPass
      :visible.sync="passVisible"
      :phone.sync="formData.account"
      @getMerchantDetail="getMerchantDetail"
    />
  </div>
</template>

<script>
import {
  fhGetMerchantDetail,
  fhEditMerchantDetail,
  fhGetCabDetail,
  fhGetEnable,
  fhPutCabSwitch,
  fhPutDeliverySwitch,
  fhGetOption,
  fhPutDeliveryPrice
} from '@/api/merchant'
import { regionData, CodeToText, TextToCode } from 'element-china-area-data'
import OssUpload from '@/components/OssUpload'
import FilterSelect from '@/components/FilterSelect'
import AutoComplete from '@/components/AutoComplete/Old'
import { form, ossImgs } from './_utils'
import { deepClone } from '@/utils'
import { getUserInfo } from '@/utils/auth'
import SetPass from './_components/setPass'
export default {
  name: 'VerifyedDetail',
  components: {
    OssUpload,
    FilterSelect,
    AutoComplete,
    SetPass
  },
  data() {
    const formRule = {}
    const formData = {}
    form.forEach(i => {
      if (i.type !== 'upload' && !i.unRequired) {
        const r = {
          required: true,
          message: `请输入${i.label}`,
          trigger: 'change'
        }
        formRule[i.field] = [r]
      } else {
        formRule[i.field] = []
      }
      formData[i.field] = ''
      i.rules && formRule[i.field].push(i.rules)
    })
    this.tempData = deepClone(formData)
    return {
      mainLoad: false,
      regionData,
      form,
      formRule,
      formData,
      catOption: [],
      newTagDigShow: false,
      // 标签相关
      newTags: [],
      newTag: '',
      saveLoad: false,
      carry: 1,
      self: 1,
      disabled: true,
      passVisible: false
    }
  },
  watch: {
    'formData.businessDate'(v) {
      this.setFormTime(['businessStartDate', 'businessEndDate'], v)
    },
    'formData.manageDate'(v) {
      this.setFormTime(['manageStartDate', 'manageEndDate'], v)
    },
    'formData.contractDate'(v) {
      this.setFormTime(['contractStartTime', 'contractEndTime'], v)
    },
    'formData.mainCates'(v) {
      this.setAuxCates(0, v)
    },
    'formData.auxCates'(v) {
      this.setAuxCates(1, v)
    }
  },
  created() {
    window.del = this
    this.userInfo()
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.getCats()
        this.getOption()
        this.getMerchantDetail()
      }, 500)
    })
  },
  methods: {
    ossImgs,
    async getMerchantDetail() {
      this.mainLoad = true
      try {
        const { results } = await fhGetMerchantDetail(this.id)
        const str = []
        for (const i in results.password) {
          str.push('*')
        }
        results.password = str.join('')
        this.handlerFormData(results)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.mainLoad = false
    },
    async userInfo() {
      try {
        const info = await getUserInfo()
        const obj = eval('(' + info + ')')
        this.id = obj.merchantId
      } catch (err) {
        console.log(err)
      }
    },
    // 适配处理数据
    handlerFormData(data) {
      // this.formData = data
      const {
        province,
        district,
        catLabelList,
        businessStartDate,
        businessEndDate,
        manageStartDate,
        manageEndDate,
        contractStartTime,
        contractEndTime,
        tagNameList = []
      } = data
      let { city } = data
      if (province === city) {
        city = '市直辖'
      }
      const regionRaw = [
        TextToCode[province].code,
        TextToCode[province][city].code,
        TextToCode[province][city][district].code
      ]
      const mainCates = catLabelList[0]
      const auxCates = catLabelList[1] || null
      const businessDate = [businessStartDate, businessEndDate]
      const manageDate = [manageStartDate, manageEndDate]
      const contractDate = [contractStartTime, contractEndTime]

      this.newTags = tagNameList
        ? tagNameList.map(i => {
            return {
              label: i
            }
          })
        : []

      this.formData = Object.assign({}, this.formData, data, {
        regionRaw,
        mainCates,
        auxCates: auxCates || null,
        businessDate,
        manageDate,
        contractDate
      })
    },
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
    async validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate(valid => {
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
    // 获取分类
    async getCats() {
      try {
        const { results } = await fhGetEnable()
        this.catOption = results
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 读取设置自提柜配置信息
    async getOption() {
      try {
        const { results } = await fhGetOption()
        const { carry, selfDeliveryState, deliveryPrice } = results
        this.carry = carry
        this.self = selfDeliveryState
        this.formData.deliveryPrice = deliveryPrice
        this.$forceUpdate()
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 读取设置自提柜配置信息
    async getCabDetail(params) {
      try {
        const { results } = await fhGetCabDetail(params)
        console.log(results)
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 设置自提柜开关
    async putCabSwitch(params) {
      try {
        await fhPutCabSwitch(params)
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 设置自配送开关
    async putDeliverySwitch(params) {
      try {
        await fhPutDeliverySwitch(params)
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 设置配送费信息
    async putDeliveryPrice(params) {
      try {
        await fhPutDeliveryPrice(params)
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 设置分类
    setAuxCates(i, v) {
      !this.formData.catName && (this.formData.catName = [])
      if (v.label) this.formData.catName[i] = v.label
    },
    resetForm() {
      this.formData = deepClone(this.tempData)
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    showNewTagDig() {
      this.newTagDigShow = true
    },
    hideNewTagDig() {
      this.newTag = ''
      this.newTagDigShow = false
    },
    // 创建新标签
    addTag() {
      if (!this.newTag) {
        this.$message.error('请输入标签')
        return
      }
      if (typeof this.newTag === 'string') {
        this.newTags.push({ label: this.newTag })
      } else {
        this.newTags.push(this.newTag)
      }
      this.hideNewTagDig()
    },
    // 删除一个标签
    delTag(i) {
      this.newTags.splice(i, 1)
    },
    setInfo(field) {
      this.set = field
    },
    // 保存信息
    async editMerchantDetail() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          this.$message.warning('请填写完整')
          return
        } else {
          this.handleEdit()
        }
      })
    },
    async handleEdit() {
      this.saveLoad = true
      const { mainCates, auxCates } = this.formData
      this.formData.catLabelList = [mainCates, auxCates]
      this.putCabSwitch({
        option: this.carry === 1
      })
      this.putDeliverySwitch({
        option: this.self === 1
      })
      this.putDeliveryPrice({
        defaultDeliveryPrice: this.formData.deliveryPrice
      })
      try {
        this.formData.tagNameList = this.newTags.map(i => i.label)
        await fhEditMerchantDetail(this.id, this.formData)
        this.$message.success('修改成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.saveLoad = false
    },
    setPass() {
      this.passVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.col {
  display: flex;
  align-items: center;
}
</style>
