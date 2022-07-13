/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 09:49:47
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-28 14:25:59
 */

import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/login-v2'),
    hidden: true
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home/page',
    meta: { title: '首页', icon: 'el-icon-s-data' },
    children: [
      {
        path: '/home/page',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: { title: '首页', icon: 'el-icon-s-data' }
      }
    ]
  },

  // 订单
  {
    path: '/orders',
    component: Layout,
    redirect: '/orders/processed',
    name: 'Order',
    meta: { title: '订单', icon: 'el-icon-tickets' },
    children: [
      {
        path: '/orders/processed',
        name: 'Processed',
        component: () => import('@/views/orders/processed'),
        meta: { title: '待处理订单', icon: '' }
      },
      {
        path: '/orders/advance',
        name: 'Advance',
        component: () => import('@/views/orders/advance'),
        meta: { title: '预订单', icon: '', type: 'restaurant' }
      },
      {
        path: '/orders/history',
        name: 'History',
        component: () => import('@/views/orders/history'),
        meta: { title: '历史订单' }
      },
      {
        path: '/orders/detail/:orderId',
        name: 'OrderDetail',
        hidden: true,
        component: () => import('@/views/orders/orderDetail'),
        meta: { title: '订单详情' }
      }
    ]
  },
  // 商品
  {
    path: '/commodity',
    component: Layout,
    redirect: '/commodity/commodity',
    meta: {
      title: '商品',
      icon: 'el-icon-shopping-bag-1',
      type: 'restaurant'
    },
    children: [
      {
        path: '/commodity/commodity',
        name: 'Commoditys',
        component: () => import('@/views/commodity/index.vue'),
        meta: { title: '商品' }
      },
      {
        path: '/commodity/create',
        name: 'CommodityCreate',
        hidden: true,
        component: () => import('@/views/commodity/create'),
        meta: { title: '新建商品' }
      },
      {
        path: '/commodity/edit/:id',
        name: 'CommodityEdit',
        hidden: true,
        component: () => import('@/views/commodity/create'),
        meta: { title: '编辑商品' }
      }
    ]
  },
  // 周预定
  {
    path: '/week',
    component: Layout,
    redirect: '/week/menu',
    meta: {
      title: '周预定',
      icon: 'el-icon-box',
      type: 'restaurant'
    },
    children: [
      {
        path: '/week/meal',
        name: 'WeekMeal',
        component: () => import('@/views/week/meal'),
        meta: { title: '餐次设置' }
      },
      {
        path: '/week/menu',
        name: 'WeekMenu',
        component: () => import('@/views/week/menu'),
        meta: { title: '周菜单管理' }
      },
      {
        path: '/week/order',
        name: 'WeekOrder',
        component: () => import('@/views/week/order'),
        meta: { title: '周订单管理' }
      },
      {
        path: '/week/order-stat',
        name: 'WeekOrderStat',
        component: () => import('@/views/week/orderStat'),
        meta: { title: '周订单统计' }
      },
      {
        path: '/week/food-stat',
        name: 'WeekFoodStat',
        hidden: true,
        component: () => import('@/views/week/foodStat'),
        meta: { title: '菜品预定统计' }
      }
    ]
  },
  // 护工
  {
    path: '/nurse',
    component: Layout,
    redirect: '/nurse/list',
    meta: { title: '护工', icon: 'el-icon-s-custom', type: 'nurse' },
    children: [
      {
        path: '/nurse/list',
        name: 'NurseList',
        hidden: true,
        component: () => import('@/views/nurse/list'),
        meta: { title: '护工列表' }
      },
      {
        path: '/nurse/info',
        name: 'NurseInfo',
        hidden: true,
        component: () => import('@/views/nurse/info'),
        meta: { title: '护工详情' }
      },
      {
        path: '/nurse/orders',
        name: 'NurseOrders',
        hidden: true,
        component: () => import('@/views/nurse/orders'),
        meta: { title: '护工订单' }
      }
    ]
  },
  // 顾客
  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/comment',
    meta: { title: '顾客', icon: 'el-icon-data-line' },
    children: [
      {
        path: '/customer/analysis',
        name: 'customeAnalysis',
        hidden: true,
        component: () => import('@/views/customer/analysis'),
        meta: { title: '顾客分析' }
      },
      {
        path: '/customer/comment',
        name: 'customeComment',
        component: () => import('@/views/customer/comment'),
        meta: { title: '顾客评价' }
      }
    ]
  },
  // 店铺
  {
    path: '/stores',
    component: Layout,
    redirect: '/stores/info',
    meta: { title: '店铺', icon: 'el-icon-s-shop' },
    children: [
      {
        path: '/stores/info',
        name: 'StoreManagement',
        component: () => import('@/views/stores/info'),
        meta: { title: '店铺管理' }
      },
      {
        path: '/stores/account',
        name: 'ChildAccountIndex',
        component: () => import('@/views/stores/childAccount'),
        meta: { title: '子账号管理' }
      }
    ]
  },
  // 财务
  {
    path: '/bill',
    component: Layout,
    redirect: '/bill/home',
    meta: { title: '财务', icon: 'el-icon-s-finance' },
    children: [
      {
        path: '/bill/home',
        name: 'BillHome',
        component: () => import('@/views/bill/home'),
        meta: { title: '账单首页' }
      },
      {
        path: '/bill/record',
        name: 'BillRecord',
        hidden: true,
        component: () => import('@/views/bill/record'),
        meta: { title: '余额提现记录' }
      },
      {
        path: '/bill/info',
        name: 'BillInfo',
        hidden: true,
        component: () => import('@/views/bill/info'),
        meta: { title: '账户信息' }
      },
      {
        path: '/bill/detail',
        name: 'BillDetail',
        component: () => import('@/views/bill/detail'),
        meta: { title: '账单对账' }
      },
      {
        path: '/bill/index/:date',
        name: 'Bill',
        hidden: true,
        component: () => import('@/views/bill/index'),
        meta: { title: '账单明细' }
      },
      {
        path: '/bill/order/:id/:date',
        name: 'BillIndex',
        hidden: true,
        component: () => import('@/views/bill/order'),
        meta: { title: '订单明细' }
      },
      {
        path: '/bill/query',
        name: 'BillQuery',
        component: () => import('@/views/bill/query'),
        meta: { title: '订单查询' }
      },
      {
        path: '/bill/download',
        name: 'BillDownload',
        hidden: true,
        component: () => import('@/views/bill/download'),
        meta: { title: '账单导出记录' }
      },
      {
        path: '/bill/split',
        name: 'FinanceSplit',
        hidden: true,
        component: () => import('@/views/bill/split'),
        meta: { title: '分账记账单' }
      }
    ]
  },
  // 系统设置
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    meta: { title: '系统', icon: 'el-icon-s-check' },
    children: [
      // 系统设置
      {
        path: '/setting/index',
        name: 'SettingIndex',
        component: () => import('@/views/setting/index'),
        meta: { title: '系统设置' }
      },
      // 子账号
      {
        path: '/setting/account',
        name: 'SubAccount',
        hidden: true,
        component: () => import('@/views/stores/account'),
        meta: { title: '子账号' }
      },
      {
        path: '/setting/aoe-account/:accountId',
        name: 'AddOrEditAccount',
        hidden: true,
        component: () => import('@/views/stores/aoe-account'),
        meta: { title: '子账号' }
      },
      // 支付
      {
        path: '/pay/index',
        name: 'paySetting',
        hidden: true,
        component: () => import('@/views/pay/index.vue'),
        meta: { title: '支付设置' }
      },
      {
        path: '/pay/apply',
        name: 'payApply',
        hidden: true,
        component: () => import('@/views/pay/apply.vue'),
        meta: { title: '支付申请' }
      },
      {
        path: '/pay/binary',
        name: 'PayBinary',
        component: () => import('@/views/pay/binary.vue'),
        meta: { title: '支付设置' }
      },
      // 角色设置
      {
        path: '/role/index',
        name: 'RoleIndex',
        hidden: true,
        component: () => import('@/views/role/index'),
        meta: { title: '角色设置' }
      },
      {
        path: '/role/create',
        name: 'RoleCreate',
        hidden: true,
        component: () => import('@/views/role/create'),
        meta: { title: '角色管理' }
      },
      // 收银系统设置
      {
        path: '/possystem/index',
        name: 'PosSystem',
        hidden: true,
        component: () => import('@/views/possystem/index'),
        meta: { title: '收银系统设置' }
      },
      // 打印机设置
      {
        path: '/setting/print',
        name: 'PrintSetting',
        hidden: true,
        component: () => import('@/views/setting/print'),
        meta: { title: '系统设置' }
      }
    ]
  },

  // 营销活动
  {
    path: '/markting',
    component: Layout,
    redirect: '/markting/index',
    meta: {
      title: '营销活动',
      icon: 'el-icon-s-marketing',
      type: 'restaurant'
    },
    children: [
      {
        path: '/markting/index',
        name: 'marktIndex',
        component: () => import('@/views/markting/index'),
        meta: { title: '活动中心', type: 'restaurant' }
      },
      {
        path: '/markting/home',
        name: 'marktHome',
        component: () => import('@/views/markting/home'),
        meta: { title: '我的活动', type: 'restaurant' }
      }
    ]
  },
  // 满减活动
  {
    path: '/reduction',
    hidden: true,
    component: Layout,
    meta: { title: '满减活动', icon: 'dashboard' },
    children: [
      {
        path: '/reduction/add',
        name: 'addFull',
        hidden: true,
        component: () => import('@/views/fullReduction/add'),
        meta: { title: '新建满减', icon: 'dashboard' }
      },
      {
        path: '/reduction/detail/:id',
        name: 'reductionDetail',
        hidden: true,
        component: () => import('@/views/fullReduction/detail'),
        meta: { title: '满减详情', icon: 'dashboard' }
      }
    ]
  },
  // 配送员
  {
    path: '/delivery',
    redirect: '/delivery/staff',
    component: Layout,
    meta: { title: '配送员', icon: 'dashboard', type: 'restaurant' },
    children: [
      {
        path: '/delivery/add',
        name: 'addDelivery',
        hidden: true,
        component: () => import('@/views/delivery/add'),
        meta: { title: '配送费减免', icon: 'dashboard' }
      },
      {
        path: '/delivery/detail/:id',
        name: 'deliveryDetial',
        hidden: true,
        component: () => import('@/views/delivery/detail'),
        meta: { title: '配送费减免详情', icon: 'dashboard' }
      },
      {
        path: '/delivery/staff',
        name: 'DeliveryStaff',
        component: () => import('@/views/delivery/staff'),
        meta: { title: '配送员' }
      },
      {
        path: '/delivery/index',
        name: 'DeliveryIndex',
        component: () => import('@/views/delivery/index'),
        meta: { title: '配送信息' }
      }
    ]
  },
  // 折扣商品
  {
    path: '/discount',
    hidden: true,
    component: Layout,
    meta: { title: '折扣商品', icon: 'dashboard' },
    children: [
      {
        path: '/discount/add',
        name: 'addDiscount',
        hidden: true,
        component: () => import('@/views/discount/add'),
        meta: { title: '折扣商品', icon: 'dashboard' }
      },
      {
        path: '/discount/detail/:id',
        name: 'discountDetail',
        hidden: true,
        component: () => import('@/views/discount/detail'),
        meta: { title: '折扣商品详情', icon: 'dashboard' }
      }
    ]
  },
  // 优惠券
  {
    path: '/coupon',
    hidden: true,
    component: Layout,
    meta: { title: '优惠券', icon: 'dashboard' },
    children: [
      {
        path: '/coupon/add',
        name: 'addCoupon',
        hidden: true,
        component: () => import('@/views/coupon/add'),
        meta: { title: '优惠券', icon: 'dashboard' }
      },
      {
        path: '/coupon/food',
        name: 'couponFood',
        hidden: true,
        component: () => import('@/views/coupon/food'),
        meta: { title: '新增单品优惠券', icon: 'dashboard' }
      },
      {
        path: '/coupon/list',
        name: 'listCoupon',
        hidden: true,
        component: () => import('@/views/coupon/list'),
        meta: { title: '优惠券列表', icon: 'dashboard' }
      },
      {
        path: '/coupon/detail/:id',
        name: 'couponDetail',
        hidden: true,
        component: () => import('@/views/coupon/detail'),
        meta: { title: '优惠券详情', icon: 'dashboard' }
      }
    ]
  },
  // 店内领券
  {
    path: '/inshop',
    hidden: true,
    component: Layout,
    meta: { title: '店内领券', icon: 'dashboard' },
    children: [
      {
        path: '/inshop/add',
        name: 'addInshop',
        hidden: true,
        component: () => import('@/views/inshop/add'),
        meta: { title: '新增店内领券', icon: 'dashboard' }
      },
      {
        path: '/inshop/list',
        name: 'listInshop',
        hidden: true,
        component: () => import('@/views/inshop/list'),
        meta: { title: '店内领券列表', icon: 'dashboard' }
      },
      {
        path: '/inshop/detail/:id',
        name: 'inshopDetail',
        hidden: true,
        component: () => import('@/views/inshop/detail'),
        meta: { title: '店内领券详情', icon: 'dashboard' }
      }
    ]
  },
  // 平台优惠券
  {
    path: '/platform-coupon',
    component: Layout,
    hidden: true,
    meta: { title: '平台优惠券', icon: 'dashboard' },
    children: [
      {
        path: '/platform-coupon/index',
        name: 'platformCoupon',
        component: () => import('@/views/platform-coupon/index'),
        meta: { title: '平台优惠券列表', icon: 'dashboard' }
      },
      {
        path: '/platform-coupon/detail/:id',
        name: 'platformCouponDetail',
        hidden: true,
        component: () => import('@/views/platform-coupon/detail'),
        meta: { title: '平台优惠券详情', icon: 'dashboard' }
      }
    ]
  },
  // 商家流量互助
  {
    path: '/merchant-flow',
    hidden: true,
    component: Layout,
    meta: { title: '商家流量互助', icon: 'dashboard' },
    children: [
      {
        path: '/merchant-flow/index',
        name: 'MerchantFlow',
        hidden: true,
        component: () => import('@/views/flow/index'),
        meta: { title: '商家流量互助', icon: 'dashboard' }
      }
    ]
  },
  // 经营分析
  {
    path: '/management',
    component: Layout,
    redirect: '/management/index',
    meta: { title: '经营', icon: 'el-icon-data-line' },
    children: [
      {
        path: '/management/index',
        name: 'ManagementAnalysis',
        component: () => import('@/views/management/index'),
        meta: { title: '经营分析' }
      },
      {
        path: '/management/download',
        name: 'ManagementDownload',
        component: () => import('@/views/management/download'),
        meta: { title: '报表下载' }
      }
    ]
  },

  // 测试
  {
    path: '/test',
    component: Layout,
    redirect: 'test',
    hidden: true,
    meta: { title: '测试专用', icon: 'dashboard' },
    children: [
      {
        path: 'test',
        name: 'TestIndex',
        component: () => import('@/views/test/index'),
        meta: { title: '测试专用', icon: 'dashboard' }
      },
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/views/test/taxt2'),
        meta: { title: '测试1', icon: 'dashboard' }
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

Vue.use(Router)

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
