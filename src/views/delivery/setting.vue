<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-21 15:47:32
 * @LastEditors: HJ
 * @LastEditTime: 2021-04-22 20:58:14
-->
<template>
  <div v-loading="mainLoad" class="container">
    <el-form inline>
      <el-row>
        <el-row>
          <!-- <el-col :span="6">
            <el-form-item label="是否开启配送自提柜" prop="zitiStatus">
              <el-radio-group v-model="detail.zitiStatus">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="6">
            <el-form-item label="是否开启自配送" prop="selfStatus">
              <el-radio-group v-model="detail.selfStatus">
                <el-radio :label="1">开启</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-col :span="24">
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
        <el-col :span="24">
          <el-form-item label="店铺配送ID" prop="delWay">
            <template v-for="i in deliveryMethods">
              <el-form
                v-if="i.deliveryType !== 1"
                :key="i.deliveryName"
                :model="i"
                class="mb-24"
                inline
              >
                <!-- 如果需要校验可以做在这 -->
                <el-form-item
                  :label="`${i.deliveryName}店铺ID`"
                  prop="baseStoreId"
                >
                  <el-input
                    v-model="i.baseStoreId"
                    placeholder="请输入店铺Id"
                  />
                </el-form-item>
              </el-form>
            </template>
            <span class="gray" style="margin: 0">
              配送店铺ID是店铺能进行配送的必填项，新建店铺可先不填，创建店铺后可到店铺详情中填写，但需要正常启用店铺时一定都需要填写
            </span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <a-divider dashed />
    <el-form inline>
      <el-row>
        <el-col :span="24">
          <el-form-item label="店铺地址" prop="fullAddress">
            <!-- <el-input v-model="detail.fullAddress" style="width: 46em" @focus="addressFocus" /> -->
            <span>{{ detail.fullAddress }}</span>
            <el-button class="ml-12" @click="addressFocus">修改</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="font-blod">店铺配送范围设置</div>
    <delivery-area
      ref="deliveryArea"
      :center.sync="deliveryCenter"
      :price.sync="detail.startSale"
      :path.sync="detail.deliveryPath"
      :polygon-path.sync="deliveryPath"
      :pass-prop="!detail.deliveryPath"
      @loadDeliveryAreaEnd="loadDeliveryAreaEnd"
    />
    <div class="base-box mt-24 flex btn-box">
      <el-button @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" :loading="saveLoad" @click="saveBtn">
        保存
      </el-button>
    </div>
    <el-dialog
      width="72vw"
      top="3vh"
      title="选择地址"
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
              <el-autocomplete
                v-model="keyWord"
                placeholder="请输入地址"
                value-key="fullAddress"
                class="mb-24"
                style="width: 100%"
                :fetch-suggestions="searchAddress"
                @select="chooseAddress"
              />
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
import DeliveryArea from '@/components/DeliveryArea'
import FilterSelect from '@/components/FilterSelect'
import GMap from '@/components/Gmap'
import { fhGetStoreDetail, fhEditStore } from '@/api/setting'
import { arrayEquals } from '@/utils'
import {
  provinceAndCityData,
  CodeToText,
  TextToCode
} from 'element-china-area-data'
import { regionMap } from './_utils'
export default {
  name: 'DeliverySetting',
  components: {
    DeliveryArea,
    FilterSelect,
    GMap
  },
  data() {
    return {
      gdMap: null,
      cascader: null,
      mainLoad: false,
      deliveryCenter: null,
      deliveryPath: '',
      mapDialogShow: false,
      detail: {
        selfStatus: 0
      },
      // 配送方式
      deliveryMethods: [],
      defaultDelivery: null,
      saveLoad: false,
      provinceAndCityData,
      // 配送范围的路径
      deliveryLoadEnd: false,
      detailLoadEnd: false,
      // 地图搜索
      keyWord: '',
      addressDetail: '',
      chooseFlag: false
    }
  },
  watch: {
    cascader: {
      // eslint-disable-next-line space-before-function-paren
      handler: function(v, ov) {
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
  mounted() {
    window.storeD = this
    this.getStoreDetail()
  },
  methods: {
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
    // 获取店铺详情
    async getStoreDetail() {
      this.mainLoad = true
      try {
        const { results } = await fhGetStoreDetail(this.storeId)
        this.detail = results
        const {
          deliveryPath,
          startTime,
          endTime,
          deliveryList,
          province,
          addressDetail,
          poiName,
          address
        } = results
        let { city } = results

        this.deliveryMethods = deliveryList

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
      } catch (e) {
        console.log('debug', e)
      }
      this.mainLoad = false
    },
    // 城市
    addressFocus() {
      this.mapDialogShow = true
    },
    // 查询地址
    searchAddress(queryString, cb) {
      const { gdMap } = this
      const { autoComplete } = gdMap || {}
      if (!autoComplete) {
        cb([])
        return
      }
      autoComplete.search(queryString, (status, res) => {
        const { tips = [] } = res
        const temp = tips.filter(i => {
          const { address, name, location } = i
          i.fullAddress = `${address}${name}`
          if (location) return i
        })
        cb(temp)
      })
    },
    // 选中一个地址
    chooseAddress(v) {
      const {
        gdMap: { marker, GDMap }
      } = this

      const { location, address, name, district } = v

      if (!location) {
        this.$message.info('当前选择的地址有误，请重新搜索后选择地址')
        return
      }

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

      this.chooseFlag = true
    },
    // 确定地址
    confirmLocation() {
      const { tempAddressObj, addressDetail, keyWord } = this
      Object.assign(this.detail, tempAddressObj, { addressDetail })
      keyWord && this.setFuleAddress()
      if (!keyWord) {
        this.$notify({
          message: '请选择一个店铺地址',
          type: 'warning'
        })
      } else {
        const cityUrl = `${this.detail.province}${this.detail.city}${this.keyWord}${this.addressDetail}`
        this.detail.fullAddress = cityUrl
        this.mapDialogShow = false
        this.chooseFlag = false
      }
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
    // 保存修改的信息
    async saveBtn() {
      this.saveLoad = true
      try {
        const {
          defaultDelivery,
          detail: { selfStatus }
        } = this
        if (!selfStatus && defaultDelivery === 1) {
          this.$notify({
            title: '警告',
            message:
              '您当前选择的默认配送方式为自配送，如果需要关闭自配送，请选择非自配送为默认配送方式',
            type: 'warning'
          })
          throw Error('设置冲突')
        }
        this.detail.deliveryList = this.deliveryMethods.map(i => {
          const { deliveryType } = i
          i.status = deliveryType === defaultDelivery
          return i
        })
        await fhEditStore(this.detail)
        this.$message.success('编辑配送服务成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.saveLoad = false
    },
    loadDeliveryAreaEnd() {
      this.$refs.deliveryArea.updateCenter(this.deliveryCenter)
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-box {
  justify-content: flex-end;
}
</style>
