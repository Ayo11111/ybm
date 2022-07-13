<template>
  <div class="container">
    <div style="width: 60%">
      <div class="search mb-12">
        <div class="mr-12">
          <span>用餐日期：</span>
          <el-date-picker style="width:240px" v-model="diningDate" type="daterange" size="small" clearable
            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            @change="getDiningDate"
          />
        </div>
        <div class="mr-12">
          <span>菜品分类：</span>
          <el-select v-model="query.categoryId" placeholder="请选择" size="small" clearable>
            <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
      </div>
      <div class="search mb-12">
        <div class="mr-12">
          <span>餐次：</span>
          <el-select v-model="query.mealsId" placeholder="请选择" size="small" clearable>
            <el-option v-for="item in mealList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="mr-12">
          <span>菜品名称：</span>
          <el-input style="width:140px" v-model="query.foodName" placeholder="请输入菜品名称" size="small" clearable></el-input>
        </div>
        <div>
          <el-button type="primary" style="margin-left: 16px" @click="onSearch">查询</el-button>
        </div>
      </div>
      <div class="stat">
        <div class="item" style="margin-right: 30px;">
          <img class="icon" src="@/assets/img/food-total.png">
          <div class="text">
            <div class="label">预订单数</div>
            <div class="num">{{ total }}</div>
          </div>
        </div>
        <div class="item">
          <img class="icon" src="@/assets/img/food-finished.png">
          <div class="text">
            <div class="label">已取餐订单数</div>
            <div class="num">{{ finished }}</div>
          </div>
        </div>
        <div class="item">
          <img class="icon" src="@/assets/img/food-unfinished.png">
          <div class="text">
            <div class="label">未取餐订单数</div>
            <div class="num">{{ unfinished }}</div>
          </div>
        </div>
      </div>
      <a-table :loading="loading" :columns="columns" :data-source="data" :pagination="false">
        <div slot="foodCount" slot-scope="{foodCount}" style="font-weight: bold;">
          {{ foodCount }}
        </div>
      </a-table>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getStoreId } from '@/utils/auth'
import { ghGetCates } from '@/api/categories'
import { fhGetMeals } from '@/api/week'
import { fhGetFoodStat } from '@/api/week-order'
export default {
  name: 'FoodStat',
  components: {
    Pagination
  },
  data() {
    return {
      columns: [
        { title: '序号', customRender: (text, record, index)=> `${index + 1}`, align: 'center' },
        { title: '菜品名称', key: 'foodName', dataIndex: 'foodName', align: 'center' },
        { title: '菜品分类', key: 'categoryName', dataIndex: 'categoryName', align: 'center' },
        { title: '单位', key: 'unit', dataIndex: 'unit', align: 'center' },
        { title: '合计数量', key: 'foodCount', scopedSlots: { customRender: 'foodCount' }, align: 'center' },
      ],
      diningDate: [
        this.$moment().format('YYYY-MM-DD'),
        this.$moment().format('YYYY-MM-DD')
      ],
      categoryList: [],
      mealList: [],
      total: 0,
      finished: 0,
      unfinished: 0,
      data: [],
      loading: false,
      query: {
        startTime: this.$moment().format('YYYY-MM-DD'),
        endTime: this.$moment().format('YYYY-MM-DD'),
        categoryId: null,
        mealsId: null,
        foodName: null
      }
    }
  },
  created() {
    this.getCategoryList()
    this.getMealList()
    this.getData()
  },
  methods: {
    async getCategoryList() {
      const { results } = await ghGetCates()
      this.categoryList = results
    },
    async getMealList() {
      const { results } = await fhGetMeals(await getStoreId())
      this.mealList = results
    },
    async getData() {
      this.detailLoad = true
      try {
        const { results: { total, finished, unfinished, statistic }} = await fhGetFoodStat(this.query)
        this.total = total
        this.finished = finished
        this.unfinished = unfinished
        this.data = statistic
      } catch (e) {
        console.log('debug axios', e)
      }
      this.detailLoad = false
    },
    getDiningDate(val) {
      this.query['startTime'] = val[0]
      this.query['endTime'] = val[1]
    },
    onSearch() {
			this.query = JSON.parse(JSON.stringify(this.query).replace(/""/g, null))
      this.getData()
    },
    // 查询页码
    pagination(v) {
      this.query = Object.assign({}, this.query, v)
      this.getData()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: auto;

  .search {
    display: flex;
    align-items: center;
  }

  .stat {
    height: 60px;
    display: flex;
    justify-content: space-evenly;
    margin: 40px 0 30px;

    .item {
      display: flex;

      .text {
        display: flex;
        flex-direction: column;
        justify-content: center;

        .label {
          color: #999;
        }

        .num {
          font-size: 24px;
        }
      }
    }
  }
}
</style>
