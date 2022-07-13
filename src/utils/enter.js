/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-10 18:41:33
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-28 12:14:54
 */
import { getUserInfo } from './auth'
export async function enterStore(storeId) {
  const { backUserId, merchantId, token } = (await getUserInfo())
  const query = `backUserId=${backUserId}&storeId=${storeId}&merchantId=${merchantId}&token=${token}`
  window.open(process.env.VUE_APP_OPEN_STORE + '?' + query)
}
