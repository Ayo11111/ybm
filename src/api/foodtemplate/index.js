/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-12 16:42:46
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-27 16:59:18
 */
import request from '@/utils/request'
import { foodTemplates } from '../base-api'

// 修改商品模板属性
export function fhEditFoodTemplate(id, data) {
  return request({
    url: `${foodTemplates}/${id}`,
    method: 'put',
    data
  })
}

// 获取商品模板详情
export function fhGetFoodTemplateDetail(id) {
  return request({
    url: `${foodTemplates}/${id}`
  })
}

// 删除商品模板
export function fhDeleteFoodTemplate(foodTemplateId) {
  return request({
    url: `${foodTemplates}/${foodTemplateId}`,
    method: 'delete'
  })
}
// 批量同步店铺菜品
export function fhUploadBatch(params) {
  return request({
    url: `${foodTemplates}/batch-store-food`,
    method: 'POST',
    params
  })
}
// 批量删除店铺菜品
export function fhDeleteBatch(params) {
  return request({
    url: `${foodTemplates}/batch-store-food`,
    method: 'DELETE',
    params
  })
}

// 批量导入菜品模板以及图片
export function fhImportBatch(params) {
  return request({
    url: `${foodTemplates}/import`,
    method: 'POST',
    params
  })
}
