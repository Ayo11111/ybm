import { platformCoupon } from '../base-api'
import request from '@/utils/request'

// 获取平台优惠券列表
export function fhGetPlatformCoupon(params) {
  return request({
    url: `${platformCoupon}/list`,
    params
  })
}

// 获取平台优惠券详情
export function fhPlatformCouponDetail(id) {
  return request({
    url: `${platformCoupon}/${id}`
  })
}

// 更新门槛
export function fhPlatformCouponThreshold(id, params) {
  return request({
    url: `${platformCoupon}/${id}/threshold`,
    method: 'PUT',
    params
  })
}

// 优惠券启禁用
export function fhPutCouponStatus(id, params) {
  return request({
    url: `${platformCoupon}/${id}/status`,
    method: 'PUT',
    params
  })
}

