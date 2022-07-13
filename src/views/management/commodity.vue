<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-20 02:21:43
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-26 14:49:01
-->
<template>
  <div v-loading="loading" class="container">
    <!-- 选择时间 -->
    <div class="mb-12">
      <ranger-time
        ref="rangerTime"
        use-fast
        use-custom
        fast-position="left"
        format-str="YYYY-MM-DD"
        :fast-config="timeConfig"
        :start.sync="query.startTime"
        :end.sync="query.endTime"
      />
      <div v-show="query.startTime" style="margin-top: 6px">
        已选时间：{{ selectTime }}
      </div>
    </div>
    <!-- 下载按钮 -->
    <div>
      <router-link :to="{ path: '/management/download' }">
        <el-button type="text">下载报表</el-button>
      </router-link>
    </div>
    <el-table border :data="commodity" @sort-change="sortChange">
      <el-table-column label="排名" type="index" width="80px" />
      <el-table-column :label="isRestaurant ? '商品图片' : '护工头像'">
        <template slot-scope="{ row: { image } }">
          <el-image
            style="width: 100px; height: 100px"
            :src="image"
            :preview-src-list="[image]"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="isRestaurant ? '商品名称' : '护工名称'"
        prop="name"
      />
      <el-table-column
        :label="isRestaurant ? '销售额' : '陪护费用'"
        prop="price"
        sortable
      >
        <template #header>
          <span>{{ isRestaurant ? '销售额' : '陪护费用' }}</span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="`统计时间内，“下单且未取消订单”中该${
              isRestaurant ? '商品原价' : '护工的陪护费用'
            }`"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :label="isRestaurant ? '销量' : '陪护天数'"
        prop="sales"
        sortable
      >
        <template #header>
          <span>
            {{ isRestaurant ? '销量' : '陪护天数' }}
          </span>
          <el-tooltip
            class="item"
            effect="dark"
            :content="`统计时间内，“下单且未取消订单”中该${
              isRestaurant ? '商品销售份数' : '护工陪护天数'
            }`"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" v-bind="query" @pagination="pagination" />
  </div>
</template>

<script>
import RangerTime from '@/components/RangerTime'
import Pagination from '@/components/Pagination'
import { fhGetCommodityStatistics } from '@/api/management'
import { deepClone } from '@/utils'
import mixin from './_mixin'
export default {
  name: 'Commodity',
  components: { RangerTime, Pagination },
  mixins: [mixin],
  data() {
    return {
      commodity: [],
      query: null,
      total: 0,
      loading: false,
      timeConfig: [
        {
          label: '今日实时',
          day: 'today'
        },
        {
          label: '昨天',
          day: 0
        },
        {
          label: '近7天',
          day: 6
        },
        {
          label: '近30天',
          day: 29
        }
      ]
    }
  },
  computed: {
    // 已经选择的时间
    selectTime() {
      const { startTime, endTime } = this.query
      return startTime === endTime ? startTime : `${startTime} 至 ${endTime}`
    }
  },
  watch: {
    query: {
      handler(query) {
        query && this.getCommodityStatistics(query)
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    const moment = this.$moment
    const startTime = moment().format('YYYY-MM-DD')
    const endTime = startTime
    this.query = {
      startTime,
      endTime,
      pageNumber: 1,
      pageSize: 10
    }
    this.$nextTick(() => {
      this.getCommodityStatistics(this.query)
    })
  },
  mounted() {
    this.$refs.rangerTime.currBtn = 'today'
  },
  methods: {
    // 获取商品分析数据
    async getCommodityStatistics(send) {
      this.loading = true
      try {
        send = {
          ...send,
          startTime: send.startTime + ' 00:00:00',
          endTime: send.endTime + ' 23:59:59'
        }
        const { results, count } = await fhGetCommodityStatistics(send)
        this.total = count
        this.commodity = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 排序
    sortChange({ column, prop, order }) {
      const key = prop === 'price' ? 'priceAsc' : 'saleAsc'
      let send = order !== null ? { [key]: order === 'ascending' } : {}
      // eslint-disable-next-line no-unused-vars
      const { priceAsc, saleAsc, ...query } = deepClone(this.query)
      send = {
        ...query,
        ...send
      }
      this.$nextTick(() => {
        this.getCommodityStatistics(send)
      })
    },
    // 切换页码
    pagination(val) {
      this.query = {
        ...this.query,
        ...val
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #fff !important;
  margin: 12px 0 0;
  padding: 24px !important;
  min-height: auto;
}
</style>
