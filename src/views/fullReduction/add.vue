<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-20 16:08:08
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-30 09:55:21
-->
<template>
  <div class="container">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="5em"
      :hide-required-asterisk="true"
    >
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          v-model="formData.activityName"
          placeholder="请输入活动名称（不能超过10个字符）"
          style="width:45%"
        />
      </el-form-item>
      <el-form-item label="活动时间" prop="actTime">
        <MarketDatePicker
          :date-option="dateOption"
          @chooseTimeS="chooseTimes"
        />
      </el-form-item>
      <el-form-item label="互斥规则">
        与折扣商品互斥
      </el-form-item>
      <a-divider dashed />
      <h4>
        满减梯度（{{ formData.meetReduceList.length }} / 5）
        <a-tooltip placement="topLeft" title="订单金额应大于减免金额">
          <a-icon type="exclamation-circle" />
        </a-tooltip>
      </h4>
      <el-form-item
        v-for="(item, index) in formData.meetReduceList"
        :key="index"
      >
        <el-row>
          <el-col :sm="24" :md="10" :lg="8">
            <el-form-item
              label="订单满"
              :prop="`meetReduceList[${index}].overflow`"
              :rules="rules.overflow"
            >
              <el-input-number
                v-model.number="item.overflow"
                :precision="2"
                :controls="false"
                clearable
                placeholder="订单金额"
                style="width: 100%;"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="10" :lg="8">
            <el-form-item
              label="减免"
              :prop="`meetReduceList[${index}].reduction`"
              :rules="rules.reduction"
            >
              <el-input-number
                v-model.number="item.reduction"
                :precision="2"
                :controls="false"
                clearable
                placeholder="减免金额"
                type="number"
                style="width: 100%;"
                :min="0.01"
              />
            </el-form-item>
          </el-col>
          <el-col :sm="24" :md="2" :lg="4" style="margin-left: 4em;">
            <el-button
              v-if="formData.meetReduceList.length > 1"
              type="text"
              style="color: red;"
              @click="delReduction(index)"
            >
              删除
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        v-if="formData.meetReduceList.length < 5"
        label=""
        label-width="6em"
      >
        <el-button type="primary" @click="addReduction()">添加梯度</el-button>
      </el-form-item>
      <a-divider dashed />
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
              style="color:black"
              @change="v => chooseEffective(v, k)"
            >
              {{ i }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form-item>
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
            style="margin-bottom: 22px;"
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
              <el-col style="width: 3em;">
                <el-button
                  v-show="formData.actPeriodReqList.length > 1"
                  type="text"
                  class="ml-12"
                  :disabled="canChangePeriod"
                  style="color: red;"
                  @click="delPeriod(index)"
                >
                  删除
                </el-button>
              </el-col>
              <el-col :sm="4" :md="2" :lg="2" style="margin-left: 30px;">
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
  </div>
</template>

<script>
import { fhAddOverflow } from '@/api/marketing/reduction'
import MarketDatePicker from '@C/MarketDatePicker'
import { getStoreId } from '@/utils/auth'

export default {
  components: {
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
    var actPeriodReqListV = (rule, value, callback) => {
      value ? callback() : callback('请选择时间段')
    }

    return {
      dateOption: {
        type: 'daterange',
        format: 'yyyy-MM-dd HH:mm:SS'
      },
      formData: {
        actPeriodReqList: [],
        actTime: [],
        activityName: '',
        allStoreFlag: false,
        meetReduceList: [{ overflow: undefined, reduction: undefined }],
        allDayFlag: true,
        weekCycle: '1'.repeat(7).split('')
      },
      rules: {
        actPeriodReqList: [{ validator: actPeriodReqListV }],
        effectiveChoose: [{ validator: effectiveChooseV }],
        actTime: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'change' },
          { max: 10, message: '不能超过10个字符', trigger: 'change' }
        ],
        overflow: [{ required: true, message: '请输入金额' }],
        reduction: [{ required: true, message: '请输入减免金额' }]
      },
      actTime: [],
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      effectiveCycle: true,
      effectiveChoose: [...Array(7).keys()],
      // 新增/编辑load
      manageLoad: false
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
    }
  },
  async mounted() {
    window.app = this
    this.formData.storeIdList = [await getStoreId()]
    console.log(this.formData.storeIdList)
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
    async addOverflow() {
      this.manageLoad = true
      const sendData = JSON.parse(JSON.stringify(this.formData))
      sendData.weekCycle = sendData.weekCycle.join('')
      sendData.actPeriodReqList =
        sendData.actPeriodReqList.length > 0
          ? this.formatPeriod(sendData.actPeriodReqList)
          : []

      try {
        const { code } = await fhAddOverflow(sendData)
        if (code === 200) {
          this.$message({
            type: 'success',
            message: '成功创建满减活动'
          })
        }
        setTimeout(() => {
          this.$router.push({ name: 'marktIndex' })
        }, 700)
      } catch (e) {
        //
      }
      this.manageLoad = false
    },
    changeAllDay(v) {
      if (v) {
        this.formData.actPeriodReqList = []
        this.$refs.form.clearValidate()
      } else {
        this.formData.actPeriodReqList = [['00:00:00', '23:59:59']]
      }
    },
    manage() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.addOverflow()
        } else {
          return false
        }
      })
    },
    delReduction(i) {
      const flag = this.formData.meetReduceList.length > 1
      flag && this.formData.meetReduceList.splice(i, 1)
    },
    addReduction() {
      this.formData.meetReduceList.push({
        overflow: undefined,
        reduction: undefined
      })
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
      ).then(() => {
        this.$router.go(-1)
      })
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
