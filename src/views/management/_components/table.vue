<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" :loading="loading">
    <div slot="edit" slot-scope="scope" style="display:flex;align-items: center;">
      <span style="margin-right: 5px">赞</span>
      <span style="color: rgba(0, 204, 0, 0.647058823529412);font-size: 24px">{{scope.upCount}}</span>
      <span style="margin: 0 5px">踩</span>
      <span style="color: rgba(255, 51, 51, 0.647058823529412);font-size: 24px">{{scope.downCount}}</span>
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
          dataIndex: 'rankNum',
          title: '排名'
        },
        {
          dataIndex: 'foodName',
          title: '商品'
        },
        {
          dataIndex: 'salesFee',
          title: '销售额'
        },
        {
          dataIndex: 'sales',
          title: '销量'
        },
        {
          dataIndex: '',
          title: '评价',
          scopedSlots: { customRender: 'edit' }
        }
      ]
    }
  }
}
</script>

<style></style>
