/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-20 11:39:18
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-19 13:36:13
 */
export const orderType = ['', '外卖', '取餐']

export const menus = [
  {
    name: 'processing',
    label: '进行中',
    id: '1',
    num: 0
  },
  {
    name: 'new',
    label: '新订单',
    id: '2',
    num: 0,
    hidden: true
  },
  {
    name: 'refund',
    label: '待骑手接单',
    id: '3',
    num: 0,
    hidden: true
  },
  {
    name: 'ready',
    label: '待出餐',
    id: '4',
    num: 0,
    hidden: true
  },
  {
    name: 'reminders',
    label: '退款',
    id: '8',
    num: 0
  },
  {
    name: 'delivered',
    label: '待配送',
    id: '5',
    num: 0
  },
  {
    name: 'exception',
    label: '催单',
    id: '7',
    num: 0
  },
  {
    name: 'mentioned',
    label: '配送异常订单',
    id: '6',
    num: 0,
    hidden: true
  }
]

export const nurseMenus = [
  {
    name: 'new',
    label: '新订单',
    id: '1',
    num: 0
  },
  {
    name: 'wait',
    label: '待服务',
    id: '4',
    num: 0
  },
  {
    name: 'processing',
    label: '服务中',
    id: '2',
    num: 0
  },
  {
    name: 'reminders',
    label: '退单',
    id: '3',
    num: 0
  }
]

// 膳食订单菜单与护理订单菜单的映射

export const advanceMenus = [
  {
    name: 'soon',
    label: '即将到时',
    id: '1',
    num: 0,
    hidden: true
  },
  {
    name: 'overtime',
    label: '已超时',
    id: '2',
    num: 0,
    hidden: true
  },
  {
    name: 'today',
    label: '今日',
    id: '3',
    num: 0
  },
  {
    name: 'tomorrow',
    label: '明日',
    id: '4',
    num: 0
  },
  {
    name: 'towlater',
    label: '2天后',
    id: '5',
    num: 0
  },
  {
    name: 'threelater',
    label: '3天后',
    id: '6',
    num: 0,
    hidden: true
  }
]

export const payInfo = [
  {
    label: '支付方式',
    field: 'payType',
    render: type => (type === 1 ? '微信支付' : '会员钱包')
  },
  { label: '菜品数量', field: 'foodCount', render: text => text },
  { label: '菜品金额', field: 'foodPrice' },
  {
    label: '配送方式',
    field: 'deliveryPrice'
  },
  {
    label: '原始配送费',
    field: 'deliveryPrice'
  },
  {
    label: '实际配送费',
    field: 'realDeliveryPrice'
  },
  { label: '骑手是否配送成功', field: 'riderDeliverySuccessStr' },
  { label: '配送取消原因', field: 'deliveryCancelReason' },
  { label: '餐盒费', field: 'packagePrice' },
  { label: '应付金额', field: 'totalPrice' },
  {
    label: '应付金额(不包含实际配送费)',
    field: 'receivableWithoutDeliveryFee'
  },
  { label: '积分抵扣', field: 'pointPrice' },
  { label: '满减优惠', field: 'meetReducePrice' },
  { label: '智慧经营抵扣', field: 'payDiscount' },
  { label: '会员价抵扣', field: 'vipPrice' },
  { label: '秒杀优惠', field: 'secKillPrice' },
  { label: '优惠券抵扣', field: 'couponPrice' },
  { label: '配送费减免', field: 'deliveryPriceDiscount' },
  {
    label: '实付金额(不包含实际配送费)',
    field: 'incomeExcludeDelivery'
  },
  { label: '实付金额(含实际配送费)', field: 'income' },
  { label: '钱包实充金额抵扣', field: 'useWalletMoney' },
  { label: '钱包赠送金额抵扣', field: 'useGiftMoney' },
  {
    label: '退款金额',
    field: 'refundPrice',
    render: text => text || '0.00'
  },
  { label: '备注', field: 'remark', style: { color: '#CFA978' } }
]

export const orderStatusMap = new Map([
  [1, '等待用户支付'],
  [2, '订单取消'],
  [3, '待接单'],
  [4, '备餐中'],
  [5, '等待分配骑手'],
  [6, '等待取餐'],
  [7, '客户已自提'],
  [8, '订单超时未处理'],
  [9, '外卖已取出自提柜'],
  [10, '商家拒绝接单'],
  [605, '商家直接退款']
])

export const statusArray = [
  [1, '等待用户支付'],
  [2, '订单取消'],
  [3, '待接单'],
  [4, '备餐中'],
  [5, '等待分配骑手'],
  [6, '等待取餐'],
  [7, '客户已取餐'],
  [8, '订单超时未处理'],
  [9, '外卖已取出自提柜'],
  [10, '商家拒绝接单'],
  [605, '商家直接退款'],
  [606, '已退款']
]

export const btnShow = (currStep, index, showStatue, source) => {
  const { refundStatus, orderProgressList, orderStatus } = source
  const { step } = orderProgressList[index]
  return (
    (!refundStatus || refundStatus === 603) &&
    step === currStep &&
    orderStatus === showStatue
  )
}

export const historyOrderStatus = [
  [7, '客户已取餐'],
  [10, '商家拒绝接单'],
  [605, '商家直接退款']
]
