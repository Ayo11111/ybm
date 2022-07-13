<template>
  <div>
    <div class="top">
      <div class="info">
        人人为我，我为人人，团结合作打造餐饮人自身流量互助平台
      </div>
      <a-divider dashed="" />
      <div class="static">
        <div>
          <span class="text">公众号跳转数据</span>
        </div>
        <OffderDate :radio.sync="radio" :date.sync="date" />
      </div>
      <div class="content">
        <Tag
          v-loading="loadingHeader"
          :tag-list="tagList"
          :tag-data="tagData"
        />
      </div>
    </div>
    <div class="total">
      <div class="info">
        <span>此功能只针对参加流量互助商家，从公众号跳转进入时商家置顶且同时竞对商家将不在商家列表中展示。最多选择三家竞对商家！</span>
      </div>
      <div class="merchant">
        <el-form label-width="6em" label-suffix=":">
          <el-form-item label="竞对商家">
            <div x>
              <el-button
                type="primary"
                style="margin-right:10px"
                :loading="loadingMerchant"
                @click="dialogVisible = true"
              >
                选择商家</el-button>
              <span v-if="merchantList.length > 0">
                已选择{{ merchantList.length }} / 3 家商家</span>
              <span v-else>您可选择3家竞对商家</span>
              <el-row v-if="merchantList.length > 0" v-loading="loadingMerchant" style="margin-top:20px" :gutter="20">
                <el-col
                  v-for="(item, index) in merchantList"
                  :key="index"
                  :xs="12"
                  :sm="12"
                  :md="12"
                  :lg="6"
                  :xl="4"
                >
                  <div class="card">
                    <span>{{ item.name }}</span>
                  </div>
                </el-col></el-row>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <a-divider dashed />
      <div class="detail">
        <div class="title">
          <span class="text">流量互助订单统计</span>
        </div>
        <div class="date">
          <OffderDate :radio.sync="radioOrder" :date.sync="dateOrder" />
          <el-button type="primary" :loading="exportLoad" @click="getExcel">
            导出报表
          </el-button>
        </div>
        <div class="self">
          <OrderCard
            text="其他商家导流订单"
            info="通过其他商家公众号跳转进入小程序购买了本商家商品订单"
            :loading.sync="loadingSelf"
            :tag-list="tagSelfList"
            :tag-data="tagSelfData"
          />
        </div>
        <div class="other">
          <OrderCard
            text="帮助其他商家导流订单"
            info="通过本商家公众号进入小程序购买了其他商家商品订单"
            :loading.sync="loadingOther"
            :tag-list="tagOtherList"
            :tag-data="tagOtherData"
          />
        </div>
      </div>
      <SelectMerchant
        v-if="dialogVisible"
        :dialog-visible.sync="dialogVisible"
        :limit="3"
        :active="merchantList"
        :default-disabled-key="defaultDisabledKey"
        @relationList="SelectMerchant"
      />
    </div>
  </div>
</template>

<script>
import SelectMerchant from '@/components/SelectMerchant'
import OffderDate from '@/components/OfferDate'
import Tag from './_component/Tag'
import OrderCard from './_component/OrderCard'
import { getUserInfo } from '@/utils/auth'
import { fhGetMpHeader } from '@/api/merchant'
import { fhUpdateExcludeMerchant, fhGetExcludeMerchant, fhFlowExcel, fhHelpSelf, fhHelpOther } from '@/api/flow'
import { downloadFile } from '@/utils/download'

const tagList = [
  {
    label: '公众号跳转进入小程序次数',
    value: 'enterCount',
    field: 'enterCount',
    prefix: null,
    suffix: '次'
  },
  {
    label: '购买订单数',
    value: 'orderCount',
    field: 'orderCount',
    prefix: null,
    suffix: '笔'
  },
  {
    label: '下单率',
    value: 'orderPct',
    field: 'orderPct',
    prefix: null,
    suffix: null
  },
  {
    label: '购买自身订单',
    value: 'selfOrderCount',
    field: 'selfOrderCount',
    prefix: null,
    suffix: '笔'
  },
  {
    label: '购买其他商家订单',
    value: 'otherOrderCount',
    field: 'otherOrderCount',
    prefix: null,
    suffix: '笔'
  }
]
const tagSelfList = [
  {
    label: '订单数',
    value: 'orderCount',
    field: 'orderCount',
    prefix: null,
    suffix: '笔'
  },
  {
    label: '订单金额',
    value: 'orderPrice',
    field: 'orderPrice',
    prefix: '￥',
    suffix: null
  },
  {
    label: '支出佣金金额',
    value: 'profitsharingPrice',
    field: 'profitsharingPrice',
    prefix: '￥',
    suffix: null
  }
]
const tagOtherList = [
  {
    label: '订单数',
    value: 'orderCount',
    field: 'orderCount',
    prefix: null,
    suffix: '笔'
  },
  {
    label: '订单金额',
    value: 'orderPrice',
    field: 'orderPrice',
    prefix: '￥',
    suffix: null
  },
  {
    label: '获得佣金金额',
    value: 'profitsharingPrice',
    field: 'profitsharingPrice',
    prefix: '￥',
    suffix: null
  }
]
export default {
  components: {
    OffderDate,
    SelectMerchant,
    Tag,
    OrderCard
  },
  data() {
    return {
      defaultDisabledKey: [],
      radio: 1,
      date: null,
      radioOrder: 1,
      dateOrder: null,
      tagList: tagList,
      tagData: {},
      loadingOther: false,
      tagOtherList: tagOtherList,
      tagOtherData: {},
      merchantList: [],
      dialogVisible: false,
      loadingHeader: false,
      loadingMerchant: false,
      exportLoad: false,
      // 其他商家导流订单
      loadingSelf: false,
      tagSelfList: tagSelfList,
      tagSelfData: {}
    }
  },
  watch: {
    date: {
      handler(v) {
        if (v === null) {
          return
        }
        this.query = { startTime: v[0], endTime: v[1] }
        this.getHeader()
      }
    },
    dateOrder: {
      handler(v) {
        if (v === null) {
          return
        }
        this.queryOrder = { startTime: v[0], endTime: v[1] }
        this.getHelpSelf()
        this.getHelpother()
      }
    }
  },
  async created() {
    const { merchantId } = (await getUserInfo())
    this.defaultDisabledKey = [{ id: merchantId }]
  },
  mounted() {
    window.app = this
    this.getMerchant()
  },

  methods: {
    async getMerchant() {
      this.loadingMerchant = true
      try {
        const { results } = await fhGetExcludeMerchant()
        this.merchantList = results.map(el => { el.disabled = false; return el })
      } catch (error) {
        console.log('debug axios: ', error)
      }
      this.loadingMerchant = false
    },
    SelectMerchant(item, id, select) {
      this.merchantList = select
      this.updateMerchant()
    },
    async updateMerchant() {
      this.loadingMerchant = true
      try {
        await fhUpdateExcludeMerchant(this.merchantList)
        this.getMerchant()
        this.$message.success('成功设置竞对商家')
      } catch (error) {
        console.log('debug axios: ', error)
      }
      this.loadingMerchant = false
    },
    async getHeader() {
      this.loadingHeader = true
      try {
        const { results } = await fhGetMpHeader(this.query)
        this.tagData = results
      } catch (error) {
        console.log('debug axios: ', error)
      }
      this.loadingHeader = false
    },
    async getHelpSelf() {
      this.loadingSelf = true
      try {
        const { results } = await fhHelpSelf(this.queryOrder)
        this.tagSelfData = results
      } catch (error) {
        console.log('debug axios: ', error)
      }
      this.loadingSelf = false
    },
    async getHelpother() {
      this.loadingOther = true
      try {
        const { results } = await fhHelpOther(this.queryOrder)
        this.tagOtherData = results
      } catch (error) {
        console.log('debug axios: ', error)
      }
      this.loadingOther = false
    },
    // 导出excel
    async getExcel() {
      this.exportLoad = true
      try {
        const results = await fhFlowExcel(this.queryOrder)
        var uint8_msg = new Uint8Array(results)
        var decodedString = String.fromCharCode.apply(null, uint8_msg)
        if (decodedString.indexOf('success') !== -1) {
          var decoded = decodeURIComponent(escape(decodedString))
          var data = JSON.parse(decoded)
          this.$message.error(data.message)
        } else {
          const { startTime, endTime } = this.queryOrder
          downloadFile(results, `商家流量互助统计报表_${startTime}至${endTime}`)
          this.$message.success('商家流量互助统计报表导出成功')
        }
      } catch (e) {
        console.log('debug axios', e)
      }
      this.exportLoad = false
    }
  }
}
</script>

<style lang="scss" scoped>
.text {
  font-weight: 700;
  font-size: 20px;
}
.top,
.total {
  padding: 24px 34px;
  margin: 34px;
  background: #fff;
  border-radius: 5px;
  .merchant{
    margin-bottom: 46px;
  }
  .detail {
      margin-top: 30px;
    .title {
      margin-bottom: 20px;
      .text {
        @extend .text;
      }
    }
    .date {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .self{
      margin-bottom: 40px;
    }
  }
}
.total {
  .info {
    padding: 6px 12px;
    background: #e6f7ff;
    border: 1px solid #bae7ff;
    border-radius: 3px;
    color: #1890ff;
    margin-bottom: 20px;
  }
}
.static {
  display: flex;
  justify-content: space-between;
  margin-bottom: 26px;
}
::v-deep .el-col {
  margin-bottom: 16px;
}
.card {
  border-radius: 4px;
  background: #f7f8fa;
  color: #999999;
  padding: 0 10px;
}
</style>
