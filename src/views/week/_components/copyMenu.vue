<template>
  <a-modal
    title="周菜谱复制"
    width="50%"
    okText="保存"
    :visible="visible"
    @ok="handleOk"
    @cancel="onClose"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="复制源">
        <el-select v-model="form.src">
          <el-option :label="srcLabel" :value="form.src" />
        </el-select>
      </el-form-item>
      <el-form-item label="复制到">
        <el-date-picker
          v-model="dstDate"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="getDstDate"
        />
      </el-form-item>
    </el-form>
  </a-modal>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    week: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      srcLabel: '',
      dstDate: [],
      form: {
        src: '',
        start: '',
        end: ''
      },
      rules: {}
    }
  },
  created() {
  },
  methods: {
    getDstDate(val) {
      this.form.start = val[0]
      this.form.end = val[1]
    },
    handleOk() {
      this.$emit('copyMenu', this.form)
      this.onClose()
    },
    onOpen() {
      this.srcLabel = `${this.week}（${this.date.substring(5)}）`
      this.$emit('update:visible', true)
    },
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
