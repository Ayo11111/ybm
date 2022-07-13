/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-18 15:30:45
 * @LastEditors: HJ
 * @LastEditTime: 2021-04-22 13:59:16
 */
export const polygonEvent = ev => {
  const changePath = ev.target.getPath()
  const resPath = changePath.map(i => {
    const { lng, lat } = i
    return [lng, lat]
  })
  return resPath
}
