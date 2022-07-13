<template>
  <div>
    <div v-loading="loadingCoupon" class="container" style="min-height: 0">
      <el-form>
        <el-form-item label="活动名称:" style="margin-bottom: 10px">
          {{ reduction.activityName }}
        </el-form-item>
        <el-form-item label="活动状态:">
          <a-badge
            :status="
              ['', 'processing', 'success', 'error'][reduction.actStatus]
            "
            :text="['', '待开始', '进行中', '已结束'][reduction.actStatus]"
          />
        </el-form-item>
      </el-form>
      <el-table
        style="margin-bottom: 20px"
        :data="reduction.discountFoodTemplateRspList"
        :header-cell-style="$getRowClass"
      >
        <el-table-column label="商品名称" width="180" prop="name" />
        <el-table-column label="原价" prop="price" />
        <el-table-column label="分类" prop="categoryName" />
        <el-table-column label="折扣" prop="discount" />
        <el-table-column label="折后价" prop="discountPrice" />
        <el-table-column prop="" label="限购份数">
          <template slot-scope="{ row }">
            <span v-if="row.limitNumber === 0">不限购</span>
            <span v-else>{{ row.limitNumber }}</span>
          </template>
        </el-table-column>
      </el-table>
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
import { fhDiscountDetail } from '@/api/marketing/discount'
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
        var arr = [
          '周一',
          '周二',
          '周三',
          '周四',
          '周五',
          '周六',
          '周日'
        ].reverse()
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
        const { results } = await fhDiscountDetail(this.id)
        const store = await fhGetStoreNameList({
          storeIdList: results.storeIdList.join(',')
        })
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

.detail-row span {
  color: #797979;
}
</style>
