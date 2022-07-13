
import request from '@/utils/request'
import { orders } from '../base-api'

// 获取病区列表
export function fhGetSickAreaList() {
  return request({
    url: `${orders}/listsickarea`
  })
}

// 获取订单列表
export function fhGetOrderList(params) {
  return request({
    url: `${orders}/search`,
    params
  })
}

// 订单分配配送员
export function fhAssignment(params) {
  return request({
    url: `${orders}/assignment`,
    method: 'put',
    params
  })
}

// 获取菜品预定统计
export function fhGetFoodStat(params) {
  return request({
    url: `${orders}/shitangfoodstatistics`,
    params
  })
}
