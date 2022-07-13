<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" row-key="id">
    <div slot="edit" slot-scope="scope">
      <a type="primary" :href="scope.downloadUrl" download>
        <el-link type="primary" :underline="false">下载</el-link>
      </a>
    </div>
  </a-table>
</template>

<script>
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
          title: '账单周期',
          dataIndex: 'billCycle'
        },
        {
          title: '相关店铺',
          dataIndex: 'storeName'
        },
        {
          title: '操作时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: '',
          scopedSlots: { customRender: 'edit' }
        }
      ]
    }
  }
}
</script>

<style></style>
