<template>
  <div class="container">
    <div class="header-fun-box">
      <span>商品名称：</span>
      <el-input
        v-model="foodTemplateName"
        style="width: 250px; margin-right: 20px"
        placeholder="请输入"
        @keyup.enter.native="queryDishName"
      />
      <el-button type="primary" :loading="queryLoad" @click="queryDishName">
        查 询
      </el-button>
      <el-button :loading="queryLoad" @click="resetQueryDish">
        重 置
      </el-button>
      <div style="margin-top: 20px">
        <el-button
          class="mr-12"
          type="primary"
          @click="$router.push({ name: 'CommodityUpload' })"
          >批量上传商品</el-button
        >
        <router-link class="mr-12" :to="{ name: 'CommodityCreate' }">
          <el-button type="primary"> 新建商品 </el-button>
        </router-link>
        <el-button @click="$refs.catagory.dialogTableVisible = true">
          新增分类
        </el-button>
        <el-button @click="$refs.time.dialogTableVisible = true">
          商品时间段
        </el-button>
        <el-button @click="$refs.label.dialogTableVisible = true">
          商品标签
        </el-button>
        <el-button
          @click="$router.push({ name: 'CommoditySync' })"
        >
          批量同步菜品
        </el-button>
      </div>
    </div>
    <el-divider />
    <commodity-list
      ref="commodity"
      :batch-btns="batchBtns"
      :get-food-list="fhGetFoodList"
      :get-catagory-list="fhGetCategories"
      :sort-categories="fhSortCategories"
      :edit-option="editOption"
      :edit-food="fhEditFoodTemplate"
      :delete-food="fhDeleteFoodTemplate"
      :del-cate="fhDeleteCategories"
      :edit-cate="fhEditCategories"
      :show-drop-off="false"
      :show-weight="false"
    />
    <AddFoodCategory ref="catagory" @postCategories="postCategories" />
    <FoodTime ref="time" />
    <FoodLabel ref="label" />
  </div>
</template>

<script>
import CommodityList from '@/components/CommodityList'
import AddFoodCategory from './_components/AddFoodCategory'
import FoodTime from './_components/FoodTime'
import FoodLabel from './_components/FoodLabel'
import { fhGetPos } from '@/api/possystem'
import {
  fhPostCategories,
  fhGetCategories,
  fhSortCategories,
  fhGetFoodList,
  fhPutFoodStatus,
  fhPutFoodStatusGrounp,
  fhBatchDeleteFoodTemplate,
  fhEditCategories,
  fhDeleteCategories
} from '@/api/categories'
import { fhDeleteFoodTemplate, fhEditFoodTemplate } from '@/api/foodtemplate'

export default {
  name: 'Commoditys',
  components: {
    CommodityList,
    AddFoodCategory,
    FoodTime,
    FoodLabel
  },
  data() {
    return {
      posStatus: false,
      statusArray: [],
      catagoryList: [],
      commodity: [],
      total: 0,
      queryLoad: false,
      foodTemplateName: '',
      // 批量处理的按钮
      batchBtns: [
        {
          name: '批量删除',
          load: false,
          field: 'foodTemplateIds',
          fn: params => fhBatchDeleteFoodTemplate(params)
        }
      ],
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
        }
      ]
    }
  },
  created() {
    this.getPos()
  },
  methods: {
    fhGetFoodList,
    fhGetCategories,
    fhSortCategories,
    fhPutFoodStatus,
    fhDeleteFoodTemplate,
    fhEditFoodTemplate,
    fhPutFoodStatusGrounp,
    fhEditCategories,
    fhDeleteCategories,
    // 获取收银系统的信息
    async getPos() {
      this.loadingPos = true
      this.loadingImport = true
      try {
        let {
          results: { openStatus, merchantDeveloperRspList }
        } = await fhGetPos()

        for (let i = 0; i < merchantDeveloperRspList.length; i++) {
          const { name, selectStatus } = merchantDeveloperRspList[i]
          if (name === 'tianCai') {
            if (selectStatus) openStatus = false
            break
          }
        }

        this.posStatus = openStatus
      } catch (e) {
        console.log(e)
      }
      this.loadingPos = false
      this.loadingImport = false
    },
    async postCategories(params, call) {
      try {
        await fhPostCategories(params)
        this.$message({
          message: '添加分类成功',
          type: 'success'
        })
        this.updateCates()
        call && call(true)
      } catch (err) {
        console.log(err)
        call && call(false)
      }
    },
    // commodity 组件数据查询
    async queryDish(query = {}) {
      this.queryLoad = true
      const { commodity } = this.$refs
      commodity.query = Object.assign(
        {},
        {
          pageNumber: 1,
          pageSize: 10
        },
        query
      )
      await commodity.rawGetFoodList()
      this.queryLoad = false
    },
    // 查询商品名称
    queryDishName() {
      this.queryDish({ foodTemplateName: this.foodTemplateName })
    },
    // 重置查询
    resetQueryDish() {
      this.foodTemplateName = ''
      this.queryDish()
    },
    // 添加标签后更新标签列表
    updateCates() {
      this.$refs.commodity.updateData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;

  &::v-deep .el-divider {
    margin-bottom: 0;
  }

  .header-fun-box {
    padding: 24px;
    padding-bottom: 0;
  }
}
</style>
