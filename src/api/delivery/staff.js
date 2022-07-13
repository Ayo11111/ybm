/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-03-24 17:21:50
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-10 11:08:24
 */
import request from '@/utils/request'
import { persons, orders } from '../base-api'

// 添加配送员
export function putDelivery(data) {
  return request({
    url: `${persons}`,
    method: 'post',
    data: data
  })
}

// 获取配送员列表
export function getDeliverys(params) {
  return request({
    url: `${persons}`,
    params
  })
}

// 删除配送员
export function delDelivery(personId) {
  return request({
    url: `${persons}/${personId}`,
    method: 'delete'
  })
}

// 获取一个配送员的信息
export function getDeliveryInfo(personId) {
  return request({
    url: `${persons}/${personId}`
  })
}

// 编辑一个配送员的信息
export function editDelivery(personId, data) {
  return request({
    url: `${persons}/${personId}`,
    method: 'put',
    data
  })
}

// 自配送接单
export function fhAcceptOrder(orderId, params) {
  return request({
    url: `${orders}/${orderId}/self-delivery/accept`,
    method: 'put',
    params
  })
}
