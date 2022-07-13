/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-20 14:00:28
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-13 10:31:57
 */

import request from '@/utils/request'
import { orders, nurseOrders } from '../base-api'

// 获取当前订单
export function fhGetCurrOrders(params) {
  return request({
    url: `${orders}/current`,
    params
  })
}

// 备餐完成
export function fhReady(orderId) {
  return request({
    url: `${orders}/${orderId}/ready`,
    method: 'put'
  })
}

// 订单详情
export function fhGetOrderDetail(orderId) {
  return request({
    url: `${orders}/${orderId}`
  })
}

// 退款订单列表
export function fhGetOrderRefunds() {
  return request({
    url: `${orders}/refunds`
  })
}

// 预订单
export function fhGetOrderAppoint(params) {
  return request({
    url: `${orders}/appoint`,
    params
  })
}

// 历史订单
export function fhGetOrderHistory(params) {
  return request({
    url: `${orders}/history`,
    params
  })
}

// 退款订单审核
export function fhVerifyRefundOrder(id, params) {
  return request({
    url: `${orders}/${id}/refund-audit`,
    method: 'put',
    params
  })
}

// 用户已取餐
export function fhPickup(id) {
  return request({
    url: `${orders}/${id}/pickup`,
    method: 'put'
  })
}

// 切换配送方式
export function fhChangeDelivery(id, params) {
  return request({
    url: `${orders}/${id}/reDelivery`,
    method: 'put',
    params
  })
}

// 直接取消订单
export function fhCancelOerder(id, params) {
  return request({
    url: `${orders}/${id}/direct-refund`,
    method: 'put',
    params
  })
}

// 自配送送达
export function fhSelfDeliveryFinish(id) {
  return request({
    url: `${orders}/${id}/self-delivery/finish`,
    method: 'put'
  })
}

// 获取接单状态
export function fhAcceptStatus(id) {
  return request({
    url: `${orders}/accept-status`
  })
}

// 接单状态切换
export function fhUpdateAcceptStatus(params) {
  return request({
    url: `${orders}/accept-status`,
    method: 'put',
    params
  })
}

// 手动接单
export function fhAccept(id) {
  return request({
    url: `${orders}/${id}/accept`,
    method: 'put'
  })
}

// (手动接单模式下)拒绝接单
export function fhRejectAccept(id, data) {
  return request({
    url: `${orders}/${id}/reject`,
    method: 'put',
    data
  })
}

// 重新打印订单
export const fhPrintOrder = id =>
  request({
    url: `${orders}/${id}/print`,
    method: 'put'
  })

// 获取膳食订单日志
export function fhGetOrdersStatusProgress(id) {
  return request({
    url: `${orders}/${id}/progress`
  })
}

// 护工新订单
export function fhGetNurseNewOrders(params) {
  return request({
    url: `${nurseOrders}/new`,
    params
  })
}

// 护工进行中
export function fhGetNurseProcessOrders(params) {
  return request({
    url: `${nurseOrders}/processing`,
    params
  })
}

// 护工退款订单
export function fhGetNurseRefundOrders(params) {
  return request({
    url: `${nurseOrders}/refund`,
    params
  })
}

// 护工待服务
export function fhGetNurseWaitOrders(params) {
  return request({
    url: `${nurseOrders}/wait`,
    params
  })
}

// 护工直接退款
export function fhPutNurseDirectRefund(id, params) {
  return request({
    url: `${nurseOrders}/${id}/direct-refund`,
    params,
    method: 'put'
  })
}

// 护工调配护工
export function fhPutOrderNurse(id, params) {
  return request({
    url: `${nurseOrders}/${id}/nurse`,
    params,
    method: 'put'
  })
}

// 护工退款审核
export function fhPutNurseRefundAudit(id, params) {
  return request({
    url: `${nurseOrders}/${id}/refund-audit`,
    params,
    method: 'put'
  })
}

// 护工历史订单列表
export function fhGetNurseHistory(params) {
  return request({
    url: `${nurseOrders}/history`,
    params
  })
}

// 手动接单
export function fhPutNurseAccept(id) {
  return request({
    url: `${nurseOrders}/${id}/accept`,
    method: 'put'
  })
}

// 商家店铺部分退款
export function fhPutOrderRefundPartial(orderId, params) {
  return request({
    url: `${orders}/${orderId}/refund-partial`,
    method: 'put',
    params
  })
}

// 护工店铺部分退款
export function fhPutNurseOrderRefundPartial(orderId, params) {
  return request({
    url: `${nurseOrders}/${orderId}/refund-partial`,
    method: 'put',
    params
  })
}

// 获取护工订单日志
export function fhGetNurseOrdersStatusProgress(id) {
  return request({
    url: `${nurseOrders}/${id}/progress`
  })
}
