<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-28 14:38:50
-->
<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="true"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :active="activeMenu"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { deepClone } from '@/utils'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      // routes: []
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'routers']),
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
    // routes() {
    //   return this.computedRoutes(this.$router.options.routes)
    // }
  },
  mounted () {
    this.$bus.$on('ChangeSidebar', ()=> {
      this.routes = this.computedRoutes(deepClone(this.routers))
      this.$forceUpdate()
    })
  },
  watch: {
    routers: {
      handler(routers) {
        this.routes = this.computedRoutes(deepClone(routers))
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    computedRoutes(routers) {
      const { orderMode, merchantInfo: { merchantManagerType }} = this.$store.getters

      const flagArr = ['retail', 'restaurant'].includes(merchantManagerType)
        ? ['护工']
        : ['预订单', '商品', '营销', '活动中心', '我的活动', '配送员']

      if (orderMode === 0) {
        flagArr.push('周预定')
      }

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
