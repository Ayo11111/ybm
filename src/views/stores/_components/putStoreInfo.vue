<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-11 10:41:51
 * @LastEditors: HJ
 * @LastEditTime: 2021-09-23 03:01:40
-->
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    width="60%"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="100px">
      <el-form-item
        v-for="(item, index) in upFormLabelData"
        :key="index"
        :label="item.label"
        :prop="item.field"
      >
        <a-input
          v-if="item.type === 'input'"
          v-model="formData[item.field]"
          style="width: 320px"
          @change="$refs.form.validateField(item.field)"
        />

        <a-textarea
          v-if="item.type === 'textarea'"
          v-model="formData[item.field]"
          class="textarea"
          @change="$refs.form.validateField(item.field)"
        />

        <div
          v-if="item.type === 'catsSelect'"
          style="width: 100%; display: flex; flex-flow: column"
        >
          <el-form-item
            label="主营品类（必填）"
            label-width="140px"
            style="dsiplay: flex; margin-bottom: 20px; width: 360px"
            prop="mainCates"
            :rules="{
              validator: validateField('mainCates', '主营品类', '选择'),
              trigger: 'change'
            }"
          >
            <filter-select
              :data="catOption"
              :value.sync="formData['mainCates']"
              vk="label"
              vl="label"
              vv="label"
              clearable
              @change="$refs.form.validateField('mainCates')"
            />
          </el-form-item>
          <el-form-item
            v-show="merchantInfo.merchantManagerType !== 'nurse'"
            label="辅营品类（非必填）"
            label-width="140px"
            style="margin-bottom: 10px"
            prop="auxCates"
          >
            <filter-select
              :data="catOption"
              :value.sync="formData['auxCates']"
              vk="label"
              vl="label"
              vv="label"
              clearable
            />
          </el-form-item>
          <div style="color: #7f7f7f">
            经营品类修改需要经过平台BD审核，审核通过后方可生效。
          </div>
        </div>

        <div v-if="item.type === 'ossUpload'">
          <OssUpload
            :files="Image"
            :success="v => ossUploadSuccess(v, item.field)"
            :limit-size="item.limitSize"
            @delImg="delImg(item.field)"
          />
          <div v-if="item.field === 'logoImage'" class="ossText">
            <!-- {{ formData[item.field] }} -->
            <span>请不要上传门脸牌匾和店内环境作为头像</span>
            <span>店铺头像修改需要平台BD审核，请谨慎修改</span>
            <span>
              图片不得大于2MB，格式JPG/PNG，宽高比4:3，尺寸不小于320*240像素
            </span>
            <span>好的头像可多吸引5%的新客</span>
          </div>
        </div>

        <template v-if="item.type === 'checkedDay'">
          <el-checkbox-group
            v-model="formData[item.field]"
            @change="v => getCheckDay(v, item.field)"
          >
            <el-checkbox
              v-for="day in item.data"
              :key="day.value"
              :label="day.value"
            >
              {{ day.label }}
            </el-checkbox>
          </el-checkbox-group>
        </template>

        <div v-if="item.type === 'rangeTime'">
          <el-time-picker
            v-model="formData['time']"
            is-range
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            format="HH:mm"
            value-format="HH:mm:ss"
            @change="v => getTime(v, item.field)"
          />

          <!-- :rules="{
                validator: validateItemTime,
                trigger: 'change'
              }" -->
          <!-- <div
            v-for="(item, index) in timeJson"
            :key="index"
            style="margin-bottom: 18px"
          >
            <el-form-item :prop="`${index}-time`">
              <el-time-picker
                is-range
                v-model="item.time"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
                value-format="HH:mm:ss"
              >
              </el-time-picker>
              <a-button
                type="link"
                style="color: red"
                @click="deleteItemTime(index)"
              >
                删除时间段
              </a-button>
            </el-form-item>
          </div>
          <el-form-item prop="time">
            <el-button
              type="primary"
              style="margin-top: 5px"
              @click="addItemTime"
            >
              添加时间段
            </el-button>
          </el-form-item> -->
        </div>

        <a-radio-group
          v-if="item.type === 'radioType'"
          v-model="formData[item.field]"
          :default-value="1"
        >
          <a-radio :value="0">外卖模式</a-radio>
          <a-radio :value="1">食堂模式</a-radio>
          <div v-if="formData.storeType === 0">
            <div style="display: flex; align-items: center; margin-top: 2px;">
              <span>接受预订时间</span>
              <el-form-item
                label=""
                prop="appointmentStart"
                :rules="{
                  validator: validateField(
                    'appointmentStart',
                    '接受预定开始时间',
                    '选择'
                  ),
                  trigger: 'change'
                }"
              >
                <filter-select
                  :data="computedTimes([
                    { label: '当天', value: 1 },
                    { label: '明天', value: 2 },
                    { label: '后天', value: 3 },
                    { label: '后2天', value: 4 },
                    { label: '后3天', value: 5 },
                    { label: '后4天', value: 6 },
                    { label: '后5天', value: 7 },
                    { label: '后6天', value: 8 }
                  ])"
                  :value.sync="formData['appointmentStart']"
                  vk="label"
                  vl="label"
                  vv="value"
                  clearable
                  style="flex: 1"
                />
              </el-form-item>
              <span style="margin: 0 8px">--</span>
              <el-form-item
                label=""
                prop="appointmentEnd"
                :rules="{
                  validator: validateField(
                    'appointmentEnd',
                    '接受预定结束时间',
                    '选择'
                  ),
                  trigger: 'change'
                }"
              >
                <filter-select
                  :data="[
                    { label: '当天', value: 1 },
                    { label: '明天', value: 2 },
                    { label: '后天', value: 3 },
                    { label: '后2天', value: 4 },
                    { label: '后3天', value: 5 },
                    { label: '后4天', value: 6 },
                    { label: '后5天', value: 7 },
                    { label: '后6天', value: 8 }
                  ]"
                  :value.sync="formData['appointmentEnd']"
                  vk="label"
                  vl="label"
                  vv="value"
                  clearable
                  style="flex: 1"
                />
              </el-form-item>
            </div>
            <div class="ossText" style="margin-top: 12px">
              <span>
                最早日期：最早日期是用户最少需要提前下单的天数，如果不选“当天”，则用户不能下要求今日送达的订单（例如：最早日期为“隔天”，则用户今日最快只能下明天备货配送的订单）
              </span>
              <span>
                最长日期：最长日期即用户要求送达的最多天数（例如：最长日期为隔天，则用户今日下单可要求明日配送的订单，不可下要求后天配送的订单）
              </span>
              <span>
                跨天预订单按照订单送达日期结算。例如：1月1日预定1月3日送达的订单，会和1月3日非预定单一起结算；
              </span>
              <span>
                跨天预订单接单后，有可能在配送当日才有配送员接单，请耐心等待；
              </span>
              <span>
                开启本功能后，请务必关注预订单中用户指定要求的配送日期，避免在非指定配送日发货，造成损失。
              </span>
            </div>
          </div>
          <div v-if="formData.storeType === 1">
            <div style="margin-top: 2px;">
              预定周期
              <filter-select
                :data="[{ label: '1周（7天）', value: 1 }, { label: '2周（14天）', value: 2 }]"
                :value.sync="formData.shitangBookingWeeks"
                vk="label"
                vl="label"
                vv="value"
                clearable
              />（自然周）
            </div>
            <div style="margin-top: 2px;">
              需提前
              <el-input-number
                v-model="formData.forwardDays"
                :min="0"
                :max="10">
              </el-input-number>
              天预订（如果设置0则表示当天可预定）
            </div>
            <div style="margin-top: 2px;">
              当餐预定需要提前
              <el-input-number
                v-model="formData.forwardHours"
                :min="1"
                :max="10">
              </el-input-number>
              小时
            </div>
          </div>
        </a-radio-group>

        <a-radio-group
          v-if="item.type === 'radio'"
          v-model="formData[item.field]"
          :options="item.data"
          :default-value="item.default"
        />

        <div v-if="item.type === 'select'" style="flex: 1">
          <span v-if="item.frontText">{{ item.frontText }} </span>
          <filter-select
            :data="item.data"
            :value.sync="formData[item.field]"
            vk="label"
            vl="label"
            vv="value"
            clearable
            style="flex: 1"
          />
          <span v-if="item.afterText"> {{ item.afterText }}</span>
          <div v-if="item.brText" style="color: #7f7f7f">
            {{ item.brText }}
          </div>
        </div>
      </el-form-item>
      <el-form-item v-if="formData.storeType === 0" label="预订单提醒">
        <span>送达时间</span>
        <filter-select
          :data="[
            { label: '60', value: 60 },
            { label: '45', value: 45 },
            { label: '30', value: 30 },
            { label: '15', value: 15 }
          ]"
          :value.sync="formData.productionReminderTime"
          vk="label"
          vl="label"
          vv="value"
          clearable
          style="flex: 1"
        />
        <span>分钟前提醒备餐</span>
      </el-form-item>
      <el-form-item v-if="formData.storeType === 0" label="出餐时间">
        <filter-select
          :data="[
            { label: '60', value: 60 },
            { label: '55', value: 55 },
            { label: '50', value: 50 },
            { label: '45', value: 45 },
            { label: '40', value: 40 },
            { label: '35', value: 35 },
            { label: '30', value: 30 },
            { label: '25', value: 25 },
            { label: '20', value: 20 },
            { label: '15', value: 15 },
            { label: '10', value: 10 },
            { label: '5', value: 5 }
          ]"
          :value.sync="formData.productionTime"
          vk="label"
          vl="label"
          vv="value"
          clearable
          style="flex: 1"
        />
        <div style="color: #7f7f7f">
          出餐时间是指从接单到完成备餐需要的时间，骑手会参考出餐时间到店取餐，请准确填写。
        </div>
      </el-form-item>
      <el-form-item v-if="formData.storeType === 0" label="接单方式">
        <filter-select
          :data="[
            { label: '自动接单', value: true },
            { label: '手动接单', value: false }
          ]"
          :value.sync="formData.autoOrderStatus"
          vk="label"
          vl="label"
          vv="value"
          clearable
          style="flex: 1"
        />
      </el-form-item>
      <el-form-item v-if="formData.storeType === 1" label="退款方式">
        <el-select v-model="formData.refundDelayTime" placeholder="请选择退款方式">
          <el-option label="次日可退款" :value="1"></el-option>
          <el-option label="下一餐可退款（需提前2小时）" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.storeType === 1" label="退款说明">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入退款说明"
          v-model="formData.refundInstructions">
        </el-input>
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { store, catImg, business, other } from './putStoreInfo'
import FilterSelect from '@/components/FilterSelect'
import OssUpload from '@/components/OssUpload'
import {
  fhCats,
  fhPutDeliveryPrice,
  fhEditMerchantDetail
} from '@/api/merchant'
import { fhEditStore } from '@/api/stores'
import { setOrderMode } from '@/utils/auth'
import { deepClone } from '@/utils'
export default {
  components: {
    FilterSelect,
    OssUpload
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: null
    },
    data: {
      type: Object,
      default: {}
    },
    merchantManagerType: {
      type: String,
      default: ''
    },
    merchant: {
      type: Object,
      default: {}
    }
  },
  data() {
    var validateItemTime = (rule, value, callback) => {
      const { field } = rule
      const index = field.split('-')[0]
      const { time } = this.timeJson[index]
      if (time) {
        callback()
      } else {
        callback(new Error('请选择时间段'))
      }
    }
    var validateTime = (rule, value, callback) => {
      if (this.timeJson.length > 0) {
        callback()
      } else {
        callback(new Error('请添加时间段'))
      }
    }
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
    return {
      validateItemTime,
      validateTime,
      validateField,
      store,
      catImg,
      business,
      other,
      confirmLoading: false,
      formData: {},
      catOption: [],
      checkList: [],
      timeJson: [],
      Image: [],
      ti: null
    }
  },
  computed: {
    ...mapGetters(['merchantInfo']),
    title() {
      return ['店铺信息', '品类和头像', '营业设置', '其他服务'][this.type]
    },
    formLabelData() {
      return [store, catImg, business, other][this.type]
    },
    upFormLabelData() {
      let newData = []
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        newData = [...this.formLabelData]
      } else {
        newData = this.formLabelData.filter(item => {
          return item.merchantManagerType !== 'restaurant'
        })
      }
      return newData
    },
    rules() {
      const data = this.formLabelData
      const rules = {}
      data.forEach(item => {
        let r
        if (item.type === 'input' || item.type === 'textarea') {
          r = {
            required: true,
            message: `请输入${item.label}`,
            trigger: 'blur'
          }
        } else {
          r = {
            validator: this.validateField(
              item.field,
              item.label,
              item.behavior
            ),
            trigger: 'change'
          }
        }
        rules[item.field] = [r]
      })
      return rules
    }
  },
  watch: {
    data: {
      handler(newVal) {
        const { startTime, endTime } = newVal
        if (!startTime || !endTime) {
          newVal.time = ['00:00:00', '00:00:00']
        } else {
          newVal.time = [startTime, endTime]
        }
        this.formData = Object.assign({}, newVal)
      },
      deep: true,
      immediate: true
    },
    'formData.mainCates'(v) {
      this.setAuxCates(0, v)
    },
    'formData.auxCates'(v) {
      this.setAuxCates(1, v)
    },
    visible(newVal) {
      if (!newVal) {
        if (this.type === 1) {
          setTimeout(() => {
            this.Image = []
          }, 400)
        }
      } else {
        this.$nextTick(() => {
          if (this.type === 0) {
            this.Image = [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: this.formData['environmentImages']
              }
            ]
          } else if (this.type === 1) {
            this.Image = [
              {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: this.formData['logoImage']
              }
            ]
          }
        })
      }
    }
  },
  created() {
    this.getCats()
  },
  methods: {
    async editStore() {
      this.confirmLoading = true
      const { businessDate } = this.formData
      const params = {
        ...this.formData,
        storeStatus: this.formData.storeStatus ? 1 : 0
      }
      params.businessDate =
        businessDate.length > 0 ? businessDate.join(',') : null
      try {
        await fhEditStore(this.formData.id, params)
        if (this.type === 1) {
          let merchantData = Object.assign({}, this.merchant)
          merchantData.catLabelList = params.catName
          await fhEditMerchantDetail(merchantData.merchantId, merchantData)
        }

        this.$store.commit('user/SET_ORDER_MODE', this.formData.storeType)
        await setOrderMode(this.formData.storeType)
        this.$bus.$emit('ChangeSidebar')

        this.$message.success('修改成功')
        this.handleCancel()
        this.$parent.getStoreDetail()
      } catch (err) {
        console.log(err)
      }
      this.confirmLoading = false
    },
    async editMerchantDetail() {
      try {
        await fhEditMerchantDetail(this.formData.id)
      } catch (err) {
        console.log()
      }
    },
    async getCats() {
      try {
        const { results } = await fhCats({ pageNumber: 1, pageSize: 9999 })
        this.catOption = results
      } catch (e) {
        console.log('debug', e)
      }
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.type === 2) {
            this.putDeliveryPrice()
          }
          this.editStore()

        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('cancel', false)
    },
    deleteItemTime(index) {
      this.timeJson.splice(index, 1)
      this.$forceUpdate()
    },
    addItemTime() {
      this.timeJson.push({ time: ['00:00:00', '00:00:00'] })
      //   this.$refs.form.validateField('time')
    },
    ossUploadSuccess(v, key) {
      let src
      if (v) {
        src = v.src
      } else {
        src = v
      }
      this.formData[key] = src
      this.$refs.form.validateField(key)
    },
    delImg(key) {
      this.formData[key] = ''
      this.$refs.form.validateField(key)
    },
    setAuxCates(i, v) {
      !this.formData.catName && (this.formData.catName = [])
      this.formData.catName[i] = v
      this.formData.cats = this.formData.catName.join(',')
      console.log(this.formData.cats)
    },
    getTime(v, field) {
      console.log()
      if (v) {
        const [startTime, endTime] = v
        this.formData.startTime = startTime
        this.formData.endTime = endTime
      } else {
        this.formData.startTime = ''
        this.formData.endTime = ''
        this.formData.time = ['00:00:00', '00:00:00']
      }
      this.$refs.form.validateField(field)
    },
    getCheckDay(v, field) {
      this.$refs.form.validateField(field)
    },
    // 修改配送费
    async putDeliveryPrice() {
      try {
        const { deliveryPrice } = this.formData
        await fhPutDeliveryPrice({ deliveryPrice })
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    // 计算和判断是否允许选择当天
    computedTimes(arr) {
      // return this.merchantManagerType === 'retail'
      //   ? [{ label: '当天', value: 1 }, ...arr]
      //   : arr
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  width: 320px;
  height: 100px;
  max-height: 100px;
  min-height: 100px;
}
.ossText {
  display: flex;
  flex-flow: column;
  background: #f2f2f2;
  line-height: 28px;
  padding: 10px 10px;
}
</style>
