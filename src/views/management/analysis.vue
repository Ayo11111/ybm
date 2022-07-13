<template>
  <div>
    <div class="container" style="min-height: 0;margin-bottom: 0">
      <span style="margin-right: 5px">选择要查看的店铺：</span>
      <el-button
        :loading="loading"
        :type="currentType === 'all' ? 'primary' : ''"
        @click="allStore"
      >全部店铺</el-button>
      <template>
        <el-button
          :loading="loading"
          :type="currentType === 'part' ? 'primary' : ''"
          @click="visible = true"
        >自定义店铺</el-button>
        <span v-if="SelectStoreID.length>0" style="margin-left:10px;color:#52ACFF;vertical-align: bottom">已选{{ SelectStoreID.length }}家店铺</span>
      </template>
    </div>
    <div class="container">
      <div class="top">
        <div>
          <b style="font-size: 18px;">商品数据</b>
          <el-radio-group v-model="day" style="margin: 0 16px" @change="getday">
            <el-radio-button label="1">昨日</el-radio-button>
            <el-radio-button label="2">近7日</el-radio-button>
            <el-radio-button label="3">近30日</el-radio-button>
            <el-radio-button label="4">自定义</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-show="day === '4' ? true : false"
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="margin-right: 16px;width: 240px"
            @change="getDate"
          />
          <el-input
            v-model="Json['foodName']"
            placeholder="请输入菜品名称"
            class="input-with-select"
            style="width: 200px"
            @blur="search"
          >
            <i
              slot="suffix"
              class="el-icon-search el-input__icon"
              style="cursor: pointer;"
              @click="search"
            />
          </el-input>
        </div>
        <el-button
          type="primary"
          :loading="loading || btnLoad"
          @click="getFoodAnalyzeExcel"
        >报表下载</el-button>
      </div>
      <div class="head">
        <span>
          商品销售额
          <i
            class="el-icon-d-caret"
            :class="{ active: index === 1 }"
            @click="getSort(1)"
          /></span>
        <span>销售量<i
          class="el-icon-d-caret"
          :class="{ active: index === 2 }"
          @click="getSort(2)"
        /></span>
        <span>赞<i
          class="el-icon-d-caret"
          :class="{ active: index === 3 }"
          @click="getSort(3)"
        /></span>
        <span>踩<i
          class="el-icon-d-caret"
          :class="{ active: index === 4 }"
          @click="getSort(4)"
        /></span>
      </div>
      <Table style="margin-top: 20px" :data="data" :loading="loading" />
      <Pagination :total="total" @pagination="pagination" />
    </div>
    <SelectStore :visible.sync="visible" @relationList="individual" />
  </div>
</template>

<script>
import SelectStore from '@/components/SelectStore'
import Pagination from '@/components/Pagination'
import Table from './_components/table'
import { fhGetFoodAnalyze, fhGetFoodAnalyzeExcel } from '@/api/management'
import { getUserInfo } from '@/utils/auth'
import { downloadFile } from '@/utils/download'
export default {
  components: {
    SelectStore,
    Pagination,
    Table
  },
  data() {
    return {
      SelectStoreID: [],
      currentType: 'all',
      visible: false,
      day: 1,
      date: null,
      index: 1,
      Json: {
        startTime: this.$moment()
          .subtract('days', 2)
          .format('YYYY-MM-DD'),
        endTime: this.$moment()
          .subtract('days', 1)
          .format('YYYY-MM-DD'),
        sortType: 1,
        storeIds: null,
        merchantId: null
      },
      loading: false,
      Time: [
        '',
        [
          this.$moment()
            .subtract('days', 2)
            .format('YYYY-MM-DD'),
          this.$moment()
            .subtract('days', 1)
            .format('YYYY-MM-DD')
        ],
        [
          this.$moment()
            .subtract('days', 7)
            .format('YYYY-MM-DD'),
          this.$moment()
            .subtract('days', 1)
            .format('YYYY-MM-DD')
        ],
        [
          this.$moment()
            .subtract('days', 30)
            .format('YYYY-MM-DD'),
          this.$moment()
            .subtract('days', 1)
            .format('YYYY-MM-DD')
        ]
      ],
      data: [{}],
      total: 0,
      btnLoad: false
    }
  },
  created() {
    window.app = this
    this.userInfo()
  },
  mounted() {
    this.getFoodAnalyze(this.Json)
  },
  methods: {
    async getFoodAnalyze(params) {
      this.loading = true
      try {
        const { results, count } = await fhGetFoodAnalyze(params)
        this.data = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async getFoodAnalyzeExcel() {
      this.btnLoad = true
      try {
        const results = await fhGetFoodAnalyzeExcel(this.Json)
        var uint8_msg = new Uint8Array(results)
        var decodedString = String.fromCharCode.apply(null, uint8_msg)
        if (decodedString.indexOf('success') !== -1) {
          var decoded = decodeURIComponent(escape(decodedString))
          var data = JSON.parse(decoded)
          this.$message.error(data.message)
        } else {
          downloadFile(results, '商品分析报表')
          this.$message.success('报表下载成功')
        }
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    async userInfo() {
      try {
        const info = await getUserInfo()
        const obj = eval('(' + info + ')')
        this.Json['merchantId'] = obj.merchantId
      } catch (err) {
        console.log(err)
      }
    },
    allStore() {
      this.currentType = 'all'
      this.SelectStoreID = []
      this.Json['storeIds'] = null
      this.getFoodAnalyze(this.Json)
    },
    individual(name, id) {
      this.SelectStoreID = id
      id = id.join(', ')
      this.Json['storeIds'] = id
      this.currentType = 'part'
      this.getFoodAnalyze(this.Json)
    },
    getday(val) {
      if (val !== '4') {
        this.Json['startTime'] = this.Time[val][0]
        this.Json['endTime'] = this.Time[val][1]
        this.getFoodAnalyze(this.Json)
      }
    },
    getDate(val) {
      if (val) {
        this.Json['startTime'] = val[0]
        this.Json['endTime'] = val[1]
        this.getFoodAnalyze(this.Json)
      }
    },
    getSort(val) {
      this.index = val
      this.Json['sortType'] = val
      this.getFoodAnalyze(this.Json)
    },
    pagination(val) {
      const params = Object.assign(val, this.Json)
      this.getFoodAnalyze(params)
    },
    search() {
      if (this.Json['foodName'] === '') {
        this.Json['foodName'] = null
      }
      this.getFoodAnalyze(this.Json)
    }
  }
}
</script>

<style scoped lang="scss">
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.head {
  margin-top: 40px;
  span {
    margin-right: 50px;
    i:hover {
      color: #52ACFF;
      cursor: pointer;
    }
    .active {
      color: #52ACFF;
    }
  }
}
</style>
