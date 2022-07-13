<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-03-05 17:55:13
 * @LastEditors: CJH
 * @LastEditTime: 2021-03-06 09:38:08
-->
<template>
  <a-table
    :data-source="data"
    :pagination="false"
    :loading="loading"
  >
    <a-table-column key="" title="商品名称" data-index="foodName" />
    <a-table-column key="" title="原价" data-index="" />
    <a-table-column key="" title="分类" data-index="" />
    <a-table-column key="" title="菜品活动价格" data-index="" />
    <a-table-column key="">
      <div slot="title">
        <span style="margin-right: 5px">菜品数量</span>
        <a-icon type="info-circle" />
      </div>
    </a-table-column>
    <a-table-column key="" title="操作" data-index="" />
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
          dataIndex: '',
          title: '商品名称'
        },
        {
          dataIndex: '',
          title: '原价'
        },
        {
          dataIndex: '',
          title: '分类'
        },
        {
          dataIndex: '',
          title: '菜品活动价格'
        },
        {
          dataIndex: '',
          title: '菜品数量'
        },
        {
          dataIndex: '',
          title: '操作',
          scopedSlots: { customRender: 'edit' }
        }
      ]
    }
  }
}
</script>

<style></style>
