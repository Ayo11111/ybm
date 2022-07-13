/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-21 11:15:40
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-21 11:17:46
 */
import store from '@/store'
export const beforeRouteLeave = (to, from, next) => {
  const { name } = to
  const { name: fromName } = from
  if (name === 'AddOrEditAccount') {
    store.dispatch('router/setPage', fromName)
  } else {
    store.dispatch('router/removePage', fromName)
  }
  next()
}
