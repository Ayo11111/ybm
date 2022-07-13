<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-20 00:29:49
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-26 14:39:26
-->
<template>
  <el-table :data="source" border>
    <el-table-column
      label="排名"
      width="80px"
      type="index"
      :index="indexMethod"
    />
    <el-table-column
      :label="isRestaurant ? '商品名称' : '护工名称'"
      prop="name"
    />
    <el-table-column :label="isRestaurant ? '销售额' : '护理费用'" prop="price">
      <template slot="header">
        <span>{{ isRestaurant ? '销售额' : '护理费用' }}</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            isRestaurant
              ? '统计时间内，包含商品原价、包装费、自配送/跑腿配送的配送费'
              : '统计时间内，包含护工的总陪护费用'
          "
          placement="top"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </template>
    </el-table-column>
    <el-table-column :label="isRestaurant ? '销量' : '陪护天数'" prop="sales">
      <template slot="header">
        <span>{{ isRestaurant ? '销量' : '陪护天数' }}</span>
        <el-tooltip
          class="item"
          effect="dark"
          :content="
            isRestaurant
              ? '统计时间内，下单且未取消订单中该商品销售份数'
              : '统计时间内，下单且未取消订单中该护工陪护的天数'
          "
          placement="top"
        >
          <i class="el-icon-question" />
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import mixin from '../_mixin'
export default {
  name: 'RankTable',
  mixins: [mixin],
  props: {
    source: {
      type: Array,
      default: () => []
    },
    noStart: {
      type: Number,
      default: 1
    }
  },
  methods: {
    indexMethod(index) {
      return `NO.${index + this.noStart}`
    }
  }
}
</script>
