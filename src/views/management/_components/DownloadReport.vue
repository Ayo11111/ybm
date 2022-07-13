<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-21 11:40:57
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-26 17:02:45
-->
<template>
  <div class="container" style="min-height: 0; margin: 0; padding: 0">
    <div class="mb-24">
      <div style="margin-top: 22px">
        <span>选择日期：</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          @change="getDate"
        />
        <span style="margin-left: 15px; color: #999999">
          数据日期为下单日期，最长不超过31天
        </span>
      </div>
    </div>
    <div class="field-box">
      <template v-for="i in fields">
        <span :key="i">{{ i }}</span>
      </template>
    </div>
    <el-button
      :loading="btnLoad"
      type="primary"
      style="margin-top: 25px"
      @click="download"
    >
      下载数据
    </el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { download } from '@/utils/download'
export default {
  name: 'DownloadReport',
  props: {
    fields: {
      type: Array,
      default: () => []
    },
    downloadFun: {
      type: Function,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      date: null,
      Json: {
        startTime: null,
        endTime: null
      },
      btnLoad: false
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  methods: {
    async getFoodAnalyzeExcel(params) {
      if (!this.downloadFun) return
      this.btnLoad = true
      try {
        const { merchantManagerType, merchantId } = this.merchantInfo
        const { results } = await this.downloadFun({
          ...params,
          merchantId,
          merchantManagerType
        })
        download(results)
        this.$message.success('报表下载成功')
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    download() {
      if (this.date !== null) {
        this.getFoodAnalyzeExcel(this.Json)
      } else {
        this.$message.warning('请选择日期')
      }
    },
    getDate(val) {
      this.Json['startTime'] = val[0] + ' 00:00:00'
      this.Json['endTime'] = val[1] + ' 23:59:59'
    }
  }
}
</script>

<style lang="scss" scoped>
.field-box {
  padding: 20px 20px;
  border: 1px solid #eee;
  max-width: 700px;
  span {
    margin-right: 30px;
    font-size: 14px;
  }
}
</style>
