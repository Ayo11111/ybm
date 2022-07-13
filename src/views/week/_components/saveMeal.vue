<template>
  <a-modal
    :title="`${form.id ? '编辑' : '添加'}餐次`"
    width="33%"
    :visible="visible"
    @ok="handleOk"
    @cancel="onClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="餐次名称">
        <el-input v-model="form.name" placeholder="请输入餐次名称" />
      </el-form-item>
      <el-form-item label="就餐时段">
        <el-time-select
          v-model="form.startDiningTime"
          placeholder="起始时间"
          :picker-options="{ start: '06:00', step: '00:15', end: '24:00' }"
        />
        <span class="range-separator">~</span>
        <el-time-select
          v-model="form.endDiningTime"
          placeholder="结束时间"
          :picker-options="{ start: '06:00', step: '00:15', end: '24:00', minTime: form.startDiningTime }"
        />
      </el-form-item>
      <el-form-item label="送达时段">
        <el-time-select
          v-model="form.startDeliveryTime"
          placeholder="起始时间"
          :picker-options="{ start: '06:00', step: '00:15', end: '24:00', minTime: form.startDiningTime }"
        />
        <span class="range-separator">~</span>
        <el-time-select
          v-model="form.endDeliveryTime"
          placeholder="结束时间"
          :picker-options="{ start: '06:00', step: '00:15', end: '24:00', minTime: form.startDeliveryTime }"
        />
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script>
import { deepClone } from '@/utils'
import { getStoreId } from '@/utils/auth'
import { fhCreateMeal, fhUpdateMeal } from '@/api/week'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      storeId: null,
      form: {
        id: 0,
        name: '',
        startDiningTime: '',
        endDiningTime: '',
        startDeliveryTime: '',
        endDeliveryTime: '',
        isValid: true,
        editor: ''
      },
      rules: {
        name: [{ required: true, message: '请输入餐次名称', trigger: 'blur' }]
      }
    }
  },
  async created() {
    this.storeId = await getStoreId()
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const form = JSON.parse(JSON.stringify(this.form))
          form.startDiningTime = this.form.startDiningTime + ':00'
          form.endDiningTime = this.form.endDiningTime + ':00'
          form.startDeliveryTime = this.form.startDeliveryTime + ':00'
          form.endDeliveryTime = this.form.endDeliveryTime + ':00'
          const { id } = form
          id ? await fhUpdateMeal(this.storeId, id, form) : await fhCreateMeal(this.storeId, form)
          this.$emit('list')
          this.onClose()
          this.$message.success(`${id ? '编辑' : '添加'}餐次成功`)
        } else {
          this.$message.error('请将信息填写完整')
        }
      })
    },
    onOpen(item) {
      if (item) {
        this.form = deepClone(item)
      }
      this.$emit('update:visible', true)
    },
    onClose() {
      this.form = {}
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.range-separator {
  margin: 0 2px;
}
::v-deep .el-form-item--medium .el-form-item__content {
  display: flex;
}
</style>
