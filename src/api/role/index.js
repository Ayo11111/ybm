/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-02 11:07:56
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-03 10:59:03
 */
import request from '@/utils/request'
import { role } from '../base-api'

// 新增角色
export function fhCreateRole(data) {
  return request({
    url: `${role}`,
    method: 'post',
    data
  })
}

// 编辑角色
export function fhEditRole(id, data) {
  return request({
    url: `${role}/${id}`,
    method: 'put',
    data
  })
}

// 获取自定义角色列表
export function fhGetRoles(params) {
  return request({
    url: `${role}/custom`,
    params
  })
}

// 获取角色详情
export function fhGetRole(id) {
  return request({
    url: `${role}/${id}`
  })
}

// 删除角色
export function fhDeleteRole(id) {
  return request({
    url: `${role}/${id}`,
    method: 'delete'
  })
}
