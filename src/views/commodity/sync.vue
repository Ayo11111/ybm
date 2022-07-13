<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-24 14:48:29
 * @LastEditors: HJ
 * @LastEditTime: 2021-03-19 18:54:32
-->
<template>
  <div class="container">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      :hide-required-asterisk="true"
    >
      <!-- 选择店铺 -->
      <el-form-item label="选择店铺" prop="storeIds">
        <el-button type="primary" @click="dialogVisible = true">
          选择店铺
        </el-button>
        <el-button v-if="formData.storeIds.length > 0" type="text">
          已选择{{ formData.storeIds.length }}家店铺
        </el-button>
        <StoreTag v-if="storeNameList.length > 0" :store-arr="storeNameList" />
      </el-form-item>
      <a-divider dashed />

      <!-- 选择菜品 -->
      <el-form-item prop="foodTemplateIds" :rules="rules.foodTemplateIds">
        <div class="commodity">
          <div class="top" style="justify-content: space-between">
            <span style="margin-left: 25px"
              >同步商品 {{ formData.foodTemplateIds.length }}</span
            >
            <el-link
              :underline="false"
              style="margin-right: 25px"
              @click="editHandle"
              >选择</el-link
            >
          </div>
          <div style="margin: 8px 8px">
            <el-tag
              v-for="(item, index) in selectedFood"
              :key="index"
              type="info"
              style="margin-right: 10px"
            >
              <template v-if="typeof item === 'object'">{{
                item.name
              }}</template>
              <template v-else>{{ item }}</template>
            </el-tag>
          </div>
        </div>
      </el-form-item>
      <a-divider dashed />

      <!-- 批量操作 -->
      <el-form-item label="批量操作" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1" style="display: block; padding: 10px 0">
            同步&nbsp;&nbsp;
            <span style="color: rgba(0, 0, 0, 0.3); margin-left: 10px"
              >如店铺内无该菜品增为新增，如有相同菜品则为覆盖</span
            >
          </el-radio>
          <el-radio :label="2">
            删除&nbsp;&nbsp;
            <span style="color: rgba(0, 0, 0, 0.3); margin-left: 10px"
              >删除店铺内的所选菜品</span
            ></el-radio
          >
        </el-radio-group>
      </el-form-item>
      <a-divider dashed />

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" :loading="loadingSave" @click="save"
          >保存</el-button
        >
        <el-button>
          <router-link :to="{ name: 'Commoditys' }"> 取消 </router-link>
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 选择店铺组件 -->
    <SelectStore
      :dialog-visible.sync="dialogVisible"
      @relationList="selectStore"
    />

    <!-- 选择菜品组件 -->
    <div v-if="dialogVisibleFoodCom">
      <SelectFood
        :dialog-visible.sync="dialogVisibleFood"
        :store-ids="formData.storeIds"
        :active-name="selectedFood"
        :radio-orcheckbox="radioOrcheckbox"
        :share="false"
        @selectFood="selectFoodFn"
      />
    </div>
  </div>
</template>

<script>
import { storeIdListV } from '@/utils/validate-form.js'
import SelectFood from '@/views/component/SelectFood'
import SelectStore from '@/views/component/SelectStore'
import StoreTag from '.././stores/_components/tag'
import { fhUploadBatch, fhDeleteBatch } from '@/api/foodtemplate'

var foodTemplateIdListV = (rule, value, callback) => {
  if (value.length < 1) {
    callback('请选择菜品')
  } else {
    callback()
  }
}
export default {
  components: {
    SelectFood,
    SelectStore,
    StoreTag
  },

  data() {
    return {
      radioOrcheckbox: 'checkbox',
      loadingSave: false,
      dialogVisibleFood: false,
      dialogVisible: false,
      formData: {
        foodTemplateIds: [],
        storeIds: [],
        type: 1 // 1 同步 2 删除
      },
      selectedFood: [],
      rules: {
        foodTemplateIds: [{ validator: foodTemplateIdListV }],
        storeIds: [{ validator: storeIdListV }],
        type: [{ required: true, message: '请选择' }]
      },
      storeNameList: []
    }
  },
  computed: {
    dialogVisibleFoodCom() {
      return this.formData.storeIds.length > 0
    }
  },

  mounted() {
    this.storeId = this.$route.params.id
    window.app = this
  },
  methods: {
    // 保存按钮
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const sendData = JSON.parse(JSON.stringify(this.formData))
          delete sendData.type
          sendData.foodTemplateIds = sendData.foodTemplateIds.join(',')
          sendData.storeIds = sendData.storeIds.join(',')
          this.postSyncFood(sendData)
        }
      })
    },
    // 请求
    async postSyncFood(params) {
      this.loadingSave = true
      console.log('params', params)
      try {
        if (this.formData.type === 1) {
          await fhUploadBatch(params)
          this.$message({ type: 'success', message: '批量同步成功' })
        } else {
          await fhDeleteBatch(params)
          this.$message({ type: 'success', message: '批量删除成功' })
        }

        setTimeout(() => {
          this.$router.push({ name: 'Commoditys' })
        })
      } catch (err) {
        console.log(err)
      }
      this.loadingSave = false
    },
    selectFoodFn(food, id) {
      this.selectedFood = food
      this.formData.foodTemplateIds = id
      this.selectedFood.forEach((ele, index) => {
        this.$set(this.formData.foodTemplateIds, index, ele.id)
      })
      this.$refs.form.validateField('foodTemplateIds')
    },
    selectStore(item, id) {
      this.formData.storeIds = id
      this.storeNameList = item
      this.$refs.form.validateField('storeIds')
      this.formData.foodTemplateIds = []
      this.selectedFood = []
    },
    editHandle() {
      this.dialogVisibleFoodCom
        ? (this.dialogVisibleFood = true)
        : (this.$message({ type: 'warning', message: '请先选择店铺' }),
          (this.dialogVisibleFood = false))
      this.$refs.form.validateField('storeIdList')
    }
  }
}
</script>

<style lang="scss" scoped>
.commodity {
  width: 586px;
  min-height: 180px;
  border: 1px solid #cccccc;
  .top {
    height: 50px;
    border-bottom: 1px solid #cccccc;
    display: flex;
    align-items: center;
  }
}

.el-link.el-link--default {
  color: #52ACFF;
}
::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #606266;
}
</style>
