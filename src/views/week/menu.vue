<template>
  <div class="container">
    <div>菜谱规则：周菜谱不重复（设置每日菜谱，不重复）</div>
    <dir class="search">
      菜谱日期
      <el-date-picker
        v-model="currentDate"
        class="picker"
        type="date"
        size="small"
        placeholder="选择日期"
        @change="onDateSelected"
      />
      <el-button-group class="button">
        <el-button size="small" plain @click="onPrevWeek">上一周</el-button>
        <el-button size="small" plain @click="onNextWeek">下一周</el-button>
      </el-button-group>
      菜谱周期：<span class="cycle">{{ dateList[0].replace(/-/g, '.') }} - {{ dateList[6].replace(/-/g, '.') }}</span> 第 {{ weekNum }} 周
    </dir>

    <el-tabs v-model="activeWeek" @tab-click="onClick">
      <el-tab-pane v-for="(item, index) in week" :key="index" :name="(index + 1).toString()">
        <span slot="label">{{ item }}（{{ dateList[index].substring(5) }}）</span>
      </el-tab-pane>
    </el-tabs>
    <el-table border :data="tableData[activeWeek - 1]" :show-header="false">
      <el-table-column width="160">
        <template slot-scope="{row}">
          <div class="meal">
            <div>{{ row.storeShitangMealsName }}</div>
            <div>{{ row.startDiningTime }}~{{ row.endDiningTime }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot-scope="{row}">
          <span v-for="categoryItem in row.categoryList" :key="categoryItem.id">
            <el-tag v-for="foodItem in categoryItem.foodList" :key="foodItem.foodId" type="info" class="food-tag">{{ foodItem.foodName }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column width="160">
        <template slot-scope="{row}">
          <div class="meal">
            <i v-show="!row.categoryList.length" class="el-icon-circle-plus-outline plus-icon" @click="onFoodDialog(row)" />
            <!-- <div style="cursor:pointer" @click="handel(event)">{{ `${!row.categoryList.length ? '添加' : '更新'}菜品</div> -->
            <div style="cursor:pointer" @click="onFoodDialog(row)">{{ `${!row.categoryList.length ? '添加' : '更新'}菜品` }}</div>
            <div v-show="row.categoryList.length" style="cursor:pointer" @click="onViewDialog(row)">菜品详情</div>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <div class="copy-button">
      <el-button type="primary" @click="onCopyDialog">菜谱复制到</el-button>
    </div>

    <SelectStoreFood
      v-if="!reset"
      :dialog-visible.sync="dialogVisibleF"
      :active-id.sync="activeId"
      :active-name.sync="activeName"
      :share="true"
      :store-ids="formData.storeIdList"
      :radio-orcheckbox="checkbox"
      @selectFood="selectFood"
    />
    <FoodDetail
      ref="foodDetail"
      :visible.sync="foodVisible"
      :week="week[activeWeek - 1]"
      :date="currentDate"
      @removeFood="removeFood"
    />
    <CopyMenu
      ref="copyMenu"
      :visible.sync="copyVisible"
      :week="week[activeWeek - 1]"
      :date="currentDate"
      @copyMenu="copyMenu"
    />
  </div>
</template>

<script>
import SelectStoreFood from '@/views/component/SelectStoreFood'
import FoodDetail from './_components/foodDetail'
import CopyMenu from './_components/copyMenu'
import { getStoreId } from '@/utils/auth'
import { fhGetWeekMenus, fhSaveMealFood, fhCopyMealFood } from '@/api/week'
export default {
  components: {
    SelectStoreFood,
    FoodDetail,
    CopyMenu
  },
  data() {
    var dialogVisibleF = () => {
      this.reset = false
      this.$nextTick(() => {
        this.dialogVisibleF = !this.dialogVisibleF
      })
    }
    return {
      storeId: null,
      query: {
        startDate: ''
      },
      currentDate: new Date(),
      dateList: [],
      weekNum: 1,
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      activeWeek: '1',
      tableData: [],
      // 选择菜品
      activeId: [], // 已选择的菜品id
      activeName: [], // 已选择的菜品name
      checkbox: 'checkbox',
      foodVisible: false,
      copyVisible: false,
      dialogVisibleF: false,
      reset: false,
      event: dialogVisibleF,
      formData: {
        storeShitangMealsId: 0,
        storeFoodIdList: []
      }
    }
  },
  async created() {
    this.storeId = await getStoreId()
    this.formData.storeIdList = [this.storeId]
    this.getCurWeek(new Date())
    this.setActiveName()
  },
  methods: {
    async getWeekMenus() {
      const { results } = await fhGetWeekMenus(this.storeId, this.query)
      this.tableData = results.map(item => {
        item.map(mealItem => {
          mealItem.startDiningTime = mealItem.startDiningTime.substr(0, 5)
          mealItem.endDiningTime = mealItem.endDiningTime.substr(0, 5)
        })
        return item
      })
    },
    getWeekNum() {
      const d1 = new Date(this.dateList[0])
      const d2 = new Date(this.dateList[0])
      d2.setMonth(0)
      d2.setDate(1)
      const rq = d1 - d2
      const days = Math.ceil(rq / (24 * 60 * 60 * 1000))
      const num = Math.ceil(days / 7)
      this.weekNum = num + 1
    },
    getCurWeek(curDate) {
      const currentDate = new Date(curDate)
      const timesStamp = currentDate.getTime()
      const currenDay = currentDate.getDay()
      const dateList = []
      for (let i = 0; i < 7; i++) {
        const d = new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7))
        // console.log(d.toLocaleDateString().replace(/\//g, '-'))
        const date = d.getFullYear() + '-' + (d.getMonth() + 1).toString().padStart(2, '0') + '-' + d.getDate().toString().padStart(2, '0')
        dateList.push(date)
      }
      this.query.startDate = dateList[0]
      this.dateList = dateList
      this.activeWeek = currenDay === 0 ? '7' : currenDay.toString()
      this.currentDate = this.formData.menuDate = dateList[this.activeWeek - 1]
      this.getWeekMenus()
      this.getWeekNum()
    },
    onDateSelected() {
      this.getCurWeek(this.currentDate)
    },
    onPrevWeek() {
      const date = new Date(this.dateList[0])
      this.getCurWeek(date.setDate(date.getDate() - 7))
    },
    onNextWeek() {
      const date = new Date(this.dateList[0])
      this.getCurWeek(date.setDate(date.getDate() + 7))
    },
    onClick(tab, event) {
      this.currentDate = this.formData.menuDate = this.dateList[this.activeWeek - 1]
    },
    handel(fn) {
      fn()
    },
    onFoodDialog(row) {
      this.reset = false
      this.formData.storeShitangMealsId = row.storeShitangMealsId
      this.$nextTick(() => {
        this.dialogVisibleF = !this.dialogVisibleF
        this.setActiveName(row)
      })
    },
    setActiveName(row) {
      this.activeName = []
      row.categoryList.forEach(categoryItem => {
        categoryItem.foodList.forEach(foodItem => {
          this.activeName.push({ id: foodItem.foodId, name: foodItem.foodName })
        })
      })
    },
    selectFood(items, ids) {
      console.log(items, ids)
      this.dialogVisibleF = false
      const storeFoodIdList = []
      const activeName = []
      items.forEach(val => {
        const { name } = val
        storeFoodIdList.push({ id: val.id })
        if (this.activeName.indexOf(name) === -1) {
          activeName.push(val)
        }
      })
      this.formData.storeFoodIdList = storeFoodIdList
      this.activeName = activeName
      this.saveFood()
    },
    onViewDialog(row) {
      this.formData.storeShitangMealsId = row.storeShitangMealsId
      this.$refs.foodDetail.onOpen(row)
    },
    removeFood(ids) {
      console.log(ids)
      this.formData.storeFoodIdList = ids
      this.saveFood()
    },
    async saveFood() {
      await fhSaveMealFood(this.storeId, this.formData)
      setTimeout(() => {
        this.reset = true
      }, 400)
      this.getCurWeek(this.currentDate)
    },
    onCopyDialog() {
      this.$refs.copyMenu.onOpen()
    },
    async copyMenu(form) {
      form.src = this.currentDate
      await fhCopyMealFood(this.storeId, form)
      this.$message.success('菜谱复制成功')
    }
  }
}
</script>

<style scoped lang="scss">
.search {
  display: flex;
  align-items: center;
  padding: 10px 0 20px;

  .picker {
    margin-left: 6px;
  }
  .button {
    margin: 0 10px;
  }
  .cycle {
    font-size: 12px;
    margin-right: 10px;
  }
}
.food-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}
.meal {
  display: flex;
  flex-direction: column;
  align-items: center;
  .plus-icon {
    font-size: 20px;
    cursor: pointer;
  }
}
.copy-button {
  margin: 40px 0 10px;
  text-align: center;
}
</style>
