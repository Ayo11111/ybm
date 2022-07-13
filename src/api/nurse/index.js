/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-15 08:57:49
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-12 17:46:07
 */
import request from '@/utils/request'
import { managementNurse, nurseAudits, nurserPickOrders } from '../base-api'

// 护工列表
export function fhGetNurses(params) {
  return request({
    url: `${managementNurse}`,
    params
  })
}

// 新建护工
export function fhCreateNurse(data) {
  return request({
    url: `${managementNurse}`,
    method: 'post',
    data
  })
}

// 护工详情
export function fhGetNurse(id) {
  return request({
    url: `${managementNurse}/${id}`
  })
}

// 编辑护工
export function fhEditNurse(id, data) {
  return request({
    url: `${managementNurse}/${id}`,
    method: 'put',
    data
  })
}

// 审核入驻护工
export function fhAuditNurse(id, data) {
  return request({
    url: `${managementNurse}/${id}/audit`,
    method: 'put',
    data
  })
}

// 审核护工列表
export function fhGetAuditNurseList(params) {
  return request({
    url: `${nurseAudits}`,
    params
  })
}

// 审核护工详情
export function fhGetAuditNurseDetails(id) {
  return request({
    url: `${nurseAudits}/${id}`
  })
}

// 审核护工详情
export function fhPutAuditNurseDetails(id, params) {
  return request({
    url: `${nurseAudits}/${id}`,
    method: 'put',
    data: params
  })
}

// 导出护工注册二维码
export const fhExportRegisterQr = () =>
  request({
    url: `${managementNurse}/qr-code`
  })

// 获取取货订单列表
export const fhGetNursePickOrders = params =>
  request({
    url: `${nurserPickOrders}`,
    params
  })
