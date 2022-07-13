/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-25 15:12:00
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-20 16:49:10
 */
import request from '@/utils/request'
import { statistics, home } from '../base-api'

// 档调试经营预览相关数据
export function fhGetBusiness() {
  return request({
    url: `${statistics}/business-preview`
  })
}

// 店铺状态相关数据
export function fhGetStorePreview(params) {
  return request({
    url: `${statistics}/store-preview`,
    params
  })
}

// 店铺评分-导出
export function fhGetStoreScoreExcel() {
  return request({
    url: `${statistics}/store-score-excel`,
    responseType: 'arraybuffer'
  })
}

// 首页概览
export function fhGetManage() {
  return request({
    url: `${home}`
  })
}
