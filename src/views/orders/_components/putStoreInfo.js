/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-11 11:38:25
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-28 14:02:16
 */

export const restAppointmentStatus = [
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
    default: true
  }
]

export const productionTime = [
  {
    label: '出餐时间',
    type: 'select',
    field: 'productionTime',
    validate: true,
    behavior: '选择',
    afterText: '分钟',
    brText:
      '出餐时间是指从接单到完成备餐需要的时间，骑手会参考出餐时间到店取餐，请准确填写。',
    data: [
      {
        label: '60',
        value: 60
      },
      {
        label: '55',
        value: 55
      },
      {
        label: '50',
        value: 50
      },
      {
        label: '45',
        value: 45
      },
      {
        label: '40',
        value: 40
      },
      {
        label: '35',
        value: 35
      },
      {
        label: '30',
        value: 30
      },
      {
        label: '25',
        value: 25
      },
      {
        label: '20',
        value: 20
      },
      {
        label: '15',
        value: 15
      },
      {
        label: '10',
        value: 10
      },
      {
        label: '5',
        value: 5
      }
    ]
  }
]

export const autoOrderStatus = [
  {
    label: '接单方式',
    type: 'select',
    validate: true,
    behavior: '选择',
    field: 'autoOrderStatus',
    data: [
      {
        label: '自动接单',
        value: true
      },
      {
        label: '手动接单',
        value: false
      }
    ]
  }
]
