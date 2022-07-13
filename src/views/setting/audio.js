/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-09-02 09:52:03
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-02 17:59:20
 */
export const list = (index) => {
  let list = [
    {
      label: '1次',
      value: '1'
    },
    {
      label: '3次',
      value: '3'
    },
    {
      label: '不播放',
      value: '0'
    }
  ]
  list.forEach((item, i) => {
      if (i === index) {
          item.label = `${item.label}(推荐)`
      }
  })
  return list
}
