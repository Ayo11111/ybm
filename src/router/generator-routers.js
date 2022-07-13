/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-01 14:10:16
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-09 16:44:57
 */
import Layout from '@/layout'

// 需要引入的页面映射
const constantRouterComponents = {
  Login: () => import('@/views/login/index'),
  '404': () => import('@/views/404'),
  Home: () => import('@/views/home'),
  StoresList: () => import('@/views/stores/list'),
  StoresPoster: () => import('@/views/stores/poster'),
  AddPoster: () => import('@/views/stores/addPoster'),
  EditPoster: () => import('@/views/stores/editPoster'),
  storeSign: () => import('@/views/stores/sign'),
  NewStore: () => import('@/views/stores/new'),
  StoreDetail: () => import('@/views/stores/detail'),
  StoreCommodity: () => import('@/views/stores/commodity'),
  SubAccount: () => import('@/views/stores/account'),
  AddOrEditAccount: () => import('@/views/stores/aoe-account'),
  storeNotice: () => import('@/views/stores/notice'),
  noticeDetail: () => import('@/views/stores/noticeDetail'),
  marktIndex: () => import('@/views/markting/index'),
  marktHome: () => import('@/views/markting/home'),
  addFull: () => import('@/views/fullReduction/add'),
  editFull: () => import('@/views/fullReduction/edit'),
  addDelivery: () => import('@/views/delivery/add'),
  addDiscount: () => import('@/views/discount/add'),
  TestIndex: () => import('@/views/test/index'),
  Test1: () => import('@/views/test/taxt2'),
  list: () => import('@/views/orders/order'),
  orderDetail: () => import('@/views/orders/orderDetail'),
  Commoditys: () => import('@/views/commodity/commodity'),
  CommodityCreate: () => import('@/views/commodity/create'),
  customeAnalysis: () => import('@/views/customer/analysis'),
  customeComment: () => import('@/views/customer/comment'),
  BillIndex: () => import('@/views/bill/index'),
  BillDetail: () => import('@/views/bill/detail'),
  BillQuery: () => import('@/views/bill/query'),
  BillDownload: () => import('@/views/bill/download'),
  FinanceSplit: () => import('@/views/bill/split'),
  StoreManagement: () => import('@/views/stores/info')
}

// 基础路由
export const baseRouters = [
  {
    path: '/login',
    name: 'Login',
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    hidden: true
  },
  {
    path: '/home',
    redirect: '/page',
    meta: { title: '', icon: 'el-icon-s-data' },
    children: [
      {
        path: '/home/page',
        name: 'Home',
        meta: { title: '首页', icon: 'el-icon-s-data' },
        action: [
          {
            action: 'export',
            describe: '导出',
            defaultCheck: false
          }
        ]
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const generator = routers => {
  if (Array.isArray(routers)) {
    return routers.map(i => {
      const { name, path, children } = i
      if (name && path) {
        i.component = constantRouterComponents[name]
      } else {
        i.component = Layout
      }
      if (children) i.children = generator(children)
      return i
    })
  } else {
    return []
  }
}
