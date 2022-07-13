/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-10 10:03:24
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-10 10:05:05
 */
import request from '@/utils/request'
import { activity } from '../base-api'

// 活动当日状态列表
export function fhGetActivityOptionList(params) {
  return request({
    url: `${activity}/list`,
    params
  })
}

// 活动当日状态统计
export function fhGetActivityOptionListStats(params) {
  return request({
    url: `${activity}/list-stats`,
    params
  })
}
