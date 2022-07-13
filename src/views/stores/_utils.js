/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-28 14:14:42
 * @LastEditors: HJ
 * @LastEditTime: 2021-09-23 02:28:35
 */
export const regionMap = new Map([
  [0, 'province'],
  [1, 'city'],
  [2, 'area']
])

export const testJson = {
  businessLicenseImgs:
    'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/top50-public/merchant/stores/755855/vc-upload-1595919389916-3_营业执照.jpg',
  manageLicenseImags:
    'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/top50-public/merchant/stores/755855/vc-upload-1595919389916-5_经营许可证.jpg',
  businessLicenseEnd: '2020-07-07 00:00:00',
  manageLicenseEnd: '2020-07-22 00:00:00',
  startTime: '00:00:00',
  endTime: '23:59:59',
  storeName: '测试用的店铺',
  phone: '13790758177',
  city: '北京市',
  province: '北京市',
  area: '东城区',
  addressDetail: '北京市朝阳区7号线焦化厂(地铁站)',
  announcement: '测试公告',
  storeManagerId: 11,
  storeStatus: '1',
  storeStartStatus: '1',
  takeAwayStatus: '1',
  zitiStatus: '1',
  delWay: '1',
  latitude: 39.855488,
  longitude: 116.537247,
  appointmentStatus: 1,
  appointmentDeliveryTime: 30,
  appointmentIntervalTime: 15,
  appointmentStart: 1,
  appointmentEnd: 2
}

export const times = {
  service: [
    { label: '30分钟', value: 30 },
    { label: '1小时', value: 60 },
    { label: '2小时', value: 120 },
    { label: '3小时', value: 180 }
  ],
  interval: [
    { label: '15分钟', value: 15 },
    { label: '20分钟', value: 20 },
    { label: '30分钟', value: 30 }
  ],
  destine: [
    { label: '当天', value: 1 },
    { label: '明天', value: 2 },
    { label: '后天', value: 3 },
    { label: '后2天', value: 4 },
    { label: '后3天', value: 5 },
    { label: '后4天', value: 6 },
    { label: '后5天', value: 7 },
    { label: '后6天', value: 8 }
  ]
}

export const storeMock = {
  deliveryPrice: 0,
  startSale: 0,
  deliveryPath:
    '114.419282,23.109523;114.409282,23.109523;114.409282,23.099523;114.419282,23.099523;',
  id: 53,
  storeManagerId: null,
  storeSuperName: null,
  isBusiness: null,
  businessHoursStr: null,
  storeName: '嘉和一品华贸店',
  introduction: '11',
  storeStatus: 0,
  storeStartStatus: 1,
  takeAwayStatus: 1,
  zitiStatus: 0,
  deliveryName: '顺丰同城配送',
  businessLicenseImgs:
    'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/top50-merchant/755855/license/businessLicenseImgs_1582009202851_690e1b79',
  manageLicenseImags:
    'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/top50-merchant/755855/license/manageLicenseImags_1582009205346_1b233752',
  startTime: '00:55:05',
  endTime: '20:59:51',
  longitude: '114.414282',
  latitude: '23.104523',
  phone: '0752-2233233',
  score: null,
  addressDetail: '广东省惠州市惠城区文昌一路9号(华贸天地)11',
  city: '惠州市',
  province: '广东省',
  area: '惠城区',
  address: '文昌一路9号(华贸天地)',
  poiName: '11',
  baseStoreId: null,
  sfStoreId: '3243279847393',
  businessLicenseBegin: null,
  businessLicenseEnd: '2021-02-19 00:00:00',
  manageLicenseBegin: null,
  manageLicenseEnd: '2021-03-11 00:00:00',
  delWay: 2,
  appointmentIntervalTime: 20,
  appointmentStatus: 1,
  appointmentDeliveryTime: 30,
  appointmentStart: 1,
  appointmentEnd: 1,
  averageCost: 125.99,
  storeSales: 15,
  logoImage:
    'https://images.liqucn.com/img/h24/h30/img_localize_0881673a0d12c4af8732de12283592bb_400x400.png',
  cats: '方便面',
  tags: '',
  announcement: ''
}

export const orderStatusMap = [
  [1, '等待用户支付'],
  [2, '订单取消'],
  [3, '自动接单中'],
  [4, '备餐中'],
  [5, '等待分配骑手'],
  [6, '等待自提'],
  [7, '客户已自提'],
  [8, '订单超时未处理'],
  [9, '外卖已取出自提柜'],
  [101, '等待分配骑手'],
  [102, '等待骑手取货'],
  [103, '商家取消订单'],
  [201, '骑手到店开始取货'],
  [202, '骑手取货成功'],
  [203, '骑手取货失败，商家取消订单'],
  [204, '骑手取货失败，骑手因自身原因取消订单'],
  [205, '骑手取货失败，骑手因商家原因取消订单'],
  [301, '骑手配送中'],
  [302, '已送达'],
  [303, '商家取消订单'],
  [304, '骑手无法联系收货人，配送物品开始返还商家'],
  [305, '骑手配送阶段——收货人拒收，配送物品开始返还商家'],
  [401, '骑手返回配送货品阶段——货品返还商户成功'],
  [501, '因运力系统原因取消'],
  [502, '因不可抗拒因素（天气，道路管制等原因）取消'],
  [601, '退款审核中'],
  [602, '退款成功'],
  [603, '退款失败'],
  [604, '急速退款'],
  [605, '商家直接退款']
]

export const getDeliveryName = arr => {
  const res = Array.isArray(arr)
    ? arr.filter(i => {
        if (i.status) return i
      })
    : [{ deliveryName: '---' }]
  return res[0] ? res[0].deliveryName : '---'
}

export const quantityList = [
  {
    label: '经营者名称',
    span: 12,
    prop: 'companyName',
    type: 'text',
    placeholder: '请输入',
    autosize: null,
    showWordLimit: false,
    maxlength: null
  },
  {
    label: '法定代表人',
    span: 12,
    prop: 'legalRepresentative',
    type: 'text',
    placeholder: '请输入',
    autosize: null,
    showWordLimit: false,
    maxlength: null
  },
  {
    label: '食品经营许可证号',
    span: 12,
    prop: 'licenseNumber',
    type: 'text',
    placeholder: '请输入',
    autosize: null,
    showWordLimit: false,
    maxlength: null
  },
  {
    label: '经营场所',
    span: 12,
    prop: 'businessAddress',
    type: 'text',
    placeholder: '请输入',
    autosize: null,
    showWordLimit: false,
    maxlength: null
  },
  {
    label: '主体业态',
    span: 12,
    prop: 'mainBusiness',
    type: 'text',
    placeholder: '请输入',
    autosize: null,
    showWordLimit: false,
    maxlength: null
  },
  {
    label: '经营项目',
    span: 24,
    prop: 'businessScope',
    type: 'textarea',
    placeholder: '请输入',
    autosize: 5,
    showWordLimit: true,
    maxlength: 300
  }
]

export const settlementMap = {
  merchant: '商家主体结算',
  store: '店铺独立结算'
}
