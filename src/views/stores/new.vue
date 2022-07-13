<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-23 16:43:35
 * @LastEditors: HJ
 * @LastEditTime: 2021-09-23 03:01:02
-->
<template>
  <div class="container">
    <div class="title-box font-blod">店铺信息</div>
    <el-divider style="margin-top: 12px" />
    <div class="info-box">
      <el-form ref="form" :model="store" :rules="rule" label-width="10em">
        <el-row>
          <el-col :span="12">
            <el-form-item label="店铺名称" prop="storeName">
              <el-input v-model="store.storeName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="店铺热线" prop="phone">
              <el-input v-model="store.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属城市" prop="cascader">
              <el-cascader
                v-model="store.cascader"
                style="width: 100%"
                :options="provinceAndCityData"
                clearable
                @change="cascaderChange"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="详细地址" prop="fullAddress">
              <el-input v-model="store.fullAddress" @focus="addressFocus" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="店铺公告" prop="announcement">
                  <el-input v-model="store.announcement" type="textarea" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="收银系统ID" prop="erpStoreId">
                  <el-input v-model="store.erpStoreId" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="12">
                <el-form-item label="店铺店长" prop="storeManagerId">
                  <filter-select
                    :data="storesAccount"
                    :value.sync="store.storeManagerId"
                    vk="id"
                    vl="name"
                    vv="id"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <span class="ml-12">
                  <el-button type="text" @click="create">新建店长</el-button>
                </span>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="6">
                <el-form-item label="店铺状态" prop="storeStatus">
                  <el-radio-group v-model="store.storeStatus">
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
                  <el-radio-group v-model="store.zitiStatus">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col> -->
              <el-col :span="6">
                <el-form-item
                  label="外卖状态"
                  label-width="8em"
                  prop="takeAwayStatus"
                >
                  <el-radio-group v-model="store.takeAwayStatus">
                    <el-radio :label="1">开启</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col v-show="store.storeStatus" :span="24">
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
          <el-col v-show="defaultDelivery > 1 && store.storeStatus" :span="24">
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
            <el-form-item label="营业时间" prop="businessTime">
              <el-time-picker
                v-model="store.businessTime"
                is-range
                start-placeholder="请选择开始时间"
                end-placeholder="请选择开始时间"
                format="HH:mm"
                value-format="HH:mm:ss"
                :default-value="['2021 08:00:00', '2021 22:00:00']"
              />
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
                    :path="ossPath"
                    :limit-size="2"
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
                    v-model="store.businessLicenseEnd"
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
                    file-name="经营许可证"
                    :path="ossPath"
                    :limit-size="2"
                    @change="option => changeImg(option, 'manageLicenseImags')"
                  >
                    <span style="color: #999">
                      请上传证件清晰原件扫描件或拍摄照片,大小不超过2M；格式为png、jpg；建议尺寸
                      644 * 436
                    </span>
                  </oss-upload>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="有效期至" prop="manageLicenseEnd">
                  <el-date-picker
                    v-model="store.manageLicenseEnd"
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
            <el-row>
              <el-col :span="12">
                <el-form-item
                  label="量化分级信息"
                  prop="quantitativeClassificationImage"
                >
                  <oss-upload
                    file-name="量化分级信息"
                    :path="ossPath"
                    :limit-size="2"
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
                <el-form-item
                  :label="i.label"
                  :prop="i.prop"
                  label-width="10em"
                >
                  <el-input
                    v-if="['text', 'textarea'].includes(i.type)"
                    v-model="store[i.prop]"
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
          </el-col>
        </el-row>
      </el-form>
      <a-divider dashed />
      <div class="font-blod sub_title">店铺配送范围设置</div>
      <delivery-area
        ref="deliveryArea"
        :center.sync="deliveryCenter"
        :price.sync="store.startSale"
        :path.sync="store.deliveryPath"
        pass-prop
      />
      <a-divider dashed />
      <div class="font-blod sub_title">预订单设置</div>
      <el-form :model="store">
        <el-form-item label="是否开启">
          <el-radio-group v-model="store.appointmentStatus">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="预约送达时间">
          <span>最快送达时间</span>
          <filter-select
            :data.sync="service"
            :value.sync="store.appointmentDeliveryTime"
            vk="label"
            vv="value"
            vl="label"
            :disable="!store.appointmentStatus"
          />
          <span>后可预约送达时间，间隔为</span>
          <filter-select
            :data="interval"
            :value.sync="store.appointmentIntervalTime"
            vk="label"
            vv="value"
            vl="label"
            :disable="!store.appointmentStatus"
          />
        </el-form-item>
        <el-form-item label="接收预定时间">
          <filter-select
            :data="destine"
            :value.sync="store.appointmentStart"
            vk="label"
            vv="value"
            vl="label"
            :disable="!store.appointmentStatus"
          />
          ---
          <filter-select
            :data="destine"
            :value.sync="store.appointmentEnd"
            vk="label"
            vv="value"
            vl="label"
            :disable="!store.appointmentStatus"
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
      <div class="btn-box">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" :loading="saveLoad" @click="validataFn">
          提交
        </el-button>
      </div>
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
                v-model="store.cascader"
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
      <g-map v-if="mapDialogShow" ref="gdMap" @load-end="mapLoadEnd" />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmLocation"> 确定 </el-button>
      </div>
    </el-dialog>
    <!-- 新建店长 -->
    <Table :visible.sync="visible" @getStoresAccount="getStoresAccount" />
  </div>
</template>

<script>
// TODO 拆分成组件
import { provinceAndCityData, CodeToText } from 'element-china-area-data'
import OssUpload from '@/components/OssUpload'
import FilterSelect from '@/components/FilterSelect'
import GMap from '@/components/Gmap'
import DeliveryArea from '@/components/DeliveryArea'
import { getUserInfo } from '@/utils/auth'
import { regionMap, times, quantityList } from './_utils'
import { fhGetStoresAccount } from '@/api/users'
import { fhCreateStore, fhGetDeliverys } from '@/api/stores'
import { beforeRouteLeave } from '@/utils/cache-router'
import { validArrayEmpty } from '@/utils/validate'
import rule from './_utils/validDetailForm'
import Table from './_components/accountModal'
export default {
  name: 'NewStore',
  components: {
    OssUpload,
    FilterSelect,
    GMap,
    DeliveryArea,
    Table
  },
  data() {
    var validateLicenseEnd = (rule, value, callback) => {
      if (this.end === '1' && !this.store.businessLicenseEnd) {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    }
    return {
      quantityList,
      cascader: null,
      defaultDelivery: null,
      store: {
        appointmentDeliveryTime: 30,
        appointmentIntervalTime: 15,
        appointmentStart: 1,
        appointmentEnd: 1,
        appointmentStatus: 0,
        storeStartStatus: 0,
        storeName: '',
        deliveryList: null,
        startSale: 0,
        storeManagerId: null
      },
      // 所有店铺账号
      storesAccount: [],
      // 营业时间
      businessTime: null,
      deliveryMethods: [],
      provinceAndCityData,
      merchantId: '',
      mapDialogShow: false,
      // 地图搜索
      keyWord: '',
      addressDetail: '',
      addressOptions: [],
      addressLoading: false,
      // 时间
      ...times,
      // 配送范围中心
      deliveryCenter: null,
      rule,
      validArrayEmpty,
      saveLoad: false,
      pickerOptions: {
        disabledDate: date => {
          const time = new Date().valueOf()
          return time > date.valueOf()
        }
      },
      status: '0',
      visible: false,
      end: '1',
      validateLicenseEnd,
      image: null,
      detailImgs: null
    }
  },
  computed: {
    ossPath() {
      return `merchant/stores/${this.merchantId}`
    }
  },
  watch: {
    'store.businessTime'(v) {
      const flag = !v || v.length < 1
      this.store.startTime = flag ? '' : v[0]
      this.store.endTime = flag ? '' : v[1]
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
  async mounted() {
    window.sn = this
    const { merchantId } = (await getUserInfo())
    this.merchantId = merchantId
    this.$nextTick(() => {
      this.getDeliverys()
      this.getStoresAccount()
    })
  },
  activated() {
    this.getStoresAccount()
  },
  methods: {
    changeImg(option, key) {
      const { src } = option
      this.$set(this.store, key, src)
      this.$refs.form.validateField(key)
    },
    // 获取可用的配置方式
    async getDeliverys() {
      try {
        const { results } = await fhGetDeliverys()
        this.deliveryMethods = results
        this.$forceUpdate()
      } catch (e) {
        console.log('debug axios', e)
      }
    },
    // 选择省市区
    cascaderChange(v) {
      if (v) {
        v.forEach((i, k) => {
          const value = CodeToText[i]
          const key = regionMap.get(k)
          this.store[key] = value
          if (key === 'city') {
            if (value === '市辖区') this.store.city = this.store.province
            if (this.gdMap) {
              this.gdMap.setAutoCompleteCity(this.store.city)
            }
          }
        })
      }
      this.$refs.form.validateField('cascader')
    },
    // 获取所有店铺店长
    async getStoresAccount(account) {
      if (account && account.id) {
        this.store.storeManagerId = account.id
        this.storesAccount = [account]
      }
      try {
        const { results } = await fhGetStoresAccount()
        this.storesAccount = results
      } catch (e) {
        console.log('debug', e)
      }
    },
    // 校验表单
    validataFn() {
      let flag = true
      const { form } = this.$refs
      form.validate(valid => {
        if (!valid) {
          flag = false
        }
      })
      flag
        ? this.createStore()
        : this.$notify({
            type: 'error',
            message: '请完整地填写表单'
          })
    },
    // 保存店铺信息
    async createStore() {
      this.saveLoad = true
      try {
        const { defaultDelivery } = this
        this.store.deliveryList = this.deliveryMethods.map(i => {
          const { deliveryType } = i
          i.status = deliveryType === defaultDelivery ? 1 : 0
          return i
        })
        let { address } = this.store
        address = Array.isArray(address)
          ? address.length === 0
            ? null
            : address[0]
          : address
        this.store.address = address
        this.store.restAppointmentStatus = this.status === '0'
        this.store.businessLicenseStatus = this.end !== '1'
        this.store.quantitativeClassificationEnd = this.store.manageLicenseEnd
        await fhCreateStore(this.store)
        this.$message.success('创建成功')
        this.$router.go(-1)
      } catch (e) {
        console.log('debug', e)
      }
      this.saveLoad = false
    },
    create() {
      this.visible = true
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
        this.store.environmentImages = this.image.join(',')
        console.log(this.store.environmentImages)
      }
    },
    mapLoadEnd(v) {
      const { success } = v
      if (success) {
        const { gdMap } = this.$refs
        this.gdMap = gdMap
        if (this.store.city) this.gdMap.setAutoCompleteCity(this.store.city)
        if (this.deliveryCenter) this.gdMap.setCenter(this.deliveryCenter)
      }
    },
    addressFocus() {
      this.mapDialogShow = true
    },
    // 地图相关事件
    // 查询地址
    searchAddress(queryString) {
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
      const { location, address, name, district } = v
      const { lat, lng } = location

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

      Object.assign(this.store, tempAddressObj, { addressDetail })
      this.setFuleAddress()
      this.mapDialogShow = false
    },
    // 设置完整的地址
    setFuleAddress() {
      if (this.tempAddressObj) {
        const { address, poiName, addressDetail } = this.store
        const { district } = this.tempAddressObj || {}
        this.store.fullAddress = district + address + poiName + addressDetail
      }
    },
    // 选中默认配送方式
    defaultDeliveryIndex(v, i) {
      console.log(v)
      console.log(i)
      this.defDelIndex = i
    }
  },
  beforeRouteLeave
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0;
  transition: height 1s linear;

  .gray {
    padding: 0;
    margin: 0;
    line-height: 1.5;
    margin-left: 7em;
  }

  .title-box {
    padding: 12px 24px;
  }

  .info-box {
    padding: 24px;
  }

  .btn-box {
    text-align: center;
  }

  &::v-deep .el-divider {
    margin: 0;
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
