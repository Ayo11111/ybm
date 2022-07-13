<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-08 13:42:35
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-01 15:13:52
-->
<template>
  <div>
    <div style="text-align: right" class="mb-12">单位：元</div>
    <a-table
      :loading="loading"
      :columns="columns"
      :data-source="bill"
      :pagination="false"
    >
      <div slot="type" slot-scope="scope">
        <span style="color: rgba(0, 153, 0, 0.647058823529412)">
          + {{ scope }}
        </span>
      </div>
      <template slot="action" slot-scope="scope">
        <div>
          <router-link
            :to="{
              path: `/bill/order/${storeId}/${scope.date}`,
              query: { type: financeType }
            }"
          >
            <el-button type="text"> 查 看 </el-button>
          </router-link>
          <div v-show="financeType === 'unclsd'" style="display: inline">
            <a-divider type="vertical" />
            <el-button type="text" @click="getDownloadFinance(scope)">
              下 载
            </el-button>
          </div>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { getStoreId } from '@/utils/auth'
import { fhGetDownloadFinance } from '@/api/finance'
export default {
  props: {
    data: {
      type: Array,
      default: () => []
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
    },
    loading: {
      type: Boolean,
      default: false
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
          dataIndex: '',
          scopedSlots: { customRender: 'action' },
          width: 300
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
      visible: false,
      detailData: {},
      detailLoad: false,
      storeId: null,
      bill: [],
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
        }
      },
      immediate: true,
      deep: true
    }
  },
  async created() {
    this.storeId = await getStoreId()
  },
  methods: {
    async getDownloadFinance(e) {
      const { date } = e
      const time = `${date}`
      const send = {
        startTime: time,
        endTime: time
      }
      this.btnLoad = true
      try {
        const { results } = await fhGetDownloadFinance(send)
        var eleLink = document.createElement('a')
        eleLink.download
        eleLink.href = results
        eleLink.click()
        eleLink.remove()
        this.$message.success('财务对账报表导出成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.btnLoad = false
    }
    // 比对数据是否一致
  }
}
</script>

<style scoped></style>
