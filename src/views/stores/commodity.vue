<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-24 14:44:39
 * @LastEditors: HJ
 * @LastEditTime: 2021-06-12 17:41:03
-->
<template>
  <div class="container">
    <div class="base-box">
      <span>选择店铺： </span>
      <filter-select
        :value.sync="storeId"
        vv="id"
        vk="id"
        vl="storeName"
        :async-get-data="getSotres"
        @change="storeChange"
      />
    </div>
    <div class="info-box">
      <el-form style="padding: 24px" :model="info" inline>
        <el-form-item v-if="!posStatus" v-loading="loadingImport">
          <el-button type="primary" @click="showDialog">导入商品</el-button>
        </el-form-item>
        <el-form-item v-else v-loading="loadingImport">
          <el-button :loading="loadingPos" type="primary" @click="handlePos">{{
            posText
          }}</el-button>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input
            v-model="dishName"
            placeholder="请输入商品名称"
            @keyup.enter.native="updateDishData"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="queryLoad"
            @click="updateDishData"
          >
            查询
          </el-button>
          <el-button :loading="queryLoad" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <el-divider />
      <commodity-list
        v-if="storeId"
        ref="commodity"
        :batch-btns="batchBtns"
        :get-catagory-list="getSotreCates"
        :get-food-list="getSotreFoods"
        :delete-food="delFood"
        :edit-option="editOption"
        :edit-food="editFood"
        :drop-off-option="dropOffOption"
        :router-query="routerQuery"
      />
    </div>
    <SelectFood
      ref="seleceFood"
      :dialog-visible.sync="importDialog"
      :store-ids="[]"
      :active-name.sync="importFoodIds"
      radio-orcheckbox="checkbox"
      @selectFood="selectFoodFn"
    />
  </div>
</template>

<script>
import FilterSelect from '@/components/FilterSelect'
import CommodityList from '@/components/CommodityList'
import SelectFood from '@/views/component/SelectFood'
import { fhGetSotres } from '@/api/stores'
import {
  fhGetStoteCates,
  fhGetStoteFoods,
  fhEditStoreFood,
  fhDropOffFood,
  fhBatchOversell,
  fhBatchUp,
  fhDelOffFood,
  fhBatchDel,
  fhBatchAdd
} from '@/api/stores/commodity'
import { fhGetPos, fhPosFood } from '@/api/possystem'

export default {
  name: 'StoreCommodity',
  components: {
    FilterSelect,
    CommodityList,
    SelectFood
  },
  data() {
    return {
      posText: '同步收银系统菜品',
      loadingPos: false,
      posStatus: false,
      loadingImport: false,
      info: {},
      stores: [],
      storeId: null,
      // 修改商品配置
      editOption: [
        {
          label: '规格',
          type: 'select'
        },
        {
          label: '原价',
          field: 'price'
        },
        {
          label: '库存',
          field: 'stock'
        },
        {
          label: '沽清',
          type: 'switch',
          align: 'right',
          field: 'oversell',
          disabledOndropOff: false
        },
        {
          disabledOndropOff: true,
          label: '推荐',
          type: 'switch',
          align: 'right',
          field: 'recommendStatus'
        }
      ],
      // 修改
      dropOffOption: {
        fn: (foodId, data) => fhDropOffFood(this.storeId, foodId, data),
        field: 'updateUpStatus'
      },
      // 批量处理的按钮
      batchBtns: [
        {
          name: '批量上架',
          load: false,
          fn: params => {
            const { foodTemplateIdArray: storeFoodIds } = params
            return fhBatchUp(this.storeId, { storeFoodIds, updateUpStatus: 1 })
          }
        },
        {
          name: '批量下架',
          load: false,
          fn: params => {
            const { foodTemplateIdArray: storeFoodIds } = params
            return fhBatchUp(this.storeId, { storeFoodIds, updateUpStatus: 0 })
          }
        },
        {
          name: '批量删除',
          load: false,
          fn: params => {
            const { foodTemplateIdArray: storeFoodIds } = params
            return fhBatchDel(this.storeId, { storeFoodIds })
          }
        },
        {
          name: '批量沽清',
          load: false,
          fn: params => {
            const { foodTemplateIdArray: storeFoodIds } = params
            return fhBatchOversell(this.storeId, {
              storeFoodIds,
              updateOversellStatus: 1
            })
          }
        },
        {
          name: '批量取消沽清',
          load: false,
          fn: params => {
            const { foodTemplateIdArray: storeFoodIds } = params
            return fhBatchOversell(this.storeId, {
              storeFoodIds,
              updateOversellStatus: 0
            })
          }
        }
      ],
      // 导入商品
      importDialog: false,
      // 商品模板数据
      importTreeData: [],
      // 选中要导入的商品
      importFoodIds: [],
      // 导入load
      importLoad: false,
      // 查询名
      dishName: '',
      // 查询load
      queryLoad: false
    }
  },
  computed: {
    routerQuery() {
      return { storeId: this.storeId, type: 'store' }
    }
  },
  created() {
    window.ad = this
    const { storeId } = this.$route.query
    this.storeId = +storeId
    this.getPos()
  },
  methods: {
    async handlePos() {
      this.loadingPos = true
      this.posText = '正在同步菜品...'

      try {
        const { results } = await fhPosFood(this.storeId)
        this.$message.success(results)
        const getCatList = this.$refs.commodity.rawGetCategories
        const rawGetFoodList = this.$refs.commodity.rawGetFoodList
        Promise.all([getCatList(), rawGetFoodList()])
      } catch (e) {
        console.log(e)
      }
      this.loadingPos = false
      this.posText = '同步收银系统菜品'
    },
    async getPos() {
      this.loadingPos = true
      this.loadingImport = true
      try {
        const {
          results: { merchantDeveloperRspList, openStatus }
        } = await fhGetPos()
        let status = false
        merchantDeveloperRspList.forEach(item => {
          if (item.selectStatus && item.name !== 'canDao' && openStatus) {
            status = true
          }
        })
        this.posStatus = status
      } catch (e) {
        console.log(e)
      }
      this.loadingPos = false
      this.loadingImport = false
    },
    delFood(id) {
      return fhDelOffFood(this.storeId, id)
    },
    editFood(id, data) {
      return fhEditStoreFood(this.storeId, id, data)
    },
    getSotreCates() {
      return fhGetStoteCates(this.storeId)
    },
    getSotreFoods(query) {
      return fhGetStoteFoods(this.storeId, query)
    },
    // 获取所有店铺
    async getSotres() {
      try {
        const { results } = await fhGetSotres({ pageSize: 999 })
        this.stores = results
        this.storeId = this.storeId || results[0].id
        return { results }
      } catch (err) {
        console.log(err)
        return { results: [] }
      }
    },
    // 切换店铺
    storeChange(v) {
      const { id } = v
      window.location.href = `${
        window.location.href.split('?')[0]
      }?storeId=${id}`
      this.$refs.commodity.updateData()
    },
    selectFoodFn(food, ids) {
      this.importFoodIds = ids
      this.$nextTick(() => this.batchAdd())
    },
    // 批量导入
    async batchAdd() {
      this.importLoad = true
      try {
        await fhBatchAdd(this.storeId, {
          foodTemplateIds: this.importFoodIds.join(',')
        })
        this.hideDialog()
        this.$message.success('导入商品成功')
        this.$refs.seleceFood.delall()
        this.$refs.commodity.updateData()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.importLoad = false
    },
    // 隐藏弹窗
    hideDialog() {
      this.importDialog = false
    },
    // 显示弹窗
    showDialog() {
      this.importDialog = true
    },
    // 查询商品名
    async updateDishData() {
      this.queryLoad = true
      try {
        const { commodity } = this.$refs
        this.$refs.commodity.query = {
          searchName: this.dishName,
          pageSize: 10,
          pageNumber: 1
        }
        await commodity.rawGetFoodList()
      } catch (e) {
        console.log('axios', e)
      }
      this.queryLoad = false
    },
    resetQuery() {
      this.dishName = ''
      this.updateDishData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: transparent;
  padding: 0;

  &::v-deep .el-divider {
    margin: 0;
  }
}

.info-box {
  margin-top: 24px;
  background: #fff;
  // padding:
}
</style>
