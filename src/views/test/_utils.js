/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-30 09:18:56
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-01 11:04:05
 */
import request from '@/utils/request'
const getImg = imgUrl =>
  request({
    url: imgUrl,
    responseType: 'blob'
  })

export function getBase64(imgUrl) {
  return new Promise((resolve, reject) => {
    getImg(imgUrl).then(res => {
      const oFileReader = new FileReader()
      oFileReader.onloadend = function(e) {
        const base64 = e.target.result
        resolve(base64)
      }
      oFileReader.onerror = function(e) {
        reject()
      }
      oFileReader.readAsDataURL(res)
    })
  })
}

export const baseRuoter = [
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
    meta: { title: '', icon: 'dashboard' },
    children: [
      {
        path: '/home/page',
        name: 'Home',
        meta: { title: '首页', icon: 'dashboard' },
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

  {
    path: '/',
    redirect: 'stores/list',
    meta: { title: '店铺管理', icon: 'dashboard' },
    children: [
      {
        path: 'stores/list',
        name: 'StoresList',
        meta: { title: '店铺列表', icon: 'dashboard' },
        action: [
          {
            action: 'query',
            describe: '查询',
            defaultCheck: false
          },
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'edit',
            describe: '编辑',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'stores/poster',
        name: 'StoresPoster',
        meta: { title: '店内海报', icon: 'dashboard' },
        action: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'edit',
            describe: '编辑',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          },
          {
            action: 'sort',
            describe: '排序',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'stores/addPoster',
        name: 'AddPoster',
        hidden: true,
        meta: { title: '新增海报', icon: 'dashboard' }
      },
      {
        path: 'stores/editPoster/:id',
        name: 'EditPoster',
        hidden: true,
        meta: { title: '编辑海报', icon: 'dashboard' }
      },
      {
        path: 'stores/sign',
        name: 'storeSign',
        meta: { title: '店内招牌', icon: 'dashboard' },
        action: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'edit',
            describe: '编辑',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'stores/new',
        name: 'NewStore',
        hidden: true,
        meta: { title: '新建店铺', icon: 'dashboard' }
      },
      {
        path: 'stores/detail/:storeId',
        name: 'StoreDetail',
        hidden: true,
        meta: { title: '店铺详情', icon: 'dashboard' }
      },
      {
        path: 'stores/commodity',
        name: 'StoreCommodity',
        hidden: true,
        meta: { title: '店铺商品', icon: 'dashboard' }
      },
      {
        path: 'stores/account',
        name: 'SubAccount',
        meta: { title: '子账号', icon: 'dashboard' },
        action: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'edit',
            describe: '编辑',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'stores/aoe-account/:accountId',
        name: 'AddOrEditAccount',
        hidden: true,
        meta: { title: '管理子账号', icon: 'dashboard' }
      },
      {
        path: 'stores/notice',
        name: 'storeNotice',
        meta: { title: '平台公告', icon: 'dashboard' }
      },
      {
        path: 'stores/notice/detail',
        name: 'noticeDetail',
        hidden: true,
        meta: { title: '公告详情', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/markting',
    redirect: 'index',
    meta: { title: '营销活动', icon: 'dashboard' },
    children: [
      {
        path: 'index',
        name: 'marktIndex',
        meta: { title: '活动中心', icon: 'dashboard' }
      },
      {
        path: 'home',
        name: 'marktHome',
        meta: { title: '我的活动', icon: 'dashboard' },
        action: [
          {
            action: 'detail',
            describe: '详情',
            defaultCheck: false
          },
          {
            action: 'edit',
            describe: '编辑',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          }
        ]
      }
    ]
  },
  {
    path: '/reduction',
    hidden: true,
    meta: { title: '满减活动', icon: 'dashboard' },
    children: [
      {
        path: 'add',
        name: 'addFull',
        hidden: true,
        meta: { title: '新建满减', icon: 'dashboard' }
      },
      {
        path: 'edit',
        name: 'editFull',
        hidden: true,
        meta: { title: '编辑满减', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/delivery',
    hidden: true,
    meta: { title: '配送费减免', icon: 'dashboard' },
    children: [
      {
        path: 'add',
        name: 'addDelivery',
        hidden: true,
        meta: { title: '配送费减免', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/discount',
    hidden: true,

    meta: { title: '折扣商品', icon: 'dashboard' },
    children: [
      {
        path: 'add',
        name: 'addDiscount',
        hidden: true,

        meta: { title: '折扣商品', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/test',

    redirect: 'test',
    meta: { title: '测试专用', icon: 'dashboard' },
    children: [
      {
        path: 'test',
        name: 'TestIndex',

        meta: { title: '测试专用', icon: 'dashboard' }
      },
      {
        path: 'test1',
        name: 'Test1',

        meta: { title: '测试1', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/order',

    redirect: '/order',
    meta: { title: '订单管理', icon: 'dashboard' },
    children: [
      {
        path: '/order/list',
        name: 'list',

        meta: { title: '订单管理' }
      },
      {
        path: '/order/detail/:id',
        name: 'orderDetail',
        hidden: true,

        meta: { title: '订单详情', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/commodity',

    redirect: '/commodity/commodity',
    meta: { title: '商品管理', icon: 'dashboard' },
    children: [
      {
        path: '/commodity/commodity',
        name: 'Commoditys',
        meta: { title: '商品管理', icon: 'dashboard' },
        action: [
          {
            action: 'add',
            describe: '新增',
            defaultCheck: false
          },
          {
            action: 'edit',
            describe: '编辑',
            defaultCheck: false
          },
          {
            action: 'delete',
            describe: '删除',
            defaultCheck: false
          },
          {
            action: 'sort',
            describe: '排序',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'commodity/create',
        name: 'CommodityCreate',
        hidden: true,
        meta: { title: '新建商品', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/customer',

    redirect: 'customer/list',
    meta: { title: '顾客管理', icon: 'dashboard' },
    children: [
      {
        path: 'customer/analysis',
        name: 'customeAnalysis',
        meta: { title: '顾客分析' },
        action: [
          {
            action: 'export',
            describe: '导出',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'customer/comment',
        name: 'customeComment',
        meta: { title: '顾客评价' },
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
  {
    path: '/bill',
    redirect: 'index',
    meta: { title: '财务管理', icon: 'dashboard' },
    children: [
      {
        path: 'index',
        name: 'BillIndex',
        hidden: true,
        meta: { title: '对账管理' }
      },
      {
        path: 'detail',
        name: 'BillDetail',
        meta: { title: '账单明细' },
        action: [
          {
            action: 'export',
            describe: '导出',
            defaultCheck: false
          },
          {
            action: 'detail',
            describe: '详情',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'query',
        name: 'BillQuery',
        meta: { title: '账单查询' },
        action: [
          {
            action: 'detail',
            describe: '详情',
            defaultCheck: false
          }
        ]
      },
      {
        path: 'download',
        name: 'BillDownload',
        meta: { title: '账单报表下载' },
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

export const localRouter = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/home',

    redirect: '/page',
    meta: { title: '', icon: 'dashboard' },
    children: [
      {
        path: '/home/page',
        name: 'Home',
        component: () => import('@/views/home'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/',

    redirect: 'stores/list',
    meta: { title: '店铺管理', icon: 'dashboard' },
    children: [
      {
        path: '/stores/list',
        name: 'StoresList',
        component: () => import('@/views/stores/list'),
        meta: { title: '店铺列表', icon: 'dashboard' }
      },
      {
        path: '/stores/poster',
        name: 'StoresPoster',
        component: () => import('@/views/stores/poster'),
        meta: { title: '店内海报', icon: 'dashboard' }
      },
      {
        path: '/stores/addPoster',
        name: 'AddPoster',
        hidden: true,
        component: () => import('@/views/stores/addPoster'),
        meta: { title: '新增海报', icon: 'dashboard' }
      },
      {
        path: '/stores/editPoster/:id',
        name: 'EditPoster',
        hidden: true,
        component: () => import('@/views/stores/editPoster'),
        meta: { title: '编辑海报', icon: 'dashboard' }
      },
      {
        path: '/stores/sign',
        name: 'storeSign',
        component: () => import('@/views/stores/sign'),
        meta: { title: '店内招牌', icon: 'dashboard' }
      },
      {
        path: '/stores/new',
        name: 'NewStore',
        hidden: true,
        component: () => import('@/views/stores/new'),
        meta: { title: '新建店铺', icon: 'dashboard' }
      },
      {
        path: '/stores/detail/:storeId',
        name: 'StoreDetail',
        hidden: true,
        component: () => import('@/views/stores/detail'),
        meta: { title: '店铺详情', icon: 'dashboard' }
      },
      {
        path: '/stores/commodity',
        name: 'StoreCommodity',
        hidden: true,
        component: () => import('@/views/stores/commodity'),
        meta: { title: '店铺商品', icon: 'dashboard' }
      },
      {
        path: '/stores/account',
        name: 'SubAccount',
        component: () => import('@/views/stores/account'),
        meta: { title: '子账号', icon: 'dashboard' }
      },
      {
        path: '/stores/aoe-account/:accountId',
        name: 'AddOrEditAccount',
        hidden: true,
        component: () => import('@/views/stores/aoe-account'),
        meta: { title: '管理子账号', icon: 'dashboard' }
      },
      {
        path: '/stores/notice',
        name: 'storeNotice',
        component: () => import('@/views/stores/notice'),
        meta: { title: '平台公告', icon: 'dashboard' }
      },
      {
        path: '/stores/notice/detail',
        name: 'noticeDetail',
        hidden: true,
        component: () => import('@/views/stores/noticeDetail'),
        meta: { title: '公告详情', icon: 'dashboard' }
      }
    ]
  },
  // 营销活动
  {
    path: '/markting',

    redirect: 'index',
    meta: { title: '营销活动', icon: 'dashboard' },
    children: [
      {
        path: '/markting/index',
        name: 'marktIndex',
        component: () => import('@/views/markting/index'),
        meta: { title: '活动中心', icon: 'dashboard' }
      },
      {
        path: '/markting/home',
        name: 'marktHome',
        component: () => import('@/views/markting/home'),
        meta: { title: '我的活动', icon: 'dashboard' }
      }
    ]
  },
  // 满减活动
  {
    path: '/reduction',
    hidden: true,

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
        path: '/reduction/edit',
        name: 'editFull',
        hidden: true,
        component: () => import('@/views/fullReduction/edit'),
        meta: { title: '编辑满减', icon: 'dashboard' }
      }
    ]
  },
  // 配送费减免
  {
    path: '/delivery',
    hidden: true,

    meta: { title: '配送费减免', icon: 'dashboard' },
    children: [
      {
        path: '/delivery/add',
        name: 'addDelivery',
        hidden: true,
        component: () => import('@/views/delivery/add'),
        meta: { title: '配送费减免', icon: 'dashboard' }
      }
    ]
  },
  // 折扣商品
  {
    path: '/discount',
    hidden: true,

    meta: { title: '折扣商品', icon: 'dashboard' },
    children: [
      {
        path: '/discount/add',
        name: 'addDiscount',
        hidden: true,
        component: () => import('@/views/discount/add'),
        meta: { title: '折扣商品', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/test',

    redirect: 'test',
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
  {
    path: '/order',

    redirect: '/order',
    meta: { title: '订单管理', icon: 'dashboard' },
    children: [
      {
        path: '/order/list',
        name: 'list',
        component: () => import('@/views/stores/order'),
        meta: { title: '订单管理' }
      },
      {
        path: '/order/detail/:id',
        name: 'orderDetail',
        hidden: true,
        component: () => import('@/views/stores/orderDetail'),
        meta: { title: '订单详情', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/commodity',

    redirect: '/commodity/commodity',
    meta: { title: '商品管理', icon: 'dashboard' },
    children: [
      {
        path: '/commodity/commodity',
        name: 'Commoditys',
        component: () => import('@/views/commodity/commodity'),
        meta: { title: '商品管理', icon: 'dashboard' }
      },
      {
        path: '/commodity/create',
        name: 'CommodityCreate',
        hidden: true,
        component: () => import('@/views/commodity/create'),
        meta: { title: '新建商品', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/customer',

    redirect: 'customer/list',
    meta: { title: '顾客管理', icon: 'dashboard' },
    children: [
      {
        path: '/customer/analysis',
        name: 'customeAnalysis',
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
  {
    path: '/bill',

    redirect: 'index',
    meta: { title: '财务管理', icon: 'dashboard' },
    children: [
      {
        path: '/bill/index',
        name: 'BillIndex',
        hidden: true,
        component: () => import('@/views/bill/index'),
        meta: { title: '对账管理' }
      },
      {
        path: '/bill/detail',
        name: 'BillDetail',
        component: () => import('@/views/bill/detail'),
        meta: { title: '账单明细' }
      },
      {
        path: '/bill/query',
        name: 'BillQuery',
        component: () => import('@/views/bill/query'),
        meta: { title: '账单查询' }
      },
      {
        path: '/bill/download',
        name: 'BillDownload',
        component: () => import('@/views/bill/download'),
        meta: { title: '账单报表下载' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]
