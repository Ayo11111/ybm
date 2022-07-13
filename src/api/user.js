/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-02 14:57:12
 */
import request from '@/utils/request'
import { router, authAccount } from './base-api'

export function login(data) {
  return request({
    url: '/dev-api/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/dev-api/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/dev-api/user/logout',
    method: 'post'
  })
}

// 获取路由
export function fhGetRouter(params) {
  return request({
    url: `${router}`,
    params
  })
}

// 获取用户信息
export function fhGetUserInfo(id, params) {
  return request({
    url: `${authAccount}/${id}`,
    params
  })
}
