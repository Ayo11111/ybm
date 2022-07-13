/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-11 13:40:46
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-30 14:11:00
 */
import request from '@/utils/request'
import { banners } from '../base-api'

// 获取轮播图列表
export function fhGetBannerList() {
  return request({
    url: `${banners}`
  })
}

// 编辑轮播图
export function fhPutBanner(bannerId, params) {
  return request({
    url: `${banners}/${bannerId}`,
    method: 'put',
    data: params
  })
}

// 删除轮播图
export function fhDeleteBanner(bannerId) {
  return request({
    url: `${banners}/${bannerId}`,
    method: 'delete'
  })
}

// 轮播图状态
export function fhPutBannerStatus(bannerId, params) {
  return request({
    url: `${banners}/${bannerId}/up-status`,
    method: 'put',
    params
  })
}

// 新增轮播图
export function fhPostAddBanner(params) {
  return request({
    url: `${banners}`,
    method: 'post',
    data: params
  })
}

// 获取轮播图详情
export function fhGetBannerDetail(bannerId) {
  return request({
    url: `${banners}/${bannerId}`
  })
}

// 获取交换排序
export function fhPutBannerSort(params) {
  return request({
    url: `${banners}`,
    method: 'put',
    params
  })
}
