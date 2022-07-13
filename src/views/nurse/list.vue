<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-11 17:35:52
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-27 16:03:11
-->
<template>
  <div v-loading="loading" class="container">
    <el-form v-show="formShow" :model="form" inline>
      <el-form-item label="护工性别">
        <filter-select
          clearable
          :data="sexData"
          vl="label"
          vk="label"
          vv="value"
          :value.sync="form.sex"
        />
      </el-form-item>
      <el-form-item label="护工等级">
        <filter-select
          clearable
          :data="levelsData"
          vl="label"
          vk="label"
          vv="value"
          :value.sync="form.nurseLevel"
        />
      </el-form-item>
      <el-form-item label="护工年限">
        <div class="nursing-years">
          <el-input
            v-model="form.nursingYearsStart"
            placeholder="请输入护工年限"
          />
          <span> ~ </span>
          <el-input
            v-model="form.nursingYearsEnd"
            placeholder="请输入护工年限"
          />
          <span> 年</span>
        </div>
      </el-form-item>
      <el-form-item label="服务状态">
        <filter-select
          clearable
          :data="statusData"
          vl="label"
          vk="label"
          vv="value"
          :value.sync="form.status"
        />
      </el-form-item>
      <el-form-item label="护工姓名">
        <el-input v-model="form.name" placeholder="请输入护工姓名" />
      </el-form-item>
      <el-form-item label="护工手机号">
        <el-input v-model="form.phone" placeholder="请输入护工姓名" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 40px">
      <div style="float: right">
        <el-button
          :loading="exportLoading"
          @click="fhExportRegisterQr"
        >
          护工注册二维码
        </el-button>
        <el-button
          class="mr-12"
          :loading="exportLoading"
          @click="showFeeDialog"
        >
          费用规则
        </el-button>
        <router-link :to="{ path: '/nurse/info' }">
          <el-button>新建护工</el-button>
        </router-link>
      </div>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0" />
        <el-tab-pane label="待审核" name="1" />
        <el-tab-pane label="审核未通过" name="2" />
      </el-tabs>
    </div>
    <el-table :data="nurses" @selection-change="handleSelectionChange">
      <el-table-column label="序号" type="index" />
      <el-table-column label="护工信息" width="180px">
        <template slot-scope="{ row: { photo, name, sex, birthday } }">
          <div class="nurse-info">
            <el-avatar :src="photo" />
            <div class="ml-12">
              <p>{{ name }}</p>
              <span>{{ sex === 1 ? '男' : '女' }}</span>
              <span>{{ computedNurseAge(birthday) }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row: { status, auditStatus } }">
          {{ status ? computedNurseStatus(status) : auditResults[auditStatus] }}
        </template>
      </el-table-column>
      <el-table-column v-if="activeName === '2'" label="审核意见">
        <template slot-scope="{ row: { auditOpinion } }">
          {{ auditOpinion }}
        </template>
      </el-table-column>
      <el-table-column label="单价(元/天)" prop="price" />
      <el-table-column label="护理等级">
        <template slot-scope="{ row: { nurseLevel } }">
          {{ computedNurseLevel(nurseLevel) }}
        </template>
      </el-table-column>
      <el-table-column label="护理年限" prop="nursingYears">
        <template slot-scope="{ row: { nursingYears } }">
          <span>{{ nursingYears }}年</span>
        </template>
      </el-table-column>
      <el-table-column label="专职科室" prop="sickroom" />
      <el-table-column
        label="身份证号"
        prop="identityCardNumber"
        width="200px"
      />
      <el-table-column label="注册时间" prop="createTime" width="200px" />
      <el-table-column label="操作">
        <template slot-scope="{ row: { id } }">
          <el-button class="mr-12" size="mini" @click="detail(id)">
            编辑
          </el-button>
          <router-link
            v-show="formShow"
            :to="{ name: 'NurseOrders', query: { id: id } }"
          >
            <el-button size="mini">服务明细</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :total="total"
      :current-page="form.pageNumber"
      :page-size="form.pageSize"
      @pagination="pagination"
    />
    <fee-rule :visibled.sync="isShowFeeRuleDialog" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterSelect from '@/components/FilterSelect'
import Pagination from '@/components/Pagination'
import FeeRule from './_components/FeeRule.vue'
import { options, nurseStatusEnum, nurseLevelEnum } from './_utils'
import {
  fhGetNurses,
  fhGetAuditNurseList,
  fhExportRegisterQr
} from '@/api/nurse'
import { downloadIamge } from '@/utils/download'

export default {
  name: 'NurseList',
  components: {
    FilterSelect,
    Pagination,
    FeeRule
  },
  data() {
    return {
      // 加载中
      loading: false,
      formShow: true,
      // 查询表单
      form: {
        status: null,
        pageNumber: 1,
        pageSize: 10
      },
      // filter 选择
      ...options,
      // 总数
      total: 0,
      params: {},
      // 护工数据
      nurses: [],
      // 选中的护工
      multipleSelectionNurse: [],
      activeName: '0',
      // 导出loading
      exportLoading: false,
      // 是否展示护工商家费用规则说明修改弹窗
      isShowFeeRuleDialog: false
    }
  },
  computed: {
    ...mapGetters(['merchantName']),
    statusData() {
      return this.status.filter(item => {
        return (item.value !== 1) & (item.value !== 2)
      })
    },
    sexData() {
      return [
        {
          label: '全部',
          value: null
        },
        ...this.sex
      ]
    },
    levelsData() {
      return [
        {
          label: '全部',
          value: null
        },
        ...this.levels
      ]
    }
  },
  mounted() {
    this.getNurses()
  },
  methods: {
    // 被选中的护工
    handleSelectionChange(val) {
      this.multipleSelectionNurse = val
    },
    // 获取护工列表
    async getNurses() {
      this.loading = true
      try {
        const {
          results: { results, count }
        } = await fhGetNurses(this.form)
        this.total = count
        this.nurses = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 审核的护工列表
    async getAuditNurseList() {
      this.loading = true
      try {
        const {
          results: { results, count }
        } = await fhGetAuditNurseList(this.params)
        this.total = count
        this.nurses = results
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 计算护工的状态
    computedNurseStatus(state) {
      return nurseStatusEnum.get(state)
    },
    // 计算护工的等级
    computedNurseLevel(level) {
      level = typeof level === 'string' ? +level : level
      return nurseLevelEnum.get(level) || '---'
    },
    // 计算护工的生日
    computedNurseAge(birthday) {
      const moment = this.$moment
      return `${moment().diff(birthday, 'years')}岁`
    },
    // 查询
    query() {
      const { nursingYearsEnd: tempEnd, nursingYearsStart: tempStart } =
        this.form

      if (tempEnd < tempStart) {
        // const temp =
        const [nursingYearsEnd, nursingYearsStart] = [tempStart, tempEnd]
        this.form = {
          ...this.form,
          nursingYearsEnd,
          nursingYearsStart
        }
      }

      this.form = {
        ...this.form,
        pageNumber: 1
      }

      this.getNurses()
    },
    // 重置
    reset() {
      this.form = {
        pageNumber: 1,
        pageSize: 10
      }
      this.$nextTick(() => {
        this.getNurses()
      })
    },
    // 页码改变
    pagination(val) {
      if (this.activeName === '0') {
        this.form = {
          ...this.form,
          ...val
        }
        this.$nextTick(() => this.getNurses())
      } else {
        this.params = {
          ...this.params,
          ...val
        }
        this.$nextTick(() => this.getAuditNurseList())
      }
    },
    // 查看详情
    detail(id) {
      const query =
        this.activeName === '0'
          ? {
              nurseId: id
            }
          : {
              nurseId: id,
              audit: true
            }
      this.$router.push({
        path: `/nurse/info`,
        query
      })
    },
    // 处理切换tab
    handleClick() {
      if (this.activeName === '0') {
        this.formShow = true
        this.getNurses()
      } else {
        this.formShow = false
        this.params.auditStatus = ['', null, false][this.activeName]
        this.getAuditNurseList(this.params)
      }
    },
    // 导出病床二维码
    async fhExportRegisterQr() {
      this.exportLoading = true
      try {
        const { results } = await fhExportRegisterQr()
        downloadIamge(results, `${this.merchantName}-注册二维码`)
        this.$message.success('导出注册二维码成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.exportLoading = false
    },
    // 显示规则弹窗
    showFeeDialog() {
      this.isShowFeeRuleDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: auto;
}

.nurse-info {
  display: flex;
  p {
    margin: 0;
  }

  .ml-12 {
    span {
      margin-right: 6px;
    }
  }
}

.nursing-years {
  &::v-deep .el-input {
    width: 10em;
  }
}
</style>
