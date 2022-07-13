/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-02 16:32:01
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-07 13:49:54
 */

export const PERMISSION_ACTIONS = [
  {
    action: 'export',
    describe: '导出',
    defaultCheck: false
  },
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
  },
  {
    action: 'delete',
    describe: '删除',
    defaultCheck: false
  },
  {
    action: 'batch',
    describe: '批量',
    defaultCheck: false
  },
  {
    action: 'detail',
    describe: '详情',
    defaultCheck: false
  },
  {
    action: 'sort',
    describe: '排序',
    defaultCheck: false
  }
]

function plugin(Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth &&
    Object.defineProperties(Vue.prototype, {
      $auth: {
        get() {
          const _this = this
          return action => {
            const permissionList = _this.$store.getters.childrenRouter
            const routerName = _this.$route.name
            const tempFind = permissionList.find(val => {
              return val.name === routerName
            })
            return tempFind
              ? tempFind.actions.findIndex(val => {
                  return val.action === action
                }) > -1
              : false
          }
        }
      }
    })
}

export default plugin
