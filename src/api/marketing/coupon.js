/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-03 09:59:17
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-07 09:30:57
 */
import { coupon } from '../base-api'
import request from '@/utils/request'

// 新建优惠券
export function fhAddCoupon(data) {
  return request({
    url: `${coupon}/common`,
    method: 'POST',
    data
  })
}

// 优惠券列表
export function fhGetCoupon(params) {
  return request({
    url: `${coupon}/list`,
    method: 'GET',
    params
  })
}

// 删除优惠券
export function fhDelCoupon(id) {
  return request({
    url: `${coupon}/${id}`,
    method: 'DELETE'
  })
}

// 启禁用优惠券
export function fhStatusCoupon(id, params) {
  return request({
    url: `${coupon}/${id}/status`,
    method: 'PUT',
    params
  })
}

// 详情
export function fhCouponDetail(id) {
  return request({
    url: `${coupon}/common/${id}`,
    method: 'GET'
  })
}

// 修改库存
export function fhCouponStock(id, params) {
  return request({
    url: `${coupon}/${id}`,
    method: 'PUT',
    params
  })
}

// 添加单品兑换券
export function fhAddSingle(data) {
  return request({
    url: `${coupon}/single-item`,
    method: 'POST',
    data
  })
}
