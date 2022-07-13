<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-27 09:58:31
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-06 18:32:19
-->
<template>
  <div>
    <el-form v-if="false" :model="query" label-width="5em">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="登录账号">
            <el-input v-model="query['account']" placeholder="请输入账号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户名">
            <el-input v-model="query['name']" placeholder="请输入用户名" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态类型">
            <el-radio-group v-model="type" @change="getType">
              <el-radio-button label="0">全部</el-radio-button>
              <el-radio-button label="1">已启用</el-radio-button>
              <el-radio-button label="2">已禁用</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="所属角色">
            <filter-select
              class="W100"
              :data="roles"
              vl="cnName"
              vk="id"
              vv="id"
              :value.sync="query['roleId']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="关联店铺">
            <filter-select
              class="W100"
              :data="stores"
              vl="storeName"
              vk="id"
              vv="id"
              :value.sync="query['storeId']"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" :loading="loading" @click="select">
            查询
          </el-button>
          <el-button :loading="loading" @click="cancel">重置</el-button>
        </el-col>
      </el-row>
    </el-form>
    <router-link :to="{ name: 'AddOrEditAccount', params: { accountId: -1 } }">
      <el-button type="primary" icon="el-icon-plus">新建子账号</el-button>
    </router-link>
    <el-table v-loading="loading" :data="accounts" class="mt-12">
      <el-table-column label="账户名称" prop="account" />
      <el-table-column label="账户ID" prop="id" />
      <el-table-column label="联系人" prop="name" />
      <el-table-column label="手机号" prop="phone" />
      <el-table-column label="角色" prop="cnName">
        <template #default="{ row }">
          {{ row.role }}
        </template>
      </el-table-column>
      <el-table-column label="关联店铺">
        <template slot-scope="{ row: { storeNameList } }">
          <span>{{ storeNameList[0] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button type="text" class="mr-12" @click="del(row.id)">
            删除
          </el-button>
          <router-link
            :to="{ name: 'AddOrEditAccount', params: { accountId: row.id } }"
          >
            <el-button type="text">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-if="!status" :total="total" @pagination="pagination" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import FilterSelect from '@/components/FilterSelect'
import {
  fhGetSubAccs,
  fhGetRoles,
  fhPutUpStatus,
  fhDeleteWmAccount
} from '@/api/users'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'SubAccount',
  components: {
    FilterSelect,
    Pagination
  },
  data() {
    return {
      query: {
        account: null,
        name: null,
        status: null,
        storeId: null,
        roleId: null
      },
      type: '0',
      loading: false,
      // 账号信息
      accounts: [],
      total: 0,
      // 店铺
      stores: [],
      // 角色
      Json: {
        applicationName: 'waimai'
      },
      roles: [],
      status: false
    }
  },
  mounted() {
    this.getAllData()
  },
  methods: {
    // 获取所有数据
    getAllData() {
      this.getSubAccs()
      this.getRoles()
    },
    async getSubAccs() {
      this.loading = true
      try {
        const { results, count = 0 } = await fhGetSubAccs(this.query)
        this.accounts = results
        this.total = count
      } catch (e) {
        console.log('debug', e)
      }
      this.loading = false
      this.status = false
    },
    async getRoles() {
      const { merchantId } = await getUserInfo()
      this.Json.merchantId = merchantId
      try {
        const { results } = await fhGetRoles(this.Json)
        this.roles = results
      } catch (err) {
        console.log(err)
      }
    },
    async putUpStatus(backUserId, params) {
      try {
        const { success } = await fhPutUpStatus(backUserId, params)
        if (success) {
          let str = ''
          if (params.status) {
            str = '启用'
          } else {
            str = '禁用'
          }
          this.$message({
            type: 'success',
            message: `已${str}`
          })
          this.getSubAccs()
        }
      } catch (err) {
        console.log(err)
      }
    },
    async deleteWmAccount(id) {
      try {
        const { success } = await fhDeleteWmAccount(id)
        if (success) {
          // this.deleteAuAccount(id)
          this.$message.success('删除成功')
          this.getSubAccs()
        }
      } catch (err) {
        console.log(err)
      }
    },
    setStatus(val) {
      this.putUpStatus(val.id, {
        status: val.status
      })
    },
    getType(val) {
      this.query['status'] = [null, true, false][val]
    },
    select() {
      this.status = true
      this.getSubAccs(this.query)
    },
    cancel() {
      this.status = true
      for (const i in this.query) {
        this.query[i] = null
      }
      this.query['type'] = 0
      this.getSubAccs(this.query)
    },
    del(id) {
      this.$confirm('确定要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteWmAccount(id)
      })
    },
    pagination(v) {
      Object.assign(this.query, v)
      this.getSubAccs()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form-item__content {
  margin-left: 0;
}
</style>
