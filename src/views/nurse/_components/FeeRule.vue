<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-27 14:33:45
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-27 16:02:07
-->
<template>
  <el-dialog title="费用规则" :visible.sync="show" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form">
        <el-form-item label="费用规则说明">
          <el-input
            v-model="form.feeRules"
            placeholder="请输入费用规则"
            type="textarea"
            show-word-limit
            :maxlength="500"
            :autosize="{ minRows: 8, maxRows: 12 }"
          />
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="controlDialog(false)">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="comfirm">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { dialog } from '@/utils/mixins'
import { fhEditFeeRule } from '@/api/stores'
import { fhGetStoreDetail } from '@/api/setting'
export default {
  name: 'FeeDialog',
  mixins: [dialog],
  data() {
    return {
      form: {
        feeRules: ''
      },
      loading: false
    }
  },
  watch: {
    show(flag) {
      if (flag) {
        this.getStoreDetail()
      }
    }
  },
  methods: {
    // 获取店铺详情
    async getStoreDetail() {
      this.loading = true
      try {
        const { results } = await fhGetStoreDetail()
        const { feeRules } = results
        this.form.feeRules = feeRules
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 关闭回调
    handleClose() {
      this.controlDialog(false)
      this.form = {}
    },
    comfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editFeeRule()
        }
      })
    },
    // 编辑商家的费用规则
    async editFeeRule() {
      this.loading = true
      try {
        await fhEditFeeRule(this.form)
        this.$message.success('编辑费用说明成功')
        this.controlDialog(false)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    }
  }
}
</script>
