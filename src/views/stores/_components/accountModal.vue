<template>
  <a-modal
    title="创建店长"
    width="700px"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <el-form ref="form" label-width="80px" :model="account" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="账号:" prop="account">
            <el-input
              v-model="account.account"
              placeholder="请输入你的账号"
              name="new-account"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码:" prop="password">
            <el-input
              v-model="account.password"
              name="new-psw"
              autocomplete="new-password"
              placeholder="请输入你的密码"
              type="password"
              show-password
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="姓名:" prop="name">
            <el-input v-model="account.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号:" prop="phone">
            <el-input
              v-model="account.phone"
              placeholder="请输入你的手机号"
              name="new-account"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </a-modal>
</template>

<script>
import { fhGetRoles, fhCreateSubAcc } from '@/api/users'
import { getUserInfo } from '@/utils/auth'
import { validFormPhone, validAccount } from '@/utils/form-validate'

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      confirmLoading: false,
      account: { account: null, password: null, name: null, phone: null },
      rules: {
        account: [
          { required: true, message: '请输入你的账号', trigger: 'blur' },
          { validator: validAccount, trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入你的手机号', trigger: 'blur' },
          { validator: validFormPhone, trigger: 'change' }
        ],
        password: [
          {
            required: true,
            message: '请输入你的密码',
            trigger: ['blur', 'change']
          }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  async mounted() {
    window.am = this
    const { merchantId } = (await getUserInfo())
    this.merchantId = merchantId
    this.getRoles()
  },
  methods: {
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.createSubAccount(this.account)
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.$refs.form.resetFields()
      this.$emit('update:visible', false)
    },
    async getRoles() {
      try {
        const { merchantId } = this
        const { results } = await fhGetRoles({
          merchantId,
          applicationName: 'waimai'
        })
        for (let i = 0; i < results.length; i++) {
          if (results[i].cnName === '店长') {
            this.account['role'] = results[i].enName
            this.account['roleId'] = results[i].id
            break
          }
        }
      } catch (e) {
        console.log('debug', e)
      }
    },
    async createSubAccount(params) {
      this.confirmLoading = true
      try {
        const { success, results } = await fhCreateSubAcc(params)
        if (success) {
          this.$message.success('创建店长成功')
          this.$emit('getStoresAccount', results)
          this.$refs.form.resetFields()
          this.$emit('update:visible', false)
        }
      } catch (e) {
        console.log('debug', e)
      }
      this.confirmLoading = false
    }
  }
}
</script>

<style></style>
