/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-04 11:14:31
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-24 13:37:04
 */
import request from '@/utils/request'
import { store, auditsCat } from '../base-api'

export function fhGetCategoriesList(storeId) {
  return request({
    url: `${store}/${storeId}/store-foods/categories`
  })
}

// 分类审核列表
export function fhGetCatAutitsList(params) {
  return request({
    url: `${auditsCat}/categories`,
    params
  })
}

// 修改审核分类
export function fhPutCatAutits(id, params) {
  return request({
    url: `${auditsCat}/categories/${id}`,
    data: params,
    method: 'put'
  })
}

// 商品审核列表
export function fhGetFoodAutitsList(params) {
  return request({
    url: `${auditsCat}/foods`,
    params
  })
}

// 审核商品详情
export function fhGetFoodAutitsDetails(id) {
  return request({
    url: `${auditsCat}/foods/${id}`
  })
}

// 修改审核商品
export function fhPutFoodAutits(id, params) {
  return request({
    url: `${auditsCat}/foods/${id}`,
    data: params,
    method: 'put'
  })
}

// 审核分类详情
export function fhGetCateAutitsDetails(id) {
  return request({
    url: `${auditsCat}/categories/${id}`
  })
}
