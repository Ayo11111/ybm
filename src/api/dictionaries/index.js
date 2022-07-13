/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-07-21 18:01:19
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-21 18:04:24
 */
import request from '@/utils/request'
import { dictionaries } from '../base-api'

export function fhGetDictionariesDetails(type) {
    return request({
        url: `${dictionaries}/${type}`
    })
}