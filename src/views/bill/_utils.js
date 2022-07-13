/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-24 16:20:16
 * @LastEditors: WorkerChen z874512298@163.com
 * @LastEditTime: 2022-05-15 20:48:59
 */
export const headerKeys = [
  {
    label: '有效订单笔数',
    field: 'orderCount',
    prefix: null,
    suffix: '笔',
    tip: '用户成功下单且无发生退款订单数'
  },
  {
    label: '有效订单金额',
    field: 'totalPrice',
    prefix: '￥',
    suffix: null,
    tip: '用户成功下单且无发生退款订单实付金额'
  },
  {
    label: '商家活动补贴',
    field: 'merchantActivityFee',
    prefix: '￥',
    suffix: null,
    tip:
      '商家所有活动优惠补贴金额（包括折扣商品、满减、配送费减免、优惠券、团餐菜品优惠等活动）'
  },
  {
    label: '平台活动补贴',
    field: 'platformActivityFee',
    prefix: '￥',
    suffix: null,
    tip: '平台活动中平台优惠补贴金额'
  },
  {
    label: '配送费',
    field: 'actualFee',
    prefix: '￥',
    suffix: null,
    tip: '第三方配送系统根据订单菜品及用户距离产生的实际配送费用（包括自配送）'
  },
  {
    label: '导流佣金',
    field: 'helpEachOtherPrice',
    prefix: '￥',
    suffix: null,
    tip:
      '参与商家流量互助活动，用户从其他商家的公众号进入医便民，购买了本商家菜品，需要给予其他商家导流佣金'
  },
  {
    label: '平台服务费',
    field: 'platFormServiceFee',
    prefix: '￥',
    suffix: null,
    tip: '订单实付金额  * 抽佣比例'
  },
  {
    label: '结算金额',
    field: 'platformSettleAccounts',
    prefix: '￥',
    suffix: null,
    tip: '商家订单金额（实付） - 平台服务费'
  }
]

export const splitHeaderConfig = [
  {
    label: '统计日期',
    field: 'time',
    span: 24,
    pull: 0
  },
  {
    label: '订单实收金额',
    field: 'cashFee',
    span: 4,
    pull: 0,
    suffix: '元'
  },
  {
    label: '用户实付配送费',
    field: 'deliveryFee',
    span: 4,
    pull: 0,
    suffix: '元'
  },
  {
    label: '真实配送费',
    field: 'originalDeliveryFee',
    span: 4,
    pull: 0,
    suffix: '元'
  },
  {
    label: '分佣金额',
    field: 'profitsharingFee',
    span: 4,
    pull: 0,
    suffix: '元'
  },
  {
    label: '线上分账金额',
    field: 'wechatProfitsharingFee',
    span: 4,
    pull: 0,
    suffix: '元'
  },
  {
    label: '待线下结算金额',
    field: 'otherProfitsharingFee',
    span: 4,
    pull: 0,
    suffix: '元'
  }
]

// 订单明细的表单配置
export const orderTableCfg = {
  restaurant: [
    {
      dataIndex: 'createTime',
      key: 'createTime',
      fixed: 'left',
      width: 200,
      slots: { title: 'createTimeTitle' },
      scopedSlots: { customRender: 'date' }
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 250
    },
    {
      dataIndex: 'originFoodPrice',
      key: 'originFoodPrice',
      width: 150,
      slots: { title: 'originFoodPriceTitle' }
    },
    {
      dataIndex: 'packagePrice',
      key: 'packagePrice',
      width: 150,
      slots: { title: 'packagePriceTitle' }
    },
    {
      dataIndex: 'preferentialPrice',
      key: 'preferentialPrice',
      width: 150,
      slots: { title: 'preferentialPriceTitle' }
    },
    {
      title: '平台活动支出',
      dataIndex: 'platformActivityFee',
      key: 'platformActivityFee',
      width: 150
    },
    {
      dataIndex: 'platformServiceFee',
      key: 'platformServiceFee',
      width: 170,
      slots: { title: 'platformServiceFeeTitle' }
    },
    {
      title: '订单抽佣比例',
      dataIndex: 'platformProfitsharingPct',
      key: 'platformProfitsharingPct',
      width: 150,
      customRender: (text) => {
        return text !== 0 ? `${text}%` : '---'
      }
    },
    {
      title: '配送费',
      dataIndex: 'deliveryPrice',
      key: 'deliveryPrice',
      width: 150,
      customRender: text => text || '---'
    },
    {
      title: '取货费',
      dataIndex: 'nurse_delivery_price',
      key: 'nurse_delivery_price',
      width: 150,
      customRender: nurse_delivery_price => nurse_delivery_price || '---'
    },
    {
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 150,
      slots: { title: 'totalPriceTitle' },
      customRender: totalPrice => totalPrice || '---'
    },
    {
      title: '结算金额',
      dataIndex: 'settleAccountsFee',
      key: 'settleAccountsFee',
      width: 150,
      scopedSlots: { customRender: 'Accounts' }
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ],
  nurse: [
    {
      dataIndex: 'createTime',
      key: 'createTime',
      fixed: 'left',
      width: 200,
      slots: { title: 'createTimeTitle' },
      scopedSlots: { customRender: 'date' }
    },
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 250
    },
    {
      title: '预约天数',
      dataIndex: 'nurseTotalDay',
      key: 'nurseTotalDay',
      width: 200
    },
    {
      title: '预约日期',
      key: 'toMakeAnAppointmentTime',
      width: 360,
      customRender: (text, item) => {
        const { nurseStartTime, nurseEndTime } = item
        return nurseStartTime || nurseEndTime
          ? `${nurseStartTime} 至 ${nurseEndTime}`
          : ''
      }
    },
    {
      title: '实际陪护天数',
      dataIndex: 'nurseCompletedDay',
      key: 'nurseCompletedDay',
      width: 200
    },
    {
      title: '实际陪护日期',
      key: 'actualNumberEscort',
      width: 360,
      customRender: (text, item) => {
        const { actualNurseStartTime, actualNurseEndTime } = item
        return actualNurseStartTime || actualNurseEndTime
          ? `${actualNurseStartTime} 至 ${actualNurseEndTime}`
          : ''
      }
    },
    {
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      width: 250,
      slots: { title: 'totalPriceTitle' }
    },
    {
      dataIndex: 'platformServiceFee',
      key: 'platformServiceFee',
      width: 170,
      slots: { title: 'platformServiceFeeTitle' }
    },
    {
      title: '平台活动支出',
      dataIndex: 'platformActivityFee',
      key: 'platformActivityFee',
      width: 170
    },
    {
      title: '结算金额',
      dataIndex: 'settleAccountsFee',
      key: 'settleAccountsFee',
      width: 150,
      scopedSlots: { customRender: 'Accounts' }
    },
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 100,
      scopedSlots: { customRender: 'action' }
    }
  ]
}

// 患者信息配置
export const patientCfg = [
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
