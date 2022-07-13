<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-08 10:08:28
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-10 17:43:34
-->
<template>
  <a-modal
    :title="title"
    :visible="visible"
    width="600px"
    centered
    :confirm-loading="confirmLoading"
    :ok-text="okText"
    @ok="handleOk"
    @cancel="$emit('update:visible', false)"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="query"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="query.name" placeholder="请输入10个字以内" />
      </el-form-item>
      <el-form-item label="分类描述" prop="description">
        <el-input v-model="query.description" placeholder="请输入40个字以内" />
      </el-form-item>
      <el-form-item label="分类属性" prop="type">
        <a-radio-group
          v-model="query.type"
          @change="$refs.form.validateField('type')"
        >
          <a-radio :style="radioStyle" :value="1" style="display: flex">
            普通分类<br>
            <span style="color: #999;font-size: 13px;margin-left: 28px">
              如果商品分类中有下单必选分类，则普通分类下的商品不能单独下单。
            </span>
          </a-radio>
          <a-radio :style="radioStyle" :value="2">
            下单必选分类<br>
            <span style="color: #999;font-size: 13px;margin-left: 28px">
              顾客下单时必须购买此分类下的任意商品。
            </span>
          </a-radio>
        </a-radio-group>
      </el-form-item>
      <el-form-item label="分时置顶">
        <!-- prop="dayOfWeekList" -->
        <el-form-item style="margin-bottom: 25px">
          <el-checkbox-group
            v-model="checkedCities"
            style="line-height: 30px;margin-top: 4px"
          >
            <el-checkbox
              v-for="city in cities"
              :key="city.value"
              :label="city.value"
              @change="v => handleCheckedCitiesChange(v, city.value)"
            >
              {{ city.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <div
          v-for="(item, index) in timeJson"
          :key="index"
          style="margin-bottom: 18px"
        >
          <!-- :prop="`${index}-time`"
            :rules="{
              validator: validateItemTime,
              trigger: 'change'
            }" -->
          <el-form-item>
            <el-time-picker
              v-model="item.time"
              is-range
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
              format="HH:mm"
              value-format="HH:mm:ss"
            />
            <a-button
              type="link"
              style="color: red"
              @click="deleteItemTime(index)"
            >删除时间段</a-button>
          </el-form-item>
        </div>
        <!-- prop="time" -->
        <el-form-item>
          <el-button
            type="primary"
            style="margin-top: 5px"
            @click="addItemTime"
          >
            添加时间段
          </el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <a-modal title="提示" :visible="infoVisible" centered>
      <p>商品信息需要经过平台审核后才可生效，可在待审核里进行查看和编辑。</p>
      <template slot="footer">
        <a-button type="primary" @click="next">
          我知道
        </a-button>
      </template>
    </a-modal>
  </a-modal>
</template>

<script>
import { fhPostCategories, fhGetCatDetails } from '@/api/categories'
import { fhGetCateAutitsDetails } from '@/api/commodity'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    cateData: {
      type: Object,
      default: () => {}
    },
    editLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateDayOfWeekList = (rule, value, callback) => {
      if (this.checkedCities.length > 0) {
        callback()
      } else {
        callback(new Error('请选择置顶周期'))
      }
    }
    var validateItemTime = (rule, value, callback) => {
      const { field } = rule
      const index = field.split('-')[0]
      const { time } = this.timeJson[index]
      if (time) {
        callback()
      } else {
        callback(new Error('请选择时间段'))
      }
    }
    var validateTime = (rule, value, callback) => {
      if (this.timeJson.length > 0) {
        callback()
      } else {
        callback(new Error('请添加时间段'))
      }
    }
    return {
      validateItemTime,
      confirmLoading: false,
      infoVisible: false,
      loading: false,
      query: {
        type: 1
      },
      checkedCities: [],
      timeJson: [],
      cities: [
        {
          label: '周一',
          value: 1
        },
        {
          label: '周二',
          value: 2
        },
        {
          label: '周三',
          value: 3
        },
        {
          label: '周四',
          value: 4
        },
        {
          label: '周五',
          value: 5
        },
        {
          label: '周六',
          value: 6
        },
        {
          label: '周日',
          value: 7
        },
        {
          label: '全选',
          value: 'all'
        }
      ],
      radioStyle: {
        display: 'block',
        height: '50px',
        lineHeight: '25px',
        marginTop: '6px'
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ],
        type: [
          {
            required: true,
            message: '请选择分类属性',
            trigger: 'change'
          }
        ],
        dayOfWeekList: [
          {
            validator: validateDayOfWeekList,
            trigger: 'change'
          }
        ],
        time: [
          {
            validator: validateTime,
            trigger: ['click', 'change']
          }
        ]
      }
    }
  },
  computed: {
    title() {
      return this.type === 'add' ? '创建分类' : '编辑分类'
    },
    okText() {
      return this.type === 'add' ? '创建' : '编辑'
    }
  },
  watch: {
    visible(newVal) {
      if (newVal === false) {
        this.$emit('update:cateData', {})
      }
    },
    cateData(newVal) {
      if (newVal && newVal.id) {
        this.getCateDetails(newVal.id)
      }
      // if (!newVal.type) newVal.type = 1
      // this.query = Object.assign({}, newVal)
    },
    editLoad(newVal) {
      this.confirmLoading = newVal
    },
    type(newVal) {
      console.log(this.type)
      this.query = {
        type: 1
      }
      this.timeJson = []
      this.checkedCities = []
      this.$emit('update:cateData', {})
    }
  },
  methods: {
    async postCategories(params) {
      this.confirmLoading = true
      try {
        await fhPostCategories(params)
        this.$message.success('创建成功')
        this.infoVisible = true
      } catch (err) {
        console.log(err)
      }
      this.confirmLoading = false
    },
    async getCateDetails(id) {
      this.loading = true
      try {
        const { results } =
          this.type === 'edit'
            ? await fhGetCatDetails(id)
            : await fhGetCateAutitsDetails(id)
        this.query = results
        if (this.query.period) {
          const { timePeriodList, dayOfWeekList } = this.query.period
          const timeJson = []
          if (timePeriodList) {
            timePeriodList.forEach(item => {
              const { startTime, endTime } = item
              timeJson.push({
                time: [startTime, endTime]
              })
            })
          }
          this.timeJson = timeJson
          if (dayOfWeekList) {
            if (dayOfWeekList.length === 7) {
              this.checkedCities = [1, 2, 3, 4, 5, 6, 7, 'all']
            } else {
              this.checkedCities = dayOfWeekList
            }
          } else {
            this.checkedCities = []
          }
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const timePeriodList = []
          for (let i = 0; i < this.timeJson.length; i++) {
            const { time } = this.timeJson[i]
            if (time) {
              const [startTime, endTime] = time
              timePeriodList.push({
                startTime,
                endTime
              })
            }
          }
          if (timePeriodList.length > 0) {
            this.query.period = Object.assign({}, this.query.period, {
              timePeriodList
            })
          }
          if (this.query.dayOfWeekList && this.query.dayOfWeekList.length > 0) {
            this.query.period = Object.assign({}, this.query.period, {
              dayOfWeekList: this.query.dayOfWeekList
            })
          }
          if (this.type === 'add') {
            this.postCategories(this.query)
          } else {
            this.$emit('putFoodCats', this.query)
          }
        } else {
          return false
        }
      })
    },
    handleCheckedCitiesChange(v, key) {
      if (!this.query.dayOfWeekList) {
        this.query.dayOfWeekList = []
      }
      if (key === 'all') {
        this.checkAll(v)
      } else {
        this.query.dayOfWeekList = this.checkedCities
      }
    },
    checkAll(v) {
      if (v) {
        this.checkedCities = [1, 2, 3, 4, 5, 6, 7, 'all']
        this.query.dayOfWeekList = [1, 2, 3, 4, 5, 6, 7]
      } else {
        this.checkedCities = []
        this.query.dayOfWeekList = []
      }
    },
    deleteItemTime(index) {
      this.timeJson.splice(index, 1)
      this.$forceUpdate()
    },
    addItemTime() {
      if (this.checkedCities.length > 0) {
        this.timeJson.push({ time: ['00:00:00', '23:59:00'] })
        this.$refs.form.validateField('time')
      } else {
        this.$message.error('请先选择置顶周期')
      }
    },
    next() {
      this.infoVisible = false
      this.$emit('update:visible', false)
      this.query = {
        type: 1
      }
      this.checkedCities = []
      this.timeJson = []
      this.$parent.changeMenu(4)
    }
  }
}
</script>

<style></style>
