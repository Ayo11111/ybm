<!--
 * @Description: 受益人组件
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: LuoJie
 * @Date: 2022-04-28 17:49:45
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-16 15:55:13
-->
<template>
  <div>
    <el-form
      ref="form"
      :model="form.shareHolder[0]"
      :rules="beneficiaryRules"
      label-position="right"
      label-width="150px"
      :disabled="disabled"
    >
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="shareholder_name" label="控股股东姓名:">
            <el-input
              v-model="form.shareHolder[0].shareholder_name"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item
            prop="ahareholder_cert_type"
            label="控股股东证件号类型:"
          >
            <Select
              :disabled="disabled"
              :value.sync="form.shareHolder[0].ahareholder_cert_type"
              width="643px"
              :data-source="papersType"
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="shareholder_id_card" label="控股股东证件号:">
            <el-input
              v-model="form.shareHolder[0].shareholder_id_card"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="shareholder_address" label="控股股东地址:">
            <el-input
              v-model="form.shareHolder[0].shareholder_address"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="idCardTimeType" label="证件有效期限类型:">
            <el-radio-group
              v-model="form.shareHolder[0].idCardTimeType"
              @change="changeTime('idCardTimeType')"
            >
              <el-radio :label="1">定期</el-radio>
              <el-radio :label="0">长期</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 身份证信息 -->
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="idCardStartTime" label="证件生效日期:">
            <el-date-picker
              v-model="form.shareHolder[0].idCardStartTime"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptionsStart"
              type="date"
              placeholder="选择日期"
              style="width: 643px"
              @change="changeTime('idCardStartTime')"
            />
          </el-form-item>
        </el-col>

        <el-col
          v-if="form.shareHolder[0].idCardTimeType"
          :xs="24"
          :sm="12"
          :md="12"
          :lg="12"
          :xl="12"
        >
          <el-form-item prop="idCardEndTime" label="证件失效日期:">
            <el-date-picker
              v-model="form.shareHolder[0].idCardEndTime"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              type="date"
              placeholder="选择日期"
              style="width: 643px"
              @change="changeTime('idCardEndTime')"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="shareholder_nation" label="控股股东国籍:">
            <Select
              :disabled="disabled"
              :value.sync="form.shareHolder[0].shareholder_nation"
              width="643"
              :data-source="countryType"
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="shareholder_birthday" label="控股股东出生日期:">
            <el-date-picker
              v-model="form.shareHolder[0].shareholder_birthday"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              style="width: 643px"
            />
          </el-form-item>
        </el-col>

        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item prop="shareholder_rate" label="控股股东持股比例:">
            <div class="flex">
              <el-input-number
                v-model="form.shareHolder[0].shareholder_rate"
                :controls="false"
                :min="0"
                :max="100"
                placeholder="请输入数字"
              />
              <span class="ml-12">%</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Select from '@/components/Select'
import { beneficiaryRules } from '../_utils/index'
export default {
  components: {
    Select
  },
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      beneficiaryRules,
      // 时间类型 true为定期
      radio: true,
      // 国籍枚举
      countryType: [
        {
          name: '中国',
          id: '1'
        }
      ],
      // 证件类型枚举
      papersType: [
        {
          name: '居民身份证或临时身份证',
          id: 11
        },
        {
          name: '军人或武警身份证件',
          id: 12
        },
        {
          name: '港澳居民来往内地通行证，台湾居民来往大陆通行证或其他有效旅行证件',
          id: 13
        },
        {
          name: '外国公民护照',
          id: 14
        },
        {
          name: '其他类个人身份有效证件',
          id: 19
        }
      ],
      // 数据存放处
      form: {
        shareHolder: [{}]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 1 * 60 * 60 * 1000
        }
      },
      pickerOptionsStart: {
        // 禁用未来时间
        disabledDate(time) {
          return time.getTime() > Date.now() - 24 * 1 * 60 * 60 * 1000
        }
      }
    }
  },
  watch: {
    value: {
      handler(v) {
        if (!v.shareHolder) {
          // this.form.shareHolder.push({})
          return
        }
        // this.form.shareHolder.pop()

        const { shareHolder } = v

        console.log(shareHolder)

        const tempTimes = shareHolder[0].shareholder_id_card_valid.split('/')
        const idCardStartTime = tempTimes[0]
        const idCardEndTime = tempTimes.length > 2 ? tempTimes[1] : tempTimes[0]
        const idCardTimeType = tempTimes.length > 2 ? 1 : 0

        this.form.shareHolder.push({
          idCardStartTime,
          idCardEndTime,
          idCardTimeType,
          ...shareHolder[0]
        })

        if (this.form.shareHolder.length > 1) {
          this.form.shareHolder.shift()
        }

        // this.form.shareHolder[0] = {
        //   idCardStartTime,
        //   idCardEndTime,
        //   idCardTimeType,
        //   ...shareHolder[0]
        // }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 时间类型
    changeTime(type) {
      // true 定期
      // false 长期
      const moment = this.$moment
      const { idCardTimeType, idCardEndTime, idCardStartTime } =
        this.form.shareHolder[0]
      let diffTime = null
      if (idCardTimeType && idCardStartTime && idCardEndTime) {
        diffTime = moment(idCardEndTime).diff(moment(idCardStartTime), 'years')
      }

      this.form.shareHolder[0].shareholder_id_card_valid = `${idCardStartTime}/${
        idCardTimeType ? idCardEndTime + '/' + diffTime : '长期'
      }`

      if (['idCardEndTime', 'idCardStartTime'].includes(type)) {
        this.$refs.form.validateField('idCardEndTime')
        this.$refs.form.validateField('idCardStartTime')
      }
    }
  }
}
</script>

<style></style>
