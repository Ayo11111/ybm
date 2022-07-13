<!--
 * @Descripttion: 
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-13 22:57:32
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-13 22:57:32
-->
<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-01 15:42:58
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-03 16:59:27
-->
<template>
  <div>
    <el-form v-if="false" inline>
      <el-form-item label="角色编码：">
        <el-input v-model="query.number" placeholder="" />
      </el-form-item>
      <el-form-item label="角色名称：">
        <el-input v-model="query.name" placeholder="" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="tableLoad" @click="getRoles">
          查询
        </el-button>
        <el-button :loading="tableLoad" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <router-link :to="{ name: 'RoleCreate' }">
      <el-button type="primary" icon="el-icon-plus">新增角色</el-button>
    </router-link>
    <el-table v-loading="tableLoad" :data="roleData" class="mt-12">
      <el-table-column label="角色编码" prop="number" />
      <el-table-column label="角色名称" prop="cnName" />
      <el-table-column label="创建时间" prop="createTime" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button
            type="text"
            class="mr-12"
            :loading="delLoad"
            @click="handlerDelete(row.id)"
          >
            删除
          </el-button>
          <router-link :to="{ name: 'RoleCreate', query: { id: row.id } }">
            <el-button type="text">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" @pagination="pagination" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import { fhGetRoles, fhDeleteRole } from '@/api/role'
export default {
  name: 'RoleIndex',
  components: {
    Pagination
  },
  data() {
    return {
      tableLoad: false,
      roleData: [],
      total: 0,
      query: {
        applicationName: 'waimai',
        pageSize: 10,
        pageNumber: 1
      },
      delLoad: false
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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
