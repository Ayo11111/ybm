<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-27 10:59:54
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-22 05:46:28
-->
<template>
  <div v-loading="loading" class="container">
    <div class="sub-title-box">基本信息</div>
    <el-form
      ref="form"
      :model="account"
      :rules="rules"
      class="mt-12"
      label-width="5em"
      style="width: 500px"
    >
      <el-form-item label="账号" prop="account">
        <el-input
          v-model="account.account"
          :disabled="disabled"
          placeholder="请输入你的账号"
          name="new-account"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <div class="flex">
          <el-input
            v-model="account.password"
            name="new-psw"
            :disabled="disabled"
            autocomplete="new-password"
            placeholder="请输入你的密码"
            type="password"
            style="flex: none"
            class="mr-12"
          />
          <el-button v-if="disabled" type="text" @click="controlDialog(true)">
            修改
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="account.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="account.phone"
          placeholder="请输入你的手机号"
          name="new-account"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleId">
        <filter-select
          :data="roles"
          vk="id"
          vl="cnName"
          vv="id"
          :value.sync="account.roleId"
          class="W100"
          @change="getRole"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          class="mr-12"
          type="primary"
          :loading="createLoad"
          @click="validatorForm"
        >
          保存
        </el-button>
        <router-link
          :to="{ name: 'ChildAccountIndex', query: { type: 'childAccount' } }"
        >
          <el-button>取消</el-button>
        </router-link>
      </el-form-item>
    </el-form>

    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%"
    >
      <el-form
        ref="passwordForm"
        :model="account"
        :rules="rules"
        label-width="7em"
        destroy-on-close
        class="mr-24"
      >
        <el-form-item label="密码" prop="password1">
          <el-input
            v-model="account.password1"
            name="new-psw"
            autocomplete="new-password-1"
            placeholder="请输入你的密码"
            type="password"
            style="flex: none"
            class="mr-12"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input
            v-model="account.password2"
            name="new-psw"
            autocomplete="new-password-1"
            placeholder="请再次输入你的密码"
            type="password"
            style="flex: none"
            class="mr-12"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="controlDialog(false)">取 消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="validChangePasswordForm"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterSelect from '@/components/FilterSelect'
import {
  fhGetRoles,
  fhCreateSubAcc,
  fhGetAccountDetail,
  fhWmEditSubAcc
} from '@/api/users'
import {
  validFormPhone,
  validatorForm,
  validAccount
} from '@/utils/form-validate'
export default {
  name: 'AddOrEditAccount',
  components: {
    FilterSelect
  },
  data() {
    const validPassword = (rule, value, cb) => {
      if (value === this.account.password1) {
        cb()
      } else {
        cb('两次输入的密码不一致')
      }
    }
    return {
      accountId: null,
      account: {},
      rules: {
        account: [
          { required: true, message: '请输入你的账号', trigger: 'change' },
          { validator: validAccount, trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入你的手机号', trigger: 'change' },
          { validator: validFormPhone, trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入你的密码', trigger: 'change' }
        ],
        password1: [
          { required: true, message: '请输入你的密码', trigger: 'change' }
        ],
        password2: [
          { required: true, message: '请输入你的密码', trigger: 'change' },
          {
            validator: validPassword,
            trigger: ['change', 'blur']
          }
        ],
        name: [{ required: true, message: '请输入联系人', trigger: 'change' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      roles: [],
      createLoad: false,
      roleJson: {},
      loading: false,
      show: false,
      // 修改密码弹窗
      dialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['merchantInfo']),
    disabled() {
      const { accountId } = this
      return accountId && accountId !== -1 && accountId !== '-1'
    }
  },
  async mounted() {
    const { storeId, merchantId, merchantName } = this.merchantInfo
    this.account = {
      ...this.account,
      storeNameList: [merchantName],
      storeIdList: [storeId],
      merchantIdList: [merchantId]
    }
    const { accountId } = this.$route.params
    this.accountId = accountId
    if (accountId && accountId !== -1 && accountId !== '-1') {
      this.getAccountDetail()
    }
    this.merchantId = merchantId
    this.$nextTick(() => {
      this.getRoles()
    })
  },
  methods: {
    async getRoles() {
      try {
        const { merchantId } = this
        const { results } = await fhGetRoles({
          merchantId,
          applicationName: 'waimai'
        })
        results.forEach(item => {
          this.roleJson[item.id] = item.enName
        })
        this.roles = results
      } catch (e) {
        console.log('debug', e)
      }
    },
    async wmEditSubAcc() {
      const backUserId = this.accountId
      const { enRole, password1, password } = this.account

      this.account = {
        ...this.account,
        role: enRole,
        password: password1 || password
      }

      this.loading = true
      try {
        await fhWmEditSubAcc(backUserId, this.account)
        this.$message.success('编辑子账号成功')
        this.$router.replace({
          path: '/stores/account',
          query: {
            type: 'childAccount'
          }
        })
      } catch (e) {
        console.log('debug', e)
        this.loading = false
      }
    },
    validatorForm() {
      const { form } = this.$refs
      if (this.accountId && this.accountId !== -1 && this.accountId !== '-1') {
        validatorForm(form, this.wmEditSubAcc)
      } else {
        validatorForm(form, this.createSubAccount)
      }
    },
    async createSubAccount() {
      this.createLoad = true
      try {
        await fhCreateSubAcc(this.account)
        this.$message.success('创建子账号成功')
        this.$router.replace({
          path: '/stores/account',
          query: {
            type: 'childAccount'
          }
        })
      } catch (e) {
        console.log('debug', e)
      }
      this.createLoad = false
    },
    // 获取账号详情
    async getAccountDetail() {
      this.loading = true
      try {
        const { results } = await fhGetAccountDetail(this.accountId)
        this.account = { ...results, ...this.account }
      } catch (error) {
        console.log('debug', error)
      }
      this.loading = false
    },
    getRole(val) {
      this.account['role'] = this.roleJson[val.id]
      this.storeNameList = []
    },
    setShow() {
      if (this.account['role']) {
        this.visible = true
      } else {
        this.$message.error('请先选择角色')
      }
    },
    // 处理修改密码弹窗
    validChangePasswordForm() {
      const { passwordForm } = this.$refs
      validatorForm(passwordForm, this.wmEditSubAcc)
    },
    // 处理关闭
    handleClose() {
      this.account = {
        ...this.account,
        password1: null,
        password2: null
      }
      this.dialogVisible = false
    },
    // 展示/关闭弹窗
    controlDialog(flag) {
      if (!flag) {
        this.account = {
          ...this.account,
          password1: null,
          password2: null
        }
      }
      this.dialogVisible = flag
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: auto;
}

.sub-title-box {
  font-weight: 700;
  font-size: 18px;
  vertical-align: middle;

  &::before {
    content: '';
    display: inline-block;
    width: 4px;
    height: 20px;
    background: #52acff;
    line-height: 20px;
    vertical-align: middle;
    margin-right: 10px;
  }
}
</style>
