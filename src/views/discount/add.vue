<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-28 09:15:51
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-14 10:36:34
-->
<template>
  <div :id="id" class="container">
    <div class="step">
      <!-- <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps> -->
      <template>
        <div class="steps-content">
          <el-form
            ref="form"
            :model="formData"
            :rules="rules"
            :hide-required-asterisk="true"
          >
            <el-form-item label="活动名称" prop="activityName">
              <el-input
                v-model="formData.activityName"
                placeholder="请输入活动名称（不能超过10个字符）"
                style="width:45%"
                @input="inputACName"
              />
            </el-form-item>
            <!-- 活动时间 -->
            <el-form-item label="活动时间" prop="actTime">
              <MarketDatePicker
                :date-option="dateOption"
                @chooseTimeS="chooseTimes"
              />
            </el-form-item>
            <!-- 生效周期 -->
            <el-form-item label="生效周期">
              <el-radio-group
                v-model="effectiveCycle"
                @change="chooseEffectiveType"
              >
                <el-radio :label="true">每天</el-radio>
                <el-radio :label="false">指定周期</el-radio>
              </el-radio-group>
              <el-form-item label-width="4.8em" prop="effectiveChoose">
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
              <el-radio-group
                v-model="formData.allDayFlag"
                @change="changeAllDay"
              >
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
                  label-width="4.8em"
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
            <el-form-item label="每笔订单可购买折扣商品总数">
              <el-radio-group
                v-model="formData.limitStatus"
                @change="changelimitNumber"
              >
                <el-radio :label="false">不限制</el-radio>
                <el-radio :label="true">
                  自定义
                  <template v-if="formData.limitStatus">
                    <el-form-item
                      prop="limitNum"
                      style="display:inline-block"
                      :rules="formData.limitStatus ? rules.limitNum : {}"
                    >
                      <el-input-number
                        v-if="formData.limitStatus"
                        v-model.number="formData.limitNum"
                        :controls="false"
                        type="number"
                        placeholder="请输入份数"
                        :disabled="!formData.limitStatus"
                        :precision="0"
                        style="width:80%"
                      />&nbsp;
                    </el-form-item>
                  </template>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="互斥规则"> 与满减活动互斥</el-form-item>
            <a-divider dashed />
            <div class="selectS">
              选择商品
            </div>
            <div class="select-button">
              <el-button
                v-for="(item, index) in handleArr"
                :key="index"
                :type="item.type"
                :plain="item.plain"
                :size="item.size"
                :disabled="item.disabled"
                @click="item.event ? handel(item.event) : ''"
              >
                {{ item.name }}
              </el-button>
            </div>
            <el-table
              v-if="formData.discountFoodTemplateReqList.length > 0"
              :data="formData.discountFoodTemplateReqList"
              tooltip-effect="dark"
              :header-cell-style="$getRowClass"
              class="food-table"
              @select="selectSingle"
              @select-all="selectFoodAll"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column
                v-for="(item, index) in columnArr"
                :key="index"
                :label="item.header ? undefined : item.label"
                :prop="item.slot ? undefined : item.prop"
                :width="item.width"
              >
                <template v-if="item.header" slot="header">
                  {{ item.label }}
                  <el-tooltip
                    v-if="item.header.tooltip"
                    class="item"
                    effect="dark"
                    :content="item.header.tooltip.content"
                    placement="top-start"
                  >
                    <a-icon
                      v-if="item.header.tooltip.icon"
                      :type="item.header.tooltip.icon"
                    />
                  </el-tooltip>
                </template>

                <template slot-scope="{ row, $index }">
                  <span v-if="!item.slot">{{ row[item.prop] }}</span>
                  <el-form-item
                    v-if="item.slot && item.input.type !== 'el-button'"
                    :control="false"
                    :prop="
                      `discountFoodTemplateReqList[${$index}][${item.prop}]`
                    "
                    :rules="rules[item.prop]"
                  >
                    <el-input-number
                      v-if="item.input.type === 'el-input-number'"
                      v-model="row[item.prop]"
                      :controls="false"
                      :max="item.input.max"
                      :min="row.price ? Number(((0.01 / row.price) * 10).toFixed(2)) : row.price"
                      style="width:50%;min-width:3em"
                    />
                    <span
                      v-if="item.input.after && !isNaN(row.discount)"
                      style="margin-left:12px"
                    >
                      {{ (row.price * (row.discount / 10)).toFixed(2) }}
                      元</span
                    >
                    <el-input
                      v-if="item.input.type === 'el-input'"
                      v-model="row[item.prop]"
                      :control="false"
                    />
                  </el-form-item>

                  <span
                    v-if="item.input.type === 'el-button'"
                    type="text"
                    class="delete-item"
                    @click="handelCol(item.input.event, row, $index)"
                    >{{ item.input.innerHtml }}</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </template>
      <div class="steps-action">
        <a-divider dashed />
        <a-button v-if="current < steps.length - 1" @click="cancel">
          取消 </a-button
        >&nbsp;&nbsp;
        <!-- <a-button
          v-if="current < steps.length - 1"
          type="primary"
          @click="handleNext"
        >
          下一步
          v-if="current == steps.length - 1"
        </a-button> -->
        <a-button type="primary" :loading="loadingSave" @click="handleSubmit">
          创建
        </a-button>
        <!-- <a-button
          v-if="current > 0 && current < steps.length - 1"
          style="margin-left: 8px"
          @click="prev"
        >
          上一步
        </a-button> -->
        <!-- <div v-if="current === 2">
          <el-button v-if="false" type="primary" @click="handleContinue"
            >继续创建</el-button
          >
          <el-button @click="$router.push({ name: 'marktIndex' })"
            >返回</el-button
          >
        </div> -->
      </div>
    </div>
    <SelectFood
      v-if="!reset"
      :dialog-visible.sync="dialogVisibleF"
      :active-id.sync="activeId"
      :active-name.sync="activeName"
      :share="true"
      :store-ids="formData.storeIdList"
      :radio-orcheckbox="checkbox"
      @selectFood="selectFood"
    />
    <el-dialog :visible.sync="visibleSetDiscount" title="批量设置折扣价">
      <div style="margin-bottom:20px">
        <span>设置为&nbsp;</span>
        <el-input-number
          v-model="SetDiscountV"
          :controls="false"
          :precision="1"
          :min="0.1"
          :max="9.9"
        >
          <template slot="append">.com</template> </el-input-number
        >&nbsp;折
      </div>

      <div>
        <el-button type="primary" @click="handleSetDiscount">提 交</el-button>
        <el-button @click="visibleSetDiscount = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="visibleSetNumber"
      title="批量设置折扣份数 （0代表不限购）"
    >
      <div style="margin-bottom:20px">
        <span>设置为&nbsp;</span>
        <el-input-number v-model="SetNumberV" :controls="false" :precision="0">
          <template slot="append">.com</template> </el-input-number
        >&nbsp;份
      </div>

      <div>
        <el-button type="primary" @click="handleSetNumber">提 交</el-button>
        <el-button @click="visibleSetNumber = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MarketDatePicker from '@C/MarketDatePicker'
import { parseTime } from '@/utils'
import SelectFood from '@/views/component/SelectFood'
import { fhAddDiscount } from '@/api/marketing/discount'
import { getStoreId } from '@/utils/auth'

export default {
  components: {
    SelectFood,
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
      console.log('aa', value)
      value ? callback() : callback('请选择时间段')
    }
    var dialogVisibleF = () => {
      this.reset = false
      this.$nextTick(() => {
        this.dialogVisibleF = !this.dialogVisibleF
      })
    }
    var delAll = () => {
      // 批量删除
      const isAll =
        this.selection.length ===
          this.formData.discountFoodTemplateReqList.length &&
        this.selection.length > 0
      if (isAll) {
        console.log('quanbu')
        this.formData.discountFoodTemplateReqList = []
      } else {
        console.log('bufen')
        this.formData.discountFoodTemplateReqList = this.formData.discountFoodTemplateReqList.filter(
          element => {
            return element.checked === false
          }
        )
      }
      this.selection = []
    }
    var setPrice = () => {
      this.visibleSetDiscount = true
    }
    var setNumber = () => {
      this.visibleSetNumber = true
    }
    return {
      dateOption: {
        type: 'daterange',
        format: 'yyyy-MM-dd HH:mm:SS'
      },
      selection: [],
      formStore: {
        storeIdList: []
      },
      activeFood: [],
      checkbox: 'checkbox',
      visibleSetDiscount: false,
      SetDiscountV: 1,
      visibleSetNumber: false,
      SetNumberV: 1,
      isIndeterminate: false,
      id: new Date(), // 重置页面
      // 选择菜品
      activeId: [], // 已选择的菜品id
      activeName: [], // 已选择的菜品name
      dialogVisibleF: false,
      reset: false,
      columnArr: [
        {
          name: '',
          label: '商品名称',
          prop: 'name',
          width: '',
          input: false,
          slot: false,
          tooltip: false,
          header: ''
        },
        {
          name: 'price',
          label: '原价',
          prop: 'price',
          width: '100px',
          slot: false,
          input: false,
          tooltip: false,
          header: ''
        },
        {
          name: 'sort',
          label: '分类',
          prop: 'sort',
          width: '',
          slot: false,
          input: false,
          tooltip: false,
          header: false
        },
        {
          name: '',
          label: '折扣',
          prop: 'discount',
          width: '',
          slot: true,
          input: {
            prop: 'discount',
            type: 'el-input-number',
            model: 'discount',
            min: 0.01,
            max: 9.99,
            precision: 2,
            placeholder: '',
            before: '',
            after: true
          },
          tooltip: false,
          header: ''
        },
        {
          name: '',
          label: '商品限购份数',
          prop: 'limitNumber',
          width: '',
          slot: true,
          input: {
            prop: '',
            type: 'el-input-number',
            model: 'limitNumber',
            min: 0,
            max: 999999,
            precision: 0,
            placeholder: '',
            before: '',
            after: ''
          },
          header: {
            tooltip: {
              content: '0代表不限购',
              icon: 'info-circle'
            }
          }
        },
        {
          name: '',
          label: '操作',
          prop: false,
          width: '',
          slot: true,
          input: {
            prop: '',
            type: 'el-button',
            model: false,
            event: 'deleteFood',
            size: '',
            before: '',
            innerHtml: '删除',
            after: ''
          },
          header: false
        }
      ],
      handleArr: [
        {
          name: '批量删除',
          label: 'delAll',
          event: delAll,
          type: '',
          plain: true,
          size: 'small',
          disabled: true
        },
        {
          name: '批量设置折扣价',
          label: 'setPrice',
          event: setPrice,
          type: '',
          plain: true,
          size: 'small',
          disabled: true
        },
        {
          name: '批量设置限购份数',
          label: 'setNumber',
          event: setNumber,
          type: '',
          plain: true,
          size: 'small',
          disabled: true
        },
        {
          name: '选择菜品',
          label: 'selectFood',
          event: dialogVisibleF,
          type: 'primary',
          plain: false,
          offset: 22,
          size: 'small',
          disabled: false
        }
      ],
      current: 0,
      steps: [
        {
          title: '填写活动信息'
        },
        {
          title: '完成'
        }
      ],
      // 其他
      loadingSave: false,
      // 选择店铺
      storeArr: [],
      // 弹框
      dialogVisible: false,
      // 表单
      formData: {
        discountFoodTemplateReqList: [],
        activityName: '',
        allDayFlag: true,
        allStoreFlag: false,
        endTime: '',
        limitStatus: false,
        startTime: '',
        storeIdList: [],
        limitNum: 1,
        actPeriodReqList: [['00:00:00', '23:59:59']],
        actTime: '',
        weekCycle: '1'.repeat(7).split('')
      },
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'change' },
          { max: 10, message: '不能超过10个字符', trigger: 'change' }
        ],
        discount: [
          { required: true, message: '请输入0.1至9.9的数字', trigger: 'blur' }
        ],
        limitNum: [{ required: true, message: '请输入' }],
        limitNumber: [{ required: true, message: '请输入', trigger: 'blur' }],
        actPeriodReqList: [{ validator: actPeriodReqListV }],
        effectiveChoose: [{ validator: effectiveChooseV }],
        actTime: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ]
      },
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      effectiveCycle: true,
      effectiveChoose: [...Array(7).keys()]
    }
  },
  computed: {
    hasSelected() {
      return this.selection.length < 1
    },
    canChangePeriod() {
      return this.formData.allDayFlag
    }
  },
  watch: {
    selection() {
      for (let i = 0; i < this.handleArr.length - 1; i++) {
        this.$set(this.handleArr[i], 'disabled', this.selection.length < 1)
      }
    }
  },
  async mounted() {
    window.app = this
    this.formData.storeIdList = [await getStoreId()]
  },
  methods: {
    chooseTimes(v, start, end) {
      this.formData.actTime = v
      this.formData.startTime = start
      this.formData.endTime = end
    },
    // 表格单选
    selectSingle(selection, row) {
      const isChecked = selection.includes(row)
      console.log('is', isChecked)
      const index = this.formData.discountFoodTemplateReqList.indexOf(row)
      this.formData.discountFoodTemplateReqList[index].checked = isChecked
      console.log(
        'che',
        this.formData.discountFoodTemplateReqList[index].checked
      )
      this.selection = selection
    },
    // 表格全选
    selectFoodAll(selection) {
      console.log('bbaa', selection)
      this.formData.discountFoodTemplateReqList.forEach((element, index) => {
        element.checked = selection.length > 0
      })
      this.selection = selection
    },
    inputACName(v) {
      this.$refs.form.validateField('activityName')
    },
    // 批量设置折扣份数
    handleSetNumber() {
      this.visibleSetNumber = false
      this.formData.discountFoodTemplateReqList.forEach(val => {
        if (val.checked) {
          val.limitNumber = this.SetNumberV
        }
      })
      // this.SetNumberV = 1
    },
    // 批量设置折扣
    handleSetDiscount() {
      this.visibleSetDiscount = false
      this.formData.discountFoodTemplateReqList.forEach(val => {
        if (val.checked) {
          val.discount = this.SetDiscountV
        }
      })
      // this.SetDiscountV = 1
    },

    // 菜品
    selectFood(item, id) {
      this.dialogVisibleF = false
      let discountFoodTemplateReqList = [
        ...this.formData.discountFoodTemplateReqList
      ]
      let activeName = []
      let activeFood = []
      item.forEach(val => {
        const { name, foodSkuList, category } = val
        const { id: foodTemplateSkuId, foodTemplateId, price } = foodSkuList[0]
        val.foodTemplateId = foodTemplateId
        val.foodTemplateSkuId = foodTemplateSkuId
        val.price = price
        val.sort = category.name
        if (this.activeFood.indexOf(name) === -1) {
          discountFoodTemplateReqList.push(val)
          activeFood.push(name)
        }
        // const { name, foodSkuList, category } = val
        // let active_index = this.activeFood.indexOf(name)
        // if (active_index === -1) {
        //   const {
        //     id: foodTemplateSkuId,
        //     foodTemplateId,
        //     price
        //   } = foodSkuList[0]
        //   val.foodTemplateId = foodTemplateId
        //   val.foodTemplateSkuId = foodTemplateSkuId
        //   val.price = price
        //   val.sort = category.name
        //   discountFoodTemplateReqList.push(val)
        // } else {
        //   discountFoodTemplateReqList.push(
        //     this.formData.discountFoodTemplateReqList[active_index]
        //   )
        // }
        // activeFood.push(name)
        // activeName.push(val)
      })
      this.formData.discountFoodTemplateReqList = discountFoodTemplateReqList
      // this.formData.discountFoodTemplateReqList = discountFoodTemplateReqList
      // this.activeName = activeName
      this.activeFood = activeFood
      setTimeout(() => {
        this.reset = true
      }, 400)
    },
    //
    handel(fn) {
      fn()
    },
    handelCol(fn, row, index) {
      if (fn === 'deleteFood') {
        this.deleteFood(row, index)
      }
    },
    // 删除
    deleteFood(item, index) {
      this.formData.discountFoodTemplateReqList.splice(index, 1)
      this.activeName.splice(index, 1)
      this.activeFood.splice(index, 1)
    },
    chooseTime(v, e) {
      this.formData.actTime = v
      const start = Array.isArray(v) ? v[0] : ''
      const end = Array.isArray(v) ? v[1] : ''
      this.formData.startTime = start
      this.formData.endTime = end
      const exp =
        e ||
        ((new Date(end).valueOf() - new Date(start).valueOf()) / 24) *
          3600 *
          1000
      this.currExpTime = exp
    },
    chooseExpTime(v) {
      const { time } = v
      this.createExpressTime(time)
    },
    createExpressTime(v) {
      const nowRaw = new Date().valueOf()
      const day = 24 * 3600 * 1000
      const now = parseTime(nowRaw)
      const end = parseTime(nowRaw + day * v)
      this.chooseTime([now, end], v)
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
    changeAllDay(v) {
      v
        ? (this.formData.actPeriodReqList = [])
        : (this.formData.actPeriodReqList = [['00:00:00', '23:59:59']])
    },
    changelimitNumber(v) {
      if (v) {
        this.formData.limitNum = 1
      }
    },
    changeReduce(v) {
      if (v) {
        this.formData.reduceFee = 0
      }
    },
    handleNext() {
      this.current += 1
    },
    // 添加请求
    async handleAdd() {
      this.loadingSave = true
      const sendData = JSON.parse(JSON.stringify(this.formData))
      sendData.weekCycle = sendData.weekCycle.join('')
      sendData.actPeriodReqList =
        sendData.actPeriodReqList.length > 0
          ? this.formatPeriod(sendData.actPeriodReqList)
          : []
      try {
        const { code } = await fhAddDiscount(sendData)
        if (code === 200) {
          this.$message.success('成功创建折扣商品活动')
          setTimeout(() => {
            this.$router.push({ name: 'marktIndex' })
          }, 700)
        }
      } catch (e) {
        console.log(e)
      }
      this.loadingSave = false
    },
    // 提交
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.formData.discountFoodTemplateReqList.length < 1) {
            this.$message.error({ type: 'error', message: '请选择菜品' })
            setTimeout(() => {
              this.dialogVisibleF = true
            }, 800)
          } else {
            this.handleAdd()
          }
        } else {
          console.log('提交失败')
        }
      })
    },
    prev() {
      this.current -= 1
    },
    delStore(item, index) {
      this.storeArr.splice(index, 1)
      this.formData.storeIdList.splice(index, 1)
      //
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
    handleContinue() {
      this.id = new Date()
      this.current = 0
    },
    cancel() {
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
.container {
  min-height: auto !important;
}
.ant-steps {
  margin-bottom: 30px;
}
.selectS {
  font-weight: 700;
  color: #333;
  font-size: 18px;
  padding: 0 6px;
  border-left: 4px solid #52acff;
  margin-bottom: 18px;
}
.tag {
  display: inline-block;
  width: 100%;
  background-color: #f4f4f5;
  color: #909399;
  height: 36px;
  padding: 0 10px;
  line-height: 36px;
  font-size: 12px;
  border: 1px dashed #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  .info {
    width: calc(100% - 20px);
    display: inline-block;
  }
}
.el-icon-close {
  border-radius: 50%;
  text-align: center;
  position: relative;
  cursor: pointer;
  font-size: 12px;
  height: 16px;
  width: 16px;
  line-height: 16px;
  vertical-align: middle;
  top: -1px;
  right: -5px;
  &:hover {
    color: #fff;
    background-color: #909399;
  }
}
.el-date-editor {
  width: 100%;
}
.select-button {
  margin-bottom: 20px;
}
.food-top {
  padding-bottom: 20px;
  line-height: 42px;
  height: 42px;
  border-bottom: 1px solid #eee;
  background: #f1efef;
  .title {
    color: #333;
    font-weight: 700;
    font-size: 14px;
  }
}
.food-body {
  .row {
    margin-bottom: 20px;
    border-bottom: 1px solid #e8e8e8;
    padding: 12px 0;
  }
}
.success {
  color: rgba(0, 0, 0, 0.847058823529412);
  font-size: 24px;
  font-weight: 650;
}
::v-deep {
  .el-radio__input.is-checked + .el-radio__label,
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
}
.food-table ::v-deep .el-form-item {
  margin: 16px 0;
}
</style>
