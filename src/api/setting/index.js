/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-21 17:03:59
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-09 16:30:27
 */
import request from '@/utils/request'
import { storeDetail, adapter } from '../base-api'

// 获取店铺详情
export function fhGetStoreDetail() {
  return request({
    url: `${storeDetail}`
  })
}

// 编辑店铺
export function fhEditStore(data) {
  return request({
    url: `${storeDetail}`,
    method: 'put',
    data
  })
}

// 获取店铺配送方式
export function fhGetDeliverys() {
  return request({
    url: `${storeDetail}/delivery-type`
  })
}

// 获取商户的收银设置详情
export function fhGetPos() {
  return request({
    url: `${adapter}/developers`
  })
}

// 同步第三方店铺菜品
export function fhPosFood() {
  return request({
    url: `${adapter}/stores/STOREID/syn-food`,
    method: 'POST'
  })
}

// 起禁用店铺
export function fhChangeStoreStatus(params) {
  return request({
    url: `${storeDetail}/up-status`,
    method: 'put',
    params
  })
}
