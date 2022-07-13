<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-17 13:44:43
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-05 15:40:31
-->
<template>
  <el-dialog
    width="72vw"
    top="3vh"
    title="选择地址"
    destroy-on-close
    :visible.sync="mapDialogShow"
    :before-close="handleClose"
  >
    <el-form label-width="5em" style="width: 100%">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-form-item label="店铺区域">
            <el-cascader
              v-model="cascader"
              style="width: 100%"
              :options="regionData"
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
      <el-button @click="$emit('update:mapDialogShow', false)">取 消</el-button>
      <el-button type="primary" @click="confirmLocation"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import GMap from '@/components/Gmap'
import {
  provinceAndCityData,
  regionData,
  CodeToText,
  TextToCode
} from 'element-china-area-data'
export default {
  components: {
    GMap
  },
  props: {
    mapDialogShow: {
      type: Boolean,
      default: false
    },
    activeCascader: {
      type: [Array, String],
      default: () => []
    },
    city: {
      type: String,
      default: ''
    }
  },
  watch: {
    activeCascader(newVal) {
      if (newVal) {
        this.cascader = newVal
        if (this.gdMap)
          this.gdMap.setAutoCompleteCity(
            this.cascader[this.cascader.length - 1]
          )
      } else {
        this.cascader = null
      }
      this.keyWord = ''
    }
  },
  data() {
    return {
      gdMap: null,
      cascader: [],
      provinceAndCityData,
      CodeToText,
      TextToCode,
      regionData,
      // 地图搜索
      keyWord: '',
      addressDetail: '',
      addressOptions: [],
      addressLoading: false,
      tempAddressObj: {},
      deliveryCenter: []
    }
  },
  methods: {
    cascaderChange(v) {
      this.$emit('changeCascader', v)
      this.keyWord = ''
    },
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
        addressDetail: '',
        location
      }

      this.deliveryCenter = [lng, lat]
      marker.setPosition(location)
      GDMap.setCenter([lng, lat])
    },
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
    mapLoadEnd(v) {
      const { success } = v
      if (success) {
        const { gdMap } = this.$refs
        const { location } = this.tempAddressObj
        this.gdMap = gdMap
        if (this.cascader.length > 0) {
          this.gdMap.setAutoCompleteCity(
            this.cascader[this.cascader.length - 1]
          )
        }
        if (location) {
          const { marker, GDMap } = this.gdMap
          marker.setPosition(location)
          GDMap.setCenter(this.deliveryCenter)
        }
      }
    },
    confirmLocation() {
      const { tempAddressObj, addressDetail, keyWord } = this
      // !tempAddressObj || !tempAddressObj.latitude
      if (!keyWord) {
        this.$message.warning('请选择一个店铺地址')
        return
      }
      let { district, address, poiName } = tempAddressObj
      let adrDetail = `${district}${address}${poiName}${addressDetail}`
      this.$emit('update:value', adrDetail)
      this.$emit('change', adrDetail, this.tempAddressObj)
      this.$emit('update:mapDialogShow', false)
    },
    handleClose() {
      this.$emit('update:mapDialogShow', false)
    }
  }
}
</script>

<style></style>
