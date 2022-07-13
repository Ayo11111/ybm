import request from '@/utils/request'
import { helpEach } from '../base-api'

// 获取竞对商家列表
export function fhGetExcludeMerchant() {
  return request({
    url: `${helpEach}/exclude-merchant`
  })
}

// 更新竞对商家列表
export function fhUpdateExcludeMerchant(data) {
  return request({
    url: `${helpEach}/exclude-merchant`,
    method: 'PUT',
    data
  })
}

// 流量互助活动效果统计EXCEL导出
export function fhFlowExcel(params) {
  return request({
    url: `${helpEach}/activity-statistic-excel`,
    responseType: 'arraybuffer',
    params
  })
}

// 流量互助统计(其他商家导流订单)
export function fhHelpSelf(params) {
  return request({
    url: `${helpEach}/activity-stat-help-self`,
    params,
    method: 'PUT'
  })
}

// 流量互助统计(其他商家导流订单)
export function fhHelpOther(params) {
  return request({
    url: `${helpEach}/activity-stat-help-other`,
    params,
    method: 'PUT'
  })
}

