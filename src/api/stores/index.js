/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-23 15:46:22
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-02 14:25:12
 */

import request from '@/utils/request'
import { store, storeAccount, storeDetail } from '../base-api'

// 获取店铺列表
export function fhGetSotres(params) {
  return request({
    url: `${store}`,
    params
  })
}

// 单独修改一个店铺的状态
export function fhChangeStoreStatus(uri, params, storeId) {
  return request({
    url: `${store}/${storeId}/${uri}`,
    method: 'put',
    params
  })
}

// 批量修改一个店铺的状态
export function fhBatchChangeStoreStatus(uri, params) {
  return request({
    url: `${store}/${uri}`,
    method: 'put',
    params
  })
}

// 创建店铺
export function fhCreateStore(data) {
  return request({
    url: `${store}`,
    method: 'post',
    data
  })
}

// 获取店铺详情
export function fhGetStoreDetail(id) {
  return request({
    url: `${store}/${id}`
  })
}

// 获取店铺配送方式
export function fhGetDeliverys() {
  return request({
    url: `${store}/delivery-type`
  })
}

// 获取店铺城市
export function fhGetStoreCity() {
  return request({
    url: `${store}/city`
  })
}

// 编辑店铺
export function fhEditStore(id, data) {
  return request({
    url: `${store}/${id}`,
    method: 'put',
    data
  })
}

// 获取城市列表
export function fhGetStoreCityList() {
  return request({
    url: `${store}/city`
  })
}

// 根据id，获取店铺的名称
export function fhGetStoreNameList(params) {
  return request({
    url: `${store}/mapping-store-name`,
    method: 'GET',
    params
  })
}

// 获取可用店长账号
export function fhGetStoreManager(params) {
  return request({
    url: `${storeAccount}/enable-store-manager`,
    params
  })
}

// 获取店铺可用配送方式
export function fhGetStoreDelivery() {
  return request({
    url: `${storeDetail}/delivery-type`
  })
}

// 获取商家的打印机配置列表
export const fhGetPrints = () =>
  request({
    url: `${storeDetail}/point`
  })

// 编辑商家的打印机配置列表
export const fhEditPrints = data =>
  request({
    url: `${storeDetail}/point`,
    method: 'put',
    data
  })

// 打印测试
export const fhPrintTest = data =>
  request({
    url: `${storeDetail}/point-test`,
    method: 'post',
    data
  })

// 编辑店铺费用规则
export const fhEditFeeRule = data =>
  request({
    url: `${storeDetail}/fee-rules`,
    method: 'put',
    data
  })

// 获取门店的铃声设置信息
export function fhGetStoreRingsSetting() {
  return request({
    url: `${storeDetail}/rings-setting`,
    method: 'GET'
  })
}

// 修改门店的铃声设置信息
export function fhPutStoreRingsSetting(params) {
  return request({
    url: `${storeDetail}/rings-setting`,
    method: 'PUT',
    data: params
  })
}
