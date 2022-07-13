/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 16:34:49
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-27 17:39:41
 */
import request from '@/utils/request'
import { cats } from '../base-api'

export function fhCats(params) {
  return request({
    url: `${cats}`,
    params
  })
}

export function fhAddCat(data) {
  return request({
    url: `${cats}`,
    method: 'post',
    data
  })
}

export function fhDeleteCat(id) {
  return request({
    url: `${cats}/${id}`,
    method: 'delete'
  })
}
