<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-19 21:02:28
 * @LastEditors: CJH
 * @LastEditTime: 2021-08-23 13:47:25
-->
<template>
  <div class="container">
    <el-menu
      :default-active="activeMenu"
      class="el-menu"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="overview">总览</el-menu-item>
      <el-menu-item index="business">营业</el-menu-item>
      <el-menu-item index="commodity">
        {{ isRestaurant ? '商品' : '护工' }}
      </el-menu-item>
    </el-menu>

    <div>
      <overview
        v-if="activeMenu === 'overview'"
        key="overview"
        :type="merchantInfo.merchantManagerType"
      />
      <business
        v-if="activeMenu === 'business'"
        key="business"
        :type="merchantInfo.merchantManagerType"
      />
      <commodity
        v-if="activeMenu === 'commodity'"
        key="commodity"
        :type="merchantInfo.merchantManagerType"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import overview from './overview.vue'
import business from './business.vue'
import commodity from './commodity.vue'
export default {
  name: 'AnalysisIndex',
  components: { overview, business, commodity },
  data() {
    return {
      activeMenu: 'overview'
    }
  },
  created() {
    const { activeMenu } = this.$route.query
    if(activeMenu) {
      this.activeMenu = activeMenu
    }
  },
  computed: {
    ...mapGetters(['merchantInfo']),
    // 是否膳食商家或零售商家
    isRestaurant() {
      return ['retail', 'restaurant'].includes(
        this.merchantInfo.merchantManagerType
      )
    }
  },
  methods: {
    handleSelect(key) {
      this.activeMenu = key
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  background: transparent;

  .el-menu {
    padding: 0 24px;
  }

  .title {
    font-weight: 900;
    font-size: 22px;
  }
}
</style>
