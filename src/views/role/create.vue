<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-01 15:46:28
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-09 12:04:10
-->
<template>
  <div v-loading="mainLoad" class="container">
    <detail-block title="基本信息">
      <el-form :model="createForm" :rules="createRules" inline>
        <el-form-item label="角色名称：" prop="cnName">
          <el-input
            v-model="createForm.cnName"
            style="width: 25em"
            name="role"
            placeholder="请输入角色名称"
          />
        </el-form-item>
        <el-form-item label="角色编码：" prop="number">
          <el-input
            v-model="createForm.number"
            style="width: 25em"
            name="role"
            placeholder="请输入角色编码"
          />
        </el-form-item>
      </el-form>
    </detail-block>
    <detail-block title="关联权限" class="authority">
      <el-tree
        ref="tree"
        show-checkbox
        node-key="id"
        :data="routerData"
        :props="treeProps"
        :default-expanded-keys="[-1]"
        :filter-node-method="filterNode"
        @check="treeCheck"
      />
    </detail-block>
    <div style="margin-top: 20px">
      <el-button
        type="primary"
        class="mr-12"
        :loading="saveLoad"
        @click="handlerSave"
      >
        保存
      </el-button>
      <router-link :to="{ name: 'ChildAccountIndex', query: { type: 'role' } }">
        <el-button>取消</el-button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DetailBlock from '@/components/DetailBlock'
import { fhGetRole, fhCreateRole, fhEditRole } from '@/api/role'
import { fhGetRouter } from '@/api/user'
import { difference, intersection, union } from '@/utils/set-utils'
import { deepClone } from '@/utils'
import { getUserInfo } from '@/utils/auth'
export default {
  name: 'RoleCreate',
  components: {
    DetailBlock
  },
  data() {
    return {
      createForm: {},
      createRules: {
        cnName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: ['blur', 'change']
          }
        ],
        number: [
          {
            required: true,
            message: '请输入角色编号',
            trigger: ['blur', 'change']
          }
        ]
      },
      treeProps: {
        label: (data, node) => {
          const { meta, id, describe } = data || {}
          const { title } = meta || {}
          return describe || `${title}` || id
        },
        children: 'actions'
      },
      // 所有路由
      webRoutes: [],
      defaultIds: [],
      routerData: [],
      rootId: new Set([-1]),
      routerActionId: new Set(),
      routerId: new Set(),
      // 尝试routerTree
      routerTree: [],
      saveLoad: false,
      mainLoad: false,
      detailLoadEnd: false,
      routerLoadEnd: false,
      merchantId: null,
      isMounted: false
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  async created() {
    window.role = this
    const { id } = this.$route.query
    const { merchantId } = (await getUserInfo()) || {}
    this.merchantId = merchantId
    if (id) {
      this.roleId = id
    }
  },
  mounted() {
    this.getRouter()
  },
  methods: {
    // 获取所有路由
    async getRouter() {
      this.mainLoad = true
      try {
        const { results } = await fhGetRouter({
          webType: 'merchant',
          merchantId: this.merchantId
        })
        this.webRoutes = this.computedRoutes(results)
        const newData = this.actionsToChildren(this.webRoutes)
        const all = [
          {
            id: -1,
            meta: {
              title: '全部'
            },
            actions: []
          }
        ]
        this.$nextTick(() => {
          all[0].actions = newData
          this.routerData = all
          this.$nextTick(() => this.$forceUpdate())
          this.routerLoadEnd = true

          if (this.roleId) {
            this.getRole()
          }
        })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.routerLoadEnd = true
      this.mainLoad = false
    },
    // 处理获取到的路由
    actionsToChildren(nodes) {
      return nodes.map(i => {
        const { id } = i
        this.rootId.add(+id)
        i.actions = i.children
        delete i.component
        return i
      })
    },
    // 保存按钮
    handlerSave() {
      this.tempRouterId = difference(this.routerId, this.rootId)
      this.tempSuperset = intersection(this.routerId, this.rootId)
      let tempRouterData = deepClone(this.routerData)
      tempRouterData = tempRouterData[0].actions
      let sendData = this.filterRouter(tempRouterData, this.tempSuperset)
      sendData = sendData.length < 1 ? [...this.tempSuperset] : sendData
      if (sendData.length < 1) {
        this.$message.error('请勾选角色的权限')
        return
      }
      this.createRole(sendData)
    },
    // 创建或编辑角色
    async createRole(router) {
      this.saveLoad = true
      delete this.createForm.router
      const send = {
        merchantId: this.merchantId,
        applicationName: 'waimai',
        router,
        ...this.createForm
      }
      try {
        this.roleId
          ? await fhEditRole(this.roleId, send)
          : await fhCreateRole(send)
        this.$message.success(`${this.roleId ? '编辑' : '创建'}角色成功`)
        this.$router.replace({
          path: '/stores/account',
          query: {
            type: 'role'
          }
        })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.saveLoad = false
    },
    // 过滤选中的路由
    filterRouter(routes, set) {
      return routes.filter(i => {
        const { id, children, actions } = i
        if (children && children.length > 0) {
          delete i.actions
          i.children = this.filterRouter(children, this.tempRouterId)
        } else if (children) {
          i.actions = this.filterRouter(actions, this.routerActionId)
        }
        if (set.has(id)) {
          return i
        }
      })
    },
    // 获取路由Id和actionId
    treeCheck(data, checks) {
      const { checkedNodes, halfCheckedNodes } = checks
      const tempRouterId = new Set()
      const tempRouterActionId = new Set()
      if (Array.isArray(halfCheckedNodes)) {
        halfCheckedNodes.forEach(i => {
          const { id } = i
          tempRouterId.add(id)
        })
      }
      if (Array.isArray(checkedNodes)) {
        checkedNodes.forEach(i => {
          const { id, actions } = i
          if (actions) {
            tempRouterId.add(id)
          } else {
            tempRouterActionId.add(id)
          }
        })
      }
      this.routerActionId = tempRouterActionId
      this.routerId = tempRouterId
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    // 获取详情
    async getRole() {
      try {
        const { results } = await fhGetRole(this.roleId)
        this.createForm = results
        const { router } = results
        this.defaultIds = this.filterDetailId(router).flat(Infinity)
        this.$nextTick(() => {
          const temp = difference(new Set(this.defaultIds), this.rootId)
          this.routerId = union(new Set(this.defaultIds), this.rootId)
          this.$refs.tree.setCheckedKeys([...temp])
          this.$nextTick(() => this.$forceUpdate())
          this.detailLoadEnd = true
        })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.detailLoadEnd = true
    },
    // 过滤详情中需要的id
    filterDetailId(router) {
      return router.map(i => {
        const { id, children, actions } = i
        const temp = []
        if (children && children.length > 0) {
          temp.push(this.filterDetailId(children))
        } else if (actions && actions.length > 0) {
          temp.push(this.filterDetailId(actions))
        } else {
          temp.push(id)
        }
        return temp
      })
    },
    // 过滤路由
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // TODO 提升为全局方法
    // 区分膳食商家和护工商家
    computedRoutes(routers) {
      const { merchantManagerType } = this.merchantInfo

      const flagArr = ['retail', 'restaurant'].includes(merchantManagerType)
        ? ['护工']
        : ['预订单', '商品', '营销活动', '活动中心', '我的活动', '配送员']

      return routers.filter(i => {
        const { title } = i.meta || {}
        if (!flagArr.includes(title)) {
          const { children } = i
          if (children) {
            const newChild = children.filter(item => {
              const { title } = item.meta || {}
              if (!flagArr.includes(title)) {
                return item
              }
            })
            i.children = newChild
          }
          return i
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  height: auto !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &::v-deep .el-dialog__body {
    padding: 10px 20px;
  }

  &::v-deep .el-scrollbar__wrap {
    overflow-y: auto;
    max-height: 600px;
  }

  .list-box {
    overflow-y: auto;
  }

  .authority {
    flex: auto;
    display: flex;
    flex-direction: column;
    &::v-deep {
      .header {
        flex: none;
        margin-bottom: 12px;
      }
      .body {
        flex: auto;
        height: 100px;
        overflow-x: hidden;
        overflow-y: auto;
      }
    }
  }
}

.box {
  padding: 0;

  &::v-deep .title {
    font-size: 18px;
    font-weight: 700;
  }

  .outer-box {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
}

::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}

.fxied {
  position: absolute;
  bottom: 24px;
}
</style>
