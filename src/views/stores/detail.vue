<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-29 15:54:14
 * @LastEditors: HJ
 * @LastEditTime: 2021-09-23 03:01:25
-->
<template>
  <div v-loading="mainLoad" class="container">
    <div class="base-box">
      <h1>{{ storeName }}</h1>
      <el-form inline>
        <el-form-item label="店铺关注人数:">
          <span class="mr-12">{{ detail.likePeopleCount }}</span>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="base-box"></div> -->
    <DetailBlock title="店铺信息" class="mt-12">
      <el-form ref="infoForm" :model="detail" :rules="rule" label-width="8em">
        <el-row>
          <el-col :span="24">
            <el-form-item label="店铺名称" prop="storeName">
              <el-input v-show="isEditStoreInfo" v-model="detail.storeName" />
              <span v-show="!isEditStoreInfo">{{ detail.storeName }}</span>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="店铺店长" prop="storeManagerId">
              <filter-select
                :data="manager"
                :value.sync="managerName"
                vl="name"
                vk="id"
                vv="id"
                @change="getManager"
              />
            </el-form-item>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="店铺公告" prop="announcement">
              <el-input
                v-show="isEditStoreInfo"
                v-model="detail.announcement"
                type="textarea"
              />
              <span v-show="!isEditStoreInfo">{{ detail.announcement }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="所属城市" prop="city">
              <el-cascader
                v-model="cascader"
                style="width: 100%"
                :options="provinceAndCityData"
                @change="cascaderChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="店铺地址" prop="fullAddress">
              <el-input v-model="detail.fullAddress" @focus="addressFocus" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="店铺热线" prop="phone">
              <el-input v-show="isEditStoreInfo" v-model="detail.phone" />
              <span v-show="!isEditStoreInfo">{{ detail.phone }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="logoImage" label="店铺头像">
              <oss-upload
                file-name="logo"
                :disabled="!isEditStoreInfo"
                :limit-size="2"
                :path="ossPath"
                :files="
                  detail.logoImage
                    ? [
                        {
                          uid: '-1',
                          name: 'image.png',
                          status: 'done',
                          url: detail.logoImage
                        }
                      ]
                    : []
                "
                @change="option => changeImg(option, 'logoImage')"
              >
                <span style="color: #999">
                  请上传图片,大小不超过2M；格式为png、jpg；建议尺寸 120 * 120
                </span>
              </oss-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="店铺环境" prop="environmentImages">
              <oss-upload
                :path="ossPath"
                :files="detailImgs"
                :limit-size="2"
                @change="detailUploadChange"
              >
                <span style="color: #999">
                  请上传图片,大小不超过2M；格式为png、jpg；建议尺寸 404 * 262
                </span>
              </oss-upload>
            </el-form-item>
          </el-col>
          <a-divider dashed />
          <div class="font-blod sub_title">食品安全档案</div>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="营业执照" prop="businessLicenseImgs">
                  <oss-upload
                    file-name="营业执照"
                    :disabled="!isEditStoreInfo"
                    :limit-size="2"
                    :path="ossPath"
                    :files="
                      detail.businessLicenseImgs
                        ? [
                            {
                              uid: '-1',
                              name: 'image.png',
                              status: 'done',
                              url: detail.businessLicenseImgs
                            }
                          ]
                        : []
                    "
                    @change="option => changeImg(option, 'businessLicenseImgs')"
                  >
                    <span style="color: #999">
                      请上传证件清晰原件扫描件或拍摄照片,大小不超过2M；格式为png、jpg；建议尺寸
                      644 * 436
                    </span>
                  </oss-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效期至" style="margin-bottom: 5px">
                  <el-radio v-model="end" label="1">定期</el-radio>
                  <el-radio v-model="end" label="2">长期</el-radio>
                </el-form-item>
                <el-form-item
                  v-show="end === '1'"
                  label=""
                  prop="businessLicenseEnd"
                >
                  <el-date-picker
                    v-model="detail.businessLicenseEnd"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd 00:00:00"
                    placeholder="请选择结束时间"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="经营许可证" prop="manageLicenseImags">
                  <oss-upload
                    :disabled="!isEditStoreInfo"
                    file-name="经营许可证"
                    :path="ossPath"
                    :limit-size="2"
                    :files="
                      detail.manageLicenseImags
                        ? [
                            {
                              uid: '-1',
                              name: 'image.png',
                              status: 'done',
                              url: detail.manageLicenseImags
                            }
                          ]
                        : []
                    "
                    @change="option => changeImg(option, 'manageLicenseImags')"
                  >
                    <span style="color: #999">
                      请上传证件清晰原件扫描件或拍摄照片,大小不超过2M；格式为png、jpg；建议尺寸
                      644 * 436
                    </span>
                  </oss-upload>
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="有效期至" prop="manageLicenseEnd">
                  <el-date-picker
                    v-model="detail.manageLicenseEnd"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd 00:00:00"
                    placeholder="请选择结束时间"
                    :picker-options="pickerOptions"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <a-divider dashed />
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="量化分级信息"
                prop="quantitativeClassificationImage"
                label-width="10em"
              >
                <oss-upload
                  file-name="量化分级信息"
                  :path="ossPath"
                  :limit-size="2"
                  :files="
                    detail.quantitativeClassificationImage
                      ? [
                          {
                            uid: '-1',
                            name: 'image.png',
                            status: 'done',
                            url: detail.quantitativeClassificationImage
                          }
                        ]
                      : []
                  "
                  @change="
                    option =>
                      changeImg(option, 'quantitativeClassificationImage')
                  "
                >
                  <span style="color: #999">
                    请上传证件清晰原件扫描件或拍摄照片,大小不超过2M；格式为png、jpg
                  </span>
                </oss-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-for="(i, j) in quantityList" :key="j">
            <el-col :span="i.span">
              <el-form-item :label="i.label" :prop="i.prop" label-width="10em">
                <el-input
                  v-if="['text', 'textarea'].includes(i.type)"
                  v-model="detail[i.prop]"
                  :placeholder="i.placeholder"
                  :type="i.type"
                  :autosize="{ minRows: i.autosize }"
                  :show-word-limit="i.showWordLimit"
                  :maxlength="i.maxlength"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </DetailBlock>
    <detail-block title="营业设置" class="mt-12">
      <el-form :model="detail" label-width="7em">
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="6">
                <el-form-item label="店铺状态" prop="storeStatus">
                  <el-radio-group v-model="detail.storeStatus">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="外卖状态" prop="takeAwayStatus">
                  <el-radio-group v-model="detail.takeAwayStatus">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <!-- <el-col :span="6">
                <el-form-item
                  label="启用配送自提柜"
                  label-width="8em"
                  prop="zitiStatus"
                >
                  <el-radio-group v-model="detail.zitiStatus">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->
            </el-row>
          </el-col>
          <el-col v-show="detail.storeStatus === 1" :span="24">
            <el-form-item label="默认配送方式">
              <filter-select
                :data="deliveryMethods"
                :value.sync="defaultDelivery"
                vl="deliveryName"
                vk="deliveryName"
                vv="deliveryType"
                @change="defaultDeliveryIndex"
              />
              <span
                class="gray"
                style="margin: 0; margin-top: 8px; display: block"
              >
                店铺启用则必选
              </span>
            </el-form-item>
          </el-col>
          <el-col
            v-show="defaultDelivery > 1 && detail.storeStatus === 1"
            :span="24"
          >
            <el-form-item label="配送方式" prop="delWay">
              <template v-for="i in deliveryMethods">
                <div :key="i.deliveryName">
                  <span
                    v-if="
                      i.deliveryType !== 1 &&
                      defaultDelivery === i.deliveryType &&
                      !i.baseStoreId
                    "
                    style="color: red"
                  >
                    当前选择的配送方式为{{ i.deliveryName }}，请填写
                    {{ i.deliveryName }}
                    店铺ID
                  </span>
                  <el-form
                    v-if="i.deliveryType !== 1"
                    ref="deliveryForm"
                    :model="i"
                    inline
                  >
                    <!-- 如果需要校验可以做在这 -->
                    <el-form-item
                      v-show="defaultDelivery === i.deliveryType"
                      :label="`${i.deliveryName}店铺ID`"
                      :rules="[
                        defaultDelivery === i.deliveryType
                          ? {
                              required: true,
                              message: `请输入${i.deliveryName}店铺ID`,
                              trigger: 'change'
                            }
                          : []
                      ]"
                      style="margin-bottom: 10px"
                      prop="baseStoreId"
                    >
                      <el-input
                        v-model="i.baseStoreId"
                        placeholder="请输入店铺Id"
                      />
                    </el-form-item>
                  </el-form>
                </div>
              </template>
              <span class="gray" style="margin: 0">
                配送店铺ID是店铺能进行配送的必填项，新建店铺可先不填，创建店铺后可到店铺详情中填写，但需要正常启用店铺时一定都需要填写
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="营业时间">
              <el-time-picker
                v-model="businessTime"
                is-range
                start-placeholder="请选择开始时间"
                end-placeholder="请选择开始时间"
                format="HH:mm"
                value-format="HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <a-divider dashed />
      <div>预订单设置</div>
      <el-form :model="detail">
        <el-form-item label="是否开启">
          <el-radio-group v-model="detail.appointmentStatus">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预约送达时间">
          <span>最快送达时间</span>
          <filter-select
            :data="service"
            :value.sync="detail.appointmentDeliveryTime"
            vk="label"
            vv="value"
            vl="label"
            :disable="!detail.appointmentStatus"
          />
          <span>后可预约送达时间，间隔为</span>
          <filter-select
            :data="interval"
            :value.sync="detail.appointmentIntervalTime"
            vk="label"
            vv="value"
            vl="label"
            :disable="!detail.appointmentStatus"
          />
        </el-form-item>
        <el-form-item label="接收预定时间">
          <filter-select
            :data="computedTimes(destine)"
            :value.sync="detail.appointmentStart"
            vk="label"
            vv="value"
            vl="label"
            :disable="!detail.appointmentStatus"
          />
          ---
          <filter-select
            :data="computedTimes(destine)"
            :value.sync="detail.appointmentEnd"
            vk="label"
            vv="value"
            vl="label"
            :disable="!detail.appointmentStatus"
          />
          <p class="gray" style="margin-top: 12px">
            最早日期：最早日期是用户最少需要提前下单的天数，如果不选“当天”，则用户不能下要求今日送达的订单（例如：最早日期为“隔天”，则用户今日最快只能下明天备货配送的订单）
          </p>
          <p class="gray">
            最长日期：最长日期即用户可要求送达的最多天数（例如：最长日期为“隔天”，则用户今日可下要求明天配送的订单，不可下要求后天配送的订单）
          </p>
        </el-form-item>
        <el-form-item label="休息是否接受预定">
          <el-radio v-model="status" label="0">休息时间支持预定</el-radio>
          <el-radio v-model="status" label="1">休息时间不支持预定</el-radio>
          <p class="gray">
            如果选择“休息时间支持预定”，则用户可以在店铺营业时间外的时间下预订单（只能选择营业时间段以内的时间送达）。该预订单在店铺营业时间开始后15分钟内未接单将会被系统自动取消，请注意查看。
          </p>
        </el-form-item>
      </el-form>
      <a-divider dashed />
      <div class="font-blod">店铺配送范围设置</div>
      <delivery-area
        ref="deliveryArea"
        :center.sync="deliveryCenter"
        :price.sync="detail.startSale"
        :path.sync="detail.deliveryPath"
        :polygon-path.sync="deliveryPath"
        :pass-prop="!detail.deliveryPath"
      />
    </detail-block>
    <div class="base-box mt-24 flex btn-box">
      <router-link class="mr-12" :to="{ name: 'StoresList' }" replace>
        <el-button>取消</el-button>
      </router-link>
      <el-button type="primary" :loading="saveLoad" @click="validateFrom">
        保存
      </el-button>
    </div>
    <el-dialog
      width="72vw"
      top="3vh"
      title="选择地址"
      destroy-on-close
      :visible.sync="mapDialogShow"
    >
      <el-form label-width="5em" style="width: 100%">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="所属城市">
              <el-cascader
                v-model="cascader"
                style="width: 100%"
                :options="provinceAndCityData"
                @change="cascaderChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="店铺地址">
              <el-select
                v-model="keyWord"
                filterable
                remote
                reserve-keyword
                value-key="fullAddress"
                placeholder="请输入地址"
                style="width: 100%"
                class="mb-24"
                :loading="addressLoading"
                :remote-method="searchAddress"
                @change="chooseAddress"
              >
                <el-option
                  v-for="item in addressOptions"
                  :key="item.fullAddress"
                  :label="item.fullAddress"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址">
              <el-input
                v-model="addressDetail"
                placeholder="详细地址：如道路、门牌号、小区、楼栋号、单元室等"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <g-map
        v-if="mapDialogShow"
        ref="gdMap"
        :cen="deliveryCenter"
        @load-end="mapLoadEnd"
      />
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmLocation"> 确定 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  fhGetStoreDetail,
  fhGetDeliverys,
  fhEditStore,
  fhGetStoreManager
} from '@/api/stores'
import OssUpload from '@/components/OssUpload'
import DetailBlock from '@/components/DetailBlock'
import FilterSelect from '@/components/FilterSelect'
import GMap from '@/components/Gmap'
import DeliveryArea from '@/components/DeliveryArea'
import { regionMap, times, quantityList } from './_utils'
import { arrayEquals } from '@/utils'
import rule from './_utils/validDetailForm'
import { getUserInfo } from '@/utils/auth'
import {
  provinceAndCityData,
  CodeToText,
  TextToCode
} from 'element-china-area-data'
export default {
  name: 'StoreDetail',
  components: {
    DetailBlock,
    OssUpload,
    FilterSelect,
    DeliveryArea,
    GMap
  },
  data() {
    var validateLicenseEnd = (rule, value, callback) => {
      if (this.end === '1' && !this.detail.businessLicenseEnd) {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    }
    return {
      quantityList,
      gdMap: null,
      cascader: null,
      mainLoad: true,
      saveLoad: false,
      detail: {
        storeStartStatus: 0,
        storeManagerId: null
      },
      mapDialogShow: false,
      isEditStoreInfo: true,
      deliveryMethods: [],
      defaultDelivery: null,
      businessTime: '',
      radius: 1000,
      ...times,
      // 配送范围的路径
      deliveryPath: '',
      deliveryCenter: null,
      deliveryLoadEnd: false,
      detailLoadEnd: false,
      provinceAndCityData,
      // 地图搜索
      keyWord: '',
      addressDetail: '',
      addressOptions: [],
      addressLoading: false,
      // 校验规则
      rule,
      storeName: '',
      pickerOptions: {
        disabledDate: date => {
          const time = new Date().valueOf()
          return time > date.valueOf()
        }
      },
      status: '0',
      manager: [],
      managerName: null,
      end: '1',
      validateLicenseEnd,
      image: [],
      detailImgs: null
    }
  },
  computed: {
    ...mapGetters(['merchantInfo']),
    ossPath() {
      return `merchant/stores/${this.merchantId}`
    },
    loadEnd() {
      return this.deliveryLoadEnd && this.detailLoadEnd
    }
  },
  watch: {
    loadEnd(v) {
      if (v) {
        Object.assign(this.deliveryMethods, this.tempDeliveryList)
      }
    },
    businessTime: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (v) {
        this.detail.startTime = v[0]
        this.detail.endTime = v[1]
      },
      immediate: true,
      deep: true
    },
    cascader: {
      // eslint-disable-next-line space-before-function-paren
      handler: function (v, ov) {
        if (ov && !arrayEquals(v, ov)) {
          this.$notify({
            title: '提示',
            message: '店铺所属城市已被修改，请重新选择店铺地址',
            duration: 3 * 1000
          })
          this.detail.fullAddress = ''
          this.keyWord = ''
          this.addressDetail = ''
        }
      }
    }
  },
  created() {
    rule['businessLicenseEnd'] = [
      {
        validator: this.validateLicenseEnd,
        trigger: 'blur'
      }
    ]
  },
  mounted() {
    window.sd = this
    const { storeId = -1 } = this.$route.params
    this.storeId = storeId
    this.getUserInfo()
    this.$nextTick(() => {
      this.getStoreDetail()
      this.getDeliverys()
      this.getStoreManager()
    })
  },
  methods: {
    changeImg(option, key) {
      const { src } = option
      this.$set(this.detail, key, src)
      this.$refs.infoForm.validateField(key)
    },
    async getStoreDetail() {
      this.mainLoad = true
      try {
        const { results } = await fhGetStoreDetail(this.storeId)
        this.detail = results
        this.managerName = results.storeManagerId
        const {
          deliveryPath,
          startTime,
          endTime,
          deliveryList,
          province,
          addressDetail,
          poiName,
          address,
          storeName
        } = results
        let { city } = results
        this.storeName = storeName
        const tempDefaultDelivery = deliveryList.filter(i => {
          if (i.status) return i
        })
        this.defaultDelivery =
          tempDefaultDelivery.length > 0
            ? tempDefaultDelivery[0].deliveryType
            : null

        this.tempDeliveryList = deliveryList
        this.businessTime = [startTime, endTime]
        this.deliveryPath = deliveryPath || ''
        const { latitude, longitude } = results
        const location = [longitude, latitude]
        this.deliveryCenter = location
        this.detailLoadEnd = true
        if (province === city) city = '市辖区'
        this.cascader = [
          TextToCode[province].code,
          TextToCode[province][city].code
        ]
        // 用于用户修改所属城市后
        this.tempCascader = [
          TextToCode[province].code,
          TextToCode[province][city].code
        ]

        if (this.detail.fullAddress) {
          this.keyWord = address + poiName
          this.addressDetail = addressDetail
        }
        this.detail.restAppointmentStatus
          ? (this.status = '0')
          : (this.status = '1')
        this.detail.businessLicenseStatus ? (this.end = '2') : (this.end = '1')
        const tempImgs = this.detail.environmentImages
          ? this.detail.environmentImages.split(',')
          : ['']
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
      } catch (e) {
        console.log('debug', e)
      }
      this.mainLoad = false
    },
    detailUploadChange({ file, fileList }) {
      const { status } = file
      if (['done', 'removed'].includes(status)) {
        this.detailImgs = fileList
        this.image = this.detailImgs.map(i => {
          const { url, uid, name, xhr: { responseURL } = {} } = i
          if (url) return url
          else {
            const filePath = `${responseURL}top50-public/${this.ossPath}/${uid}_${name}`
            return filePath
          }
        })
        this.detail.environmentImages = this.image.join(',')
      }
    },
    // 获取可用的配送方式
    async getDeliverys() {
      try {
        const { results } = await fhGetDeliverys()
        this.deliveryLoadEnd = true
        this.deliveryMethods = results
        this.$forceUpdate()
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    async getStoreManager(params) {
      try {
        const { results } = await fhGetStoreManager(params)
        this.manager = results
        this.manager.push({
          id: this.detail.storeManagerId,
          name: this.detail.storeSuperName
        })
      } catch (e) {
        console.log(e)
      }
    },
    async fhPutIcon() {},
    async getUserInfo() {
      try {
        const results = await getUserInfo()
        const obj = JSON.parse(results)
        this.merchantId = obj.merchantId
      } catch (e) {
        console.log(e)
      }
    },
    changeIsEditStore() {
      this.isEditStoreInfo = !this.isEditStoreInfo
    },
    // 图片上传成功方法
    uploadSuccess(v, key) {
      const { src } = v
      this.detail[key] = src
      this.$refs.infoForm.clearValidate(key)
    },
    ImgList(v, key) {
      const { src } = v
      this.detail[key] = src
      this.$refs.infoForm.clearValidate(key)
    },
    // 图片删除方法
    removeUpload(key) {
      this.detail[key] = ''
    },
    // 选中默认配送方式
    defaultDeliveryIndex(v, i) {
      this.defDelIndex = i
    },
    // 选择省市区
    cascaderChange(v) {
      if (v) {
        v.forEach((i, k) => {
          const value = CodeToText[i]
          const key = regionMap.get(k)
          this.detail[key] = value
          if (key === 'city') {
            if (value === '市辖区') this.detail.city = this.detail.province
            if (this.gdMap) {
              this.gdMap.setAutoCompleteCity(this.detail.city)
            }
          }
        })
      }
    },
    // 城市
    addressFocus() {
      this.mapDialogShow = true
    },
    // 校验输入
    validateFrom() {
      let flag = true
      const { infoForm, deliveryForm } = this.$refs
      infoForm.validate(valid => {
        if (!valid) {
          flag = false
        }
      })
      deliveryForm.forEach(i => {
        i.validate(valid => {
          if (!valid) {
            flag = false
          }
        })
      })
      // console.log('debug', flag)
      flag
        ? this.saveBtn()
        : this.$notify({
            type: 'error',
            message: '请完整地填写表单'
          })
    },
    // 获取店长账号ID
    getManager(val) {
      this.detail.storeManagerId = val.id
    },
    // 修改信息接口
    async editStore(id, params) {
      try {
        const { success } = await fhEditStore(id, params)
        if (success) {
          this.$message.success('编辑成功')
          this.$router.go(-1)
        }
      } catch (err) {
        console.log(err)
      }
    },
    // 保存修改的信息
    async saveBtn() {
      this.saveLoad = true
      try {
        const { defaultDelivery } = this
        this.detail.deliveryList = this.deliveryMethods.map(i => {
          const { deliveryType } = i
          i.status = deliveryType === defaultDelivery ? 1 : 0
          return i
        })
        this.detail.restAppointmentStatus = this.status === '0'
        this.detail.businessLicenseStatus = this.end !== '1'
        this.detail.quantitativeClassificationEnd = this.detail.manageLicenseEnd
        this.editStore(this.storeId, this.detail)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.saveLoad = false
    },
    // 查询地址
    searchAddress(queryString, cb) {
      if (queryString !== '') {
        this.addressLoading = true
        const { gdMap } = this
        const { autoComplete } = gdMap || {}
        if (!autoComplete) return
        autoComplete.search(queryString, (status, res) => {
          const { tips = [] } = res
          const temp = tips
            .filter(i => i.location)
            .map(i => {
              const { address, name } = i
              i.fullAddress = `${address}${name}`
              return i
            })
          this.addressOptions = temp
          this.addressLoading = false
        })
      }
    },
    // 选中一个地址
    chooseAddress(v) {
      const {
        gdMap: { marker, GDMap }
      } = this
      const { location, name, district } = v
      let { address } = v
      const { lat, lng } = location

      address = Array.isArray(address) ? address[0] || '' : address

      this.tempAddressObj = {
        latitude: lat,
        longitude: lng,
        address,
        district,
        poiName: name,
        addressDetail: ''
      }

      this.deliveryCenter = [lng, lat]

      marker.setPosition(location)
      GDMap.setCenter([lng, lat])
      this.$refs.deliveryArea.updateCenter([lng, lat])
    },
    // 确定地址
    confirmLocation() {
      const { tempAddressObj, addressDetail } = this

      if (!tempAddressObj || !tempAddressObj.latitude) {
        this.$message.warning('请选择一个店铺地址')
        return
      }

      Object.assign(this.detail, tempAddressObj, { addressDetail })
      this.setFuleAddress()
      this.mapDialogShow = false
    },
    // 设置完整的地址
    setFuleAddress() {
      if (this.tempAddressObj) {
        const { address, poiName, addressDetail } = this.detail
        const { district } = this.tempAddressObj || {}
        this.detail.fullAddress = district + address + poiName + addressDetail
      }
    },
    mapLoadEnd(v) {
      const { success } = v
      if (success) {
        const { gdMap } = this.$refs
        this.gdMap = gdMap
        if (this.detail.city) this.gdMap.setAutoCompleteCity(this.detail.city)
      }
    },
    // 计算和判断是否允许选择当天
    computedTimes(arr) {
      // return this.merchantInfo.merchantManagerType === 'retail'
      //   ? [{ label: '当天', value: 1 }, ...arr]
      //   : arr
      return arr
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: transparent;
  padding: 0;

  .btn-box {
    justify-content: flex-end;
  }
  .font-blod {
    font-size: 16px;
    font-weight: 700;
  }
  .sub_title {
    margin-bottom: 10px;
  }
}
</style>
