import request from '@/utils/request'
import { notices, notice } from '../base-api'

// 获取商家公告列表
export function fhGetNoticesList(params) {
  return request({
    url: `${notices}`,
    params
  })
}

// 读公告列表
export function fhGetReadNotice(noticesId) {
  return request({
    url: `${notice}/${noticesId}/read`
  })
}
