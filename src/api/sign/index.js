import request from '@/utils/request'
import { shop } from '../base-api'

// 招牌列表
export function fhGetShopList() {
  return request({
    url: `${shop}/list`
  })
}

// 上传招牌
export function fhPostShop(params) {
  return request({
    url: `${shop}`,
    method: 'post',
    data: params
  })
}

// 删除招牌
export function fhDeleteShop(bgId) {
  return request({
    url: `${shop}/${bgId}/`,
    method: 'delete'
  })
}

// 更改状态
export function fhPutShopStatus(bgId, params) {
    return request({
      url: `${shop}/${bgId}/status`,
      method: 'put',
      params
    })
  }
