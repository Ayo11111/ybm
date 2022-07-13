<template>
  <div class="container">
    <div v-loading="loadingDetail">
      <div class="quan">
        <Quan
          :name="detail.name"
          :valid-day="detail.validPeriod"
          :start-time="detail.startTime"
          :end-time="detail.endTime"
          :threshold-status="detail.thresholdStatus"
          :price-threshold="detail.threshold"
          :reduction-amount="detail.value"
          :discount-value="detail.discountValue"
          coupon-type="MJQ"
        />
      </div>
      <div>
        <el-form
          ref="form"
          :model="form"
          label-width="100px"
          class="demo-form"
          disabled
        >
          <el-row class="detail-row">
            <el-col>
              <el-form-item label="状态:">
                <span v-if="detail.status">启用中</span>
                <span v-else style="color:#52ACFF">禁用中</span>
              </el-form-item>
            </el-col>
          </el-row>
          <div style="display: flex">
            <el-form-item label="成本费用:">
              <span>{{ detail.merchantCostStr }}</span>
            </el-form-item>
            <el-form-item label="互斥规则:" style="margin-left: 20px">
              <span>{{ detail.rulesStr }}</span>
            </el-form-item>
          </div>
          <!-- <el-row style="display: flex">
            <el-col>
              
            </el-col>
            <el-col>
              
            </el-col>
          </el-row> -->
        </el-form>
      </div>
      <a-divider dashed />

      <!-- 数据统计 -->
      <div class="tab">
        <div class="tab-header">券效果统计</div>
        <div class="statistics-box">
          <div
            class="statistics-item"
            v-for="(item, index) in statistics"
            :key="index"
          >
            <div class="itemBox">
              <div style="margin-bottom: 5px">
                <span>{{ item.title }}</span>
              </div>
              <b v-if="item.add" style="font-size: 22px">¥</b>
              <b>{{ detail[item.filed] || 0 }}</b>
            </div>
          </div>
        </div>
        <!-- <div class="tab-main">
          <el-row :gutter="30">
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <div class="tab-item">
                <div class="tab-item-title">
                  本商家核销券数量
                </div>
                <div class="tab-item-detail">
                  {{ detail.usedNum }}
                </div>
              </div>
            </el-col>
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <div class="tab-item">
                <div class="tab-item-title">
                  本商家承担成本
                </div>
                <div class="tab-item-detail">￥{{ detail.merchantCost }}</div>
              </div>
            </el-col>
            <el-col :sm="12" :md="8" :lg="6" :xl="4">
              <div class="tab-item">
                <div class="tab-item-title">
                  相关订单金额
                </div>
                <div class="tab-item-detail">￥{{ detail.totalOrderPrice }}</div>
              </div>
            </el-col>
          </el-row>
        </div> -->
      </div>
    </div>
    <a-divider />
    <div>
      <el-button type="primary" @click="$router.go(-1)">返回列表</el-button>
    </div>
  </div>
</template>

<script>
import Quan from '@/components/Quan'
import { fhPlatformCouponDetail } from '@/api/marketing/platform-coupon'

export default {
  components: {
    Quan
  },
  data() {
    return {
      detail: {},
      loadingEffect: false,
      loadingDetail: false,
      form: {},
      coupon: {},
      statistics: [
        {
          title: '本商家核销券数量',
          filed: 'usedNum'
        },
        {
          title: '本商家承担成本',
          filed: 'merchantCost',
          add: '￥'
        },
        {
          title: '相关订单金额',
          filed: 'totalOrderPrice',
          add: '￥'
        }
      ]
    }
  },

  mounted() {
    window.app = this
    this.id = this.$route.params.id
    this.getDetail()
  },

  methods: {
    async getDetail() {
      this.loadingDetail = true
      try {
        const { results } = await fhPlatformCouponDetail(this.id)
        this.detail = results
        // 处理互斥规则
        const { meetReduceExcludeFlag, merchantCouponExcludeFlag } = results
        const FlagList = [
          {
            field: 'meetReduceExcludeFlag',
            label: '与满减活动',
            value: meetReduceExcludeFlag
          },
          {
            field: 'merchantCouponExcludeFlag',
            label: '与商家优惠券',
            value: merchantCouponExcludeFlag
          }
        ]

        const rulesArr = FlagList.reduce((acc, cur, index) => {
          acc.push(`${cur.label}${cur.value ? '互斥' : '共享'}`)
          return acc
        }, [])
        this.$set(this.detail, 'rulesStr', rulesArr.join(' / '))
      } catch (e) {
        console.log(e)
      }
      this.loadingDetail = false
    }
  }
}
</script>

<style lang="scss" scoped>
.quan {
  margin-bottom: 20px;
}
.container >>> .el-input__inner,
.container >>> .el-radio__label,
.container >>> .el-select__tags-text {
  color: #333333 !important;
}
.statistics-box {
  display: flex;
  align-items: center;
  flex-flow: wrap;
  margin-top: 24px;
  .statistics-item {
    width: 213px;
    height: 118px;
    background: #f2f2f2;
    padding: 20px 30px;
    margin-right: 25px;
    position: relative;
    b {
      font-size: 24px;
    }
    .el-icon-info {
      margin-left: 8px;
    }
    .textBtn {
      position: absolute;
      right: 18px;
      bottom: 8px;
    }
  }
}
</style>
