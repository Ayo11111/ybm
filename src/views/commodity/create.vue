<template>
  <div v-loading="mainLoad" class="container">
    <el-form
      ref="form"
      label-width="120px"
      :model="formData"
      :rules="formRules"
      size="small"
      :disabled="disabledform === 1"
    >
      <el-form-item label="商品分类" prop="categoryId">
        <filter-select
          :async-get-data="ghGetCates"
          :value.sync="formData.categoryId"
          vk="id"
          vv="id"
          vl="name"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input
          v-model="formData.name"
          placeholder="请输入商品名称"
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input
          v-model="formData.introduction"
          type="textarea"
          :rows="5"
          placeholder="请输入商品描述(100字以内)"
          style="width: 500px"
        />
      </el-form-item>
      <el-form-item label="商品图片" prop="images">
        <span>建议尺寸 600 x 450; (第一张为缩略图) 最多上传5张</span>
        <div class="flex" style="display: flex">
          <oss-upload
            :path="ossPath"
            :limit="5"
            :disabled="disabledform === 1"
            :files="detailImgs"
            @change="option => detailUploadChange(option, 'images')"
          />
        </div>
      </el-form-item>
      <el-form-item label="商品规格">
        <span>商品规格决定价格和库存，如大份、小份</span><br>
        <template v-for="(i, k) in skusForm">
          <div :key="k" class="has-del-box" style="width: 600px">
            <el-button
              v-show="skusForm.length > 1"
              class="btn-del"
              icon="el-icon-close"
              type="text"
              @click="delSku(k)"
            />
            <el-form
              ref="skuForm"
              class="mb-12"
              :label-position="labelPosition"
              label-width="80px"
              :model="i"
              size="small"
              :disabled="disabledform === 1"
              style="background: #f7f8fa; padding: 10px 20px"
            >
              <el-row :gutter="24">
                <el-col :span="24">
                  <el-form-item
                    label="规格名称："
                    prop="name"
                    :rules="[
                      {
                        required: true,
                        message: '请输入规格名',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input v-model="i.name" placeholder="例如：大份、小份" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="价格："
                    prop="price"
                    :rules="[
                      {
                        required: true,
                        message: '请输入价格',
                        trigger: 'change'
                      },
                      {
                        type: 'number',
                        message: '请输入大于0的数字',
                        trigger: 'change',
                        min: 0
                      }
                    ]"
                  >
                    <el-input-number
                      v-model="i.price"
                      :min="0"
                      :controls="false"
                      placeholder="请输入商品价格"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="库存："
                    :prop="`${k}-stock`"
                    :rules="[
                      {
                        validator: validateItemStock,
                        trigger: ['blur', 'change']
                      },
                      {
                        type: 'integer',
                        message: '请输入大于0的整数',
                        trigger: 'change',
                        min: 0
                      }
                    ]"
                  >
                    <div style="display: flex">
                      <el-input-number
                        v-model="i.stock"
                        style="flex: 1; margin-right: 10px"
                        :min="0"
                        :controls="false"
                        placeholder="请输入当前库存"
                      />
                      <el-input-number
                        v-model="i.dailyStock"
                        style="flex: 1"
                        :min="0"
                        :controls="false"
                        placeholder="请输入每日库存"
                      />
                    </div>
                    <el-checkbox
                      v-model="i.dailyStockStatus"
                    >每日自动补足库存</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="份量："
                    prop="weight"
                    :rules="[
                      {
                        required: true,
                        message: '请输入商品份量',
                        trigger: 'change'
                      },
                      {
                        type: 'number',
                        message: '请输入大于0的数字',
                        trigger: 'change',
                        min: 0
                      }
                    ]"
                  >
                    <div style="display: flex; align-items: center">
                      <el-input-number
                        v-model="i.weight"
                        style="flex: 1"
                        :min="1"
                        :controls="false"
                        placeholder="请输入商品份量"
                      />
                      <el-form-item
                        label=""
                        :prop="`${k}-unit`"
                        :rules="[
                          {
                            validator: validateItemUnit,
                            trigger: ['blur', 'change']
                          }
                        ]"
                        style="margin-bottom: 0"
                      >
                        <el-cascader
                          v-model="i.unitItem"
                          style="width: 100px"
                          :options="options"
                          :show-all-levels="false"
                          @change="v => setItemUnit(v, k)"
                        />
                        <!-- <a-cascader
                          style="width: 100px"
                          :field-names="{
                            label: 'optionContent',
                            value: 'optionContent',
                            children: 'childrenContents'
                          }"
                          :options="options"
                          placeholder="请选择份量单位"
                          @change="v => setItemUnit(v, k)"
                        /> -->
                        <!-- @change="onChange"  -->
                      </el-form-item>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="包装费："
                    prop="packagePrice"
                    :rules="[
                      {
                        required: true,
                        message: '请输入餐盒费',
                        trigger: 'change'
                      }
                    ]"
                  >
                    <el-input-number
                      v-model="i.packagePrice"
                      :min="0"
                      :controls="false"
                      placeholder="请输入餐盒费"
                    >
                      <template slot="append">元</template>
                    </el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </template>
        <el-button size="small" @click="addSku"> 添加规格 </el-button>
      </el-form-item>
      <el-form-item />

      <el-form-item label="商品属性">
        <template v-for="(i, k) in attriFrom">
          <div :key="k" class="has-del-box attributes-box" style="width: 650px">
            <el-button
              v-show="attriFrom.length > 1"
              class="btn-del"
              icon="el-icon-close"
              type="text"
              @click="delAttri(k)"
            />
            <div class="attri-box">
              <div class="attri-label-box">
                <el-input v-model="i.key" placeholder="请输入属性名称" />
              </div>
              <div class="attri-value-box">
                <el-row :gutter="24">
                  <el-col v-for="(ji, jk) in 9" :key="jk" :span="8">
                    <el-input
                      :key="jk"
                      v-model="i.value[jk]"
                      placeholder="请输入属性值"
                      @input="testInput($event, jk, k)"
                    />
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </template>
        <el-button size="small" @click="addAttri">添加属性</el-button>
      </el-form-item>

      <el-form-item label="最小购买量" prop="startNum">
        <span> 最小购买量为下单时加购物车一次会有多少份</span><br>
        <el-input-number
          v-model="formData.startNum"
          :min="1"
          :controls="false"
          step-strictly
          style="width: 350px"
          class="inputNumber"
          placeholder="请输入最小购买量"
        />
      </el-form-item>

      <el-form-item label="可售时间">
        <a-radio-group
          v-model="formData.allPeriodStatus"
          style="margin-top: 5px"
          @change="$refs.form.validateField('type')"
        >
          <a-radio :value="true"> 全时段售卖 </a-radio>
          <a-radio :value="false"> 自定义时间 </a-radio>
          <div v-show="!formData.allPeriodStatus">
            <el-form-item style="margin-bottom: 24px" prop="dayOfWeekList">
              <el-checkbox-group
                v-model="checkedCities"
                style="line-height: 30px; margin-top: 10px"
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
              <el-form-item
                :prop="`${index}-time`"
                :rules="{
                  validator: validateItemTime,
                  trigger: 'change'
                }"
              >
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
            <el-form-item prop="time">
              <el-button
                type="primary"
                style="margin-top: 5px"
                @click="addItemTime"
              >
                添加时间段
              </el-button>
            </el-form-item>
          </div>
        </a-radio-group>
      </el-form-item>
    </el-form>
    <el-divider />
    <el-button
      v-if="disabledform !== 1"
      type="primary"
      :loading="saveLoad"
      @click="handlerSaveBtn"
    >
      保存
    </el-button>
    <el-button @click="$router.go(-1)">{{
      disabledform !== 1 ? '取消' : '返回'
    }}</el-button>
    <a-modal title="提示" :visible="infoVisible" centered>
      <p>商品信息需要经过平台审核后才可生效，可在待审核里进行查看和编辑。</p>
      <template slot="footer">
        <a-button type="primary" @click="handleOk"> 我知道 </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import { ghGetCates, fhGetfoodPeriods, fhGetTagsList } from '@/api/categories'
import { fhGetFoodTemplateDetail } from '@/api/foodtemplate'
import {
  fhGetStoreCommDetail,
  fhPostAddStoreFood,
  fhPutEditStoreFood
} from '@/api/stores/commodity'
import { fhGetFoodAutitsDetails, fhPutFoodAutits } from '@/api/commodity'
import { getUserInfo } from '@/utils/auth'
import FilterSelect from '@/components/FilterSelect'
import OssUpload from '@/components/OssUpload'
import { baseRules } from './_utils'
import { getStoreId } from '@/utils/auth'
import { fhGetDictionariesDetails } from '@/api/dictionaries'
// import { options } from './index'
export default {
  components: {
    FilterSelect,
    OssUpload
  },
  data() {
    var validateDayOfWeekList = (rule, value, callback) => {
      if (this.formData.allPeriodStatus) {
        callback()
        return
      }
      if (this.checkedCities.length > 0) {
        callback()
      } else {
        callback(new Error('请选择置顶周期'))
      }
    }
    var validateItemTime = (rule, value, callback) => {
      if (this.formData.allPeriodStatus) {
        callback()
        return
      }
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
      if (this.formData.allPeriodStatus) {
        callback()
        return
      }
      if (this.timeJson.length > 0) {
        callback()
      } else {
        callback(new Error('请添加时间段'))
      }
    }
    var validateItemStock = (rule, value, callback) => {
      const { field } = rule
      const index = field.split('-')[0]
      const { stock, dailyStock } = this.skusForm[index]
      if (!stock || !dailyStock) {
        callback(new Error('请输入商品库存'))
      } else if (
        `${stock}`.indexOf('.') > 0 ||
        `${dailyStock}`.indexOf('.') > 0
      ) {
        callback(new Error('请输入整数'))
      } else {
        callback()
      }
    }

    var validateItemUnit = (rule, value, callback) => {
      const { field } = rule
      const index = field.split('-')[0]
      const { unit } = this.skusForm[index]
      if (unit) {
        callback()
      } else {
        callback(new Error('请选择份量单位'))
      }
    }

    const formRules = {
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
    for (const i in baseRules) {
      const { message, rules } = baseRules[i]
      if (message) {
        formRules[i] = [{ required: true, message, trigger: 'change' }]
      }
      if (rules) {
        formRules[i] = formRules[i] ? formRules[i].concat(rules) : rules
      }
    }
    return {
      // options,
      options: [],
      infoVisible: false,
      validateItemUnit,
      validateItemTime,
      validateItemStock,
      labelPosition: 'top',
      // 加载中
      mainLoad: false,
      // 表单数据
      formData: {
        importStatus: 0,
        foodPeriodIds: [],
        allPeriodStatus: true
      },
      checkedCities: [],
      timeJson: [],
      store_id: null,
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
      formRules,
      state: false,
      skusForm: [{ name: '常规', dailyStockStatus: false }],
      saveLoad: false,
      ossPath: '',
      attriFrom: [],
      miniImageFiles: [],
      // 详情大图
      detailImgs: [],
      // 出售时间段
      periods: [],
      audits: null,
      unitArray: {}
    }
  },
  async created() {
    this.getDictionariesDetails('dish_unit')
    window.create = this
    const { id } = this.$route.params
    const { storeId = null, disabledform, audits } = this.$route.query
    this.audits = audits
    this.getstoreId()
    if (id) {
      this.$route.meta.title = disabledform ? '商品详情' : '编辑商品'
      this.id = id
    } else {
      this.$route.meta.title = '新建商品'
    }
    this.getPeriods()
    this.disabledform = +disabledform
    this.storeId = storeId
    const { merchantId } = (await getUserInfo()) || {}
    this.ossPath = `footTemplate/${merchantId}`
  },
  mounted() {},
  methods: {
    // input框测试回调
    testInput(e, index, fromIndex) {
      if (e === '') {
        // console.log(e)
        // console.log(this.attriFrom)
        // console.log(index, 'Index')
        // console.log(fromIndex, 'fromIndex')
        this.attriFrom[fromIndex].value.splice(index, 1)
      }
    },
    // 获取商品分类
    ghGetCates,
    // 获取标签列表
    fhGetTagsList,
    // 获取时间段
    async getstoreId() {
      try {
        const results = await getStoreId()
        this.store_id = results
      } catch (err) {
        console.log(err)
      }
    },
    async getDictionariesDetails(type) {
      try {
        const { results } = await fhGetDictionariesDetails(type)
        const { optionContents } = results
        for (let i = 0; i < optionContents.length; i++) {
          const { optionContent, childrenContents } = optionContents[i]
          optionContents[i].label = optionContent
          optionContents[i].value = optionContent
          if (childrenContents.length > 0) {
            for (let c = 0; c < childrenContents.length; c++) {
              const {
                optionContent: oneChildrenOptionContent,
                childrenContents: oneChildrenContents
              } = childrenContents[c]
              childrenContents[c].label = oneChildrenOptionContent
              childrenContents[c].value = oneChildrenOptionContent
              if (oneChildrenContents.length > 0) {
                // for (let q = 0; q < oneChildrenContents.length; q++) {
                //   const {
                //     optionContent,
                //     childrenContents: twoChildrenContents
                //   } = oneChildrenContents[q]
                //   oneChildrenContents[q].label = optionContent
                //   oneChildrenContents[q].value = optionContent
                //   if (twoChildrenContents.length === 0) {
                //     delete oneChildrenContents[q].childrenContents
                //   } else {
                //     oneChildrenContents[q].children = twoChildrenContents
                //   }
                // }
                // childrenContents[c].children = oneChildrenContents
              } else {
                delete childrenContents[c].childrenContents
                this.unitArray[oneChildrenOptionContent] = [
                  optionContent,
                  oneChildrenOptionContent
                ]
              }
            }
            optionContents[i].children = childrenContents
          } else {
            delete optionContents[i].childrenContents
          }
        }
        if (this.id) {
          this.getFoodTemplateDetail()
        }
        this.options = optionContents
      } catch (err) {
        console.log(err)
      }
    },
    async getPeriods() {
      try {
        const { results } = await fhGetfoodPeriods()
        this.periods = results.map(i => {
          const { name, startTime, endTime } = i
          i.name = `${name} ${startTime}至${endTime}`
          return i
        })
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    async putFoodAutits() {
      try {
        await fhPutFoodAutits(this.id, this.formData)
        this.$message.success('修改成功')
        this.$router.go(-1)
      } catch (err) {
        console.log(err)
      }
    },
    // 获取商品详情
    async getFoodTemplateDetail() {
      this.mainLoad = true
      try {
        const { results } =
          this.storeId && !this.audits
            ? await fhGetStoreCommDetail(this.storeId, this.id)
            : this.audits
              ? await await fhGetFoodAutitsDetails(this.id)
              : await fhGetFoodTemplateDetail(this.id)
        this.formData = results
        console.log(results)
        const {
          categoryId: rawCategoryId,
          category = {},
          tag = {},
          tagId: rawTagId,
          foodSkuList,
          foodPeriodList: rawFoodPeriodList,
          storeFoodSkuDtoList,
          skuList,
          attributeDtoList,
          attribute,
          images,
          upStatus,
          miniImage,
          importStatus,
          period
        } = results
        let { foodPeriodIds } = results
        const categoryId = rawCategoryId || (category && category.id) || null
        const tagId = rawTagId || (tag && tag.id) || null
        // if (!this.formData.allPeriodStatus) this.formData.allPeriodStatus = true
        if (period) {
          const { dayOfWeekList, timePeriodList } = period
          this.formData.dayOfWeekList = dayOfWeekList
          this.checkedCities = dayOfWeekList
          const timeJson = []
          timePeriodList.forEach(item => {
            timeJson.push({
              time: [item.startTime, item.endTime]
            })
          })
          this.timeJson = timeJson
        }
        const tempPeriodIds = rawFoodPeriodList || foodPeriodIds
        foodPeriodIds = Array.isArray(tempPeriodIds)
          ? tempPeriodIds.map(i => i.id)
          : []

        this.formData.importStatus = importStatus || upStatus
        this.miniImageFiles = [
          {
            uid: '-1',
            status: 'done',
            name: 'image.png',
            url: miniImage
          }
        ]
        this.formData = Object.assign({}, this.formData, {
          categoryId,
          foodPeriodIds,
          tagId
        })

        const tempImgs = images ? images.split(',') : ['']
        const tempImgsRes = []
        tempImgs.forEach((i, k) => {
          i &&
            tempImgsRes.push({
              uid: -1 * k - 1 + '',
              name: 'image.png',
              status: 'done',
              url: i
            })
        })
        this.detailImgs = tempImgsRes

        const skusForm = this.storeId
          ? storeFoodSkuDtoList
          : this.audits
            ? skuList
            : foodSkuList
        for (let i = 0; i < skusForm.length; i++) {
          const { unit } = skusForm[i]
          if (unit) {
            console.log(unit)
            skusForm[i].unitItem = this.unitArray[unit]
            console.log(skusForm[i].unitItem)
          }
        }
        this.skusForm = skusForm
        this.attriFrom =
          attributeDtoList || attribute ? JSON.parse(attribute) : [] || []

        this.$forceUpdate()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.mainLoad = false
    },
    // 添加商品规格
    addSku() {
      this.skusForm.push({ dailyStockStatus: false })
    },
    // 删除一个规格
    delSku(index) {
      const ln = this.skusForm.length
      if (ln < 1) return
      this.skusForm.splice(index, 1)
      if (ln - 1 === 1 && !this.skusForm[0].name) {
        this.skusForm[0].name = '常规'
      }
    },

    // 保存按钮回调
    handlerSaveBtn() {
      let msg = null
      this.$refs.skuForm.forEach(i => {
        i.validate(valid => {
          if (!valid) msg = '请检查商品规格的填写'
        })
      })

      if (msg) {
        this.$message.error(msg)
        return
      }

      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.formData.allPeriodStatus) {
            const timePeriodList = []
            for (let i = 0; i < this.timeJson.length; i++) {
              const { time } = this.timeJson[i]
              const [startTime, endTime] = time
              timePeriodList.push({
                startTime,
                endTime
              })
            }
            this.formData.period = {
              dayOfWeekList: this.formData.dayOfWeekList,
              timePeriodList
            }
          }
          this.saveLoad = true
          this.formData.foodSkuList = this.skusForm
          this.formData.foodSkuFormList = this.skusForm
          this.formData.skuList = this.skusForm
          this.formData.attributeDtoList = this.attriFrom
          this.formData.attribute = JSON.stringify(this.attriFrom)
          this.formData.upStatus = this.formData.importStatus
          this.formData.foodPeriodIdList = this.formData.foodPeriodIds

          this.$nextTick(() => {
            this.id && !this.audits
              ? this.editFoodTemplate()
              : this.audits
                ? this.putFoodAutits()
                : this.postAddStoreFood()
          })
        } else {
          this.$message.error('请检查您的输入')
        }
      })
    },
    // 创建商品模板
    async postAddStoreFood() {
      try {
        await fhPostAddStoreFood(this.store_id, this.formData)
        this.$message.success('创建商品模板成功')
        this.infoVisible = true
        // this.$router.go(-1)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.saveLoad = false
    },
    // 修改商品
    async editFoodTemplate() {
      try {
        await fhPutEditStoreFood(this.store_id, this.id, this.formData)
        this.$message.success('修改成功')
        this.infoVisible = true
        // this.$router.go(-1)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.saveLoad = false
    },
    // 添加商品属性
    addAttri() {
      this.attriFrom.push({ value: [] })
    },
    // 删除一个属性
    delAttri(index) {
      if (this.attriFrom.length < 1) return
      this.attriFrom.splice(index, 1)
    },
    // 详情大图改变事件
    detailUploadChange({ file, fileList, src }, type) {
      if (file.status === 'done') {
        // 增加上传
        fileList[fileList.length - 1].url = src
        const url = fileList
          .map(val => {
            return val.url
          })
          .join(',')
        this.$set(this.formData, type, url)
        // 缩略图
        const { url: minUrl } = fileList[0]
        this.formData.miniImage = minUrl
      } else if (file.status === 'removed') {
        // 删除
        const url = fileList
          .map(val => {
            return val.url
          })
          .join(',')
        this.$set(this.formData, type, url)
      }
      this.$refs.form.validateField(type)
    },
    handleCheckedCitiesChange(v, key) {
      if (!this.formData.dayOfWeekList) {
        this.formData.dayOfWeekList = []
      }
      if (key === 'all') {
        this.checkAll(v)
      } else {
        this.formData.dayOfWeekList = this.checkedCities
      }
    },
    checkAll(v) {
      if (v) {
        this.checkedCities = [1, 2, 3, 4, 5, 6, 7, 'all']
        this.formData.dayOfWeekList = [1, 2, 3, 4, 5, 6, 7]
      } else {
        this.checkedCities = []
        this.formData.dayOfWeekList = []
      }
    },
    addItemTime() {
      this.timeJson.push({ time: ['00:00:00', '23:59:00'] })
      this.$refs.form.validateField('time')
    },
    deleteItemTime(index) {
      this.timeJson.splice(index, 1)
      this.$forceUpdate()
    },
    setItemUnit(v, index) {
      const value = v[v.length - 1]
      this.skusForm[index].unit = value
    },
    handleOk() {
      this.$router.push({ name: 'Commoditys', query: { menu: 4 }})
    }
  },
  beforeRouteLeave(to, from, next) {
    this.$route.meta.title = ''
    next()
  }
}
</script>

<style scoped lang="scss">
::v-deep .ant-upload-list-picture-card-container {
  margin-right:50px;
}

.has-del-box {
  position: relative;

  .btn-del {
    position: absolute;
    right: 20px;
    top: 10px;
    padding: 0;
    cursor: pointer;
    z-index: 2;
    &::v-deep .el-icon-close {
      color: gray;
      font-size: 18px;
      cursor: pointer;
    }
  }

  &::v-deep .el-input-number {
    width: 100%;
    text-align: left;
  }
}

.flex {
  &::v-deep .clearfix {
    flex: auto;
  }
}

.attributes-box {
  width: 100%;
  background-color: rgb(247, 248, 250);
  padding: 38px 20px;
  margin-bottom: 24px;

  .attri-box {
    display: flex;
    justify-content: space-between;

    .attri-label-box {
      flex: none;
      padding-right: 12px;
    }

    .attri-value-box {
      flex: auto;
      display: flex;
      flex-wrap: wrap;
    }

    &::v-deep .el-input {
      margin-bottom: 12px;
      input {
        text-align: center;
        height: 38px;
        border-radius: 0;
      }
    }
  }
}

.inputNumber {
  &::v-deep {
    input {
      text-align: left;
    }
  }
}
</style>
