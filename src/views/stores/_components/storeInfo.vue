<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-10 14:17:15
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-05 14:06:29
-->
<template>
  <div v-loading="loading">
    <el-form label-width="11em">
      <div class="container box">
        <b style="font-size: 20px">{{ details.storeName }}</b>
        <span style="margin-left: 10px" class="mr-12">
          店铺id: {{ details.id }}
        </span>
        <el-form-item label="店铺状态:" style="margin-bottom: 0">
          <a-switch
            :checked="details.storeStatus"
            checked-children="启用"
            un-checked-children="禁用"
            :loading="changeLoad"
            @change="storeStatusChange"
          />
        </el-form-item>
        <el-form-item label="地址:" style="margin-bottom: 0">
          {{ details.address }}
        </el-form-item>
      </div>
      <div v-for="(item, index) in upInfo" :key="index" class="container box">
        <div class="box_hender">
          <b style="font-size: 16px">{{ item.title }}</b>
          <el-button type="primary" @click="show(item.type)">修改</el-button>
        </div>
        <el-form-item
          v-for="i in item.titleInfo"
          :key="i.label"
          :label="i.label + '：'"
          style="margin-bottom: 15px"
        >
          <template v-if="i.type === 'text'">
            <div v-if="i.render">
              <span
                v-html="
                  i.render(
                    details[i.field] ||
                      details[i.field] === 0 ||
                      details[i.field] === false
                      ? details[i.field]
                      : details
                  )
                "
              />
            </div>
            <div v-else>
              {{ details[i.field] || i.default || '' }}
            </div>
          </template>

          <template v-if="i.type === 'ossUpload'">
            <oss-upload
              :disabled="true"
              style="margin-left: 15px"
              :files="
                details[i.field]
                  ? [
                      {
                        uid: '-1',
                        name: 'image.png',
                        status: 'done',
                        url: details[i.field]
                      }
                    ]
                  : []
              "
            />
          </template>
        </el-form-item>
      </div>
    </el-form>
    <PutStoreInfo
      v-if="!reset"
      :merchantManagerType="merchantManagerType"
      :visible.sync="visible"
      :type="type"
      :data="details"
      :merchant="merchant"
      @cancel="cancel"
    />
  </div>
</template>

<script>
import { fhGetStoreDetail, fhChangeStoreStatus } from '@/api/setting'
import { fhGetMerchantDetail } from '@/api/merchant'
import { info } from './storeInfo'
import OssUpload from '@/components/OssUpload'
import PutStoreInfo from './putStoreInfo.vue'
import { getMerchantManagerType, getUserInfo } from '@/utils/auth'
export default {
  components: {
    OssUpload,
    PutStoreInfo
  },
  data() {
    return {
      info,
      details: {},
      visible: false,
      type: 0,
      loading: false,
      reset: false,
      changeLoad: false,
      merchantManagerType: 'restaurant',
      merchantId: null,
      merchant: {}
    }
  },
  created() {
    this.getManagerType()
    this.userInfo()
    this.getStoreDetail()
  },
  computed: {
    upInfo() {
      let newInfo = []
      if (['retail', 'restaurant'].includes(this.merchantManagerType)) {
        newInfo = [...this.info]
      } else {
        newInfo = this.info.filter(item => {
          return (item.titleInfo = item.titleInfo.filter(i => {
            return i.merchantManagerType !== 'restaurant'
          }))
        })
      }
      return newInfo
    }
  },
  methods: {
    async getManagerType() {
      try {
        const results = await getMerchantManagerType()
        this.merchantManagerType = results
      } catch (err) {
        console.log(err)
      }
    },
    async userInfo() {
      try {
        const results = await getUserInfo()
        const { merchantId } = results
        this.getMerchantDetail(merchantId)
      } catch (err) {
        console.log(err)
      }
    },
    async getMerchantDetail(merchantId) {
      try {
        const { results } = await fhGetMerchantDetail(merchantId)
        this.merchant = results
        console.log(this.merchant)
      } catch (err) {
        console.log()
      }
    },
    async getStoreDetail() {
      this.loading = true
      try {
        const { results } = await fhGetStoreDetail()
        const { cats, businessDate, productionReminderTime, storeStatus } =
          results
        const catName = cats.split(',')
        results.mainCates = catName[0]
        results.auxCates = catName[1]
        results.catName = catName
        const businessDateArr = []
        if (businessDate) {
          results.businessDate = businessDate.split(',')
        } else {
          results.businessDate = []
        }
        results.businessDate.forEach(item => {
          businessDateArr.push(parseInt(item))
        })
        results.businessDate = businessDateArr
        results.storeStatus = !!storeStatus
        if (!productionReminderTime) results.productionReminderTime = 60
        this.details = results
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    show(type) {
      this.reset = false
      this.$nextTick(() => {
        this.type = type
        this.visible = true
      })
    },
    cancel() {
      this.visible = false
      this.$nextTick(() => {
        setTimeout(() => {
          this.reset = true
        }, 300)
      })
    },
    // 切换店铺状态
    async storeStatusChange(upStatus) {
      this.changeLoad = true
      try {
        await fhChangeStoreStatus({ upStatus: upStatus ? 1 : 0 })
        this.details.storeStatus = upStatus
        this.$message.success(`${upStatus ? '启用' : '禁用'}店铺成功`)
      } catch (e) {
        console.error('切换店铺状态 error:', e)
      }
      this.changeLoad = false
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin: 0;
  margin-bottom: 20px;
  min-height: 0;
  .box_hender {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
