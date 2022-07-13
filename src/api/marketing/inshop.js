/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-04 15:42:09
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-08 13:45:58
 */
import { inshop } from '../base-api'
import request from '@/utils/request'

// 获取活动列表
export function fhGetInshop(params) {
  return request({
    url: `${inshop}/list`,
    method: 'GET',
    params
  })
}

// 活动详情
export function fhInshopDetail(id) {
  return request({
    url: `${inshop}/${id}`,
    method: 'GET'
  })
}

// 添加店内领券
export function fhAddInshop(data) {
  return request({
    url: `${inshop}/add`,
    method: 'POST',
    data
  })
}

// 更新活动
export function fhupdateInshop(id, data) {
  return request({
    url: `${inshop}`,
    method: 'PUT',
    data
  })
}

// 修改状态
export function fhStatusInshop(id, params) {
  return request({
    url: `${inshop}/${id}/status`,
    method: 'PUT',
    params
  })
}

// 删除活动
export function fhDelInshop(id) {
  return request({
    url: `${inshop}/${id}`,
    method: 'DELETE'
  })
}
