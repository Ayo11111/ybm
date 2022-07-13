/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-01 10:05:35
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-08 14:36:22
 */
import { foodTemplates, discount } from '../base-api'
import request from '@/utils/request'

// 获取店铺的交集菜品模板的分类
export function fhGetShareCat(params) {
  return request({
    url: `${foodTemplates}/intersection-category`,
    method: 'GET',
    params
  })
}

// 获取店铺的交集菜品模板
export function fhGetShareTemplate(params) {
  return request({
    url: `${foodTemplates}/intersection-food-template`,
    method: 'GET',
    params
  })
}

// 增加折扣商品
export function fhAddDiscount(data) {
  return request({
    url: `${discount}`,
    method: 'POST',
    data
  })
}

// 获取折扣商品列表
export function fhGetDiscount(params) {
  return request({
    url: `${discount}`,
    method: 'GET',
    params
  })
}

// 启禁用折扣活动
export function fhStatusDiscount(id, params) {
  return request({
    url: `${discount}/${id}/up-status`,
    method: 'PUT',
    params
  })
}

// 删除折扣活动
export function fhDelDiscount(id) {
  return request({
    url: `${discount}/${id}`,
    method: 'DELETE'
  })
}

// 折扣活动详情详情
export function fhDiscountDetail(id) {
  return request({
    url: `${discount}/${id}`,
    method: 'GET'
  })
}

