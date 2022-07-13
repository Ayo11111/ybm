<template>
  <a-modal
    title="菜谱详情"
    width="50%"
    okText="保存"
    :visible="visible"
    @ok="handleOk"
    @cancel="onClose"
  >
    <div style="margin-bottom: 10px;">
      <span style="margin-right: 10px;">日期：{{ week }}（{{ date.replace(/-/g, '.') }}）</span>
      <span>餐次：{{ mealName }}（{{ startTime }}-{{ endTime }}）</span>
    </div>
    <a-table :columns="columns" :data-source="data" :pagination="false">
      <div slot="foodList" slot-scope="scope">
        <el-tag
          v-for="food in scope.foodList"
          :key="food.foodId"
          class="food-tag"
          type="info"
          closable
          @close="removeFood(scope.categoryId, food.foodId)"
        >{{ food.foodName }}</el-tag>
      </div>
    </a-table>
  </a-modal>
</template>

<script>
import { deepClone } from '@/utils'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    week: {
      type: String,
      default: ''
    },
    date: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      columns: [
        { title: '分类', key: 'categoryName', dataIndex: 'categoryName', width: 140 },
        { title: '菜品', key: 'foodList', scopedSlots: { customRender: 'foodList' } }
      ],
      data: [],
      mealName: '',
      startTime: '',
      endTime: ''
    }
  },
  async created() {
  },
  methods: {
    removeFood(categoryId, foodId) {
      this.data.forEach(cItem => {
        if (cItem.categoryId === categoryId) {
          cItem.foodList = cItem.foodList.filter(fItem => fItem.foodId !== foodId)
        }
      })
    },
    handleOk() {
      const ids = this.data.filter(cItem => cItem.foodList.length).map(cItem => cItem.foodList.map(fItem => ({ id: fItem.foodId })))
      this.$emit('removeFood', ids.flat())
      this.onClose()
    },
    onOpen(item) {
      this.mealName = item.storeShitangMealsName
      this.startTime = item.startDiningTime
      this.endTime = item.endDiningTime
      this.data = item.categoryList.map(cItem => ({
        categoryId: cItem.categoryId,
        categoryName: cItem.categoryName,
        foodList: cItem.foodList
      }))
      this.$emit('update:visible', true)
    },
    onClose() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
.food-tag {
  margin-right: 4px;
  margin-bottom: 4px;
}
</style>
