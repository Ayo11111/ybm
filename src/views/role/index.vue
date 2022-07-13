<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-01 15:42:58
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-15 08:48:27
-->
<template>
  <div class="container">
    <div class="mb-12" style="height: 36px">
      <span style="font-size: 18px; font-weight: 600; line-height: 36px">
        已有角色（共{{ total }}个）
      </span>
      <router-link :to="{ name: 'RoleCreate' }" style="float: right">
        <el-button type="primary" icon="el-icon-plus">新增角色</el-button>
      </router-link>
    </div>
    <a-divider style="margin: 0" />
    <div
      v-if="roleData.length > 0"
      v-loading="tableLoad || detailLoadEnd"
      class="role-box"
    >
      <el-scrollbar v-loading="tableLoad" class="role-sider">
        <a-menu
          :selected-keys="[permissions.id || '']"
          mode="inline"
          style="width: 140px; height: 100%"
          @click="selectRole"
        >
          <a-menu-item v-for="i in roleData" :key="i.id">
            {{ i.cnName }}
          </a-menu-item>
        </a-menu>
      </el-scrollbar>
      <div v-loading="detailLoadEnd" class="permissions-box">
        <div>
          <div class="title">
            <span>角色名称</span>
            <router-link
              style="float: right"
              :to="{ name: 'RoleCreate', query: { id: permissions.id } }"
            >
              <el-button type="text">编辑</el-button>
            </router-link>
            <el-button
              style="float: right"
              class="mr-12"
              type="text"
              @click="handlerDelete(permissions.id)"
            >
              删除
            </el-button>
          </div>
          <div class="pl-12">{{ permissions.cnName }}</div>
        </div>
        <div class="title">角色权限</div>
        <el-scrollbar style="height: 575px">
          <div v-for="i in permissions.router" :key="i.id">
            <div class="permissions-title">{{ i.meta.title }}</div>
            <span v-for="j in i.children" :key="j.id" class="permissions-item">
              {{ j.meta.title }}
            </span>
            <a-divider />
          </div>
        </el-scrollbar>
      </div>
    </div>
    <a-empty v-else-if="!(tableLoad || detailLoadEnd)" class="mt-24" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { fhGetRoles, fhDeleteRole, fhGetRole } from '@/api/role'
export default {
  name: 'RoleIndex',
  data() {
    return {
      tableLoad: false,
      detailLoadEnd: true,
      roleData: [],
      total: 0,
      query: {
        applicationName: 'waimai',
        pageSize: 999,
        pageNumber: 1
      },
      delLoad: false,
      // 当前权限
      permissions: {
        id: null
      }
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  async created() {
    const { merchantId } = this.merchantInfo
    this.query.merchantId = merchantId
    this.merchantId = merchantId
    this.$nextTick(() => this.getRoles())
  },
  methods: {
    async getRoles() {
      this.tableLoad = true
      try {
        const { results, count } = await fhGetRoles(this.query)
        this.total = count || 0
        this.roleData = results
        if (results.length > 0) {
          this.getRole(results[0].id)
        } else {
          this.detailLoadEnd = false
          this.permissions = {}
        }
      } catch (e) {
        console.log('debug axios', e)
      }
      this.tableLoad = false
    },
    async deleteRole(id) {
      try {
        const { success } = await fhDeleteRole(id)
        if (success) {
          this.getRoles()
          this.$message.success('删除成功')
        }
      } catch (err) {
        console.log(err)
      }
    },
    resetQuery() {
      this.query = {
        applicationName: 'waimai',
        pageSize: 10,
        pageNumber: 1,
        merchantId: this.merchantId
      }
      this.getRoles()
    },
    pagination(v) {
      Object.assign(this.query, v)
      this.$nextTick(() => this.getRoles())
    },
    handlerDelete(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteRole(id)
        })
        .catch(() => {})
    },
    // 获取详情
    async getRole(id) {
      this.detailLoadEnd = true
      try {
        const { results } = await fhGetRole(id)
        this.permissions = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.detailLoadEnd = false
    },
    // 选择一个menu
    selectRole({ key }) {
      this.getRole(key)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
  .el-scrollbar__view {
    height: 100%;
  }
}
.container {
  padding: 0;
  margin: 0;
  min-height: auto;
  .role-box {
    height: 700px;
    display: flex;
    .role-sider {
      width: 140rpx;
      height: 100%;
      overflow: hidden auto;
    }
    .permissions-box {
      height: 100%;
      flex: 1;
      .title {
        font-size: 18px;
        font-weight: 600;
        padding: 12px;
      }
      .permissions-title {
        font-size: 16px;
        font-weight: 600;
        margin: 0 12px 12px;
      }
      .permissions-item {
        margin: 0 12px;
      }
    }
  }
}
</style>
