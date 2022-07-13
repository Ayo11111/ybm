<template>
  <div class="container">
    <div class="info-box">
      <el-form style="padding: 24px" :model="info" inline>
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
        :del-cate="fhDeleteCategories"
        :sort-categories="fhSortCategories"
        :edit-cate="fhEditCategories"
        :router-query="routerQuery"
        @openAddCate="openAddCate"
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
import TreeSelect from '@/components/TreeSelect'
import SelectFood from '@/views/component/SelectFood'
import { fhEditCategories, fhDeleteCategories, fhSortCategories } from '@/api/categories'
import {
  fhGetStoteCates,
  fhGetStoteFoods,
  fhEditStoreFood,
  fhDropOffFood,
  fhBatchUp,
  fhDelOffFood,
  fhBatchDel,
  fhBatchAdd
} from '@/api/stores/commodity'
// import { fhGetPos, fhPosFood } from '@/api/possystem'
import { getStoreId } from '@/utils/auth'

export default {
  name: 'StoreCommodity',
  components: {
    FilterSelect,
    CommodityList,
    TreeSelect,
    SelectFood
  },
  data() {
    return {
      fhEditCategories,
      fhDeleteCategories,
      fhSortCategories,
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
          field: 'stock',
          type: 'block'
        }
        // {
        //   label: '今日库存',
        //   field: 'dailyStock'
        // }
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
    this.getstoreId()
  },
  methods: {
    async getstoreId() {
      try {
        const results = await getStoreId()
        this.storeId = results
      } catch (err) {
        console.log(err)
      }
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
    // 打开增加分类弹窗
    openAddCate() {
      this.visible = true
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
        await commodity.rawGetCategories()
      } catch (e) {
        console.log('axios', e)
      }
      this.queryLoad = false
    },
    resetQuery() {
      this.dishName = ''
      this.updateDishData()
      this.$refs.commodity.rawGetCategories()
      console.log(this.$refs.commodity.isCheckAll)
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
