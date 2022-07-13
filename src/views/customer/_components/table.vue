<template>
  <a-table :columns="columns" :data-source="data" :pagination="false" :loading="loading"> </a-table>
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
        {
          dataIndex: 'oneCount',
          title: '1星评价数'
        },
        {
          dataIndex: 'towCount',
          title: '2星评价数'
        },
        {
          dataIndex: 'threeCount',
          title: '3星评价数'
        },
        {
          dataIndex: 'fourCount',
          title: '4星评价数'
        },
        {
          dataIndex: 'fiveCount',
          title: '5星评价数'
        },
        {
          dataIndex: 'score',
          title: '商家评分',
          slots: { title: 'customTitle' }
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
      ]
    }
  }
}
</script>

<style></style>
