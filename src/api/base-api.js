/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-09 16:31:09
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-20 16:48:13
 */
import {
  _NURSE_MERCHANT_URL,
  _NURSE_MERCHANT_STORE_URL,
  _HOSPITAL_ADMIN
} from './base-url'

const { VUE_APP_API_UNMOCK_URL, VUE_APP_API__COMMON_URL } = process.env

const _UNMOCK_API = VUE_APP_API_UNMOCK_URL || ''
const _COMMON_API =
  VUE_APP_API_UNMOCK_URL ||
  VUE_APP_API__COMMON_URL ||
  'https://ybm-dev.thinkmacro.cn'

const _MC = 'merchant'
const _WM = `waimai/admin/merchants/MERCHANTID`
const _WMT = `waimai/merchants/MERCHANTID`
const _WMV2 = `waimai/merchant/MERCHANTID`
const _WMShop = `waimai/merchants/MERCHANTID`
const _WMNO = `waimai/merchants/notices/MERCHANTID`
const _WMTI = `waimai/merchants/notices`
const _AU = 'union-identity'
const _WM2 = `waimai/admin/MERCHANTID/reduce-delivery-fee`
const _wmShop = `waimai/shop`

const _SS = `${_UNMOCK_API}/statistics/merchants/MERCHANTID`
const _S = `statistics`
const _SShop = `${_UNMOCK_API}/statistics/shops/MERCHANTID`
const _WM3 = `waimai/store-coupon-act/merchants/MERCHANTID`
const _WM4 = `waimai/admin/MERCHANTID`
const _WM5 = `waimai/admin/merchants/MERCHANTID`

const merchantCenter = 'merchant'
const storeId = 'STOREID'

export const merchants = `${_UNMOCK_API}/${merchantCenter}/merchants`
export const merchant = `${_UNMOCK_API}/${merchantCenter}`
export const capcha = `${_COMMON_API}/capcha/captcha/generate`
export const checkInfos = `${_UNMOCK_API}/${_MC}/check-infos`
export const cats = `${_UNMOCK_API}/${_WM}/categories`
export const mcCats = `${_UNMOCK_API}/${_MC}/categories`
export const user = `${_UNMOCK_API}/${_AU}/back-users`
export const store = `${_UNMOCK_API}/${_WM}/stores`
export const storeDetail = `${_UNMOCK_API}/${_WM}/stores/${storeId}`
export const role = `${_UNMOCK_API}/${_AU}/roles`
export const roles = `${_UNMOCK_API}/${_AU}/roles`
export const tags = `${_UNMOCK_API}/${_WM}/tags`
export const foodPeriods = `${_UNMOCK_API}/${_WM}/food-periods`
export const foodTemplates = `${_UNMOCK_API}/${_WM}/food-templates`
export const orderComments = `${_UNMOCK_API}/${_WMT}/order-comments`
export const order = `${_UNMOCK_API}/${_WMV2}/order`
export const orders = `${_UNMOCK_API}/${_wmShop}/${storeId}/order`
export const banners = `${_UNMOCK_API}/${_WM}/banners`
export const shop = `${_UNMOCK_API}/${_WMShop}/shop-background`
export const notices = `${_UNMOCK_API}/${_WMNO}`
export const notice = `${_UNMOCK_API}/${_WMTI}`
export const unionUser = `${_UNMOCK_API}/${_AU}/union-back-users`
export const account = `${_UNMOCK_API}/${_WMT}/accounts`
export const storeAccount = `${_UNMOCK_API}/${_WM}/accounts`
export const commentStat = `${_SS}/comment-stat`
export const overflow = `${_UNMOCK_API}/${_WM}/overflows`
export const finance = `${_SS}/finance`
export const statistics = `${_SS}`
export const split = `${_SS}/profitsharing`
export const delivery = `${_UNMOCK_API}/${_WM2}`

export const router = `${_UNMOCK_API}/${_AU}/web-router`
// 不需要merchantId的account
export const authAccount = `${_UNMOCK_API}/waimai/accounts`
export const stat = `${_UNMOCK_API}/${_S}/foods-stat`
export const discount = `${_UNMOCK_API}/${_WM}/discount-food-act`
export const coupon = `${_UNMOCK_API}/${_WM}/coupon`
export const inshop = `${_UNMOCK_API}/${_WM3}`

export const switchs = `${_UNMOCK_API}/${_WM4}/option`
export const seller = `${_UNMOCK_API}/${_WM5}`
export const applyments = `${_UNMOCK_API}/${_WM}/finance/applyments`
export const withdrew = `${_UNMOCK_API}/${_WM}/finance`
export const platformCoupon = `${_UNMOCK_API}/${_WM}/platform-coupon`
export const adapter = `${_UNMOCK_API}/adapter/admin/merchants/MERCHANTID`
export const helpEach = `${_UNMOCK_API}/${_WM}/merchants-help-each-order`
export const group = `${_UNMOCK_API}/${_WM5}/focus-group-activity`

export const persons = `${_UNMOCK_API}/${_wmShop}/stores/${storeId}/persons`

// 护工管理
export const managementNurse = `${_NURSE_MERCHANT_URL}/nurses`
export const nurseOrders = `${_NURSE_MERCHANT_URL}/orders`
export const nurseAudits = `${_NURSE_MERCHANT_STORE_URL}/nurse-audits`
// 护工取货订单列表
export const nurserPickOrders = `${_NURSE_MERCHANT_URL}/orders`

export const auditsCat = `${_UNMOCK_API}/${_WM}/stores/${storeId}/audits`

export const hospitalInfo = `${_HOSPITAL_ADMIN}/hospital-info`

export const activity = `${_UNMOCK_API}/waimai/activity-option`

export const dictionaries = `${_UNMOCK_API}/${_MC}/data-dictionary`
// 经营分析
export const businessAnalysis = `${_SS}/business`

export const home = `${_SShop}/manage`
