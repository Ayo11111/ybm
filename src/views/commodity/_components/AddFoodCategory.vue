<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-10 10:17:40
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-09 15:00:50
-->
<template>
  <div>
    <el-dialog
      title="新增商品分类"
      :visible.sync="dialogTableVisible"
      width="350px"
    >
      <el-form ref="form" :model="params" inline>
        <el-form-item
          label="分类名称"
          :rules="[
            { required: true, message: '请输入分类名', trigger: 'blur' },
            {
              type: 'string',
              max: 5,
              message: '请输入少于5个字的分类名称',
              trigger: 'change'
            }
          ]"
          prop="name"
        >
          <el-input v-model="params.name" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="ok" :loading="saveLoad">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogTableVisible: false,
      params: {},
      saveLoad: false
    }
  },
  methods: {
    ok() {
      const { form } = this.$refs
      form.validate(valid => {
        if (valid) {
          this.saveLoad = true
          this.$emit('postCategories', this.params, res => {
            this.saveLoad = false
            if (res) {
              this.params.name = ''
              this.dialogTableVisible = false
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.add {
  height: 38px;
  width: 100%;
  line-height: 38px;
  text-align: center;
  border-radius: 3px;
  margin-top: 15px;
  border: 1px dashed #cccccc;
}
.add:hover {
  color: #52ACFF;
  border: 1px dashed #52ACFF;
  cursor: pointer;
}
</style>
