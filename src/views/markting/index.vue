<template>
  <div class="container">
    <div class="left box" v-loading="loading">
      <b>营销活动</b>
      <div style="margin-top: 20px">活动中心</div>
      <div class="activityBox">
        <div
          class="item"
          v-for="(item, index) in marketList"
          :key="index"
          v-show="!item.control || usableActivity.includes(item.id)"
        >
          <router-link
            v-isManage:[ManageV]
            :to="{ name: item.routerLink }"
            tag="a"
            :class="item.routerLink"
          >
            <div class="wrapper">
              <img :src="item.img" alt="营销图片" style="width: 50px" />
              <div class="info">
                <div class="name">{{ item.name }}</div>
                <div class="illustration">{{ item.illustration }}</div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="right box">
      <div class="tabs" v-loading="headLoad">
        <div
          class="item"
          :class="{ active: active === index }"
          v-for="(item, index) in this.activityStatus"
          :key="index"
        >
          <span @click="setStatus(item.value, index)">
            {{ item.label }}({{ thatDayCount[item.filed] }})
          </span>
        </div>
      </div>
      <el-scrollbar
        class="scroll"
        style="flex: 1;height: 400px"
        v-loading="listLoad"
      >
        <div
          class="activityItem"
          v-for="(item, index) in data"
          :key="index"
          @click="
            $router.push({ path: `/${item.activityType == 3 ? 'reduction' : 'discount'}/detail/${item.activityId}` })
          "
        >
          <div class="head">
            <span>{{ item.activityName }}</span>
            <span>{{ typeText[item.activityType] }}</span>
          </div>
          <span class="body">优惠内容：{{ item.summary }}</span>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { fhGetMerActivity } from '@/api/merchant'
import { typeText } from './_utils'
import {
  fhGetActivityOptionList,
  fhGetActivityOptionListStats
} from '@/api/marketing'
import { getUserInfo } from '@/utils/auth'
var reduction = require('@/assets/img/reduction.png')
var paper = require('@/assets/img/paper.png')

export default {
  directives: {
    isManage(el, binding) {
      const arr = []
      if (arr.includes(el.classList[0])) {
        el.style.display = binding.arg
      }
    }
  },
  data() {
    const clickEvent = () => {
      this.$message({
        type: 'info',
        duration: 3000,
        message: '活动正在快马加鞭开发中，敬请期待！'
      })
    }
    return {
      typeText,
      ManageV: 'none',
      loading: false,
      active: 0,
      clickEvent,
      usableActivity: [],
      query: {
        activityTypeList: '3,4',
        thatDayStatus: 1,
        pageNumber: 1,
        pageSize: 999
      },
      data: [],
      thatDayCount: {},
      activityStatus: [
        {
          label: '当日结束',
          filed: 'thatDayEnd',
          value: 1
        },
        {
          label: '当日开始',
          filed: 'thatDayStart',
          value: 2
        },
        {
          label: '当日进行中',
          filed: 'thatDayRunning',
          value: 3
        }
      ],
      headLoad: false,
      listLoad: false,
      marketList: [
        // {
        //   name: '配送费减免',
        //   img: integral,
        //   illustration: '下单后可享受配送费减免优惠',
        //   routerLink: 'addDelivery',
        //   disabled: false,
        //   clickEvent: '',
        //   img_disabled: '',
        //   id: 1,
        //   control: true
        // },
        {
          name: '满减活动',
          img: reduction,
          illustration: '下单可享受满减优惠',
          routerLink: 'addFull',
          clickEvent: '',
          disabled: false,
          id: 3,
          control: true
        },
        {
          name: '折扣商品',
          img: paper,
          illustration: '购买指定商品可享受折扣优惠',
          routerLink: 'addDiscount',
          clickEvent: '',
          disabled: false,
          id: 4,
          control: true
        }
        // {
        //   name: '店内领券',
        //   img: coupon,
        //   illustration: '进入店铺后可领取代金券',
        //   routerLink: 'addInshop',
        //   disabled: false,
        //   clickEvent: '',
        //   img_disabled: '',
        //   id: 5,
        //   control: true
        // },
        // {
        //   name: '优惠券',
        //   img: coupon,
        //   illustration: '下单可享受满减优惠',
        //   routerLink: 'listCoupon',
        //   disabled: false,
        //   clickEvent: '',
        //   img_disabled: '',
        //   control: false
        // },
        // {
        //   name: '平台优惠券',
        //   img: coupon,
        //   illustration: '平台发放的优惠券',
        //   routerLink: 'platformCoupon',
        //   disabled: false,
        //   clickEvent: '',
        //   img_disabled: '',
        //   control: false
        // },
        // {
        //   name: '分众社群运营',
        //   img: group,
        //   illustration: '分众助力引流，推荐爆品进行社群营销',
        //   routerLink: 'Group',
        //   disabled: false,
        //   clickEvent: '',
        //   img_disabled: '',
        //   control: false
        // },
        // {
        //   name: '商家流量互助',
        //   img: merchant,
        //   illustration: '人人为我，我为人人团结合作共赢',
        //   routerLink: 'MerchantFlow',
        //   disabled: false,
        //   clickEvent: '',
        //   img_disabled: '',
        //   control: false
        // }

        // {
        //   name: '期待',
        //   img: '',
        //   illustration: '',
        //   routerLink: '',
        //   disabled: true,
        //   clickEvent: clickEvent,
        //   img_disabled: ''
        // }
      ]
    }
  },
  async created() {
    this.getMerActivity()
    const { merchantId } = await getUserInfo()
    this.query.merchantId = merchantId
  },
  mounted() {
    window.m = this
    this.getActivityOptionListStats()
    this.getActivityOptionList()
  },
  methods: {
    async getActivityOptionList() {
      this.listLoad = true
      try {
        const { results } = await fhGetActivityOptionList(this.query)
        this.data = results
      } catch (err) {
        console.log(err)
      }
      this.listLoad = false
    },
    async getActivityOptionListStats() {
      this.headLoad = true
      try {
        const { results } = await fhGetActivityOptionListStats(this.query)
        this.thatDayCount = results
      } catch (err) {
        console.log(err)
      }
      this.headLoad = false
    },
    // 获取商家权限
    async getMerActivity() {
      this.loading = true
      try {
        const { results } = await fhGetMerActivity()
        this.usableActivity = results.filter(i => i.status).map(i => i.id)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    setStatus(v, index) {
      this.active = index
      this.query.thatDayStatus = v
      this.getActivityOptionList()
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
  display: flex;
  background: #eee;
  .left {
    flex: 1;
    padding: 24px;
    b {
      font-size: 18px;
    }
    .activityBox {
      display: flex;
      flex-flow: wrap;
      .item {
        width: 300px;
        margin-right: 0px;
        .wrapper {
          padding: 24px;
          padding-left: 0;
          padding-right: 0;
          max-height: 97px;
          background: #ffffff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          .info {
            overflow: hidden;
            margin-left: 14px;
            .name {
              font-size: 15px;
              font-weight: 600;
              color: #272727;
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  }
  .right {
    width: 360px;
    margin-left: 15px;
    display: flex;
    flex-flow: column;
    .tabs {
      height: 42px;
      border-bottom: 1px solid #ccc;
      display: flex;
      .item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          cursor: pointer;
        }
      }
      .active {
        color: #52acff;
      }
    }
    .scroll {
      flex: 1;
      display: flex;
      flex-flow: column;
      .activityItem {
        width: 100%;
        padding: 5px 15px 5px 15px;
        margin: 15px 0;
        cursor: pointer;
        border-bottom: 1px solid #ccc;
        // margin-bottom: 20px;
        .head {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
        }
      }
      .activityItem:hover {
        background: rgba(242, 242, 242, 1);
      }
    }
  }
  .box {
    background: #fff;
    border-radius: 4px;
  }
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
