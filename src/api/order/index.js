import request from '@/utils/request'
import { order } from '../base-api'

// 订单管理订单列表
export function fhGetOrderList(params) {
  return request({
    url: `${order}/order-list`,
    params
  })
}

// 订单详情
export function fhGetOrderDetail(orderId) {
  return request({
    url: `${order}/${orderId}`
  })
}
