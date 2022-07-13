/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 17:41:04
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-01-11 17:58:30
 */

import request from '@/utils/request'
const { VUE_APP_API_UNMOCK_URL, VUE_APP_API__COMMON_URL } = process.env
const _COMMON_API =
  VUE_APP_API_UNMOCK_URL ||
  VUE_APP_API__COMMON_URL ||
  'https://ybm-dev.thinkmacro.cn'

export function fhGetOssSign(params, platform = 'TOP50') {
  return request({
    url: `${_COMMON_API}/osspolicy/aliyun-oss/${platform}/sign`,
    headers: {
      'OSS-SERVICE-TOKEN':
        'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1Nzg2MjE4MzcsInN1YiI6IntcImZyb21TZXJ2aWNlU3lzdGVtXCI6XCJUb3A1MFwifSJ9.lKXaeSgt_yO1SYl2Oz27UHdXqt_-PKPWo2KlWDJ02iQ'
    },
    params
  })
}
