/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-10-19 11:52:53
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-10 10:06:48
 */
var coupon = require('@/assets/img/coupon.png')
var reduction = require('@/assets/img/reduction.png')
var paper = require('@/assets/img/paper.png')
var integral = require('@/assets/img/integral.png')

export const markConfig = new Map([
  [
    1,
    {
      name: '配送费减免',
      mark: 'delivery',
      img: integral,
      illustration: '下单后可享受配送费减免优惠',
      routerLink: 'addDelivery',
      disabled: false,
      clickEvent: '',
      img_disabled: '',
      id: 1,
      control: true
    }
  ],
  [
    3,
    {
      name: '满减活动',
      mark: 'reduction',
      img: reduction,
      illustration: '下单可享受满减优惠',
      routerLink: 'addFull',
      clickEvent: '',
      disabled: false,
      id: 3,
      control: true
    }
  ],
  [
    4,
    {
      name: '折扣商品',
      mark: 'discount',
      img: paper,
      illustration: '购买指定商品可享受折扣优惠',
      routerLink: 'addDiscount',
      clickEvent: '',
      disabled: false,
      id: 4,
      control: true
    }
  ],
  [
    5,
    {
      name: '店内领券',
      mark: 'inshop',
      img: coupon,
      illustration: '进入店铺后可领取代金券',
      routerLink: 'addInshop',
      disabled: false,
      clickEvent: '',
      img_disabled: '',
      id: 5,
      control: true
    }
  ]
])

export const typeText = {
  1: '配送费减免活动',
  2: '单品推荐活动',
  3: '满减活动',
  4: '折扣菜品活动',
  5: '店内领券活动',
  6: '兑换活动',
  7: '首页特惠菜品',
  8: '护工取货费减免活动'
}
