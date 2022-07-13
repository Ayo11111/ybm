<!--
 * @Descripttion: 
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-08 13:42:35
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-04 12:45:55
-->
<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" :loading="loading" row-key="id" />
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      columns: [
        {
          dataIndex: 'storeName',
          title: '店铺名称'
        },
        // {
        //   dataIndex: 'storeCity',
        //   title: '城市'
        // },
        // {
        //   dataIndex: 'storeManager',
        //   title: '店长'
        // },
        {
          dataIndex: 'memberCount',
          title: '成交客户数'
        },
        {
          dataIndex: 'rePurchaseMemberCount',
          title: '复购人数'
        },
        {
          dataIndex: 'oldNewPct',
          title: '新顾客占比'
        },
        {
          dataIndex: 'rePurchasePct',
          title: '复购率'
        }
      ]
    }
  }
}
</script>

<style></style>
