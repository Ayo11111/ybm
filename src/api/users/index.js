/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:45:28
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-27 16:33:38
 */
import {
  capcha,
  checkInfos,
  user,
  roles,
  account,
  unionUser,
  storeAccount
} from '../base-api'
import request from '@/utils/request'
// import { getSellerId } from '@/utils/seller'
const getSellerId = () => {}

// 商家管理员登录
export function fhLogin(data) {
  return request({
    url: `${user}/auth`,
    method: 'post',
    data
  })
}

// 刷新token
export function fhRefreshToken(params) {
  return request({
    url: `${user}/refresh`,
    method: 'post',
    params
  })
}

export function getInfo(token) {
  return request({
    url: '/dev-api/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

// 请求手机验证码
export function fhGetPhoneCode(phone) {
  return request({
    url: `${checkInfos}/captcha`,
    method: 'get',
    params: phone
  })
}

// 商家入驻申请
export function fhSubInfo(infos) {
  return request({
    url: '../merchant/seller/register',
    method: 'post',
    data: infos
  })
}

// 商家token刷新
export function fhRefrehToken(token) {
  const sellerId = getSellerId()
  return request({
    url: `../merchant/seller/${sellerId}/refresh-token`,
    method: 'get',
    params: token
  })
}

// 商家重置密码
export function fhResetPw(data) {
  return request({
    url: '../merchant/seller/reset-password',
    method: 'post',
    data
  })
}

// 重置密码请求手机验证码
export function fhResetPhoneC(query) {
  return request({
    url: `../merchant/sms/send/reset-password`,
    method: 'get',
    params: query
  })
}

// 获取图形验证码
export function fhGetCodeImg() {
  return request({
    url: capcha,
    responseType: 'arraybuffer',
    headers: {
      Accept: 'image/jpeg',
      'content-type': 'image/jpeg'
    }
  })
}

// 提交入驻申请信息
export function subInfo(data) {
  return request({
    url: checkInfos,
    method: 'post',
    data
  })
}

// 校验第一步申请信息
export function fhCheckNext(data) {
  return request({
    url: `${checkInfos}/check-next`,
    method: 'post',
    data
  })
}

// 获取不包含超管角色列表
export function fhGetRoles(params) {
  return request({
    url: `${roles}/not-super`,
    params
  })
}

// 获取子账号列表
export function fhGetSubAccs(params) {
  return request({
    url: `${account}`,
    params
  })
}

// 创建子账号
export function fhCreateSubAcc(data) {
  return request({
    url: `${account}`,
    method: 'post',
    data
  })
}

// 外卖的编辑子账号
export function fhWmEditSubAcc(accountId, params) {
  return request({
    url: `${account}/${accountId}`,
    method: 'put',
    data: params
  })
}

// 统一的编辑子账号
export function fhAuEditSubAcc(backUserId, params) {
  return request({
    url: `${unionUser}/${backUserId}`,
    method: 'put',
    data: params
  })
}

// 外卖的删除账号
export function fhDeleteWmAccount(accountId) {
  return request({
    url: `${account}/${accountId}`,
    method: 'delete'
  })
}

// 统一的删除账号
export function fhDeleteAuAccount(backUserId) {
  return request({
    url: `${unionUser}/${backUserId}`,
    method: 'delete'
  })
}

// 启禁用账号
export function fhPutUpStatus(backUserId, params) {
  return request({
    url: `${unionUser}/${backUserId}/up-status`,
    method: 'put',
    params
  })
}

// 获取账号详情
export function fhGetAccountDetail(accountId) {
  return request({
    url: `${account}/${accountId}`
  })
}

// 获取所有店铺店长账号
export function fhGetStoresAccount() {
  return request({
    url: `${storeAccount}/enable-store-manager`
  })
}

// 提交入驻
export function fhPostCheckInfoNext(step, params) {
  return request({
    url: `${checkInfos}/next/${step}`,
    data: params,
    method: 'post'
  })
}

// 获取入驻申请信息
export function fhGetNextInfo(id) {
  return request({
    url: `${checkInfos}/next/${id}`
  })
}

// 获取账号信息
export function fhGetCheckAccountInfo(account) {
  return request({
    url: `${checkInfos}/next/0/account-check/${account}`
  })
}
