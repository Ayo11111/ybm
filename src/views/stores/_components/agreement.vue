<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-26 14:12:37
 * @LastEditors: HJ
 * @LastEditTime: 2021-08-18 19:37:44
-->
<template>
  <div class="container">
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :pagination="false"
    >
      <div slot="type">
        <span>医便民平台与客户合同</span>
      </div>
      <div slot="edit" slot-scope="scope">
        <a-button type="link" @click="look(scope.contractUrl)">查看</a-button>
      </div>
    </a-table>
  </div>
</template>

<script>
import { fhGetMerchantDetail } from '@/api/merchant'
import { getUserInfo } from '@/utils/auth'
export default {
  data() {
    return {
      data: [],
      total: 0,
      loading: false,
      columns: [
        {
          title: '合同类型',
          dataIndex: '',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '状态',
          dataIndex: 'isContractOverdue',
          customRender: (text, item) => {
            const { contractEndTime } = item
            const flag = this.$moment().isBefore(this.$moment(contractEndTime))
            return flag ? '生效中' : '已失效'
          }
        },
        {
          title: '截止时间',
          dataIndex: 'contractEndTime'
        },
        {
          title: '操作',
          dataIndex: '',
          scopedSlots: { customRender: 'edit' }
        }
      ]
    }
  },
  async created() {
    const { merchantId } = await getUserInfo()
    this.getMerchantDetail(merchantId)
  },
  methods: {
    async getMerchantDetail(merchantId) {
      this.loading = true
      try {
        const { results } = await fhGetMerchantDetail(merchantId)
        this.data = [results]
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    look(url) {
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      a.click()
    },
    download(url) {
      const a = document.createElement('a')
      a.href = url
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a) // 移除a元素
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  margin: 0;
  min-height: 0;
}
</style>
