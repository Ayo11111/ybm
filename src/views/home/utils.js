/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-08-17 09:57:23
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-24 11:27:37
 */

export const analysis = [
  {
    title: '昨日有效订单',
    field: 'yesterdayValidOrdersCount',
    tooltip: '交易成功且用户未退款',
    router: {
      text: '单',
      name: 'ManagementAnalysis',
      query: { activeMenu: 'business', activeName: 'effective' }
    }
  },
  {
    title: '昨日预计收入',
    field: 'yesterdayExpectIncome',
    tooltip: '扣除相关支出费用（营销活动支出、平台服务费）后的净收入',
    router: {
      text: '元',
      name: 'ManagementAnalysis',
      query: { activeMenu: 'business' }
    }
  },
  {
    title: '昨日下单顾客',
    field: 'yesterdayUserCount',
    company: "人"
  },
  {
    title: '昨日老客占比',
    field: 'oldUserPercentage',
    company: "%"
  },
  {
    title: '客单',
    field: 'avgPrice',
    tooltip: '',
    company: "元"
  }
]
