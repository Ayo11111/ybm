<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 11:35:52
 * @LastEditors: HJ
 * @LastEditTime: 2020-08-28 16:41:07
-->
<template>
  <el-row class="title" type="flex" align="middle" justify="space-between">
    <span>{{ name }}</span>
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
  </el-row>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb'
export default {
  components: { Breadcrumb },
  computed: {
    name() {
      return this.$route.meta.title
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  padding: 0 34px;
  background: #fff;
  height: 50px;
  border-top: 1px solid rgba(0, 21, 41, 0.08);
  span {
    font-size: 18px;
    font-weight: 600;
  }
  .breadcrumb-container {
    float: left;
  }
}
</style>
