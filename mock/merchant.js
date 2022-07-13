/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 16:29:49
 * @LastEditors: HJ
 * @LastEditTime: 2020-07-13 14:16:11
 */
const Mock = require('mockjs')
const { mock } = Mock
const data = mock({
  'items|10': [
    {
      iconUrl: '@image()',
      'id|+1': '@id',
      name: '@cword(2)',
      sellerCount: '@integer(0, 70)',
      weight: '@integer(0, 10)',
      createTime: '@datetime',
      isEdit: false
    }
  ]
})

module.exports = [
  {
    url: '/cats',
    type: 'get',
    response: config => {
      const items = data.items
      return {
        code: 200,
        count: items.length,
        curPage: 1,
        hasRecords: true,
        message: '',
        pageCount: 30,
        pageSize: 10,
        results: items,
        success: true
      }
    }
  },
  {
    url: '/cats',
    type: 'post',
    response: config => {
      return {
        code: 200,
        hasRecords: true,
        message: '',
        results: '',
        success: true
      }
    }
  },
  {
    url: 'banners',
    type: 'get',
    response: config => {}
  }
  // 商家审核
]
