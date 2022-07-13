import request from '@/utils/request'
import { adapter } from '../base-api'

// 获取商户的收银设置详情
export function fhGetPos() {
  return request({
    url: `${adapter}/developers`
  })
}

// 第三方收银设置
export function fhSetPos(data) {
  return request({
    url: `${adapter}/developers/setting`,
    method: 'POST',
    data
  })
}

// 启禁用收银系统
export function fhSetPosStatus(params) {
  return request({
    url: `${adapter}/developers/open-status`,
    method: 'PUT',
    params
  })
}

// 店铺同步收银系统
export function fhStoresPos(data) {
  return request({
    url: `${adapter}/stores/syn-store`,
    method: 'POST',
    data
  })
}
// 同步第三方店铺菜品
export function fhPosFood(id) {
  return request({
    url: `${adapter}/stores/${id}/syn-food`,
    method: 'POST'
  })
}
