<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-09-01 11:18:07
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-01 11:22:13
-->
<template>
  <div>
    <div style="text-align: right" class="mb-12">单位：元</div>
    <a-table
      :columns="columns"
      :data-source="data"
      :pagination="false"
      :loading="loading"
      row-key="id"
    >
      <div
        v-if="JSON.stringify(scope) !== '{}'"
        slot="action"
        slot-scope="scope"
      >
        <router-link
          :to="{
              path: `/bill/order/${storeId}/${scope.startDate}`,
              query: { type: financeType }
        }"
        >
          <a-button type="link"> 查 看 </a-button>
        </router-link>
      </div>
    </a-table>
  </div>
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
    },
    baseInfo: {
      type: Object,
      default: () => {
        return {}
      }
    },
    financeType: {
      type: String,
      default: 'clsd'
    }
  },
  data() {
    return {
      type: [
        '',
        '自配送',
        '顺丰配送',
        '蜂鸟配送',
        '餐道聚合配送',
        '达达',
        '闪送'
      ],
      columns: [
        {
          title: '时间',
          dataIndex: 'date',
          key: 'date'
        },
        {
          title: '账单金额',
          dataIndex: 'totalPrice',
          key: 'totalPrice'
        },
        {
          title: '操作',
          dataIndex: '',
          width: 100,
          scopedSlots: { customRender: 'action' }
        },
        {
          title: '账单金额',
          align: 'center',
          dataIndex: '',
          width: 300,
          customRender: (text, row, index) => {
            const { cycle = '', totalPrice } = this.baseInfo
            return {
              children: (
                <div style={{ textAlign: 'center' }}>
                  <div>{cycle.replace('~', ' 至 ')}</div>
                  <div>￥{totalPrice}</div>
                  <div
                    style={{
                      display: this.financeType === 'clsd' ? 'block' : 'none'
                    }}>
                    已汇入余额
                  </div>
                </div>
              ),
              attrs: {
                rowSpan: index === 0 ? 5 : 0
              }
            }
          }
        }
      ],
      visible: false,
      detailData: {},
      detailLoad: false
    }
  },
  methods: {}
}
</script>