<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-11 10:41:51
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-15 09:04:36
-->
<template>
  <a-modal
    :title="title"
    :visible="visible"
    :confirm-loading="confirmLoading"
    width="50%"
    centered
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <el-form ref="form" :model="formData" :rules="rules">
      <el-form-item
        v-for="(item, index) in formLabelData"
        :key="index"
        :label="item.label"
        :prop="item.field"
        style="display: flex"
      >
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
    </el-form>
  </a-modal>
</template>

<script>
import {
  restAppointmentStatus,
  productionTime,
  autoOrderStatus
} from './putStoreInfo'
import FilterSelect from '@/components/FilterSelect'
import { fhEditStore } from '@/api/stores'
import { fhGetStoreDetail } from '@/api/setting'
export default {
  components: {
    FilterSelect
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.getStoreDetail()
      }
    }
  },
  data() {
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
      validateField,
      restAppointmentStatus,
      productionTime,
      autoOrderStatus,
      confirmLoading: false,
      formData: {}
    }
  },
  computed: {
    title() {
      return ['预订单设置', '出餐时间设置', '接单方式设置'][this.type]
    },
    formLabelData() {
      return [restAppointmentStatus, productionTime, autoOrderStatus][this.type]
    },
    rules() {
      let data = this.formLabelData
      let rules = {}
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
  methods: {
    async getStoreDetail() {
      try {
        const { results } = await fhGetStoreDetail()
        this.formData = results
      } catch (err) {
        console.log(err)
      }
    },
    async editStore() {
      this.confirmLoading = true
      const params = {
        ...this.formData,
        storeStatus: this.formData.storeStatus ? 1 : 0
      }

      try {
        await fhEditStore(this.formData.id, params)
        this.$message.success('修改成功')
        this.handleCancel()
      } catch (err) {
        console.log(err)
      }
      this.confirmLoading = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editStore()
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$emit('update:visible', false)
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
