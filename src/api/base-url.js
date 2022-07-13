/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-15 08:54:51
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-01 09:43:09
 */
const _UNMOCK_API = process.env.VUE_APP_API_UNMOCK_URL || ''
const storeId = 'STOREID'
const merchantId = 'MERCHANTID'
// 护工
export const _NURSE_URL = `${_UNMOCK_API}/nurse`
export const _NURSE_MERCHANT_URL = `${_NURSE_URL}/admin/stores/${storeId}`
export const _NURSE_MERCHANT_STORE_URL = `${_NURSE_URL}/admin/merchants/${merchantId}/stores/${storeId}`

// 医院
export const _HOSPITAL_URL = `${_UNMOCK_API}/hospital`
export const _HOSPITAL_MERCHANT_STORE_URL = `${_HOSPITAL_URL}/admin/merchants/${merchantId}/stores/${storeId}`
export const _HOSPITAL_ADMIN = `${_HOSPITAL_URL}/admin`
