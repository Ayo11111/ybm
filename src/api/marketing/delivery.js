/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-26 10:17:01
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-08 11:52:42
 */
import { delivery } from '../base-api'
import request from '@/utils/request'

// 新建配送费减免
export function fhAddDelivery(data) {
  return request({
    url: `${delivery}/add`,
    method: 'POST',
    data
  })
}

// 配送费减免列表
export function fhGetDelivery(params) {
  return request({
    url: `${delivery}/list`,
    method: 'GET',
    params
  })
}

// 删除配送费
export function fhDelDelivery(id) {
  return request({
    url: `${delivery}/${id}`,
    method: 'DELETE'
  })
}

// 启禁用配送费
export function fhStatusDelivery(id, params) {
  return request({
    url: `${delivery}/${id}/status`,
    method: 'PUT',
    params
  })
}

// 活动详情
export function fhDeliveryDetail(id) {
  return request({
    url: `${delivery}/${id}`,
    method: 'GET'
  })
}
