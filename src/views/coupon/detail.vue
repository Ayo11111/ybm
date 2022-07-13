<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-03 14:51:01
 * @LastEditors: HJ
 * @LastEditTime: 2020-12-30 14:36:19
-->
<template>
  <div class="container">
    <div class="content">
      <div
        v-loading="loadingCoupon"
        style="min-height:355px;margin-bottom:20px"
      >
        <div class="coupon-rapper">
          <CouponForBlank :coupon="coupon" />
          <!-- <div v-if="coupon.type===1">
            <CouponForFood :coupon="coupon" />
          </div>
          <div v-if="coupon.type===2">
            <CouponForMoney :coupon="coupon" />
          </div> -->
        </div>
        <div>
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            label-width="96px"
            class="demo-form"
            disabled
          >
            <el-row class="detail-row">
              <el-col>
                <el-form-item label="状态:">
                  <span v-if="coupon.disable === 1">禁用中</span>
                  <span v-else style="color:#52ACFF">启用中</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="优惠券类型:">
                  <span>{{ coupon.type === 2 ? '代金券' : '单品券' }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="互斥规则:">
                  <span>与满减活动{{ coupon.reduceCoexistFlag ? '' : '不' }}同享</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="适用店铺:">
                  <span>{{
                    coupon.ruleSummary
                      ? coupon.ruleSummary.slice(5, coupon.ruleSummary.length)
                      : ''
                  }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="已领取数量:">
                  <span>{{ coupon.sendNum }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="剩余数量:">
                  <span style="margin-right:20px">{{ coupon.stock }}</span>
                  <el-form
                    v-if="stockVisible"
                    :model="stockForm"
                    :rules="rules"
                    style="display:inline-block"
                  >
                    <el-form-item prop="stock">
                      <el-input-number
                        ref="input"
                        v-model="stockForm.stock"
                        style="min-width:13em"
                        placeholder="请输入大于等于1的整数"
                        :min="1"
                        :precision="0"
                        :controls="false"
                        size="small"
                        @change="changeStockCount"
                      />
                      <el-button
                        size="small"
                        @click="cancleStock"
                      >撤销</el-button><el-button
                        v-loading="loadingSaveStock"
                        size="small"
                        type="primary"
                        @click="saveStock"
                      >保存</el-button>
                    </el-form-item>
                  </el-form>
                  <span
                    v-if="!stockVisible"
                    class="edit-item"
                    @click="changeStock"
                  >增加库存</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 数据统计 -->
      <el-tabs
        v-if="false"
        v-loading="loadingEffect"
        type="border-card"
        @tab-click="handelTabC"
      >
        <el-tab-pane label="累计效果数据">
          <div class="tab">
            <div class="tab-header">活动效果数据</div>
            <div class="tab-main">
              <el-row :gutter="30">
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动营业额
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的营业额"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.sumOfBusiness }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动订单数
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的订单数"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.orderNumber }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      平均客单价
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="所有订单的平均价格"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.averageCustomerPrice }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="昨日">
          <div class="tab">
            <div class="tab-header">活动效果数据</div>
            <div class="tab-main">
              <el-row :gutter="30">
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动营业额
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的营业额"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.sumOfBusiness }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动订单数
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的订单数"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.orderNumber }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      平均客单价
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="所有订单的平均价格"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.averageCustomerPrice }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="近7天">
          <div class="tab">
            <div class="tab-header">活动效果数据</div>
            <div class="tab-main">
              <el-row :gutter="30">
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动营业额
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的营业额"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.sumOfBusiness }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动订单数
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的订单数"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.orderNumber }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      平均客单价
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="所有订单的平均价格"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.averageCustomerPrice }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="近30天">
          <div class="tab">
            <div class="tab-header">活动效果数据</div>
            <div class="tab-main">
              <el-row :gutter="30">
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动营业额
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的营业额"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.sumOfBusiness }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      活动订单数
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="优惠券产生的订单数"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.orderNumber }}
                    </div>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="tab-item">
                    <div class="tab-item-title">
                      平均客单价
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="所有订单的平均价格"
                        placement="top-start"
                      >
                        <img src="@/assets/img/question.png" alt width="14">
                      </el-tooltip>
                    </div>
                    <div class="tab-item-detail">
                      ￥{{ effectData.averageCustomerPrice }}
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <a-divider />
      <div>
        <router-link :to="{ name: 'listCoupon' }">
          <el-button type="primary">返回列表</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { fhCouponDetail, fhCouponStock } from '@/api/marketing/coupon'
import { removeLocalStorage } from '@/utils/localstorage'
// import CouponForFood from '@/views/component/CouponForFood'
// import CouponForMoney from '@/views/component/CouponForMoney'
import CouponForBlank from '@/views/component/CouponForBlank'

export default {
  components: {
    CouponForBlank
    // CouponForFood,
    // CouponForMoney
  },
  data() {
    return {
      coupon: {},
      loadingSaveStock: false,
      stockForm: {
        stock: 1
      },
      rules: {
        stock: [{ required: true, message: '请输入增加的数量' }]
      },
      stockVisible: false,
      // 菜品
      foodsOptions: '',
      loadingSku: false,
      loadingCoupon: false,
      loadingEffect: false,
      id: '',
      skuOptions: '',
      allStore: '',
      loadingDetail: false, // 初始loading
      loadingStore: false,
      storeId: [],
      effectData: {},
      storeOptions: [],
      form: {
        name: '', // 名称
        applicableStoreIds: '', // 适用店铺
        isAllApplicableStore: '', // 是否全部店铺适用
        distributableQuantity: '', // 可发放总量
        applicableScene: [], // 使用场景
        isAllApplicableScene: '', // 是否全部场景适用 ,
        priceThreshold: '', // 价格门槛
        reductionAmount: '', // 减免金额
        validDay: '', // 有效天数
        isLimitGrantNum: '', // 是否限制领取次数 ,
        limitGrantNum: '' // 限制领取次数 ,
      }
    }
  },
  mounted() {
    window.app = this
    this.id = this.$route.params.id
    this.getCouponDetailData()
    // this.getCouponEffectData(0)
  },
  methods: {
    changeStockCount(v) {
      // console.log(v)
    },
    // 增加库存
    changeStock() {
      this.stockVisible = true
    },
    cancleStock() {
      this.stockForm.stock = 1
      this.stockVisible = true
      this.stockVisible = false
    },
    saveStock() {
      this.loadingSaveStock = true
      this.$refs.form.validate(async valid => {
        if (valid) {
          const id = this.$route.params.id
          const params = { stock: this.stockForm.stock }
          try {
            await fhCouponStock(id, params)
            this.$message({ type: 'success', message: '增加库存成功' })
            this.coupon.stock += this.stockForm.stock
            this.stockVisible = false
            this.stockForm.stock = 1
          } catch (e) {
            this.$message({ type: 'error', message: '增加库存失败' })
          }
        } else {
          return
        }
      })
      this.loadingSaveStock = false
    },
    handelTabC(el) {
      console.log(el)
      switch (el.index) {
        case '0': // 发起累计数据
          this.getCouponEffectData(0)
          break
        case '1': // 发起昨日
          this.getCouponEffectData(1)
          break
        case '2': // 发起近7天
          this.getCouponEffectData(2)
          break
        case '3': // 发起近3天
          this.getCouponEffectData(3)
      }
    },
    // 菜品下拉框
    handelFoodVis() {},
    handelFoodChange() {},
    // 规格下拉
    handelSkuVis() {},
    handelSkuChange() {},
    // 下拉店铺
    handelStoreVis() {},
    handelStoreChange() {},
    // 请求优惠券详情
    async getCouponDetailData() {
      this.loadingCoupon = true

      const { results } = await fhCouponDetail(this.id)
      this.coupon = results
      // if (data.code === 200) {
      //   this.form = data.results

      //   if (this.form.isAllApplicableStore > 0) {
      //     // 所有店铺
      //     this.form.applicableStoreIds = ['all']
      //   } else {
      //     // 多个店铺
      //     this.form.applicableStoreIds =
      //       this.form.applicableStoreIds && this.form.applicableStoreIds.split(',').map(i => +i)
      //   }
      //   // 场景转换
      //   this.form.applicableScene =
      //     this.form.applicableScene && this.form.applicableScene.split(',').map(i => +i)
      // } else {
      //   this.$message({ type: 'error', message: data.message })
      // }
      this.loadingCoupon = false

      this.loadingDetail = false
    }
    // 优惠券累计效果数据
    // async getCouponEffectData(type) {
    //   this.loadingEffect = true
    //   const query = {
    //     id: this.id,
    //     type
    //   }
    //   const data = await getCouponEffect(this.id, query)
    //   if (data.code === 200) {
    //     this.effectData = data.results
    //   } else {
    //     this.$message.error(data.message)
    //   }
    //   this.loadingEffect = false
    // }
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
  background: #f0f2f5;
  min-height: calc(100vh - 84px);
  padding: 24px;
  .content {
    padding: 40px;
    background: #fff;
    .coupon-rapper {
      // display: inline-block;
      padding: 18px;
      background: #eee;
      // width: 352px;
      // height: 92px;
      margin-bottom: 32px;
    }
    .el-row {
      .left {
        color: #ffffff;
        height: 92px;
        width: 92px;
        text-align: center;
        border-radius: 6px 0 0 6px;
        .money {
          font-size: 32px;
          .icon {
            font-size: 20px;
            position: relative;
            top: 0;
          }
        }
        .reduction {
          line-height: 12px;
          font-size: 10px;
        }
      }
      .right {
        width: 260px;
        height: 92px;
        .detail {
          padding: 16px 24px;
          height: 92px;
          .name {
            font-size: 16px;
            color: #333333;
            font-weight: 560;
            margin-bottom: 10px;
          }
          .date {
            font-size: 12px;
          }
        }
      }
    }
  }
}
.el-form-item >>> label {
  font-weight: normal;
  color: #272727;
}
.el-tabs {
  margin-bottom: 20px;
}
.tab {
  color: #777683;
  padding: 0 14px;
}
.tab-header {
  margin-top: 25px;
  line-height: 16px;
  padding-left: 20px;
  height: 16px;
  border-left: 4px solid #a1a3b3;
  margin-bottom: 20px;
}

.tab-item {
  padding: 20px;
  background: #fafafa;
}
.tab-item-title {
  color: #626073;
  line-height: 26px;
}
.tab-item-detail {
  color: #272727;
  font-size: 20px;
  font-weight: 600;
}

.container >>> .el-input__inner,
.container >>> .el-radio__label,
.container >>> .el-select__tags-text {
  color: #333333 !important;
}
</style>
