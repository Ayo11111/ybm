<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-08-28 09:15:51
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-14 14:28:18
-->
<template>
  <div :id="id" class="container">
    <div class="step">
      <a-steps :current="current">
        <a-step v-for="item in steps" :key="item.title" :title="item.title" />
      </a-steps>
      <template v-if="current == 0">
        <div class="steps-content">
          <div class="selectS">
            选择店铺
          </div>
          <el-form
            ref="formStore"
            :model="formStore"
            :rules="rulesStore"
            label-width="5me"
            :hide-required-asterisk="true"
          >
            <el-form-item label="" prop="storeIdList">
              <el-button
                type="primary"
                style="margin-right:20px"
                @click="dialogVisible = true"
              >
                选择店铺</el-button>
              <span
                v-if="formData.storeIdList.length"
              >已选择{{ formData.storeIdList.length }}家店铺</span>
            </el-form-item>
          </el-form>
          <el-row :gutter="20">
            <el-col
              v-for="(item, index) in storeArr"
              :key="index"
              :sm="12"
              :md="8"
              :lg="6"
              :xl="4"
              style="margin-bottom:18px"
            >
              <div class="tag">
                <div class="info">{{ item.label }}</div>
                <span><i
                  class="el-icon-close"
                  @click="delStore(item, index)"
                /></span>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-if="current == 1">
        <div class="steps-content">
          <el-form
            ref="form"
            :model="formData"
            :rules="rules"
            :hide-required-asterisk="true"
          >
            <el-form-item label="活动名称" prop="activityName">
              <el-input v-model="formData.activityName" placeholder="请输入活动名称（不能超过10个字符）" style="width:45%" @input="inputACName" />
            </el-form-item>
            <!-- 活动时间 -->
            <el-form-item label="活动时间" prop="actTime">
              <el-row>
                <el-col :sm="12" :md="11" :lg="12" :xl="10">
                  <el-date-picker
                    v-model="formData.actTime"
                    type="datetimerange"
                    start-placeholder="活动开始时间"
                    end-placeholder="活动结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="chooseTime"
                  />
                </el-col>
                <el-col :sm="8" :md="8" :lg="8" :offset="1" :xl="8">
                  <span
                    v-for="(i, k) in expressTime"
                    :key="k"
                    :class="[
                      'express-time-box',
                      'ml-12',
                      i.time === currExpTime ? 'curr-exp-time' : ''
                    ]"
                    @click="chooseExpTime(i)"
                  >
                    {{ i.label }}
                  </span>
                </el-col>
              </el-row>
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
                  指定时间段({{ formData.effectivePeriod.length }}/3)
                </el-radio>
              </el-radio-group>
              <div v-if="!formData.allDayFlag">
                <el-form-item
                  v-for="(item, index) in formData.effectivePeriod"
                  :key="index"
                  label-width="4.8em"
                  :prop="`effectivePeriod[${index}]`"
                  :rules="formData.allDayFlag ? {} : rules.effectivePeriod"
                  style="margin-bottom:22px"
                >
                  <el-row>
                    <el-col :sm="15" :md="12" :lg="8">
                      <el-time-picker
                        v-model="formData.effectivePeriod[index]"
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
                        v-show="formData.effectivePeriod.length > 1"
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
                        v-show="formData.effectivePeriod.length < 3"
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
                      prop="limitNumber"
                      style="display:inline-block"
                      :rules="formData.limitStatus ? rules.limitNumber : {}"
                    >
                      <el-input-number
                        v-if="formData.limitStatus"
                        v-model.number="formData.limitNumber"
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
                @click="item.event ? handel(item.event) : ''"
              >
                {{ item.name }}
              </el-button>
            </div>

            <div class="food-top">
              <el-row>
                <el-col
                  v-for="(item, index) in titleArr"
                  :key="index"
                  :span="item.span"
                >
                  <el-checkbox
                    v-if="item.checkbox"
                    v-model="checkAll"
                    style="margin-right:10px"
                    :indeterminate="isIndeterminate"
                    :disabled="foodArr.size < 1"
                    @change="handleCheckAll"
                  />
                  <span
                    class="title"
                  >{{ item.name }}
                    <el-tooltip
                      v-if="item.tooltip"
                      class="item"
                      effect="dark"
                      :content="item.tooltip.content"
                      placement="top-start"
                    >
                      <a-icon
                        v-if="item.tooltip.icon"
                        :type="item.tooltip.icon"
                      />
                    </el-tooltip>
                  </span>
                </el-col>
              </el-row>
            </div>
            <div class="food-body">
              <el-row v-for="(item, index) in foodArr" :key="index" class="row">
                <el-col :span="6">
                  <el-checkbox
                    v-model="
                      formData.discountFoodTemplateReqList[index].checked
                    "
                    style="margin-right:10px"
                    @change="checked => handleCheckFood(item, index, checked)"
                  />
                  <span>{{ item.name }}</span>
                </el-col>
                <el-col :span="4">
                  <el-select
                    v-model="formData.discountFoodTemplateReqList[index]"
                    size="small"
                    placeholder="请选择"
                    style="max-width:10em;min-width:4em"
                    value-key="name"
                    @change="item => changeGuige(item, index)"
                  >
                    <el-option
                      v-for="(i, j) in foodSkuList[index]"
                      :key="j"
                      :label="i.name"
                      :value="i"
                    />
                  </el-select>
                </el-col>
                <el-col :span="2">
                  {{ formData.discountFoodTemplateReqList[index].price }}
                </el-col>
                <el-col :span="3">{{ item.category.name }}</el-col>
                <el-col :span="2">
                  <el-form-item
                    style="margin-bottom:0"
                    :prop="`discountFoodTemplateReqList[${index}].discount`"
                    :rules="rules.discount"
                  >
                    <el-input-number
                      v-model="
                        formData.discountFoodTemplateReqList[index].discount
                      "
                      :min="0.1"
                      :max="9.9"
                      :precision="1"
                      :controls="false"
                      style="width:85%"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="min-width:6em">
                  <el-form-item
                    style="margin-bottom:0"
                    :prop="`discountFoodTemplateReqList[${index}].limitNumber`"
                    :rules="rules.limitNumber"
                  >
                    <el-input-number
                      v-model="
                        formData.discountFoodTemplateReqList[index].limitNumber
                      "
                      :precision="0"
                      :controls="false"
                      style="width:85%"
                      size="small"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button
                    type="text"
                    class="delete-item"
                    @click="deleteFood(item, index)"
                  >
                    删除
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-form>
        </div>
      </template>
      <template v-if="current == 2">
        <div class="steps-content" style="text-align:center">
          <div class="class" style="margin-bottom:30px">
            <img src="@/assets/img/success-act.png" alt="成功">
          </div>
          <div class="success" style="margin-bottom:70px">
            创建活动成功
          </div>
        </div>
      </template>
      <div class="steps-action">
        <a-divider dashed />
        <a-button
          v-if="current < steps.length - 2"
          @click="cancel"
        >
          取消
        </a-button>&nbsp;&nbsp;
        <a-button
          v-if="current < steps.length - 2"
          type="primary"
          @click="handleNext"
        >
          下一步
        </a-button>
        <a-button
          v-if="current == steps.length - 2"
          type="primary"
          :loading="loadingSave"
          @click="handleSubmit"
        >
          提交
        </a-button>
        <a-button
          v-if="current > 0 && current < steps.length - 1"
          style="margin-left: 8px"
          @click="prev"
        >
          上一步
        </a-button>
        <div v-if="current === 2">
          <el-button type="primary" @click="handleContinue">继续创建</el-button>
          <el-button
            @click="$router.push({ name: 'marktIndex' })"
          >返回</el-button>
        </div>
      </div>
    </div>
    <SelectStore
      :dialog-visible.sync="dialogVisible"
      @relationList="selectStore"
    />
    <SelectFood
      v-if="current === 1"
      :dialog-visible.sync="dialogVisibleF"
      :active-id.sync="activeId"
      :active-name.sync="activeName"
      :store-ids="formData.storeIdList"
      :radio-orcheckbox="checkbox"
      @relationList="selectFood"
    />
    <el-dialog :visible.sync="visibleSetDiscount" title="批量设置折扣价">
      <div style="margin-bottom:20px">
        <span>设置为&nbsp;</span>
        <el-input-number v-model="SetDiscountV" :controls="false" :precision="1" :min="0.1" :max="9.9">
          <template slot="append">.com</template> </el-input-number>&nbsp;折
      </div>

      <div>
        <el-button type="primary" @click="handleSetDiscount">提 交</el-button>
        <el-button @click="visibleSetDiscount = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="visibleSetNumber" title="批量设置折扣份数">
      <div style="margin-bottom:20px">
        <span>设置为&nbsp;</span>
        <el-input-number v-model="SetNumberV" :controls="false" :precision="0">
          <template slot="append">.com</template> </el-input-number>&nbsp;份
      </div>

      <div>
        <el-button type="primary" @click="handleSetNumber">提 交</el-button>
        <el-button @click="visibleSetNumber = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SelectStore from '@/views/component/SelectStore'
import { parseTime } from '@/utils'
import SelectFood from '@/views/component/SelectFood'
import { fhAddDiscount } from '@/api/marketing/discount'
import { storeIdListV } from '@/utils/validate-form.js'

export default {
  components: {
    SelectStore,
    SelectFood
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
      console.log('aa', value)
      value ? callback() : callback('请选择时间段')
    }
    var dialogVisibleF = () => {
      this.dialogVisibleF = !this.dialogVisibleF

      console.log(this.dialogVisibleF)
    }
    var delAll = () => {
      console.log('deleall')
      if (this.checkedList.size > 0) {
        this.checkedList.forEach(val => {
          console.log('del', val)
          const index = Array.from(this.foodArr).indexOf(val)
          console.log('index', index)
          this.formData.discountFoodTemplateReqList.splice(index, 1)
          this.foodArr.delete(val)
        })
        this.checkedList.clear()
        this.$forceUpdate()
      } else {
        return
      }
      this.makeCheck()
    }
    var setPrice = () => {
      this.visibleSetDiscount = true
    }
    var setNumber = () => {
      this.visibleSetNumber = true
    }
    return {
      formStore: {
        storeIdList: []
      },
      rulesStore: {
        storeIdList: [{ validator: storeIdListV }]
      },
      checkbox: 'checkbox',
      visibleSetDiscount: false,
      SetDiscountV: 0,

      visibleSetNumber: false,
      SetNumberV: 0,
      checkedList: new Set(),
      isIndeterminate: false,
      id: new Date(), // 重置页面
      // 选择菜品
      activeId: [], // 已选择的菜品id
      activeName: [], // 已选择的菜品name
      dialogVisibleF: false,
      titleArr: [
        {
          name: '商品名称',
          label: 'name',
          span: 6,
          checkbox: true,
          tooltip: false
        },
        {
          name: '规格',
          label: 'format',
          span: 4,
          checkbox: false,
          tooltip: false
        },
        {
          name: '原价',
          label: 'price',
          span: 2,
          checkbox: false,
          tooltip: false
        },
        {
          name: '分类',
          label: 'sort',
          span: 3,
          checkbox: false,
          tooltip: false
        },
        {
          name: '折扣',
          label: 'discount',
          span: 2,
          checkbox: false,
          tooltip: false
        },
        {
          name: '商品限购份数',
          label: 'num',
          span: 3,
          checkbox: false,
          tooltip: {
            content: '0代表不限购',
            icon: 'info-circle'
          }
        },
        {
          name: '操作',
          label: 'action',
          span: 2,
          checkbox: false,
          tooltip: false
        }
      ],
      foodArr: new Set(),
      checkAll: false,
      handleArr: [
        {
          name: '批量删除',
          label: 'delAll',
          event: delAll,
          type: '',
          plain: true,
          size: 'small'
        },
        {
          name: '批量设置折扣价',
          label: 'setPrice',
          event: setPrice,
          type: '',
          plain: true,
          size: 'small'
        },
        {
          name: '批量设置限购份数',
          label: 'setNumber',
          event: setNumber,
          type: '',
          plain: true,
          size: 'small'
        },
        {
          name: '选择菜品',
          label: 'selectFood',
          event: dialogVisibleF,
          type: 'primary',
          plain: false,
          offset: 22,
          size: 'small'
        }
      ],
      current: 0,
      steps: [
        {
          title: '选择活动店铺'
        },
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
        effectivePeriod: [['00:00:00', '23:59:59']],
        actTime: '',
        weekCycle: '1'.repeat(7).split('')
      },
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'change' },
          { max: 10, message: '不能超过10个字符', trigger: 'change' }
        ],
        discount: [{ required: true, message: '请输入0.1至9.9的数字' }],
        limitNumber: [{ required: true, message: '请输入' }],
        effectivePeriod: [{ validator: effectivePeriodV }],
        effectiveChoose: [{ validator: effectiveChooseV }],
        actTime: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ]
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
      effectiveChoose: [...Array(7).keys()]
    }
  },
  computed: {
    // 已选择的菜品的规格集合
    foodSkuList() {
      const arr = []
      Array.from(this.foodArr).forEach((val, index) => {
        console.log('sku', val)
        this.$set(arr, index, val.foodSkuList)
      })
      return arr
    },
    canChangePeriod() {
      return this.formData.allDayFlag
    }
  },
  mounted() {
    window.app = this
  },
  methods: {
    inputACName(v) {
      this.$refs.form.validateField('activityName')
    },
    // 判断全选checkbox样式
    makeCheck() {
      const checkedCount = this.checkedList.size
      this.checkAll = checkedCount === this.foodArr.size
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.foodArr.size
    },
    // 批量设置折扣份数
    handleSetNumber() {
      this.visibleSetNumber = false
      this.formData.discountFoodTemplateReqList.forEach(val => {
        if (val.checked) {
          val.limitNumber = this.SetNumberV
        }
      })
    },
    // 批量设置折扣
    handleSetDiscount() {
      this.visibleSetDiscount = false
      this.formData.discountFoodTemplateReqList.forEach(val => {
        if (val.checked) {
          val.discount = this.SetDiscountV
        }
      })
    },
    handleCheckAll(checked) {
      console.log('checkedall')
      this.formData.discountFoodTemplateReqList.forEach(val => {
        val.checked = checked
      })
      this.checkedList = checked ? new Set(this.foodArr) : new Set()
    },
    // checkbox改变单个菜品
    handleCheckFood(item, index, checked) {
      console.log('aaa', item, index, checked)
      this.$set(
        this.formData.discountFoodTemplateReqList[index],
        'checked',
        checked
      )

      checked ? this.checkedList.add(item) : this.checkedList.delete(item)
      this.makeCheck()
    },
    // 菜品
    selectFood(item, id) {
      this.dialogVisibleF = false
      console.log('item', item)
      const result = [...item]
      result.forEach((val, index) => {
        // 默认展示菜品规格的第一项
        console.log('valaa', val)
        this.formData.discountFoodTemplateReqList[index] = val.foodSkuList[0]
        this.$set(
          this.formData.discountFoodTemplateReqList[index],
          'checked',
          false
        )
        this.formData.discountFoodTemplateReqList[index].foodTemplateSkuId =
          val.foodSkuList[0].id
      })
      this.foodArr = new Set(item)
    },
    //
    handel(fn) {
      fn()
    },
    // 改变规格select
    changeGuige(item, index) {
      this.formData.discountFoodTemplateReqList[index].foodTemplateSkuId =
        item.id
      this.$refs.form.validateField(
        `discountFoodTemplateReqList[${index}].discount`
      )
      this.$refs.form.validateField(
        `discountFoodTemplateReqList[${index}].limitNumber`
      )
    },
    // 删除
    deleteFood(item, index) {
      this.foodArr.delete(item)
      this.formData.discountFoodTemplateReqList.splice(index, 1)
      this.checkedList.delete(item)
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
      this.formData.effectivePeriod.push(['00:00:00', '23:59:59'])
    },
    delPeriod(i) {
      this.formData.effectivePeriod.splice(i, 1)
    },
    changeAllDay() {
      this.formData.effectivePeriod = [['00:00:00', '23:59:59']]
      // this.$refs.form.validate()
    },
    changelimitNumber(v) {
      if (v) {
        this.formData.limitNumber = 1
      }
    },
    changeReduce(v) {
      if (v) {
        this.formData.reduceFee = 0
      }
    },
    selectStore(item, id) {
      this.storeArr = item
      this.formData.storeIdList = id
      this.formStore.storeIdList = id
      this.$refs.formStore.validateField('storeIdList')
    },
    handleNext() {
      this.$refs.formStore.validate(valid => {
        if (valid) {
          this.current += 1
        }
      })
    },
    // 添加请求
    async handleAdd() {
      this.loadingSave = true
      const sendData = Object.assign({}, this.formData)
      sendData.weekCycle = sendData.weekCycle.join('')
      sendData.effectivePeriod =
        sendData.effectivePeriod.length > 1
          ? this.formatPeriod(sendData.effectivePeriod)
          : []
      try {
        const { code } = await fhAddDiscount(sendData)
        if (code === 200) {
          this.current += 1
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
.ant-steps {
  margin-bottom: 30px;
}
.selectS {
  font-weight: 700;
  color: #333;
  font-size: 18px;
  padding: 0 6px;
  border-left: 4px solid #52ACFF;
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
.express-time-box {
  display: inline-block;
  padding: 0 12px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 18px;
  height: 36px;
  cursor: pointer;
}

.curr-exp-time {
  background: #52ACFF;
  color: #fff;
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
</style>
