
<template>
  <div class="container">
    <div v-loading="loading" class="upload">
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        :hide-required-asterisk="true"
      >
        <b style="font-size: 18px">上传海报</b>
        <el-form-item prop="imageUrl">
          <oss-upload
            style="margin-top: 10px"
            :files="miniImageFiles"
            :limit-size="3"
            @change="uploadChange"
          />
          <span>图片格式为jpg/png；建议上传比例为690*160,文件最大3M</span>
        </el-form-item>
        <el-divider />
        <el-form-item label="选择店铺" prop="storeIdList">
          <el-button type="primary" @click="dialogVisible = true">
            选择店铺
          </el-button>
          <el-button v-if="formData.storeIdList.length > 0" type="text">
            已选择{{ formData.storeIdList.length }}家店铺
          </el-button>
        </el-form-item>
        <el-divider />
        <el-form-item label="跳转类型：">
          <el-radio-group v-model="formData.type" @change="changeType">
            <el-radio :label="1">单一详情页</el-radio>
            <el-radio :label="2">商品活动页</el-radio>
            <el-radio :label="3">无跳转</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item />
        <div v-show="formData.type === 3 ? false : true">
          <el-form-item prop="foodTemplateIdList" :rules="rules.foodTemplateIdList">
            <div class="commodity">
              <div class="top" style="justify-content: space-between;">
                <span
                  style="margin-left: 25px"
                >关联商品 {{ formData.foodTemplateIdList.length }}</span>
                <el-link
                  :underline="false"
                  style="margin-right: 25px"
                  @click="editHandle"
                >选择</el-link>
              </div>
              <div style="margin: 8px 8px">
                <el-tag v-for="(item,index) in selectedFood" :key="index" type="info">{{ item.name }}</el-tag>
              </div>
            </div>
          </el-form-item>
        </div>
        <el-form-item label="启用状态：">
          <el-switch
            v-model="formData.upStatus"
            active-text="开启"
            inactive-text="关闭"
          />
        </el-form-item>
        <el-form-item label="生效周期：">
          <el-radio-group
            v-model="effectiveCycle"
            @change="chooseEffectiveType"
          >
            <el-radio :label="true">每天</el-radio>
            <el-radio :label="false">指定周期</el-radio>
          </el-radio-group>
          <el-form-item prop="effectiveChoose" label-width="calc( 6em - 2px )">
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
        <el-form-item label="生效时段：">
          <el-radio-group v-model="formData.allDayFlag" @change="changeAllDay">
            <el-radio :label="true">全天</el-radio>
            <el-radio v-if="formData.allDayFlag" :label="false">
              指定时间段
            </el-radio>
            <el-radio v-else :label="false">
              指定时间段
            </el-radio>
          </el-radio-group>
          <div v-if="!formData.allDayFlag">
            <el-form-item
              v-for="(item, index) in formData.actPeriodReqList"
              :key="index"
              label-width="calc( 6em - 4px )"
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
                    v-show="formData.actPeriodReqList.length > 999"
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
                    v-show="formData.actPeriodReqList.length > 999"
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
    </div>

    <div style="margin-top: 15px">
      <el-tag
        v-for="item in storeName"
        :key="item.id"
        closable
        style="margin-bottom: 8px"
        @close="handleClose(item)"
      >
        {{ item.label }}
      </el-tag>
    </div>
    <el-divider />
    <el-button type="primary" :loading="loading" @click="save">保存</el-button>
    <el-button>
      <router-link :to="{ name: 'StoresPoster' }">
        取消
      </router-link>
    </el-button>
    <SelectStore
      :dialog-visible.sync="dialogVisible"
      @relationList="selectStore"
    />
    <div v-if="dialogVisibleFoodCom">
      <SelectFood
        :dialog-visible.sync="dialogVisibleFood"
        :store-ids="formData.storeIdList"
        :active-name="selectedFood"
        :radio-orcheckbox="radioOrcheckbox"
        share
        @selectFood="selectFoodFn"
      />
    </div>
  </div>
</template>

<script>
import OssUpload from '@/components/OssUpload'
import { storeIdListV } from '@/utils/validate-form.js'
import SelectFood from '@/views/component/SelectFood'
import SelectStore from '@/views/component/SelectStore'
import { fhPostAddBanner } from '@/api/banners'
import { parseTime, formatPeriod } from '@/utils'

export default {
  components: {
    OssUpload,
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
    var actPeriodReqListV = (rule, value, callback) => {
      value ? callback() : callback('请选择时间段')
    }
    var foodTemplateIdListV = (rule, value, callback) => {
      if (this.formData.type === 3) {
        callback()
        return false
      } else {
        if (value.length < 1) {
          callback('请选择菜品')
        } else {
          callback()
        }
      }
    }
    return {
      miniImageFiles: [],
      selectedFood: [],
      dialogVisibleFood: false,
      dialogVisible: false,
      formData: {
        type: 1,
        imageUrl: '',
        allDayFlag: true,
        upStatus: true,
        foodTemplateIdList: [],
        weekCycle: '1'.repeat(7).split(''),
        actPeriodReqList: [],
        storeIdList: []
      },
      rules: {
        type: 0,
        imageUrl: [{ required: true, message: '请上传图片' }],
        upStatus: true,
        foodTemplateIdList: [{ validator: foodTemplateIdListV }],
        weekCycle: '',
        actPeriodReqList: [{ validator: actPeriodReqListV }],
        effectiveChoose: [{ validator: effectiveChooseV }],
        storeIdList: [{ validator: storeIdListV }]
      },
      effectiveCycle: true,
      currExpTime: 0,
      effectiveChoose: [...Array(7).keys()],
      // 新增/编辑load
      loading: false,
      storeName: [],
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    }
  },
  computed: {
    radioOrcheckbox() {
      return this.formData.type === 1 ? 'radio' : 'checkbox'
    },

    canChangePeriod() {
      return this.formData.allDayFlag
    },
    dialogVisibleFoodCom() {
      return this.formData.storeIdList.length > 0
    }
  },
  watch: {
    effectiveChoose(v) {
      this.effectiveCycle = v.length === 7
    }
  },
  mounted() {
    window.app = this
  },
  methods: {
    uploadChange({ file, fileList, src }) {
      this.$set(this.formData, 'imageUrl', src)
      this.$refs.form.validateField('imageUrl')
    },
    changeType() {
      this.selectedFood = []
      this.formData.foodTemplateIdList = []
      this.$refs.form.validateField('foodTemplateIdList')
    },
    editHandle() {
      this.dialogVisibleFoodCom ? this.dialogVisibleFood = true : (this.$message({ type: 'warning', message: '请先选择店铺' }), this.dialogVisibleFood = false)
      this.$refs.form.validateField('storeIdList')
    },
    selectFoodFn(food, id) {
      // console.log('parent', food, id)
      this.selectedFood = food
      this.selectedFood.forEach((ele, index) => {
        this.$set(this.formData.foodTemplateIdList, index, ele.id)
      })
      this.$refs.form.validateField('foodTemplateIdList')
    },
    selectStore(item, id) {
      this.formData.storeIdList = id
      this.$refs.form.validateField('storeIdList')
      this.formData.foodTemplateIdList = []
      this.selectedFood = []
    },
    async postAddBanner(params) {
      this.loading = true
      try {
        await fhPostAddBanner(params)
        this.$message({ type: 'success', message: '成功创建海报' })
        setTimeout(() => {
          this.$router.push({ name: 'StoresPoster' })
        }, 800)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 增加请求
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const sendData = JSON.parse(JSON.stringify(this.formData))
          sendData.weekCycle = this.formData.weekCycle.join('')
          sendData.actPeriodReqList =
        sendData.actPeriodReqList.length > 0
          ? formatPeriod(sendData.actPeriodReqList)
          : []

          this.postAddBanner(sendData)
        }
      })
    },
    handleClose(item) {
      this.$refs.relation.close(item)
    },
    relationStore(name, id, select) {
      this.storeName = select
    },
    changeAllDay(v) {
      if (v) {
        this.formData.actPeriodReqList = []
        this.$refs.form.clearValidate()
      } else {
        this.formData.actPeriodReqList = [['00:00:00', '23:59:59']]
      }
    },
    chooseTime(v, e) {
      this.formData.actTime = v
      const start = v && v[0]
      const end = v && v[1]
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
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  display: flex;
  flex-flow: column;

  &::v-deep .ant-upload {
    width: 690px;
    height: 160px;
  }
  &::v-deep .ant-upload-list-picture-card-container {
    width: 690px;
    height: 160px;
  }
  &::v-deep .ant-upload-list-picture-card .ant-upload-list-item {
    width: 690px;
    height: 160px;
  }
}
::v-deep .el-tag + .el-tag {
  margin-left: 10px;
}
::v-deep .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
::v-deep .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.block {
  margin-bottom: 28px;
}
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

::v-deep {
  .el-radio__input.is-checked + .el-radio__label,
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #606266;
  }
}
</style>
