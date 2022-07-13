<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-26 11:04:09
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-13 16:36:05
-->
<template>
  <div v-loading="loading" class="container" style="display: flex;min-height: 0">
    <div class="menu">
      <a-menu :defaultSelectedKeys="[0]">
        <a-menu-item
          v-for="(item, index) in buttonArr"
          :key="index"
          v-show="!item.control || usableActivity.includes(item.id)"
          @click="toggleButton(item)"
        >
          {{ item.label }}
        </a-menu-item>
      </a-menu>
    </div>
    <div v-if="usableActivity.length > 0" style="max-width: 100%">
      <keep-alive>
        <component :is="current" />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import reduction from './reduction'
import delivery from './delivery'
import discount from './discount'
import inshop from './inshop'

import { fhGetMerActivity } from '@/api/merchant'

export default {
  components: {
    reduction,
    delivery,
    discount,
    inshop
  },
  data() {
    return {
      buttonArr: [
        // { label: '配送费减免', name: 'delivery', id: 1, control: true },
        { label: '满减活动', name: 'reduction', id: 3, control: true },
        { label: '折扣商品', name: 'discount', id: 4, control: true }
        // { label: '店内领券', name: 'inshop', id: 5, control: true }
      ],
      buttonArrB: [
        { label: '配送费减免', name: 'deliveryList', id: 1, control: true },
        { label: '满减活动', name: 'reductionList', id: 3, control: true },
        { label: '折扣商品', name: 'discountList', id: 4, control: true },
        { label: '店内领券', name: 'inshopList', id: 5, control: true }
      ],
      current: 'reduction',
      currentButton: 'reduction',
      usableActivity: [{}],
      loading: false
    }
  },
  created() {
    this.getMerActivity()
    window.app = this
  },
  methods: {
    toggleButton(item) {
      this.current = item.name
      this.currentButton = item.name
    },
    // 获取商家权限
    async getMerActivity() {
      this.loading = true
      try {
        const { results } = await fhGetMerActivity()
        this.usableActivity = results.filter(i => i.status).map(i => i.id)
        const curr = this.buttonArr.filter(i => i.id === this.usableActivity[0])
        curr.sort((a, b) => {
          return a > b
        })
        this.current = curr[0].name
        this.currentButton = curr[0].name
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #eeeeee;
  padding: 0;
}
.menu {
  width: 280px;
  padding: 10px 0;
  background: #ffffff;
  margin-right: 10px;
}
.button-d {
  text-align: center;
}
.button-a {
  padding: 12px 10px;
  display: inline-block;
  cursor: pointer;
  &:hover {
    color: #52acff;
  }
}
.actived {
  border-bottom: 2px solid #52acff;
}
</style>
