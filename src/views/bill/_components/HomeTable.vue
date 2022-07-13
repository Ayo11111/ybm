<template>
  <a-table
    :columns="columns"
    :data-source="bill"
    :pagination="false"
    :loading="loading"
  >
    <div slot="edit" slot-scope="scope">
      <router-link
        :to="{
          path: `/bill/order/${storeId}/${scope.date}`,
          query: { type: financeType }
        }"
      >
        <el-link type="primary" :underline="false">查看</el-link>
      </router-link>
    </div>
  </a-table>
</template>

<script>
import { getStoreId } from '@/utils/auth'
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
      columns: [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time'
        },
        {
          title: '账单金额',
          dataIndex: 'totalPrice',
          key: 'totalPrice',
          customRender: totalPrice => '￥' + (totalPrice || 0)
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'edit' }
        },
        {
          title: '账单信息',
          align: 'center',
          dataIndex: 'settleAccountsStatus',
          customRender: (text, row) => {
            const { startTime, endTime, allPrice, rowSpan, expectedTime } = row
            return {
              children: (
                <div style={{ textAlign: 'center' }}>
                  <div style='display:flex; justify-content: center;'>
                    {startTime} <div style={{
                      display: endTime ? 'block' : 'none'
                    }}>至 {endTime}</div>
                  </div>
                  <div style='font-size: 21px;'>￥{allPrice}</div>
                  <div
                    style={{
                      display: this.financeType === 'clsd' ? 'block' : 'none'
                    }}>
                    已汇入余额
                  </div>
                  <div
                    style={{
                      display: this.financeType !== 'clsd' ? 'block' : 'none'
                    }}>
                    预计 { expectedTime } 入账
                  </div>
                </div>
              ),
              attrs: {
                rowSpan
              }
            }
          }
        }
      ],
      bill: [],
      storeId: null,
      changeDate: {
        '1': '星期一',
        '2': '星期二',
        '3': '星期三',
        '4': '星期四',
        '5': '星期五',
        '6': '星期六',
        '7': '星期日'
      }
    }
  },
  watch: {
    data: {
      handler(list) {
        if (list) {
          const temp = []
          list.forEach((item, k) => {
            const { billDetails, allPrice, startTime, endTime, expectedTime } = item
            if (billDetails) {
              billDetails.forEach((i, index) => {
                i.allPrice = allPrice
                i.startTime = startTime
                i.endTime = endTime
                i.expectedTime = expectedTime
                i.time = `${i.date} ${this.changeDate[i.dayOfWeek]}`
                if (index === 0) {
                  i.rowSpan = billDetails.length > 1 ? billDetails.length : 1
                } else {
                  i.rowSpan = 0
                }
                temp.push(i)
              })
            }
          })
          this.bill = temp
          console.log(this.bill, 'this.bill ')
        }
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    this.storeId = await getStoreId()
  }
}
</script>
