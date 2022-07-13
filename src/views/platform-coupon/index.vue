<template>
  <div class="container">
    <div class="query">
      <el-form ref="query" :model="query" inline label-suffix=":">
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input v-model="query.couponName" />
        </el-form-item>
        <el-form-item>
          <el-button
            v-for="(i, k) in ['查询', '重置']"
            :key="k"
            size="small"
            :type="k == 0 ? 'primary' : ''"
            :loading="filterLoad"
            @click="filterData(k)"
          >
            {{ i }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :data-source="tableData"
        row-key="id"
        :pagination="false"
        :loading="loadingTable"
      >
        <span slot="customTitle">
          优惠券门槛
          <a-tooltip placement="top">
            <template slot="title">
              <span>0 代表不限制门槛</span>
            </template>
            <a-icon type="exclamation-circle" />
          </a-tooltip>
        </span>
        <template slot="threshold" slot-scope="threshold, item">
          <template v-if="item.merchantCustomizeThresholdFlag">
            <div style="display: flex;align-items: center;">
              <a-input-number
                v-model="item.threshold"
                placeholder="0 代表不限制"
                :precision="2"
                @change="changeThreshold(item)"
              />
              <template v-if="item.isChangeThreshold">
                <el-button type="primary" :loading="item.loadingSave" size="mini" style="margin-left: 10px"
                 @click="handelSubmit(item)"
                  >保存</el-button
                >
                <!-- <span v-for="(i, index) in ['撤销', '保存']" :key="index">
                <el-button
                  :type="index === 1 ? 'primary' : 'danger'"
                  :icon="index===1?'el-icon-check':'el-icon-close'"
                  circle
                  size="mini"
                  :title="i"
                  @click="handelSubmit(item,index)" -->
              <!-- </span> -->
              </template>
            </div>
          </template>
          <span v-else>{{ item.threshold }}</span>
        </template>
        <div slot="merchantStatus" slot-scope="scope, item">
          <a-switch
            :loading="item.loadingSwitch"
            checked-children="开"
            un-checked-children="关"
            :defaultChecked="scope"
            @change="v => setStatus(v, item)"
          />
        </div>
        <router-link
          slot="action"
          slot-scope="text, item"
          :to="{ name: 'platformCouponDetail', params: { id: item.id } }"
          class="edit-item"
          style="color: #52ACFF"
        >
          详情
        </router-link>
      </a-table>
    </div>
    <pagination
      v-if="!resetStatus"
      :cur-page="query.pageNumber"
      :page-size="query.pageSize"
      :total="pageCount"
      @pagination="paginationChange"
    />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import {
  fhGetPlatformCoupon,
  fhPlatformCouponThreshold,
  fhPutCouponStatus
} from '@/api/marketing/platform-coupon'
function validatePrimeNumber(number) {
  if (/^[1-9]\d*|0$/.test(number)) {
    return {
      validateStatus: 'success',
      errorMsg: ''
    }
  }
  return {
    validateStatus: 'error',
    errorMsg: '请填写优惠券的使用门槛'
  }
}
export default {
  components: {
    Pagination
  },
  data() {
    const columns = [
      {
        title: '优惠券名称',
        dataIndex: 'name'
      },
      {
        title: '优惠内容',
        dataIndex: 'couponContent'
      },
      {
        title: '券成本',
        dataIndex: 'couponCost'
      },
      {
        title: '本商家核销数量',
        dataIndex: 'usedNum'
      },
      {
        key: 'threshold',
        slots: { title: 'customTitle' },
        scopedSlots: { customRender: 'threshold' }
      },
      {
        title: '本商家成本',
        dataIndex: 'merchantCost'
      },
      // {
      //   title: '启禁用',
      //   dataIndex: 'merchantStatus',
      //   scopedSlots: { customRender: 'merchantStatus' }
      // },
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      form: this.$form.createForm(this),
      columns,
      query: {
        couponName: null,
        pageNumber: 1,
        pageSize: 10,
        merchantId: null
      },
      tableData: [],
      loadingTable: false,
      filterLoad: false,
      pageCount: 0,
      pageQuery: {
        pageNumber: 1,
        pageSize: 10
      },
      resetStatus: false,
      isChangeThreshold: false,
      goodModelCountData: []
    }
  },

  async mounted() {
    window.app = this
    this.getList(this.query)
  },

  methods: {
    getFildStatus(id) {
      const data = this.goodModelCountData.filter(item => id === item.id)[0]
      if (data) {
        return data
      } else {
        return {
          errorMsg: '',
          validateStatus: 'success'
        }
      }
    },
    async editThreshold(item) {
      item.loadingSave = true
      try {
        const { id, threshold } = item
        await fhPlatformCouponThreshold(id, { threshold })
        this.$message.success('成功编辑优惠券门槛')
        this.$set(item, 'isChangeThreshold', false)
      } catch (e) {
        console.log(e)
      }
      item.loadingSave = false
    },
    handelSubmit(item, index) {
      // console.log(item)
      // if (index === 0) {
      //   this.$set(item, 'isChangeThreshold', false)
      //   this.getList(this.query)
      // } else if (index === 1) {
      //   this.editThreshold(item)
      // }
      this.editThreshold(item)
    },
    changeThreshold(item) {
      this.$set(item, 'isChangeThreshold', true)
      const { id } = item
      const { errorMsg, validateStatus } = validatePrimeNumber(item.threshold)
      let flag = true
      this.goodModelCountData.forEach(val => {
        if (val.id === id) {
          flag = false
          val.errorMsg = errorMsg
          val.validateStatus = validateStatus
        }
      })

      if (flag) {
        this.goodModelCountData.push({
          id,
          errorMsg,
          validateStatus
        })
      }
    },
    async getList(params) {
      this.loadingTable = true
      try {
        const data = await fhGetPlatformCoupon(params)
        this.tableData = data.results.map(el => {
          el.loadingSwitch = false
          el.isChangeThreshold = false
          el.loadingSave = false
          return el
        })
        this.pageCount = data.count
      } catch (e) {
        console.log(e)
      }
      if (this.resetStatus) {
        this.$nextTick(() => {
          this.resetStatus = false
        })
      }
      this.loadingTable = false
    },
    async putCouponStatus(id, params) {
      try {
        await fhPutCouponStatus(id, params)
        this.$message.success(`${params.status ? '启用' : '禁用'}成功`)
      } catch (err) {
        console.log(err)
      }
    },
    // 页码或单页数量变化
    paginationChange(v) {
      let Json = JSON.parse(JSON.stringify(this.query))
      console.log(Object.assign(Json, v, this.query))
      this.getList(Object.assign(Json, v))
    },
    filterData(k) {
      this.resetStatus = true
      if (k === 1) {
        this.$refs.query.resetFields()
      }
      this.getList(this.query)
    },
    setStatus(v, data) {
      data.loadingSwitch = true
      this.putCouponStatus(data.id, { status: v })
        .then(res => (data.loadingSwitch = false))
        .catch(err => {
          data.loadingSwitch = false
          data.merchantStatus = !data.merchantStatus
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  .btn {
    margin-bottom: 20px;
  }
}
</style>
