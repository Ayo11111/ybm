import request from '@/utils/request'
import { banners } from '../base-api'

// 获取轮播图列表
export function fhGetBannerList(params) {
  return request({
    url: `${banners}/banner-stores`,
    params
  })
}

// 编辑轮播图
export function fhPutBanner(bannerStoreId, params) {
  return request({
    url: `${banners}/banner-stores/${bannerStoreId}`,
    method: 'put',
    data: params
  })
}

// 删除轮播图
export function fhDeleteBanner(bannerStoreId) {
  return request({
    url: `${banners}/banner-stores/${bannerStoreId}`,
    method: 'delete'
  })
}

// 轮播图状态
export function fhPutBannerStatus(bannerStoreId, params) {
  return request({
    url: `${banners}/banner-stores/${bannerStoreId}/up-status`,
    method: 'put',
    params
  })
}

// 新增轮播图
export function fhPostAddBanner(params) {
  return request({
    url: `${banners}/banner-stores`,
    method: 'post',
    data: params
  })
}

// 获取轮播图详情
export function fhGetBannerDetail(bannerStoreId) {
  return request({
    url: `${banners}/banner-stores/${bannerStoreId}`
  })
}

// 获取交换排序
export function fhPutBannerSort(params) {
  return request({
    url: `${banners}/banner-stores/sort`,
    method: 'put',
    params
  })
}
