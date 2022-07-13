<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-24 15:39:23
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-22 11:38:39
-->
<template>
  <div>
    <div class="error" v-show="statusCurr === 5">
      <a-icon type="exclamation-circle" style="margin-right: 7px;" />
      <span>审核结果: 不通过</span>
      <span style="margin-left: 12px;">
        审核意见：{{ rawValue.auditOpinion }}
      </span>
    </div>
    <div class="flex outer-box">
      <el-checkbox v-model="rawChecked" @change="checkedDish" />
      <span v-show="showWeight" style="margin-left: 10px;color: #606266">
        序号
      </span>
      <el-input
        v-show="showWeight"
        v-model="rawValue['weight']"
        v-loading="loads['weight']"
        style="width: 4em;margin-left: 10px"
        @change="editWeight"
      />
      <el-image
        class="img-box ml-12 mr-12"
        fit="contain"
        :src="rawValue.miniImage"
      />
      <div class="flex info-box">
        <div>
          <div class="flex name-box">
            <span style="margin-left: 1em">
              {{ rawValue.name }}
              <a-tag style="margin-left: 8px;">
                月销 {{ rawValue.saleNum || 0 }}
              </a-tag>
            </span>
            <a-switch
              v-if="showDropOff && statusCurr < 4"
              :checked="!!rawValue[dropOffKey]"
              :loading="loads[dropOffKey]"
              checked-children="上架"
              un-checked-children="下架"
              @change="
                e =>
                  dropOffOption ? dropOffFun(e) : switchChange(dropOffKey, e)
              "
            />
          </div>
          <div class="flex option-box">
            <el-form
              ref="skuForm"
              inline
              label-width="5em"
              :model="rawValue[skuKey][skuIndex]"
              :rules="skuValueRules"
            >
              <el-form-item
                v-for="i in baseInfo"
                :key="i.label"
                :label="i.label"
                :class="{ 'align-right': i.align }"
                :prop="i.field"
              >
                <el-select
                  v-if="i.type === 'select'"
                  v-model="currSku"
                  value-key="id"
                  placeholder="请选择规格"
                  style="width: 7em"
                >
                  <el-option
                    v-for="(si, sk) in rawValue[skuKey]"
                    :key="sk"
                    :value="si"
                    :label="si.name"
                    @click.native="skuOptionClick(sk)"
                  />
                </el-select>
                <a-switch
                  v-else-if="i.type === 'switch'"
                  :disabled="
                    i.disabledOndropOff ? !!rawValue[dropOffKey] : false
                  "
                  :checked="!!rawValue[i.field]"
                  :loading="loads[i.field]"
                  checked-children="是"
                  un-checked-children="否"
                  @change="e => switchChange(i.field, e)"
                />

                <div v-else-if="i.type === 'block'" style="display: flex">
                  <el-input
                    v-model="rawValue[skuKey][skuIndex][i.field]"
                    placeholder="请输入当前库存"
                    style="width: 10em"
                    :disabled="!!rawValue[dropOffKey]"
                  />
                  <el-input
                    v-model="rawValue[skuKey][skuIndex]['dailyStock']"
                    placeholder="请输入每日库存"
                    style="width: 10em;margin-left:10px"
                    :disabled="!!rawValue[dropOffKey]"
                  />
                  <div v-show="!rawValue[dropOffKey]" style="margin-left: 18px;">
                    <a-button
                      type="link"
                      style="padding: 0"
                      @click="setting(0, skuIndex, i.field)"
                      :loading="loads[i.field]"
                      >清零</a-button
                    >
                    <a-divider type="vertical" />
                    <a-button
                      type="link"
                      style="padding: 0"
                      @click="
                        setting(
                          rawValue[skuKey][skuIndex][i.field],
                          skuIndex,
                          i.field
                        )
                      "
                      :loading="loads[i.field]"
                      >最大</a-button
                    >
                    <a-divider type="vertical" />
                    <a-button
                      type="link"
                      style="padding: 0"
                      @click="setting(null, skuIndex, i.field)"
                      :loading="loads[i.field]"
                      >设置</a-button
                    >
                  </div>
                </div>

                <el-input
                  v-else
                  v-model="rawValue[skuKey][skuIndex][i.field]"
                  style="width: 9em"
                  :disabled="!!rawValue[dropOffKey]"
                >
                  <template slot="append">
                    <el-button
                      v-if="!!!rawValue[dropOffKey]"
                      size="small"
                      :loading="loads[i.field]"
                      @click="editFoodTemplate(i.field)"
                    >
                      修改
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-form>
            <div class="flex" style="align-items: center" v-if="statusCurr < 4">
              <router-link
                :to="{
                  path: `/commodity/edit/${rawValue.id}`,
                  query: Object.assign({ disabledform: 0 }, routerQuery)
                }"
                class="mr-12"
              >
                <!-- rawValue[dropOffKey] -->
                <el-button type="text">
                  编辑
                  <!-- {{ rawValue[dropOffKey] ? '详情' : '编辑' }} -->
                </el-button>
              </router-link>
              <el-button v-loading="delLoad" type="text" @click="handleDel">
                删除
              </el-button>
            </div>
            <el-button
              type="primary"
              style="height: 36px"
              v-else
              @click="
                $router.push({
                  path: `/commodity/edit/${rawValue.id}`,
                  query: { audits: true }
                })
              "
              >编辑</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { validPrice, validIntZero } from '@/utils/validate'
import { fhPutstoreFoodWeight } from '@/api/stores/commodity'
import { fhPutFoodAutits } from '@/api/commodity'
import { getStoreId } from '@/utils/auth'
export default {
  name: 'Info',
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    updateData: {
      type: Function,
      default: () => {}
    },
    editOption: {
      type: Array,
      default: () => []
    },
    editFood: {
      type: Function,
      default: () => {}
    },
    deleteFood: {
      type: Function,
      default: () => {}
    },
    dropOffOption: {
      type: Object,
      default: () => {
        return {}
      }
    },
    checkItem: {
      type: Function,
      default: () => {}
    },
    checked: {
      type: Boolean,
      default: false
    },
    routerQuery: {
      type: Object,
      default: () => {}
    },
    showDropOff: {
      type: Boolean,
      default: true
    },
    showWeight: {
      type: Boolean,
      default: true
    },
    statusCurr: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      rawValue: {},
      baseInfo: this.editOption,
      delLoad: false,
      skus: [],
      skuKey: '',
      currSku: {},
      storeFood: '',
      // sku选中的索引
      skuIndex: 0,
      // 修改load
      loads: {},
      rawChecked: false,
      storeId: null,
      // 价格库存校验规则
      skuValueRules: {
        price: [
          {
            validator: validPrice,
            trigger: 'change'
          }
        ],
        stock: [
          {
            validator: validIntZero,
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    dropOffKey() {
      const { dropOffOption } = this
      const { field } = dropOffOption || {}
      return field || ''
    }
  },
  watch: {
    value: {
      // eslint-disable-next-line space-before-function-paren
      handler: function(v) {
        this.rawValue = v
        this.skuKey = v.foodSkuList
          ? 'foodSkuList'
          : v.skuList
          ? 'skuList'
          : 'storeFoodSkuDtoList'
        this.rawValue.updateUpStatus = v.upStatus
        this.rawValue.updateImportStatus = v.importStatus
        const skus = v.foodSkuList || v.storeFoodSkuDtoList || v.skuList
        if (skus && skus.length > 0) {
          this.currSku = skus[0]
          this.skus = skus
        }
      },
      immediate: true,
      deep: true
    },
    checked(v) {
      this.rawChecked = v
    }
  },
  async created() {
    this.storeId = await getStoreId()
  },
  methods: {
    async putstoreFoodWeight(foodId, params) {
      this.loads['weight'] = true
      this.$forceUpdate()
      try {
        await fhPutstoreFoodWeight(this.storeId, foodId, params)
        this.$message.success('修改成功')
        this.$emit('rawGetFoodList')
      } catch (err) {
        console.log(err)
      }
      this.loads['weight'] = false
      this.$forceUpdate()
    },
    // 选中sku
    skuOptionClick(index) {
      this.skuIndex = index
    },
    editWeight(val) {
      this.putstoreFoodWeight(this.rawValue.id, {
        weight: val
      })
    },
    // 修改商品属性
    async editFoodTemplate(key) {
      let msg = null
      this.$refs.skuForm.validate(valid => {
        if (!valid) {
          msg = `请检查${this.rawValue.name}商品修改后的值是否正确`
        }
      })
      if (msg) {
        this.$message.error(msg)
        return
      }

      this.loads[key] = true
      this.$forceUpdate()
      this.rawValue[this.skuKey][0].dailyStockStatus = null
      if (!this.tempValue) this.tempValue = deepClone(this.rawValue)
      try {
        const {
          foodPeriodIds: periodIds,
          foodPeriodList: periodList,
          tag,
          category,
          categoryId: tempCategoryId
        } = this.rawValue
        const foodPeriodIds = periodIds ? periodIds.map(i => i.id) : ''
        const foodPeriodIdList = periodList ? periodList.map(i => i.id) : ''
        const tagId = tag ? tag.id : null
        const categoryId = category ? category.id : tempCategoryId || null
        const foodSkuFormList = this.rawValue[this.skuKey]
        if (this.statusCurr < 4) {
          await this.editFood(
            this.rawValue.id,
            Object.assign({}, this.rawValue, {
              foodPeriodIds,
              foodPeriodIdList,
              tagId,
              categoryId,
              foodSkuFormList
            })
          )
        } else {
          await fhPutFoodAutits(
            this.rawValue.id,
            Object.assign({}, this.rawValue, {
              foodPeriodIds,
              foodPeriodIdList,
              tagId,
              categoryId,
              foodSkuFormList
            })
          )
        }
        this.$message.success('修改成功')
        this.tempValue = null
      } catch (e) {
        console.log('debug axios', e)
        this.rawValue[key] = this.rawValue[key] ? 0 : 1
      }
      this.loads[key] = false
      this.$forceUpdate()
    },
    handleDel() {
      this.$confirm('此操作将删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // eslint-disable-next-line space-before-function-paren
        .then(async () => {
          this.deleteFoodTemplate()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除一个商品模板
    async deleteFoodTemplate() {
      this.delLoad = true
      try {
        await this.deleteFood(this.rawValue.id)
        this.$message.success('删除成功')
        this.updateData()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.delLoad = false
    },
    // 修改switch状态
    switchChange(key, e) {
      this.tempValue = deepClone(this.rawValue)
      this.rawValue[key] = e ? 1 : 0
      this.$nextTick(() => this.editFoodTemplate(key))
    },
    // 上下架函数
    async dropOffFun(e) {
      const { fn, field } = this.dropOffOption || {}
      this.loads[field] = true
      this.$forceUpdate()
      try {
        await fn(this.rawValue.id, { [field]: e ? 1 : 0 })
        this.$message.success('修改成功')
        this.updateData()
        this.rawValue[field] = e ? 1 : 0
        this.rawValue[
          field === 'updateUpStatus' ? 'upStatus' : 'importStatus'
        ] = e ? 1 : 0
        console.log('debug', this.rawValue)
        this.$forceUpdate()
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loads[field] = false
      this.$forceUpdate()
    },
    // 是否选中当前商品
    checkedDish(e) {
      this.checkItem(e, this.rawValue.id, this.rawValue)
    },
    setting(num, index, field) {
      if (num !== null) {
        this.rawValue[this.skuKey][index].dailyStock = num
        this.$forceUpdate()
      }
      this.editFoodTemplate(field)
    }
  }
}
</script>

<style lang="scss" scoped>
.outer-box {
  align-items: center;
  border-bottom: 1px solid #eee;

  & > :not(.info-box) {
    flex: none;
  }
}

.img-box {
  width: 82px;
  height: 82px;
  border: 1px dashed rgba(0, 0, 0, 0.1);
}

.name-box {
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  font-size: 16px;
}

.option-box {
  justify-content: space-between;
  margin-top: 8px;
}

.info-box {
  flex: 1;
  flex-direction: column;
  justify-content: center;
  margin-top: 24px;
}

.error {
  font-weight: 500;
  color: red;
  font-size: 15px;
  margin-top: 15px;
  border: 1px solid;
  padding: 10px;
}

.align-right {
  &::v-deep .el-form-item__label {
    text-align: right;
  }
}
</style>
