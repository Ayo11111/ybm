<template>
  <div v-loading="btnLoad">
    <div class="btn_group">
      <el-radio-group v-model="week" @change="setWeek">
        <el-radio-button
          v-for="(item, index) in btnList"
          :key="index"
          :label="item.value"
          >{{ item.label }}</el-radio-button
        >
      </el-radio-group>
    </div>

    <el-form
      ref="form"
      :model="query"
      :rules="rules"
      class="select"
      label-suffix=":"
      style="margin-top: 34px"
    >
      <el-form-item v-for="(item, index) in data" :key="index">
        <el-row>
          <el-col :span="4" class="time_food">
            <span>{{ item.periodStr }}</span>
          </el-col>
          <el-col :span="6" style="margin-left: 20px">
            <el-button type="primary" @click="selectFood(item.foodList, index)"
              >选择菜品</el-button
            >
          </el-col>
        </el-row>
        <el-table
          :data="item.foodList"
          style="margin-top: 25px"
          tooltip-effect="dark"
          :header-cell-style="$getRowClass"
          class="food-table"
        >
          <el-table-column
            v-for="(item, ind) in columnArr"
            :key="ind"
            :label="item.header ? undefined : item.label"
            :prop="item.slot ? undefined : item.prop"
            :width="item.width"
            :min-width="item.minWidth"
          >
            <template v-if="item.header" slot="header">
              {{ item.label }}
              <el-tooltip
                v-if="item.header.tooltip"
                class="item"
                effect="dark"
                placement="top-start"
              >
              <div slot="content" v-html="item.header.tooltip.content"></div>
                <a-icon
                  v-if="item.header.tooltip.icon"
                  :type="item.header.tooltip.icon"
                />
              </el-tooltip>
            </template>

            <template slot-scope="{ row }">
              <span v-if="!item.slot && !item.type">{{ row[item.prop] }}</span>
              <div v-if="item.type === 'checked'">
                <el-checkbox v-model="row[item.prop]" @change="getCheckVal($event, `${index}${Json[week][index].foodList.indexOf(row)}`)"></el-checkbox>
                是
              </div>
              <el-form-item
                :ref="`${index}${Json[week][index].foodList.indexOf(row)}${item.prop}`"
                v-if="item.slot && item.input.type !== 'el-button'"
                :control="false"
                :prop="`${index}-${Json[week][index].foodList.indexOf(row)}-${row.newGroupMemberFoodFlag}-${item.prop}`"
                :rules="rules[item.prop]"
              >
                <el-input-number
                  v-if="item.input.type === 'el-input-number'"
                  v-model="row[item.prop]"
                  :controls="false"
                  :disabled="item.input.disabled ? !row[item.input.disabled] : false"
                  :precision="item.input.precision"
                  :max="item.input.maxProp ? row[item.input.maxProp] : item.input.max"
                  :min="item.input.minProp ? row[item.input.minProp] : item.input.min"
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
                @click="handelCol(item.input.event, row, index)"
                >{{ item.input.innerHtml }}</span
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-row style="margin-top: 25px" :gutter="20" v-show="item.foodName">
          <el-col style="display: flex" :span="5">
            菜品活动价格:  
            <el-form-item style="flex:1;" :prop="`${index}`" :rules="[{ validator: checkPrice, trigger: 'blur' }]">
              <el-input-number v-model="item.foodDiscountPrice" :controls="false" :min="0.01" :precision="2" style="width: 100%;margin-left: 12px"/>
            </el-form-item>
          </el-col>
          <el-col style="display: flex" :span="5">
            菜品数量: 
            <el-form-item style="flex:1;" :prop="`${index}`" :rules="[{ validator: checkCount, trigger: 'blur' }]">
              <el-input-number v-model="item.foodLimitCount" :controls="false" :min="1" style="width: 100%;margin-left: 12px"/>
            </el-form-item>
          </el-col>
        </el-row> -->
      </el-form-item>
      <el-form-item label="活动订单配送费" prop="deliveryPriceDiscount">
        <el-input-number
          v-model="query.deliveryPriceDiscount"
          :min="0"
          :precision="2"
          :controls="false"
          placeholder="请输入配送费金额"
        />
      </el-form-item>
    </el-form>
    <a-divider dashed />
    <div class="btn">
      <el-button type="primary" @click="save" :loading="btnLoad"
        >保存</el-button
      >
      <el-button :loading="btnLoad" @click="getGroupDetail">取消</el-button>
    </div>
    <SelectFood
      v-if="resetFood"
      :dialogVisible.sync="dialogFood"
      :active-name="activeName"
      radio-orcheckbox="checkbox"
      @selectFood="selectFoodFn"
    />
    <!-- <div v-if="dialogFood">
      
    </div> -->
    <!-- <select-food :dialog-visible="true" /> -->
  </div>
</template>

<script>
import SelectFood from '@/views/component/SelectFood.vue'
import { fhGetGroupDetail, fhPutGroupUpdate } from '@/api/group'
import ActivityTable from './ActivityTable'
const timeList = [
  { time: '10:00-11:00', food: '欢乐双人套餐', value: 1 },
  { time: '10:00-11:00', food: '欢乐双人套餐', value: 1 },
  { time: '10:00-11:00', food: null, value: null }
]

export default {
  components: { SelectFood, ActivityTable },
  data() {
    var checkDelivery = (rule, value, callback) => {
      if (
        this.query.deliveryPriceDiscount ||
        this.query.deliveryPriceDiscount === 0
      ) {
        callback()
      } else {
        callback(new Error('请填写'))
      }
    }
    var checkPrice = (rule, value, callback) => {
      let indexArr = rule.field.split('-')
      if (
        this.Json[this.week][indexArr[0]].foodList[indexArr[1]]
          .foodDiscountPrice ||
        this.Json[this.week][indexArr[0]].foodList[indexArr[1]]
          .foodDiscountPrice === 0
      ) {
        callback()
      } else {
        callback(new Error(`请填写`))
      }
    }
    var checkCount = (rule, value, callback) => {
      let indexArr = rule.field.split('-')
      if (
        this.Json[this.week][indexArr[0]].foodList[indexArr[1]]
          .foodLimitCount ||
        this.Json[this.week][indexArr[0]].foodList[indexArr[1]]
          .foodLimitCount === 0
      ) {
        callback()
      } else {
        callback(new Error(`请填写`))
      }
    }
    var checkSpecialDiscountFoodPrice = (rule, value, callback) => {
      let indexArr = rule.field.split('-')
      if (indexArr[2] === "true" && !this.Json[this.week][indexArr[0]].foodList[indexArr[1]].specialDiscountFoodPrice) {
        callback(new Error(`请填写`))
      } else {
        callback()
      }
    }
    var checkSpecialDiscountFoodLimitCount = (rule, value, callback) => {
      let indexArr = rule.field.split('-')
      if (indexArr[2] === "true" && !this.Json[this.week][indexArr[0]].foodList[indexArr[1]].specialDiscountFoodLimitCount) {
        callback(new Error(`请填写`))
      } else {
        callback()
      }
    }
    return {
      dialogFood: false,
      timeList,
      checkPrice,
      checkCount,
      day: {
        星期一: '周一',
        星期二: '周二',
        星期三: '周三',
        星期四: '周四',
        星期五: '周五',
        星期六: '周六',
        星期日: '周日'
      },
      btnList: [],
      activeName: [],
      rules: {
        // price: [
        //   { required: true, message: '请填写', trigger: ['blur', 'change'] }
        // ],
        foodDiscountPrice: [{ validator: checkPrice, trigger: 'blur' }],
        foodLimitCount: [{ validator: checkCount, trigger: 'blur' }],
        deliveryPriceDiscount: [
          { validator: checkDelivery, trigger: ['blur', 'change'] }
        ],
        specialDiscountFoodPrice: [
          { validator: checkSpecialDiscountFoodPrice, trigger: 'blur' }
        ],
        specialDiscountFoodLimitCount: [
          { validator: checkSpecialDiscountFoodLimitCount, trigger: 'blur' }
        ]
      },
      formData: {
        phone: [
          { value: 1, model: 'price', price: 0, name: '美味猪脚' },
          { value: 1, model: 'price', price: 0, name: '美味猪脚' },
          { value: 1, model: 'price', price: 0, name: '' }
        ],
        delivery: null
      },
      week: '星期一',
      oldWeek: '星期一',
      Json: {},
      data: [],
      query: {
        deliveryPriceDiscount: 0,
        id: null,
        status: true,
        weekList: []
      },
      setIndex: 0,
      resetFood: true,
      btnLoad: false,
      columnArr: [
        {
          name: '',
          label: '商品名称',
          prop: 'foodName',
          minWidth: '170px',
          input: false,
          slot: false,
          tooltip: false,
          header: ''
        },
        {
          name: 'price',
          label: '原价',
          prop: 'price',
          slot: false,
          input: false,
          tooltip: false,
          header: ''
        },
        // {
        //   name: 'sort',
        //   label: '分类',
        //   prop: 'sort',
        //   width: '',
        //   slot: false,
        //   input: false,
        //   tooltip: false,
        //   header: false
        // },
        {
          name: '',
          label: '团餐价',
          prop: 'foodDiscountPrice',
          minWidth: '170px',
          slot: true,
          input: {
            prop: 'discount',
            type: 'el-input-number',
            model: 'discount',
            min: 0.01,
            max: 999999,
            minProp: 'specialDiscountFoodPrice',
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
          label: '菜品数量',
          prop: 'foodLimitCount',
          minWidth: '150px',
          slot: true,
          input: {
            prop: '',
            type: 'el-input-number',
            model: 'limitNumber',
            min: 1,
            max: 999999,
            minProp: 'specialDiscountFoodLimitCount',
            precision: 0,
            placeholder: '',
            before: '',
            after: ''
          },
          header: {
            tooltip: {
              content: '例：菜品数量设100，则所有店铺的菜品库存均为100',
              icon: 'info-circle'
            }
          }
        },
        {
          name: 'newGroupMemberFoodFlag',
          label: '是否特惠菜品',
          prop: 'newGroupMemberFoodFlag',
          slot: false,
          input: false,
          tooltip: false,
          header: '',
          type: 'checked',
          header: {
            tooltip: {
              content: '设为特惠菜品后可设置特惠菜品价格及每日限量抢数量；<br/>特惠菜品参与新人首单专享及每日特惠老用户限量抢',
              icon: 'info-circle'
            }
          }
        },
        {
          name: 'specialDiscountFoodPrice',
          label: '每日特惠价格',
          prop: 'specialDiscountFoodPrice',
           minWidth: '150px',
          slot: true,
          input: {
            prop: '',
            type: 'el-input-number',
            model: 'limitNumber',
            min: 0.01,
            max: 999999,
            maxProp: 'foodDiscountPrice',
            precision: 2,
            placeholder: '',
            before: '',
            after: '',
            disabled: 'newGroupMemberFoodFlag'
          }
        },
        {
          name: 'specialDiscountFoodLimitCount',
          label: '每日特惠限量抢',
          prop: 'specialDiscountFoodLimitCount',
          minWidth: '150px',
          slot: true,
          input: {
            prop: '',
            type: 'el-input-number',
            model: 'limitNumber',
            min: 1,
            max: 999999,
            maxProp: 'foodLimitCount',
            precision: 0,
            placeholder: '',
            before: '',
            after: '',
            disabled: 'newGroupMemberFoodFlag'
          },
          header: {
            tooltip: {
              content: '对老用户开放一定数量特惠套餐每日限量开抢；特惠菜品方可设置',
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
      ]
    }
  },
  mounted() {
    window.ac = this
    this.getGroupDetail()
  },
  methods: {
    async getGroupDetail() {
      this.btnLoad = true
      try {
        const { results } = await fhGetGroupDetail()
        results.status = true
        this.btnList = []
        results.activityWeekList.forEach((item, index) => {
          if (index === 0) {
            this.week = item
            this.oldWeek = item
          }
          this.btnList.push({
            label: this.day[item],
            value: item
          })
        })
        this.$emit(
          'setHead',
          results.activityWeekList,
          results.activityPeriodList,
          results.storeList
        )
        this.query = results
        results.weekList.forEach(item => {
          this.Json[item.name] = item.periods
          for (let i = 0;i < item.periods.length; i++) {
            for (let c = 0;c < item.periods[i].foodList.length; c++) {
              if (!item.periods[i].foodList[c].specialDiscountFoodPrice) {
                item.periods[i].foodList[c].specialDiscountFoodPrice = undefined
                item.periods[i].foodList[c].specialDiscountFoodLimitCount = undefined
              }
            }
          }
        })
        this.data = this.Json[this.week]
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    async putGroupUpdate() {
      this.btnLoad = true
      try {
        await fhPutGroupUpdate(this.query)
        this.$message.success('保存成功')
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    setWeek(e) {
      this.Json[this.oldWeek] = this.data
      this.data = this.Json[e]
      this.oldWeek = e
    },
    // 点击选择菜品按钮的方法
    selectFood(foodList, index) {
      this.setIndex = index
      this.activeName = []
      foodList.forEach(item => {
        this.activeName.push({
          id: item.foodTemplateId,
          name: item.foodName,
          price: item.price,
          skuId: item.foodTemplateSkuId
        })
      })
      this.dialogFood = true
    },
    // 选择菜品后的方法
    selectFoodFn(list) {
      if (list.length > 0) {
        list.forEach(item => {
        if (this.activeName.indexOf(item) === -1) {
          let id = item.foodSkuList ? item.foodSkuList[0].id : item.skuId
          let price = item.foodSkuList ? item.foodSkuList[0].price : item.price
          this.data[this.setIndex].foodList.push({
            foodName: item.name,
            foodTemplateSkuId: id,
            price: price
          })
        }
      })
      } else {
        this.data[this.setIndex].foodList = []
      }
      this.resetFood = false
      this.$nextTick(() => {
        this.resetFood = true
      })
    },
    handelCol(fn, row, index) {
      if (fn === 'deleteFood') {
        this.deleteFood(row, index)
      }
    },
    // 删除
    deleteFood(item, index) {
      let foodIndex = this.Json[this.week][index].foodList.indexOf(item)
      this.Json[this.week][index].foodList.splice(foodIndex, 1)
    },
    getCheckVal(v, prop) {
      if (!v) {
        this.$refs[`${prop}specialDiscountFoodPrice`][0].clearValidate()
        this.$refs[`${prop}specialDiscountFoodLimitCount`][0].clearValidate()
      }
    },
    save() {
      this.query.weekList.forEach(item => {
        item.periods = this.Json[item.name]
      })
      this.$refs.form.validate(valid => {
        if (valid) {
          this.putGroupUpdate()
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.btn_groupt {
  margin-bottom: 34px;
}
.time_food {
  background: #f7f8fa;
  color: #999999;
  padding-left: 20px;
  .food,
  .no_food {
    margin-left: 20px;
  }
  .no_food {
    color: #52ACFF;
  }
}
.food-table ::v-deep .el-form-item {
  margin: 16px 0;
}
</style>
