<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-10 10:17:40
 * @LastEditors: HJ
 * @LastEditTime: 2020-09-01 13:32:55
-->
<template>
  <a-table :columns="columns" :data-source="data" :pagination="false">
    <div slot="status" slot-scope="scope">
      {{ orderStatusJson[scope] }}
    </div>
  </a-table>
</template>

<script>
import { orderStatusMap } from '../_utils'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          dataIndex: 'orderStatus',
          title: '操作类型',
          scopedSlots: { customRender: 'status' }
        },
        {
          dataIndex: 'operationTime',
          title: '操作时间'
        },
        {
          dataIndex: 'duration',
          title: '耗时'
        }
      ],
      orderStatusJson: {}
    }
  },
  created() {
    orderStatusMap.forEach(item => {
      this.orderStatusJson[item[0]] = item[1]
    })
  }
}
</script>

<style></style>
