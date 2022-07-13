/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-20 05:59:20
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-04 12:54:16
 */
// 统计类型枚举
export const typeEnum = {
  income: 1,
  turnover: 2,
  effective: 3,
  realPay: 4,
  averagePriceActuallyPaid: 5
}
export const typeEnumName = {
  income: '收入',
  turnover: '营业额',
  effective: '有效订单',
  realPay: '顾客实付',
  averagePriceActuallyPaid: '实付单均价'
}

// 膳食下载报表字段展示配置
export const reportFields = {
  order: [
    '店铺名称',
    '店铺ID',
    '店铺所在城市',
    '订单编号',
    '下单时间',
    '完成时间',
    '订单状态',
    '是否预订单',
    '商品信息',
    '活动信息',
    '配送类型',
    '是否部分退款',
    '是否全部退款',
    '退款金额',
    '订单取消原因(仅取消订单)',
    '顾客实付',
    '订单原金额',
    '配送费',
    '包装费',
    '平台活动补贴',
    '商家活动支出'
  ],
  goods: [
    '店铺名称',
    '店铺ID',
    '店铺所在城市',
    '商品名称',
    '商品销售额',
    '商品销量',
    '销售额占比',
    '销量占比'
  ]
}

// 护理下载报表字段展示配置
export const reportNurseFields = {
  order: [
    '日期',
    '店铺名称',
    '店铺ID',
    '店铺所在城市',
    '订单编号',
    '下单时间',
    '完成时间',
    '订单状态',
    '预约开始时间',
    '预约结束时间',
    '预约护理天数',
    '实际陪护开始时间',
    '实际陪护结束时间',
    '实际陪护天数',
    '是否部分退款',
    '是否全部退款',
    '退款金额',
    '订单取消原因(仅取消订单)',
    '护工姓名',
    '护理单价/天',
    '顾客实付',
    '订单原金额',
    '平台活动补贴',
    '商家活动支出'
  ],
  goods: [
    '店铺名称',
    '店铺ID',
    '店铺所在城市',
    '护工姓名',
    '销售额',
    '护理时长(天)',
    '销售额占比',
    '时长占比'
  ]
}
