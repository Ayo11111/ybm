/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-07 11:04:32
 * @LastEditors: HJ
 * @LastEditTime: 2021-06-15 09:52:13
 */
export const storeIdListV = (rule, value, callback) => {
  if (value.length > 0) {
    callback()
  } else {
    callback('请选择店铺')
  }
}
