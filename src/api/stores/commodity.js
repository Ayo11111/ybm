/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-13 16:25:07
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-08 17:44:26
 */
import request from '@/utils/request'
import { store } from '../base-api'

// 店铺分类
export function fhGetStoteCates(id) {
  return request({
    url: `${store}/${id}/store-foods/categories`
  })
}

// 店铺商品
export function fhGetStoteFoods(id, params) {
  return request({
    url: `${store}/${id}/store-foods`,
    params
  })
}

// 编辑店铺商品
export function fhEditStoreFood(storeId, foodId, data) {
  return request({
    url: `${store}/${storeId}/store-foods/${foodId}`,
    method: 'put',
    data
  })
}

// 店铺商品上下架
export function fhDropOffFood(storeId, foodId, params) {
  return request({
    url: `${store}/${storeId}/store-foods/${foodId}/up`,
    method: 'put',
    params
  })
}

// 删除店铺商品
export function fhDelOffFood(storeId, foodId) {
  return request({
    url: `${store}/${storeId}/store-foods/${foodId}`,
    method: 'delete'
  })
}

// 批量修改沽清状态
export function fhBatchOversell(id, params) {
  return request({
    url: `${store}/${id}/store-foods/oversell-batch`,
    method: 'put',
    params
  })
}

// 批量修改推荐状态
export function fhBatchRecommend(id, params) {
  return request({
    url: `${store}/${id}/store-foods/recommend-batch`,
    method: 'put',
    params
  })
}

// 批量上下架
export function fhBatchUp(id, params) {
  return request({
    url: `${store}/${id}/store-foods/up-batch`,
    method: 'put',
    params
  })
}

// 批量删除
export function fhBatchDel(id, params) {
  return request({
    url: `${store}/${id}/store-foods/batch`,
    method: 'delete',
    params
  })
}

// 批量导入模板
export function fhBatchAdd(id, params) {
  return request({
    url: `${store}/${id}/store-foods/batch`,
    method: 'post',
    params
  })
}

// 获取店铺商品详情
export function fhGetStoreCommDetail(storeId, foodId) {
  return request({
    url: `${store}/${storeId}/store-foods/${foodId}`
  })
}

// 编辑店铺权重排序
export function fhPutstoreFoodWeight(storeId, foodId, params) {
  return request({
    url: `${store}/${storeId}/store-foods/${foodId}/weight`,
    method: 'put',
    params
  })
}

// 增加菜品模板和店铺菜品
export function fhPostAddStoreFood(storeId, params) {
  return request({
    url: `${store}/${storeId}/store-foods/add`,
    method: 'post',
    data: params
  })
}

// 增加菜品模板和店铺菜品
export function fhPutEditStoreFood(storeId, foodId , params) {
  return request({
    url: `${store}/${storeId}/store-foods/update/${foodId}`,
    method: 'put',
    data: params
  })
}
