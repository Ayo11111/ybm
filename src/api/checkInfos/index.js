/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-05 15:52:06
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-17 10:59:23
 */
import request from '@/utils/request'
import { checkInfos } from '../base-api'

export function fhPostCheckInfos(params) {
  return request({
    url: `${checkInfos}`,
    method: 'post',
    data: params
  })
}

export function fhPostCheckNext(params) {
  return request({
    url: `${checkInfos}/check-next`,
    method: 'post',
    data: params
  })
}
