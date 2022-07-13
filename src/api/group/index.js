/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-03-03 10:04:43
 * @LastEditors: CJH
 * @LastEditTime: 2021-03-04 14:11:50
 */

import request from '@/utils/request'
import { group } from '../base-api'

// 获取活动详情
export function fhGetGroupDetail() {
  return request({
    url: `${group}/detail`
  })
}

// 获取活动详情
export function fhPutGroupUpdate(params) {
  return request({
    url: `${group}/update`,
    data: params,
    method: 'put'
  })
}

// 活动订单统计汇总
export function fhGroupStat(params) {
  return request({
    url: `${group}/order-stat-collect`,
    params
  })
}

// 活动订单统计
export function fhGroupOrder(params) {
  return request({
    url: `${group}/order-stat`,
    params
  })
}
// 流分众营销活动效果统计EXCEL导出
export function fhFlowExcel(params) {
  return request({
    url: `${group}/order-excel`,
    responseType: 'arraybuffer',
    params
  })
}
