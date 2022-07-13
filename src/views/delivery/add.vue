<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-24 15:34:21
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-24 11:50:46
-->
<template>
  <div class="container">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :hide-required-asterisk="true"
      label-width="5em"
    >
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          v-model="formData.activityName"
          placeholder="请输入活动名称（不能超过10个字符）"
          style="width:45%"
        />
      </el-form-item>
      <el-form-item label="选择店铺" prop="storeIdList">
        <el-button type="primary" @click="dialogVisible = true">
          选择店铺
        </el-button>
        <el-button v-if="formData.storeIdList.length > 0" type="text">
          已选择{{ formData.storeIdList.length }}店铺
        </el-button>
      </el-form-item>

      <el-form-item label="活动时间" prop="actTime">
        <MarketDatePicker :date-option="dateOption" @chooseTimeS="chooseTimes" />
      </el-form-item>
      <!-- 使用门槛 -->
      <el-form-item label="使用门槛">
        <el-radio-group
          v-model="formData.noThresholdFlag"
          @change="changeThreshold"
        >
          <el-radio :label="false">
            <span v-if="formData.noThresholdFlag">限制&nbsp;</span>
            <template v-if="!formData.noThresholdFlag">
              满
              <el-input-number
                v-if="!formData.noThresholdFlag"
                v-model.number="formData.threshold"
                :controls="false"
                type="number"
                :disabled="formData.noThresholdFlag"
                :precision="0"
                style="width:50%"
              />&nbsp;元可用
            </template>
          </el-radio>
          <el-radio :label="true">不限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 减免方式 -->
      <el-form-item label="减免方式">
        <el-radio-group v-model="formData.allReduceFlag" @change="changeReduce">
          <el-radio :label="false">
            立减&nbsp;

            <el-input-number
              v-if="!formData.allReduceFlag"
              v-model.number="formData.reduceFee"
              :precision="0"
              :controls="false"
              type="number"
              :disabled="formData.allReduceFlag"
              style="width:50%"
            />
            <template v-if="!formData.allReduceFlag">&nbsp;元</template>
          </el-radio>
          <el-radio :label="true">全免</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 生效周期 -->
      <el-form-item label="生效周期">
        <el-radio-group v-model="effectiveCycle" @change="chooseEffectiveType">
          <el-radio :label="true">每天</el-radio>
          <el-radio :label="false">指定周期</el-radio>
        </el-radio-group>
        <el-form-item prop="effectiveChoose">
          <el-checkbox-group v-model="effectiveChoose">
            <el-checkbox
              v-for="(i, k) in week"
              :key="i"
              :label="k"
              class="week"
              @change="v => chooseEffective(v, k)"
            >
              {{ i }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
      <!-- 生效时段 -->
      <el-form-item label="生效时段">
        <el-radio-group v-model="formData.allDayFlag" @change="changeAllDay">
          <el-radio :label="true">全天</el-radio>
          <el-radio v-if="formData.allDayFlag" :label="false">
            指定时间段
          </el-radio>
          <el-radio v-else :label="false">
            指定时间段({{ formData.actPeriodReqList.length }}/3)
          </el-radio>
        </el-radio-group>

        <div v-if="!formData.allDayFlag">
          <el-form-item
            v-for="(item, index) in formData.actPeriodReqList"
            :key="index"
            :prop="`actPeriodReqList[${index}]`"
            :rules="formData.allDayFlag ? {} : rules.actPeriodReqList"
            style="margin-bottom:22px"
          >
            <el-row>
              <el-col :sm="15" :md="12" :lg="8">
                <el-time-picker
                  v-model="formData.actPeriodReqList[index]"
                  is-range
                  value-format="HH:mm:SS"
                  range-separator="至"
                  start-placeholder="请选择开始时间"
                  end-placeholder="请选择结束时间"
                  :disabled="canChangePeriod"
                />
              </el-col>
              <el-col style="width:3em">
                <el-button
                  v-show="formData.actPeriodReqList.length > 1"
                  type="text"
                  class="ml-12"
                  :disabled="canChangePeriod"
                  style="color:red"
                  @click="delPeriod(index)"
                >
                  删除
                </el-button>
              </el-col>
              <el-col :sm="4" :md="2" :lg="2" style="margin-left:30px">
                <el-button
                  v-show="formData.actPeriodReqList.length < 3"
                  type="primary"
                  :disabled="canChangePeriod"
                  @click="addPeriod"
                >
                  添加时间段
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </div>
      </el-form-item>
      <!-- 保存 -->
      <a-divider dashed />
      <div>
        <el-button type="primary" :loading="manageLoad" @click="manage">
          保存
        </el-button>
        <el-button @click="cacel">
          取消
        </el-button>
      </div>
    </el-form>
    <SelectStore
      :dialog-visible.sync="dialogVisible"
      @relationList="selectStore"
    />
  </div>
</template>

<script>
import SelectStore from '../component/SelectStore'
import { fhAddDelivery } from '@/api/marketing/delivery'
import { storeIdListV } from '@/utils/validate-form.js'
import MarketDatePicker from '@C/MarketDatePicker'
export default {
  components: {
    SelectStore,
    MarketDatePicker
  },
  data() {
    var effectiveChooseV = (rule, value, callback) => {
      if (this.effectiveChoose.length < 1) {
        callback('请选择活动周期')
      } else {
        callback()
      }
    }
    var effectivePeriodV = (rule, value, callback) => {
      value ? callback() : callback('请选择时间段')
    }

    return {
      dateOption: {
        type: 'daterange', format: 'yyyy-MM-dd HH:mm:SS'
      },
      storeId: [],
      dialogVisible: false,
      formData: {
        activityName: '',
        allDayFlag: true,
        allReduceFlag: true,
        allStoreFlag: false,
        endTime: '',
        noThresholdFlag: true,
        reduceFee: 1,
        sellerId: '',
        startTime: '',
        storeIdList: [],
        threshold: 1,
        limitStatusL: undefined,
        limitNumL: undefined,
        actPeriodReqList: [],
        actTime: [],
        weekCycle: '1'.repeat(7).split('')
      },
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'change' },
          { max: 10, message: '不能超过10个字符', trigger: 'change' }
        ],
        storeIdList: [{ validator: storeIdListV }],
        actPeriodReqList: [{ validator: effectivePeriodV }],
        effectiveChoose: [{ validator: effectiveChooseV }],
        actTime: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ]
      },
      actTime: [],
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      effectiveCycle: true,
      effectiveChoose: [...Array(7).keys()],
      manageLoad: false
      // 单品推荐
    }
  },
  computed: {
    canChangePeriod() {
      return this.formData.allDayFlag
    }
  },
  watch: {
    effectiveChoose(v) {
      this.effectiveCycle = v.length === 7
    },
    formData: {
      handler: function(v) {
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // this.getAllMerchants()
    window.app = this
    this.tempSingleOption = {}
  },
  methods: {
    chooseTimes(v, start, end) {
      this.formData.actTime = v
      this.formData.startTime = start
      this.formData.endTime = end
    },
    // 时间段数据格式化
    formatPeriod(v) {
      return v.reduce((acc, cur, index) => {
        const [startTime, endTime] = cur
        const obj = { startTime, endTime }
        acc.push(obj)
        return acc
      }, [])
    },
    async addDelivery() {
      this.manageLoad = true
      const sendData = JSON.parse(JSON.stringify(this.formData))
      sendData.weekCycle = sendData.weekCycle.join('')
      sendData.actPeriodReqList =
        sendData.actPeriodReqList.length > 0
          ? this.formatPeriod(sendData.actPeriodReqList)
          : []

      try {
        const { code } = await fhAddDelivery(sendData)
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '成功创建配送费减免'
          })
          setTimeout(() => {
            this.$router.push({ name: 'marktIndex' })
          }, 700)
        }
      } catch (e) {
        console.log(`fetch:${e}`)
      }
      this.manageLoad = false
    },

    changeAllDay(v) {
      v ? this.formData.actPeriodReqList = []
        : this.formData.actPeriodReqList = [[
          '00:00:00', '23:59:59'
        ]]
    },
    changeThreshold(v) {
      if (v) {
        this.formData.threshold = 0
      }
    },
    changeReduce(v) {
      if (v) {
        this.formData.reduceFee = 0
      }
    },
    manage() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.addDelivery()
        } else {
          return false
        }
      })
    },
    selectStore(item, id) {
      this.formData.storeIdList = id
      this.$refs.form.validateField('storeIdList')
    },
    chooseEffective(v, i) {
      this.formData.weekCycle[6 - i] = v ? 1 : 0
    },
    chooseEffectiveType(v) {
      this.formData.weekCycle = v
        ? [1, 1, 1, 1, 1, 1, 1]
        : [0, 0, 0, 0, 0, 0, 0]
      this.effectiveChoose = v ? [0, 1, 2, 3, 4, 5, 6] : []
    },
    addPeriod() {
      this.formData.actPeriodReqList.push(['00:00:00', '23:59:59'])
    },
    delPeriod(i) {
      this.formData.actPeriodReqList.splice(i, 1)
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
        .then(
          () => {
            this.$router.go(-1)
          })
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '~@/styles/resetinput.scss';
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
