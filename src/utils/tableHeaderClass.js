/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-04 16:20:11
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-07 14:52:27
 */
const getRowClass = function({ row, column, rowIndex, columnIndex }) {
  if (rowIndex === 0) {
    return {
      background: '#FAFAFA',
      color: '#252525',
      borderTop: '1px solid #DFE6EC'
    }
  } else {
    return ''
  }
}

export default getRowClass
