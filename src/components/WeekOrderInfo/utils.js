/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-13 16:10:43
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-04-29 14:35:42
 */

export const orderType = ['', '堂食', '打包带走']

export const orderStatusMap = new Map([
  [1, '等待用户支付'],
  [2, '订单取消'],
  [3, '待接单'],
  [4, '备餐中'],
  [5, '等待分配骑手'],
  [6, '等待取餐'],
  [7, '客户已取餐'],
  [8, '订单超时未处理'],
  [9, '外卖已取出取餐柜'],
  [101, '等待分配骑手'],
  [102, '分配骑手成功'],
  [103, '商家取消配送'],
  [201, '骑手到店开始取货'],
  [202, '骑手取货成功'],
  [203, '骑手取货失败，商家取消订单,订单结束'],
  [204, '骑手取货失败，骑手因自身原因取消订单,订单结束'],
  [205, '骑手取货失败，骑手因商家原因取消订单,订单结束'],
  [301, '骑手配送中'],
  [302, '订单已完成'],
  [303, '商家取消订单，订单结束'],
  [304, '骑手无法联系收货人，配送物品开始返还商家'],
  [305, '骑手配送阶段——收货人拒收，配送物品开始返还商家'],
  [401, '骑手返回配送货品阶段——货品返还商户成功， 订单结束'],
  [501, '配送取消, 订单结束'],
  [502, '因不可抗拒因素（天气，道路管制等原因）取消，订单结束'],
  [601, '退款审核中'],
  [602, '退款成功'],
  [603, '退款失败'],
  [604, '极速退款成功'],
  [605, '商家直接退款'],
  [606, '部分退款成功']
])

export const nurseOrderStatusMap = new Map([
  [1, '等待用户支付'],
  [2, '订单取消'],
  [3, '待接单'],
  [4, '待服务'],
  [5, '等待分配骑手'],
  [6, '等待提供护理服务'],
  [7, '服务已完成'],
  [8, '订单超时未处理'],
  [9, '外卖已取出取餐柜'],
  [10, '服务中'],
  [101, '等待分配骑手'],
  [102, '分配骑手成功'],
  [103, '商家取消护理'],
  [201, '骑手到店开始取货'],
  [202, '骑手取货成功'],
  [203, '骑手取货失败，商家取消订单,订单结束'],
  [204, '骑手取货失败，骑手因自身原因取消订单,订单结束'],
  [205, '骑手取货失败，骑手因商家原因取消订单,订单结束'],
  [301, '骑手配送中'],
  [302, '订单已完成'],
  [303, '商家取消订单，订单结束'],
  [304, '骑手无法联系收货人，配送物品开始返还商家'],
  [305, '骑手配送阶段——收货人拒收，配送物品开始返还商家'],
  [401, '骑手返回配送货品阶段——货品返还商户成功， 订单结束'],
  [501, '护理服务被取消, 订单结束'],
  [502, '因不可抗拒因素（天气，道路管制等原因）取消，订单结束'],
  [601, '退款审核中'],
  [602, '退款成功'],
  [603, '退款失败'],
  [604, '极速退款成功'],
  [605, '商家直接退款']
])

export const orderDeliverys = new Map([
  [1, '自配送'],
  [2, '顺丰配送'],
  [3, '蜂鸟配送']
])

export const baseInfo = [
  {
    label: '顾客手机号',
    field: 'phone',
    span: () => 24,
    show: () => true
  },
  {
    label: '顾客地址',
    field: 'shippingAddress',
    span: () => 24,
    show: () => true
  }
  // ,
  // {
  //   label: '商家接单时间',
  //   // labelField: 'previousStatusName',
  //   field: 'previousStatusTime',
  //   span: val => {
  //     return 12
  //   },
  //   show: () => true
  // },
  // {
  //   label: '下单时间',
  //   // labelField: 'previousStatusName',
  //   field: 'previousStatusTime',
  //   span: val => {
  //     return 12
  //   },
  //   show: () => true
  // },
  // {
  //   label: '本单备餐时长',
  //   field: 'cookTime',
  //   span: val => {
  //     return 12
  //   },
  //   show: () => true
  // },
  // {
  //   label: '备注',
  //   field: 'remark',
  //   span: () => 24,
  //   show: () => true,
  //   render: value => value || '暂无备注'
  // },
  // {
  //   label: '当前配送方式',
  //   field: 'deliveryType',
  //   span: () => 12,
  //   show: () => false,
  //   render: value => {
  //     return value ? orderDeliverys.get(value) : ''
  //   }
  // }
]

export const nurseInfo = [
  {
    label: '患者性别',
    field: 'sexText',
    span: () => 24,
    show: () => true
  },
  {
    label: '患者年龄',
    field: 'birthday',
    span: () => 24,
    show: () => true
  },
  {
    label: '床位编号',
    field: 'addressDetail',
    span: () => 24,
    show: () => true
  },
  {
    label: '患者机号',
    field: 'phone',
    span: () => 24,
    show: () => true
  }
]

export const moneyInfo = [
  {
    label: '护工费用',
    field: 'nurseDeliveryPrice',
    first: 'originNurseDeliveryPrice'
  },
  {
    label: '小计',
    field: 'foodPrice'
  },
  {
    label: '商家活动支出',
    field: 'preferentialPrice'
  },
  {
    label: '平台服务费',
    field: 'serviceFee'
  },
  {
    label: '实际收入',
    field: 'settleAccountsFee'
  },
  {
    label: '顾客实际支付',
    field: 'totalPrice',
    class: 'title'
  }
]

export const nurseFoodInfo = [
  {
    label: '小计',
    field: 'originNursePrice',
    class: 'allFee'
  },
  {
    label: '平台服务费',
    field: 'platformServiceFee'
  },
  {
    label: '实际收入',
    field: 'settleAccountsFee'
  },
  {
    label: '顾客实际支付',
    field: 'totalPrice',
    class: 'title'
  }
]

export const riderMap = new Map([
  [-1, ''],
  [1, '骑手接单时间'],
  [2, ''],
  [3, '骑手']
])

const fixTwo = str => (`${str}`.length < 2 ? `0${str}` : str)

export const parseTime = (time, cFormat) => {
  if (!time) {
    return null
  }
  const format = cFormat || '{h}:{i}:{s}'

  time /= 1000
  const hour = parseInt(time / 3600)
  let min = parseInt(time / 60)
  if (min >= 60) {
    min = min % 60
  }
  if (min < 10) min = '0' + min
  const lastsecs = parseInt(time % 60)

  const formatObj = {
    h: fixTwo(hour),
    i: fixTwo(min),
    s: fixTwo(lastsecs)
  }

  const time_str = format.replace(/{([his])+}/g, (result, key) => {
    const value = formatObj[key]
    return value.toString().padStart(2, '0')
  })

  return time_str
}
