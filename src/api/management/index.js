/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-14 01:18:37
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-22 03:54:17
 */
import request from '@/utils/request'
import { stat, statistics, businessAnalysis } from '../base-api'

// 菜品分析
export function fhGetFoodAnalyze(params) {
  return request({
    url: `${stat}/analyze`,
    params
  })
}

// 菜品分析
export function fhGetFoodAnalyzeExcel(params) {
  return request({
    url: `${stat}/analyze-excel`,
    responseType: 'arraybuffer',
    params
  })
}

// 菜品分析
export function fhGetManagementAnalyzeExcel(params) {
  return request({
    url: `${statistics}/managementAnalysis-excel`,
    responseType: 'arraybuffer',
    params
  })
}

// 经营分析
export function fhGetRealTimeStatistics() {
  return request({
    url: `${businessAnalysis}/real-time-statistics`
  })
}

// 实时趋势图
export function fhGetRealTimeTrend(params) {
  return request({
    url: `${businessAnalysis}/real-time-trend`,
    params
  })
}

// 历史数据统计
export function fhGetHistoricalStatistics(params) {
  return request({
    url: `${businessAnalysis}/historical-statistics`,
    params
  })
}

// 历史数据统计趋势
export function fhGetHistoricalTrend(params) {
  return request({
    url: `${businessAnalysis}/historical-trend`,
    params
  })
}

// 商品分析
export function fhGetCommodityStatistics(params) {
  return request({
    url: `${businessAnalysis}/commodity-statistics`,
    params
  })
}

// 订单分布，按时段分布
export function fhGetOrderTimeDistribution() {
  return request({
    url: `${businessAnalysis}/order-time`
  })
}

// 订单分布，按实付分布
export function fhGetOrderPriceDistribution() {
  return request({
    url: `${businessAnalysis}/order-price`
  })
}

// 导出商品数据报表
export function fhExportCommodityExcel(params) {
  return request({
    url: `${businessAnalysis}/commodity-excel`,
    params
  })
}

// 导出订单数据报表
export function fhExportOrderExcel(params) {
  return request({
    url: `${businessAnalysis}/order-excel`,
    params
  })
}

// 导出历史记录
export const fhGetExportRecord = params =>
  request({
    url: `${businessAnalysis}/download-list`,
    params
  })
