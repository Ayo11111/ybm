<template>
  <div class="container">
    <div class="content">
      <div
        v-loading="loadingCoupon"
      >
        <div v-if="reduction.activityId">
          <div class="couponList" style="padding:34px 24px 16px 24px;background:#eee;margin-bottom:20px">
            <el-row>
              <el-col v-for="(item,index) in reduction.couponTemplateList" :key="index" :xs="24" :sm="24" :md="12" :lg="8" :xl="8" style="margin-bottom:18px">
                <CouponForBlank :coupon="item" />
              </el-col>
            </el-row>
          </div>
          <el-form ref="form" label-width="" class="demo-form" disabled>
            <el-row class="detail-row">
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="活动名称:">
                  <span>{{ reduction.activityName }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="活动状态:">
                  <span v-if="reduction.upStatus" style="color:#52ACFF">启用中</span>
                  <span v-else>禁用中</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="活动时间:">
                  <span>{{ reduction.startTime }}</span><span v-if="reduction.activityId">~</span>
                  <span>{{ reduction.endTime }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="生效周期:">
                  <span v-if="reduction.weekCycleArr.length === 7">每天</span>
                  <template v-else>
                    <span
                      v-for="(item, index) in reduction.weekCycleArr"
                      :key="index"
                    >
                      <span v-if="index === reduction.weekCycleArr.length - 1">{{ item }}</span>
                      <span v-else>{{
                        item
                      }}、</span>
                    </span>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="生效时段:">
                  <span
                    v-if="reduction.allDayFlag"
                  >全天</span>
                  <span v-else>
                    <span
                      v-for="(item, index) in reduction.actPeriodReqList"
                      :key="index"
                    >
                      <template v-if="index===reduction.actPeriodReqList.length-1">
                        <span>{{ item.startTime }}至</span><span>{{ item.endTime }}</span>
                      </template>
                      <template v-else>
                        <span>{{ item.startTime }}至</span><span>{{ item.endTime }}、</span>
                      </template>
                    </span>
                  </span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="领取数量:">
                  <span>{{ reduction.receive }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="核销数量:">
                  <span>{{ reduction.used }}</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                <el-form-item label="限领次数:">
                  <span v-if="reduction.rule===1">每天可领取</span>
                  <span v-if="reduction.rule===2">活动内可领取</span>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item label="适用店铺:">
                  <template v-if="storeNameList.length>0">
                    <span v-for="(item,index) in storeNameList" :key="index" class="detail-content">
                      <span v-if="index===storeNameList.length-1">{{ item.name }}</span>
                      <span v-else>{{ item.name }}、</span>
                    </span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <a-divider dashed />
      <DataPane
        :data-source="reduction"
        :pane-list="paneList"
        :card-list="cardList"
      />
      <a-divider />
      <div>
        <el-button type="primary" @click="$router.go(-1)">返回列表</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fhInshopDetail } from '@/api/marketing/inshop'
import { removeLocalStorage } from '@/utils/localstorage'
import CouponForBlank from '@/views/component/CouponForBlank'
import { fhGetStoreNameList } from '@/api/stores/index.js'
import { arraysMap } from '@/utils'
import DataPane from '@/components/DataPane'
const cardList = [
  {
    label: '活动营业额',
    comment: null,
    icon: null,
    field: 'activityAllFee',
    prefix: '￥',
    suffix: null
  },
  {
    label: '活动订单数',
    comment: null,
    icon: null,
    field: 'activityOrderCount',
    prefix: '￥',
    suffix: null
  },
  {
    label: '平均客单价',
    comment: null,
    icon: null,
    field: 'avgTotalPrice',
    prefix: '￥',
    suffix: null
  },
  {
    label: '活动成本',
    comment: null,
    icon: null,
    field: 'activityCost',
    prefix: '￥',
    suffix: null
  }
]
const paneList = [{ label: '累计效果数据' }]
export default {
  components: {
    CouponForBlank, DataPane
  },
  data() {
    return {
      cardList,
      paneList,
      storeNameList: [],
      reduction: {},
      // 菜品
      loadingCoupon: false,
      loadingEffect: false,
      id: '',
      allStore: '',
      loadingDetail: false, // 初始loading
      loadingStore: false,
      storeId: [],
      effectData: {}
    }
  },
  computed: {
    weekValue() {
      if (!this.reduction.weekCycle) {
        return
      } else {
        var arr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].reverse()
        const source = this.reduction.weekCycle.split('')
        source.forEach((element, index) => {
          if (element === '0') {
            arr.splice(index, 1)
          }
        })
      }
      return arr
    }

  },
  mounted() {
    window.app = this
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    // 请求详情
    async getDetail() {
      this.loadingCoupon = true
      try {
        const { results } = await fhInshopDetail(this.id)
        const store = await fhGetStoreNameList({ storeIdList: results.storeIdList.join(',') })
        this.storeNameList = store
        const sou = results.weekCycle.split('').reverse()
        results.weekCycleArr = arraysMap(undefined, sou, '1')
        this.reduction = results
      } catch (e) {
        console.log(`e:${e}`)
      }

      this.loadingCoupon = false
      this.loadingDetail = false
    }
  },
  beforeRouteLeave(to, from, next) {
    // 是否跳转到特定的页面
    const flag = /couponList/.test(to.name)
    if (!flag) {
      // 否 清楚本地存储
      const key = ['currentPage', 'searchForm']
      removeLocalStorage(key)
    }
    next()
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: auto;
  .content {
    background: #fff
  }
}
.el-form-item >>> label {
  font-weight: normal;
  color: #272727;
}
.container >>> .el-input__inner,
.container >>> .el-radio__label,
.container >>> .el-select__tags-text {
  color: #333333 !important;
}
.detail-row span{
  color:#797979
}
</style>
