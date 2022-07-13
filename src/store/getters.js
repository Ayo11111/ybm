/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-15 08:19:21
 */

const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  merchantName: state => state.user.merchantName,
  uuid: state => state.user.uuid,
  merchantInfo: state => state.user.merchantInfo,
  orderMode: state => state.user.orderMode,
  storeId: state => state.user.storeId,
  pageCache: state => state.router.pageCache,
  routers: state => state.router.routers,
  controllableRoutes: state => state.router.controllableRoutes,
  routerFlag: state => state.router.routerFlag,
  childrenRouter: state => state.router.childrenRouter,
  axiosCancel: state => state.router.axiosCancel
}
export default getters
