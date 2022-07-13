<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-14 01:18:37
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-16 17:04:57
-->
<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :loading="loading"
  >
    <div slot="edit" slot-scope="scope">
      <router-link :to="`/bill/index/${scope.date}`">
        <el-link type="primary" :underline="false">查看</el-link>
      </router-link>
    </div>
  </a-table>
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
          title: '时间',
          dataIndex: 'createTime'
        },
        {
          title: '金额',
          dataIndex: 'amount'
        },
        {
          title: '提现状态',
          dataIndex: 'status'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'edit' }
        }
      ]
    }
  }
}
</script>

<style></style>
