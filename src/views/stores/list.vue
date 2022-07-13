<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-23 15:24:16
 * @LastEditors: HJ
 * @LastEditTime: 2021-03-07 13:38:39
-->
<template>
  <div class="container">
    <el-form :model="query" inline>
      <el-form-item label="店铺名称">
        <el-input v-model="query.storeName" placeholder="请输入店铺名称" />
      </el-form-item>
      <el-form-item label="所属城市">
        <filter-select :data="citys" clearable :value.sync="query.city" />
      </el-form-item>
      <el-form-item label="营业执照期限">
        <filter-select
          :data="businessLicenseEnumOptions"
          :value.sync="query.businessLicenseEnum"
          clearable
          vl="label"
          vv="value"
        />
      </el-form-item>
      <el-form-item label="经营许可期限">
        <filter-select
          :data="managerLicenseEnumOptions"
          :value.sync="query.managerLicenseEnum"
          clearable
          vl="label"
          vv="value"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="search">
          查询
        </el-button>
        <el-button :loading="loading" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <router-link class="mr-24" :to="{ name: 'NewStore' }">
      <el-button type="primary" icon="el-icon-plus">添加店铺</el-button>
    </router-link>

    <el-dropdown v-loading="loading" class="mr-24" @command="batchChangeStatus">
      <el-button type="primary">
        批量操作<i class="el-icon-arrow-down el-icon--right" />
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="i in batchMenu"
          :key="i.lable"
          :command="i.opt"
        >
          {{ i.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <el-table
      v-loading="loading"
      :data="stores"
      fit
      class="mt-24"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="storeName" label="店铺名称" min-width="160px" />
      <el-table-column prop="city" label="所属城市" />
      <el-table-column prop="storeManagerName" label="店长">
        <template #default="{ row }">
          <span>{{ row.storeSuperName || '---' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="营业时间" width="160px">
        <template slot-scope="{ row }">
          <span>{{ row.startTime }}</span>
          -
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前营业状态" width="140px">
        <template slot-scope="{ row }">
          <span v-if="row.isBusiness"><a-badge status="success" />营业中</span>
          <span v-else> <a-badge status="error" />打烊中</span>
        </template>
      </el-table-column>
      <el-table-column width="140px">
        <template slot="header">
          <span>收银系统店铺id</span>
          <el-tooltip
            class="item"
            effect="dark"
            placement="top"
            content="同步收银系统店铺成功后将会获得收银系统店铺id"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template slot-scope="{ row }">
          <span v-if="row.posStoreId">{{ row.posStoreId }}</span>
          <span v-else>---</span>
        </template>
      </el-table-column>

      <el-table-column #default="{ row }" prop="storeStatus" label="店铺状态">
        <a-switch
          checked-children="启用"
          un-checked-children="禁用"
          :loading="row.storeStatusLoad"
          :checked="!!row.storeStatus"
          @change="v => changeStatus('up-status', v, row)"
        />
      </el-table-column>
      <el-table-column prop="delWay" label="配送方式">
        <template #default="{ row }">
          {{ getDeliveryName(row.deliveryList) }}
        </template>
      </el-table-column>
      <el-table-column prop="storeStartStatus" width="120px">
        <template slot="header">
          <span>是否强制打烊</span>
          <el-tooltip
            class="item"
            effect="dark"
            placement="top"
            content="若店铺在正常营业时间内，开启强制打烊，则店铺处于打烊状态。"
          >
            <i class="el-icon-info" />
          </el-tooltip>
        </template>
        <template #default="{ row }">
          <a-switch
            checked-children="是"
            un-checked-children="否"
            :loading="row.storeStartStatusLoad"
            :checked="row.storeStartStatus === 0"
            @change="v => changeStatus('start-status', v, row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="takeAwayStatus" label="外卖状态">
        <template #default="{ row }">
          <a-switch
            checked-children="启用"
            un-checked-children="禁用"
            :loading="row.takeAwayStatusLoad"
            :checked="!!row.takeAwayStatus"
            @change="v => changeStatus('take-away-status', v, row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="营业执照截止日期"
        prop="businessLicenseOverdueInfo"
        width="180"
      >
        <template #default="{row}">
          <span :class="row.businessLicenseOverdueEnum">{{
            row.businessLicenseOverdueInfo
          }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="经营许可证截止日期"
        prop="manageLicenseOverdueInfo"
        width="240"
      >
        <template #default="{row}">
          <span :class="row.manageLicenseOverdueEnum">{{
            row.manageLicenseOverdueInfo
          }}</span>
        </template>
      </el-table-column>
      <el-table-column width="220px" label="操作" fixed="right">
        <template #default="{ row }">
          <router-link
            :to="{ name: 'StoreCommodity', query: { storeId: row.id } }"
          >
            <el-button type="text">店铺商品</el-button>
          </router-link>
          <el-divider direction="vertical" />
          <router-link
            :to="{ name: 'StoreDetail', params: { storeId: row.id } }"
          >
            <el-button type="text">详情</el-button>
          </router-link>
          <el-divider direction="vertical" />
          <el-button type="text" @click.native="enterStore(row.id)">
            进入店铺
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" @pagination="pagination" />

    <!-- 选择店铺组件 -->
    <SelectStore
      :dialog-visible.sync="dialogVisible"
      @relationList="selectStore"
    />
  </div>
</template>

<script>
import FilterSelect from '@/components/FilterSelect'
import Pagination from '@/components/Pagination'
import { getDeliveryName } from './_utils'
import { enterStore } from '@/utils/enter'
import {
  fhGetSotres,
  fhChangeStoreStatus,
  fhBatchChangeStoreStatus,
  fhGetStoreCity
} from '@/api/stores'
import SelectStore from '@/views/component/SelectStore'
import { fhGetPos, fhStoresPos } from '@/api/possystem'
const licenseOptions = [
  { label: '正常', value: 'HAVEN_OVERDUE' },
  { label: '临近过期', value: 'IMMEDIATELY_OVERDUE' },
  { label: '已过期', value: 'HAD_OVERDUE' }
]

export default {
  name: 'StoresList',
  components: {
    FilterSelect,
    Pagination,
    SelectStore
  },
  data() {
    return {
      businessLicenseEnumOptions: licenseOptions,
      managerLicenseEnumOptions: licenseOptions,
      synStoreReqList: [],
      query: {
        pageNumber: 1,
        pageSize: 10
      },
      dialogVisible: false,
      citys: [],
      loading: false,
      posStatus: false,
      loadingPos: false,
      batchMenu: [
        {
          label: '启用',
          opt: {
            uri: 'up-status-batch',
            params: {
              upStatus: 1
            }
          }
        },
        {
          label: '禁用',
          opt: {
            uri: 'up-status-batch',
            params: {
              upStatus: 0
            }
          }
        },
        {
          label: '启用外卖',
          opt: {
            uri: 'take-away-status-batch',
            params: {
              takeAwayStatus: 1
            }
          }
        },
        {
          label: '禁用外卖',
          opt: {
            uri: 'take-away-status-batch',
            params: {
              takeAwayStatus: 0
            }
          }
        },
        // {
        //   label: '营业',
        //   opt: {
        //     uri: 'start-status-batch',
        //     params: {
        //       startStatus: 1
        //     }
        //   }
        // },
        {
          label: '打烊',
          opt: {
            uri: 'start-status-batch',
            params: {
              startStatus: 0
            }
          }
        }
      ],
      stores: [],
      selectStoreList: [],
      delivery: null,
      // 总条数
      total: 0,
      // 批量操作
      batchLoad: false,
      notify: undefined
    }
  },
  created() {
    window.store = this
    this.getStores()
    this.getStoreCity()
    this.storesStatusMap = new Map([
      ['up-status', 'storeStatus'],
      ['start-status', 'storeStartStatus'],
      ['take-away-status', 'takeAwayStatus']
    ])
    this.storesParamsMap = new Map([
      ['up-status', 'upStatus'],
      ['start-status', 'startStatus'],
      ['take-away-status', 'takeAwayStatus']
    ])
    this.getPos()
  },
  methods: {
    handleData(type) {
      return this[type]
    },
    selectStore(item, id) {
      this.selectStoreList = item.map(el => {
        return { name: el.label, storeId: el.id }
      })
      this.handlePos()
    },
    async getPos() {
      this.loadingPos = true
      try {
        const {
          results: { openStatus }
        } = await fhGetPos()
        this.posStatus = openStatus
      } catch (e) {
        console.log(e)
      }
      this.loadingPos = false
    },
    async handlePos() {
      this.loadingPos = true
      try {
        const {
          results: { failList }
        } = await fhStoresPos({ synStoreReqList: this.selectStoreList })
        if (failList) {
          const str = failList.reduce((acc, cur, index) => {
            acc = acc + `  ${index + 1}. ${cur.failMsg} 、`
            return acc
          }, '')
          this.$message.error(str)
        } else {
          this.$message.success('同步收银系统成功')
        }
        this.getStores()
      } catch (e) {
        console.log(e)
      }
      this.loadingPos = false
    },
    search() {
      this.query.pageNumber = 1
      this.query.pageSize = 10
      this.getStores()
    },
    getDeliveryName,
    resetQuery() {
      this.query = {
        pageNumber: 1,
        pageSize: 10
      }
      this.getStores()
    },
    queryStores() {
      this.total = 0
      this.query = Object.assign({}, this.query, {
        pageNumber: 1,
        pageSize: 10
      })
      this.getStores()
    },
    async getStores() {
      this.loading = true
      try {
        const { results, count } = await fhGetSotres(this.query)
        this.stores = results.map(i => {
          i.storeStatusLoad = false
          i.storeStartStatusLoad = false
          i.takeAwayStatusLoad = false
          return i
        })
        this.total = count
      } catch (error) {
        console.log('debug', error)
      }
      this.loading = false
    },
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      this.getStores()
    },
    async changeStatus(key, statu, row) {
      const statusList = {
        'up-status': '',
        'start-status': '强制打烊',
        'take-away-status': '外卖'
      }
      const { id: storeId } = row
      const storeStatuKey = this.storesStatusMap.get(key)
      row[`${storeStatuKey}Load`] = true
      let params
      if (storeStatuKey === 'storeStartStatus') {
        params = { [this.storesParamsMap.get(key)]: statu ? 0 : 1 }
      } else {
        params = { [this.storesParamsMap.get(key)]: statu ? 1 : 0 }
      }
      try {
        await fhChangeStoreStatus(key, params, storeId)
        this.$message.success(
          `店铺已${statu ? '启用' : '禁用'}${statusList[key]}`
        )
        if (storeStatuKey === 'storeStartStatus') {
          row[storeStatuKey] = statu ? 0 : 1
          this.getStores()
          this.loading = false
          this.$forceUpdate()
        } else {
          row[storeStatuKey] = statu ? 1 : 0
        }
      } catch (e) {
        console.log('debug', e)
      }
      row[`${storeStatuKey}Load`] = false
    },
    async batchChangeStatus(opt) {
      if (!this.chooseStoreIds || this.chooseStoreIds.length <= 0) {
        this.$message.error('请选择需要批量处理的店铺')
        return
      }

      this.loading = true
      const { params, uri } = opt
      const send = Object.assign({}, params, {
        storeIds: this.chooseStoreIds.join(',')
      })
      try {
        await fhBatchChangeStoreStatus(uri, send)
        this.$message.success('修改成功')
        this.getStores()
      } catch (e) {
        console.log('debug', e)
      }
      this.loading = false
    },
    // 处理表单多选
    handleSelectionChange(val) {
      this.synStoreReqList = val.map(el => {
        return { name: el.storeName, storeId: el.id }
      })
      const temp = []
      val.forEach(i => {
        const { id } = i
        temp.push(id)
      })
      this.chooseStoreIds = temp
    },
    // 获取城市
    async getStoreCity() {
      try {
        const { results } = await fhGetStoreCity()
        this.citys = results
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    // 进入店铺
    enterStore
  }
}
</script>

<style lang="scss" scoped>
.HAVEN_OVERDUE {
  color: auto;
}
.IMMEDIATELY_OVERDUE {
  color: #52ACFF;
}
.HAD_OVERDUE {
  color: #f5222d;
}
</style>
