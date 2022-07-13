/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-20 10:11:43
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-29 10:33:17
 */

import request from '@/utils/request'
import { mcCats, cats, merchants, merchant, switchs, seller } from '../base-api'

export function fhCats(params) {
  return request({
    url: `${mcCats}/enable`,
    params
  })
}

export function fhWmCats() {
  return request({
    url: `${cats}`
  })
}

// 获取商户详情
export function fhGetMerchantDetail(id) {
  return request({
    url: `${merchants}/${id}`
  })
}

// 编辑商户详情
export function fhEditMerchantDetail(id, data) {
  return request({
    url: `${merchants}/${id}`,
    method: 'put',
    data
  })
}

// 商家分类列表
export function fhGetEnable() {
  return request({
    url: `${merchant}/categories/enable`
  })
}

// 商家分类列表
export function fhPutPassWord(params) {
  return request({
    url: `${merchants}/update-password`,
    method: 'put',
    data: params
  })
}

// 读取商家配置信息
export function fhGetOption() {
  return request({
    url: `${switchs}`
  })
}

// 读取自提柜配置信息
export function fhGetCabDetail(params) {
  return request({
    url: `${switchs}/cab-detail`,
    method: 'put',
    params
  })
}

// 设置自提柜开关
export function fhPutCabSwitch(params) {
  return request({
    url: `${switchs}/cab-switch`,
    method: 'put',
    params
  })
}

// 设置自配送开关
export function fhPutDeliverySwitch(params) {
  return request({
    url: `${switchs}/self-delivery-switch`,
    method: 'put',
    params
  })
}

// 获取商家配送费相关信息
export function fhGetSellerPrice() {
  return request({
    url: `${seller}/seller-price`
  })
}

// 设置商家的默认配送费
export function fhPutDeliveryPrice(params) {
  return request({
    url: `${seller}/STOREID/default-delivery-price`,
    method: 'put',
    params
  })
}

// 获取商家权限
export function fhGetMerActivity() {
  return request({
    url: `${switchs}/activity`
  })
}

// 获取商家列表的部分信息
export function fhGetAllMerchantsPartial(params) {
  return request({
    url: `${merchants}/partial`,
    params
  })
}

// 商家公众号跳转汇总统计
export function fhGetMpHeader(params) {
  return request({
    url: `${seller}/merchants-help-each-order/mp-stat-header`,
    params
  })
}

// 获取商家所在医院管理员手机号
export function fhGetOptionLiaisonPhone() {
  return request({
    url: `${switchs}/liaison-phone`
  })
}
