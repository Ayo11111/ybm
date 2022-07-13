<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="false"
      :row-key="rowKey"
      :loading="loading"
    >
      <template slot="enterType" slot-scope="{enterType}">
        <span>{{ entype[enterType] }}</span>
      </template>
    </a-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      default: () => { return 'orderCount' }
    },
    loading: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default() {
        return [
          {
            title: '商家名称',
            dataIndex: 'merchantName',
            key: 'merchantName'
          },
          {
            title: '跳转进入小程序次数',
            dataIndex: 'enterCount',
            key: 'enterCount'
          },
          {
            title: '下单数',
            dataIndex: 'orderCount',
            key: 'orderCount'
          },
          {
            title: '下单率',
            dataIndex: 'orderPct',
            key: 'orderPct'
          }
        ]
      }
    }
  },
  data() {
    return {
      entype: {
        WECHAT_MP: '微信公众号进入',
        SEARCH: '搜索进入',
        SHARE: '分享进入',
        SCAN: '扫码进入',
        DROP_DOWN: '下拉进入',
        OTHER: '其他'
      }
    }
  }
}
</script>

<style scoped></style>
