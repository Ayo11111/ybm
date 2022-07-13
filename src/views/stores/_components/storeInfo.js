/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-10 14:31:01
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-13 19:15:27
 */
export const info = [
  {
    title: '店铺信息',
    type: 0,
    titleInfo: [
      {
        label: '店铺名称',
        type: 'text',
        field: 'storeName'
      },
      {
        label: '店铺牌匾',
        type: 'ossUpload',
        field: 'environmentImages'
      },
      {
        label: '店铺公告',
        type: 'text',
        field: 'announcement',
        default: '暂无公告'
      },
      {
        label: '店铺电话',
        type: 'text',
        field: 'phone'
      }
    ]
  },
  {
    title: '品类和头像',
    type: 1,
    titleInfo: [
      {
        label: '经营品类',
        type: 'text',
        field: 'cats',
        render: cats => {
          if (typeof cats === 'string') {
            const catsArr = cats.split(',')
            if (catsArr[1]) {
              return `主营：${catsArr[0]} <span style="margin: 0 10px">|</span>辅营：${catsArr[1]}`
            } else {
              return `主营：${catsArr[0]}`
            }
          } else {
            return ''
          }
        }
      },
      {
        label: '店铺头像',
        type: 'ossUpload',
        field: 'logoImage'
      }
    ]
  },
  {
    title: '营业设置',
    type: 2,
    titleInfo: [
      {
        label: '营业日期',
        type: 'text',
        field: 'businessDate',
        render: businessDate => {
          if (typeof businessDate === 'object' && businessDate.length) {
            let dayArr = [
              '',
              '周一',
              '周二',
              '周三',
              '周四',
              '周五',
              '周六',
              '周日'
            ]
            let day = []
            businessDate.forEach(item => {
              day.push(dayArr[item])
            })
            return day.join('、')
          } else {
            return ''
          }
        }
      },
      {
        label: '营业时段',
        type: 'text',
        field: '',
        render: item => {
          if (item) {
            return `${
              item.startTime ? item.startTime.substring(0, 5) : ''
            }<span style="margin: 0 10px">-</span>${
              item.endTime ? item.endTime.substring(0, 5) : ''
            }`
          }
        }
      },
      {
        label: '预订单类型',
        type: 'text',
        field: 'storeType',
        render: storeType => {
          return `${
            !storeType ? '外卖模式' : '食堂模式'
          }`
        },
        merchantManagerType: 'restaurant'
      },
      {
        label: '预订单设置',
        type: 'text',
        field: 'restAppointmentStatus',
        render: restAppointmentStatus => {
          return `${
            restAppointmentStatus ? '休息时接受预订' : '休息时不接受预订'
          }`
        },
        merchantManagerType: 'restaurant'
      },
      // {
      //   label: '商家接受预订的日期',
      //   type: 'text',
      //   field: '',
      //   render: item => {
      //     const day = [
      //       '',
      //       '当天',
      //       '明天',
      //       '后天',
      //       '后2天',
      //       '后3天',
      //       '后4天',
      //       '后5天',
      //       '后6天'
      //     ]
      //     return `仅支持${day[item.appointmentStart] || ''}到${day[
      //       item.appointmentEnd
      //     ] || ''}的预定`
      //   },
      //   merchantManagerType: 'restaurant'
      // },
      {
        label: '预订单提醒',
        type: 'text',
        field: 'productionReminderTime',
        render: productionReminderTime => {
          return `送达时间${productionReminderTime || 0}分钟前提醒备餐`
        },
        merchantManagerType: 'restaurant'
      },
      // {
      //   label: '出餐时间',
      //   type: 'text',
      //   field: 'productionTime',
      //   render: productionTime => {
      //     return `${productionTime || ''}分钟`
      //   },
      //   merchantManagerType: 'restaurant'
      // },
      {
        label: '接单方式',
        type: 'text',
        field: 'autoOrderStatus',
        render: autoOrderStatus => {
          return `${autoOrderStatus ? '自动接单' : '手动接单'}`
        }
      },
      {
        label: '配送费',
        type: 'text',
        field: 'deliveryPrice',
        render: deliveryPrice => {
          return deliveryPrice + '元'
        },
        merchantManagerType: 'restaurant'
      }
    ]
  }
  // {
  //   title: '其他服务',
  //   type: 3,
  //   titleInfo: [
  //     {
  //       label: '开具发票',
  //       type: 'text',
  //       field: 'invoiceStatus',
  //       render: invoiceStatus => {
  //         return `${invoiceStatus ? '支持' : '不支持'}`
  //       }
  //     },
  //     {
  //       label: '发票最低金额',
  //       type: 'text',
  //       field: 'invoiceMinimumAmount',
  //       render: invoiceMinimumAmount => {
  //         return `￥${invoiceMinimumAmount ||
  //           0} <span style="color: #7F7F7F">发票金额请以订单中实际支付金额为准</span>`
  //       }
  //     }
  //   ]
  // }
]
