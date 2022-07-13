<template>
  <div>
    <div v-loading="loadingCoupon" class="container" style="min-height: 0">
      <el-form>
        <el-form-item label="活动名称:" style="margin-bottom: 10px">
          {{ reduction.activityName }}
        </el-form-item>
        <el-form-item label="活动状态:" style="margin-bottom: 10px">
          <a-badge
            :status="
              ['', 'processing', 'success', 'error'][reduction.actStatus]
            "
            :text="['', '待开始', '进行中', '已结束'][reduction.actStatus]"
          />
        </el-form-item>
        <el-form-item label="活动内容:" style="margin-bottom: 0">
          {{ reduction.summary }}
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="loadingCoupon" class="container">
      <el-tabs v-model="tab">
        <el-tab-pane label="活动效果" name="errect">
          <effect :data="reduction" :active-id="id" />
        </el-tab-pane>
        <el-tab-pane label="活动规则" name="rule">
          <rule :data="reduction" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { fhOverflowDetail } from '@/api/marketing/reduction'
import { removeLocalStorage } from '@/utils/localstorage'
import { fhGetStoreNameList } from '@/api/stores/index.js'
import effect from './component/effect.vue'
import rule from './component/rule.vue'
import { arraysMap } from '@/utils'
export default {
  components: {
    effect,
    rule
  },
  data() {
    return {
      tab: 'errect',
      paneList: [{ label: '累计效果数据' }],
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
  mounted() {
    window.app = this
    this.id = this.$route.params.id
    this.getDetail()
  },
  methods: {
    handelTabC(el) {},
    // 请求详情
    async getDetail() {
      this.loadingCoupon = true
      try {
        const { results } = await fhOverflowDetail(this.id)
        const store = await fhGetStoreNameList({
          storeIdList: results.storeIdList.join(',')
        })
        this.reduction = results
        const sou = results.weekCycle.split('').reverse()
        results.weekCycleArr = arraysMap(undefined, sou, '1')
        this.storeNameList = store
      } catch (e) {
        console.log(`e:${e}`)
      }
      this.loadingCoupon = false
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
    background: #fff;
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
.detail-content {
  color: #797979;
}
</style>
