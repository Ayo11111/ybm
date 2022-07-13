import request from '@/utils/request'
import { store } from '../base-api'

// 获取餐次
export function fhGetMeals(storeId){
  return request({
    url: `${store}/${storeId}/store-shitang-meals`
  })
}

// 添加餐次
export function fhCreateMeal(storeId, data){
  return request({
    url: `${store}/${storeId}/store-shitang-meals`,
    method: 'post',
    data
  })
}

// 编辑餐次
export function fhUpdateMeal(storeId, mealId, data){
  return request({
    url: `${store}/${storeId}/store-shitang-meals/${mealId}`,
    method: 'put',
    data
  })
}

// 获取周菜谱
export function fhGetWeekMenus(storeId, params) {
  return request({
    url: `${store}/${storeId}/store-shitang-menu/getWeekMenu`,
    params
  })
}

// 保存某天某餐菜谱
export function fhSaveMealFood(storeId, data) {
  return request({
    url: `${store}/${storeId}/store-shitang-menu/saveMealsMenu`,
    method: 'post',
    data
  })
}

// 复制某天某餐菜谱到某些日期
export function fhCopyMealFood(storeId, params) {
  return request({
    url: `${store}/${storeId}/store-shitang-menu/copyMealsMenu`,
    method: 'put',
    params
  })
}
