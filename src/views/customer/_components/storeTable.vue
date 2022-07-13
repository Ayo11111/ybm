<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :loading="loading"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      style="margin-bottom: 14px"
    >
    </a-table>
    <div class="bottom">
      <span style="color: #ccc">已选{{ selectedRowKeys.length }}个店铺</span>
      <Pagination :total="total" @pagination="getSotres"></Pagination>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      columns: [
        {
          dataIndex: 'city',
          title: '城市'
        },
        {
          dataIndex: 'storeName',
          title: '店铺名称'
        }
      ],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    getSotres(params) {
      this.$emit('getSotres', params)
    }
  }
}
</script>

<style scoped lang="scss">
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .mt-24 {
    margin-top: 0;
  }
}
</style>
