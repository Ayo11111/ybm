/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-24 15:58:16
 * @LastEditors: HJ
 * @LastEditTime: 2020-12-15 09:47:03
 */
import request from '@/utils/request'
import { finance, statistics, withdrew, applyments, split } from '../base-api'

// 获取账单明细
export function fhGetFinanceDetailList(params) {
  return request({
    url: `${finance}/finance-detail-list`,
    params
  })
}

// 获取订单明细-头部
export function fhGetFinanceDetailHeader(params) {
  return request({
    url: `${finance}/finance-detail-header`,
    params
  })
}

// 财务对账-头部
export function fhGetFinanceHeader(params) {
  return request({
    url: `${finance}/finance-header`,
    params
  })
}

// 财务对账-列表
export function fhGetFinanceList(params) {
  return request({
    url: `${finance}/finance-list`,
    params
  })
}

// 订单明细-列表
export function fhGetOrderDetailList(params) {
  return request({
    url: `${finance}/finance-order-detail-list`,
    params
  })
}

// 订单查询
export function fhGetOneFinance(orderId) {
  return request({
    url: `${finance}/${orderId}/detail`
  })
}

// 账单下载
export function fhGetDownloadFinance(params) {
  return request({
    url: `${statistics}/bill-excel`,
    params
  })
}

// 账单记录
export function fhGetBillLog(params) {
  return request({
    url: `${statistics}/bill-log`,
    params
  })
}

// 订单详情
export function fhGetBillDeail(orderId) {
  return request({
    url: `${finance}/${orderId}/detail`
  })
}

// 商户提现记录列表
export function fhPostWithdrew(params) {
  return request({
    url: `${withdrew}/withdrew-list`,
    method: 'post',
    params
  })
}

// 查询商户余额
export function fhGetOnlineAmount() {
  return request({
    url: `${withdrew}/online-amount`
  })
}

// 商户分账列表
export function fhGetProfitsharing(params) {
  return request({
    url: `${withdrew}/profitsharing/list`,
    params
  })
}

// 商户结算信息查询
export function fhGetAccountInfo() {
  return request({
    url: `${withdrew}/account-info`
  })
}

// 商户提现
export function fhPostObtain(params) {
  return request({
    url: `${withdrew}/withdrew`,
    method: 'post',
    params
  })
}

// 发送验证码
export function fhGetCaptcha() {
  return request({
    url: `${withdrew}/captcha`
  })
}

// 商户进件状态查询
export function fhGetApplyments() {
  return request({
    url: `${applyments}`
  })
}

// 商户进件
export function fhPostApplyments(data) {
  return request({
    url: `${applyments}`,
    method: 'POST',
    data
  })
}

// 重置商户结算信息复制文档复制地址
export function fhResetApplyments(data) {
  const url = applyments.replace('applyments', 'reset-info')
  return request({
    url,
    method: 'PUT'
  })
}

// 分账单头部信息
export function fhGetSplitHeader(params) {
  return request({
    url: `${split}/statistics`,
    params
  })
}

// 分账单列表信息
export function fhGetSplitList(params) {
  return request({
    url: `${split}/list`,
    params
  })
}

// 导出分账单
export function fhGetSplitExcel(params) {
  return request({
    url: `${split}/excel`,
    responseType: 'blob',
    params
  })
}
