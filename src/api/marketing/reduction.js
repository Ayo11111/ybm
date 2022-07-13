/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-24 18:10:48
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-04 11:28:56
 */
import { activity, overflow } from '../base-api'
import request from '@/utils/request'

// 新建满减
export function fhAddOverflow(data) {
  return request({
    url: `${overflow}`,
    method: 'POST',
    data
  })
}

// 满减列表
export function fhGetOverflow(params) {
  return request({
    url: `${overflow}`,
    method: 'GET',
    params
  })
}
// 删除满减
export function fhDelOverflow(id) {
  return request({
    url: `${overflow}/${id}`,
    method: 'DELETE'
  })
}

// 启禁用满减
export function fhStatusOverflow(id, params) {
  return request({
    url: `${overflow}/${id}/status`,
    method: 'PUT',
    params
  })
}

// 满减活动详情
export function fhOverflowDetail(id, params) {
  return request({
    url: `${overflow}/${id}`,
    method: 'GET',
    params
  })
}

// 获取活动营业额折线图
export const fhGetTurnoverLineChart = params =>
  request({
    url: `${activity}/line-chart/turnover`,
    params
  })

// 获取活动订单数折线图
export const fhGetOrderCountLineChart = params =>
  request({
    url: `${activity}/line-chart/order-count`,
    params
  })

// 获取活动卡片统计
export const fhGetAactiveStats = params =>
  request({
    url: `${activity}/stats`,
    params
  })
