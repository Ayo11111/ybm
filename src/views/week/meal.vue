<template>
  <div class="container">
    <div class="meal-list">
      <a-card v-for="item in mealList" :key="item.id" class="item" :title="item.name">
        <template #extra>
          <a-button type="link" @click="onUpdate(item)">编辑</a-button>
          <a-switch :default-checked="item.isValid" @change="handleChange(item)" />
        </template>
        <div>就餐时段：{{ `${item.startDiningTime} ~ ${item.endDiningTime}` }}</div>
        <div>配送时段：{{ `${item.startDeliveryTime} ~ ${item.endDeliveryTime}` }}</div>
      </a-card>
    </div>
    <div class="no-data">
      <div v-if="mealList.length === 0" class="text">暂无餐次</div>
      <a-button type="primary" @click="onCreate">添加</a-button>
    </div>
    <SaveMeal ref="saveMeal" :visible.sync="visible" @list="getMeals" />
  </div>
</template>

<script>
import SaveMeal from './_components/saveMeal'
import { getStoreId } from '@/utils/auth'
import { fhGetMeals, fhUpdateMeal } from '@/api/week'
export default {
  name: 'Meal',
  components: {
    SaveMeal
  },
  data() {
    return {
      visible: false,
      storeId: 0,
      mealList: []
    }
  },
  async created() {
    this.storeId = await getStoreId()
    this.getMeals()
  },
  methods: {
    async getMeals() {
      const { results } = await fhGetMeals(this.storeId)
      this.mealList = results.map(item => {
        item.startDiningTime = item.startDiningTime.substr(0, 5)
        item.endDiningTime = item.endDiningTime.substr(0, 5)
        item.startDeliveryTime = item.startDeliveryTime.substr(0, 5)
        item.endDeliveryTime = item.endDeliveryTime.substr(0, 5)
        return item
      })
    },
    onCreate() {
      this.$refs.saveMeal.onOpen()
    },
    onUpdate(item) {
      this.$refs.saveMeal.onOpen(item)
    },
    async handleChange(item) {
      const form = JSON.parse(JSON.stringify(item))
      form.startDiningTime = item.startDiningTime + ':00'
      form.endDiningTime = item.endDiningTime + ':00'
      form.startDeliveryTime = item.startDeliveryTime + ':00'
      form.endDeliveryTime = item.endDeliveryTime + ':00'
      form.isValid = !item.isValid
      await fhUpdateMeal(this.storeId, form.id, form)
    }
  }
}
</script>

<style scoped lang="scss">
.no-data {
  text-align: center;

  .text {
    margin-bottom: 10px;
  }
}
.meal-list {
  display: flex;
  flex-wrap: wrap;

  .item {
    width: 30%;
    margin: 15px;
  }
}
</style>
