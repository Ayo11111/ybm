/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-21 17:02:50
 * @LastEditors: HJ
 * @LastEditTime: 2021-09-23 02:28:29
 */
export const times = {
  service: [
    { label: '30分钟', value: 30 },
    { label: '1小时', value: 60 },
    { label: '2小时', value: 120 },
    { label: '3小时', value: 180 }
  ],
  interval: [
    { label: '15分钟', value: 15 },
    { label: '20分钟', value: 20 },
    { label: '30分钟', value: 30 }
  ],
  destine: [
    { label: '当天', value: 1 },
    { label: '明天', value: 2 },
    { label: '后天', value: 3 },
    { label: '后2天', value: 4 },
    { label: '后3天', value: 5 },
    { label: '后4天', value: 6 },
    { label: '后5天', value: 7 },
    { label: '后6天', value: 8 }
  ]
}

export const regionMap = new Map([
  [0, 'province'],
  [1, 'city'],
  [2, 'area']
])
