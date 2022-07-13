<template>
  <div class="container">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="6em"
      :hide-required-asterisk="true"
    >
      <el-form-item label="优惠券类型">
        <el-radio v-model="radioV" :label="1">代金券</el-radio>
      </el-form-item>
      <el-form-item label="选择店铺" prop="storeIdList">
        <el-button type="primary" @click="dialogVisible = true">
          选择店铺
        </el-button>
        <el-button v-if="formData.storeIdList.length > 0" type="text">
          已选择{{ formData.storeIdList.length }}家店铺
        </el-button>
      </el-form-item>
      <el-form-item label="优惠券名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width:50%"
          placeholder="请输入活动名称（不能超过10个字符）"
        />
      </el-form-item>
      <el-form-item label="发放数量" prop="stock">
        <el-input-number
          v-model="formData.stock"
          :precision="0"
          :controls="false"
          placeholder="请输入发放数量"
        />
      </el-form-item>
      <el-form-item label="使用门槛">
        <el-radio-group
          v-model="formData.noThreshold"
          @change="changeThreshold"
        >
          <el-radio :label="true">不限制</el-radio>
          <el-radio :label="false">
            <span v-if="formData.noThreshold">限制&nbsp;</span>
            <template v-if="!formData.noThreshold">
              消费满&nbsp;
              <el-form-item
                label-width="0"
                prop="threshold"
                style="display:inline-block"
              >
                <el-input-number
                  v-if="!formData.noThreshold"
                  v-model="formData.threshold"
                  :controls="false"
                  :disabled="formData.noThreshold"
                  :precision="2"
                  style="width:50%;display: inline-block"
                  @change="changeThreshold"
                />&nbsp;元可用
              </el-form-item>
            </template>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优惠内容">
        减免&nbsp;
        <el-form-item label="" prop="value" style="display:inline-block">
          <el-input-number
            v-model="formData.value"
            :precision="2"
            :controls="false"
            :min="0.01"
          />&nbsp;元
        </el-form-item>
      </el-form-item>
      <el-form-item label="有效期">
        自券发出之日起&nbsp;
        <el-form-item prop="validPeriod" label="" style="display:inline-block">
          <el-input-number
            v-model="formData.validPeriod"
            :precision="0"
            :controls="false"
          />&nbsp;天有效
        </el-form-item>
      </el-form-item>
      <el-form-item label="互斥规则" prop="reduceCoexistFlag">
        <el-checkbox
          v-model="formData.reduceCoexistFlag"
          label="与满减活动同享"
        />
        <small class="gray" style="display: block">优惠券默认与满减互斥，当勾选与满减活动同享后此券将和满减活动同享使用</small>
      </el-form-item>
    </el-form>
    <a-divider dashed />
    <div>
      <el-button type="primary" :loading="manageLoad" @click="manage">
        保存
      </el-button>
      <el-button @click="cacel">
        取消
      </el-button>
    </div>
    <SelectStore
      :dialog-visible.sync="dialogVisible"
      @relationList="selectStore"
    />
  </div>
</template>

<script>
import { storeIdListV } from '@/utils/validate-form.js'
import SelectStore from '@/views/component/SelectStore'
import { fhAddCoupon } from '@/api/marketing/coupon'
export default {
  components: {
    SelectStore
  },
  data() {
    return {
      radioV: 1,
      storeId: [],
      dialogVisible: false,
      formData: {
        validPeriod: 1,
        value: 1,
        threshold: 1,
        noThreshold: true,
        stock: 1,
        name: '',
        storeIdList: [],
        reduceCoexistFlag: false
      },
      rules: {
        storeIdList: [{ validator: storeIdListV }],
        validPeriod: [
          {
            required: true,
            message: '请输入有效期'
          }
        ],
        value: [
          {
            required: true,
            message: '请输入优惠金额'
          }
        ],
        stock: [
          {
            required: true,
            message: '请输入发放数量'
          }
        ],
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'change' },
          { max: 10, message: '不能超过10个字符', trigger: 'change' }
        ],
        threshold: [{ required: true, message: '请输入门槛金额' }]
      },
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      expressTime: [
        {
          label: '7天',
          time: 7
        },
        {
          label: '30天',
          time: 30
        },
        {
          label: '90天',
          time: 90
        }
      ],
      currExpTime: 0,
      effectiveCycle: true,
      // 新增/编辑load
      manageLoad: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    window.app = this
  },
  methods: {
    changeThreshold() {
      this.$refs.form.validateField('threshold')
    },
    async addCoupon() {
      this.manageLoad = true
      const sendData = Object.assign({}, this.formData)

      try {
        const { code } = await fhAddCoupon(sendData)
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '成功创建优惠券'
          })
        }
        setTimeout(() => {
          this.$router.push({ name: 'listCoupon' })
        }, 700)
      } catch (e) {
        //
      }
      this.manageLoad = false
    },
    manage() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.addCoupon()
        } else {
          return false
        }
      })
    },
    selectStore(item, id) {
      this.formData.storeIdList = id
      this.$refs.form.validateField('storeIdList')
    },
    cacel() {
      this.$confirm(
        '此操作将返回到列表页, 且当前输入的内容不会保存, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$router.push({ name: 'listCoupon' })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../../styles/resetinput.scss';
.el-date-editor {
  width: 100%;
}
::v-deep {
  .el-radio__input.is-checked + .el-radio__label,
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
}
</style>
