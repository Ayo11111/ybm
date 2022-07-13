/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-10 10:17:40
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-25 14:42:19
 */
import request from '@/utils/request'
import { cats, tags, foodPeriods, foodTemplates } from '../base-api'

// 获取标签列表
export function fhGetTagsList() {
  return request({
    url: `${tags}`
  })
}

// 增加标签
export function fhPostAddTags(params) {
  return request({
    url: `${tags}`,
    method: 'post',
    data: params
  })
}

//  删除标签
export function fhDeleteTags(tagId) {
  return request({
    url: `${tags}/${tagId}`,
    method: 'delete'
  })
}

// 获取商品时间段列表
export function fhGetfoodPeriods() {
  return request({
    url: `${foodPeriods}`
  })
}

// 批量添加/编辑/删除商品时间段
export function fhPostBatch(data) {
  return request({
    url: `${foodPeriods}/batch`,
    method: 'post',
    data
  })
}

// 获取商品分类
export function ghGetCates(params) {
  return request({
    url: `${cats}`,
    data: params
  })
}

// 添加分类
export function fhPostCategories(params) {
  return request({
    url: `${cats}`,
    method: 'post',
    data: params
  })
}

//分类详情
export function fhGetCatDetails(id) {
  return request({
    url: `${cats}/${id}`
  })
}

// 获取商品模板的分类列表
export function fhGetCategories() {
  return request({
    url: `${foodTemplates}/categories`
  })
}

// 分类排序
export function fhSortCategories(data) {
  return request({
    url: `${cats}/sort`,
    method: 'put',
    data
  })
}

// 删除分类
export function fhDeleteCategories(id) {
  return request({
    url: `${cats}/${id}`,
    method: 'delete'
  })
}

// 编辑分类
export function fhEditCategories(id, data) {
  return request({
    url: `${cats}/${id}`,
    method: 'put',
    data
  })
}

// 获取商品模板列表
export function fhGetFoodList(params) {
  return request({
    url: `${foodTemplates}`,
    params
  })
}

// 修改商品状态
export function fhPutFoodStatus(foodTemplateId, params) {
  return request({
    url: `${foodTemplates}/${foodTemplateId}/import-status`,
    method: 'put',
    params
  })
}

// 批量修改商品模板状态
export function fhPutFoodStatusGrounp(params) {
  return request({
    url: `${foodTemplates}/import-status-batch`,
    method: 'put',
    params
  })
}

// 创建商品
export function fhCreateFoodTemplate(data) {
  return request({
    url: `${foodTemplates}`,
    method: 'post',
    data
  })
}

// 批量删除商品模板
export function fhBatchDeleteFoodTemplate(params) {
  return request({
    url: `${foodTemplates}/batch`,
    method: 'delete',
    params
  })
}
