/*
 * @Descripttion:
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-12 20:22:51
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-12 21:26:46
 */

// 枚举
export const options = {
  printCategory: [
    {
      printType: 1,
      printName: '小票机'
    },
    {
      printType: 2,
      printName: '标签机'
    }
  ],
  printType: [
    {
      printType: 'FEIE',
      printName: '飞鹅打印机',
      printConfig: { sn: '', snKey: '' }
    }
  ]
}

// map
export const printCategoryMap = new Map(
  options.printCategory.map(i => [i.printType, i.printName])
)
export const printTypeMap = new Map(
  options.printType.map(i => [i.printType, i.printName])
)
