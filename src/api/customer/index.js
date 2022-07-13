import request from '@/utils/request'
import { orderComments, commentStat } from '../base-api'

// 获取评论列表
export function fhGetCommentList(params) {
  return request({
    url: `${orderComments}`,
    params
  })
}

// 商家回复 (重复就是修改)
export function fhPutComment(orderId, params) {
  return request({
    url: `${orderComments}/${orderId}`,
    method: 'put',
    params
  })
}

// 商家平均分
export function fhGetMerchantComment() {
  return request({
    url: `${commentStat}/merchant-comment`
  })
}

// 店铺平均分
export function fhGetStorecomment(params) {
  return request({
    url: `${commentStat}/store-comment`,
    params
  })
}

// 店铺分析
export function fhGetStoreAnalyze(params) {
  return request({
    url: `${commentStat}/store-analyze`,
    params
  })
}

// 顾客分析
export function fhGetMemberAnalyze(params) {
  return request({
    url: `${commentStat}/member-analyze`,
    params
  })
}

// 店铺分析 导出
export function fhGetDownloadAnalyze(params) {
  return request({
    url: `${commentStat}/store-analyze-excel`,
    responseType: 'arraybuffer',
    params
  })
}

// 店铺平均分 导出
export function fhGetDownloadComment() {
  return request({
    url: `${commentStat}/store-comment-excel`,
    responseType: 'arraybuffer'
  })
}
