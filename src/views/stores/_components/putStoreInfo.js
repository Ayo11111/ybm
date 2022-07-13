/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-11 11:38:25
 * @LastEditors: HJ
 * @LastEditTime: 2021-09-23 02:29:08
 */
export const store = [
  {
    label: '店铺名称',
    type: 'input',
    field: 'storeName'
  },
  {
    label: '店铺牌匾',
    type: 'ossUpload',
    field: 'environmentImages',
    validate: true,
    limitSize: 2,
    behavior: '上传'
  },
  {
    label: '店铺公告',
    type: 'textarea',
    field: 'announcement'
  },
  {
    label: '店铺电话',
    type: 'input',
    field: 'phone'
  }
]

export const catImg = [
  {
    label: '经营品类',
    type: 'catsSelect'
  },
  {
    label: '店铺头像',
    type: 'ossUpload',
    field: 'logoImage',
    validate: true,
    limitSize: 2,
    behavior: '上传'
  }
]

export const business = [
  {
    label: '营业日期',
    type: 'checkedDay',
    field: 'businessDate',
    validate: true,
    behavior: '选择',
    data: [
      {
        label: '周一',
        value: 1
      },
      {
        label: '周二',
        value: 2
      },
      {
        label: '周三',
        value: 3
      },
      {
        label: '周四',
        value: 4
      },
      {
        label: '周五',
        value: 5
      },
      {
        label: '周六',
        value: 6
      },
      {
        label: '周日',
        value: 7
      }
    ]
  },
  {
    label: '营业时间段',
    type: 'rangeTime',
    field: 'time',
    validate: true,
    behavior: '选择'
  },
  {
    label: '预订单类型',
    type: 'radioType',
    validate: true,
    behavior: '选择',
    field: 'storeType',
    merchantManagerType: 'restaurant'
  },
  {
    label: '预订单设置',
    type: 'radio',
    validate: true,
    behavior: '选择',
    field: 'restAppointmentStatus',
    data: [
      {
        label: '休息时间支持预订',
        value: true
      },
      {
        label: '休息时间不支持预订',
        value: false
      }
    ],
    default: true,
    merchantManagerType: 'restaurant'
  },
  // {
  //   label: '商家接受预订时间',
  //   type: 'selectDay',
  //   field: '',
  //   data: [
  //     {
  //       label: '当天',
  //       value: 1
  //     },
  //     { label: '明天', value: 2 },
  //     { label: '后天', value: 3 },
  //     { label: '后2天', value: 4 },
  //     { label: '后3天', value: 5 },
  //     { label: '后4天', value: 6 },
  //     { label: '后5天', value: 7 },
  //     { label: '后6天', value: 8 }
  //   ],
  //   merchantManagerType: 'restaurant'
  // },
  // {
  //   label: '',
  //   type: 'dayText'
  // },
  // {
  //   label: '预订单提醒',
  //   type: 'select',
  //   field: 'productionReminderTime',
  //   validate: true,
  //   behavior: '选择',
  //   frontText: '送达时间',
  //   afterText: '分钟前提醒备餐',
  //   data: [
  //     {
  //       label: '60',
  //       value: 60
  //     },
  //     {
  //       label: '45',
  //       value: 45
  //     },
  //     {
  //       label: '30',
  //       value: 30
  //     },
  //     {
  //       label: '15',
  //       value: 15
  //     }
  //   ],
  //   merchantManagerType: 'restaurant'
  // },
  // {
  //   label: '出餐时间',
  //   type: 'select',
  //   field: 'productionTime',
  //   validate: true,
  //   behavior: '选择',
  //   afterText: '分钟',
  //   brText:
  //     '出餐时间是指从接单到完成备餐需要的时间，骑手会参考出餐时间到店取餐，请准确填写。',
  //   data: [
  //     {
  //       label: '60',
  //       value: 60
  //     },
  //     {
  //       label: '55',
  //       value: 55
  //     },
  //     {
  //       label: '50',
  //       value: 50
  //     },
  //     {
  //       label: '45',
  //       value: 45
  //     },
  //     {
  //       label: '40',
  //       value: 40
  //     },
  //     {
  //       label: '35',
  //       value: 35
  //     },
  //     {
  //       label: '30',
  //       value: 30
  //     },
  //     {
  //       label: '25',
  //       value: 25
  //     },
  //     {
  //       label: '20',
  //       value: 20
  //     },
  //     {
  //       label: '15',
  //       value: 15
  //     },
  //     {
  //       label: '10',
  //       value: 10
  //     },
  //     {
  //       label: '5',
  //       value: 5
  //     }
  //   ],
  //   merchantManagerType: 'restaurant'
  // },
  // {
  //   label: '接单方式',
  //   type: 'select',
  //   validate: true,
  //   behavior: '选择',
  //   field: 'autoOrderStatus',
  //   data: [
  //     {
  //       label: '自动接单',
  //       value: true
  //     },
  //     {
  //       label: '手动接单',
  //       value: false
  //     }
  //   ]
  // },
  {
    label: '配送费',
    type: 'input',
    validate: true,
    behavior: '选择',
    field: 'deliveryPrice',
    merchantManagerType: 'restaurant'
  }
]

export const other = [
  {
    label: '开具发票',
    type: 'radio',
    field: 'invoiceStatus',
    data: [
      {
        label: '支持',
        value: true
      },
      {
        label: '不支持',
        value: false
      }
    ],
    default: true
  },
  {
    label: '发票最低金额',
    type: 'input',
    field: 'invoiceMinimumAmount'
  }
]
