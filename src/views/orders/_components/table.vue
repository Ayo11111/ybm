<template>
  <a-table :columns="columns" :data-source="data" :pagination="false">
    <div slot="status" slot-scope="scope">
      {{ scope }}
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
          dataIndex: 'progressName',
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
  }
}
</script>

<style></style>
