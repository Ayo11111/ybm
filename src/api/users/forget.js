/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-10 16:30:05
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-10 17:20:12
 */
import { user } from '../base-api'
import request from '@/utils/request'

// 获取验证码
export function fhGetForgetCaptcha(params) {
  return request({
    url: `${user}/captcha`,
    params
  })
}

// 获取手机下的账号
export function fhGetMobileUsers(params) {
  return request({
    url: `${user}/${params.mobile}`,
    params
  })
}

// 校验验证码并发放token
export function fhPostCheckForgetCaptcha(params) {
  return request({
    url: `${user}/${params.mobile}/check`,
    params,
    method: 'post'
  })
}

// 修改账号的密码
export function fhPutUserPassword(params) {
  return request({
    url: `${user}/${params.mobile}/update-password/${params.backUserId}`,
    params,
    method: 'put'
  })
}
