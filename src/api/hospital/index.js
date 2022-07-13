/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-01 09:44:31
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-01 09:46:15
 */
import request from '@/utils/request'
import { hospitalInfo } from '../base-api'

export function fhGetHospitalAddress() {
  return request({
    url: `${hospitalInfo}/address-list`
  })
}
