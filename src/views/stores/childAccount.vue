<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-03 15:19:14
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-15 08:49:48
-->
<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="子账号管理" name="childAccount">
        <account ref="childAccount" />
      </el-tab-pane>
      <el-tab-pane label="角色管理" name="role">
        <role ref="role" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Account from '@/views/stores/account'
import Role from '@/views/role/index'
export default {
  name: 'ChildAccount',
  components: { Account, Role },
  data() {
    return {
      activeName: 'childAccount'
    }
  },
  mounted() {
    const { type } = this.$route.query
    this.activeName = type || this.activeName
  },
  methods: {
    tabChange(tab, event) {
      const { name } = tab
      const component = this.$refs[name]

      if (name === 'childAccount') {
        component.getAllData()
      } else {
        component.getRoles()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
