<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-25 15:12:00
 * @LastEditors: HJ
 * @LastEditTime: 2021-06-10 14:16:02
-->
<template>
  <a-table
    :columns="columns"
    :data-source="data"
    :pagination="false"
    :loading="loading"
    row-key="storeName"
  >
    <!-- <div slot="edit" slot-scope="scope, item">
      <router-link to="">
        <el-link
          type="primary"
          :underline="false"
          @click="enterStore(item.id)"
        >
          进入店铺
        </el-link>
      </router-link>
    </div> -->
  </a-table>
</template>

<script>
import { enterStore } from '@/utils/enter'
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
        {
          dataIndex: 'city',
          title: '所属城市'
        },
        {
          dataIndex: 'businessHoursStr',
          title: '营业时间'
        },
        {
          dataIndex: 'deliveryName',
          title: '配送方式'
        },
        {
          dataIndex: 'isBusiness',
          title: '营业状态'
        },
        {
          dataIndex: 'likePeopleNumber',
          title: '关注人数'
        },
        {
          dataIndex: 'score',
          title: '店铺评分'
        },
        {
          dataIndex: 'tasteScore',
          title: '口味评分'
        },
        {
          dataIndex: 'packageScore',
          title: '包装评分'
        },
        {
          dataIndex: 'deliveryScore',
          title: '配送评分'
        }
        // {
        //   dataIndex: '',
        //   title: '操作',
        //   scopedSlots: { customRender: 'edit' }
        // }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    enterStore
  }
}
</script>

<style></style>
