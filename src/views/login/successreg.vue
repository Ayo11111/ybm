<template>
  <div class="successreg">
    <div class="wrap">
      <div class="img">
        <img src="@/assets/img/daishenhe.png" alt="" />
      </div>
      <div v-loading="loadingName" class="company">
        您的账户：{{ name }}&nbsp;&nbsp;授权成功
      </div>
      <div class="info">
        小程序已经授权成功，请等待平台管理员进行审核，审核通过后才能登录商家后台。
      </div>
      <div class="btn">
        <router-link :to="{ path: '/login' }">
          <el-button type="primary">返回登录页</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getQueryStringValueByName } from '@/utils'
import { getMerchantInfo } from '@/api/seller'

export default {
  data() {
    return { name: '', loadingName: false }
  },
  mounted() {
    this.getQueryStringValueByName('merchantId')
  },
  methods: {
    getQueryStringValueByName,
    // 请求商家名称
    async getMerchantInfoData() {
      this.loadingName = true
      const data = await getMerchantInfo()
      if (data.code === 200) {
        this.name = data.results.companyName
      } else {
        this.$message.error(data.message)
      }
      this.loadingName = false
    }
  }
}
</script>

<style lang="scss" scoped>
.successreg {
  background-image: url('http://127.0.0.1:32767/15.35.20/images/%E7%99%BB%E5%BD%95/u1.jpg');
  opacity: 0.8;
  height: 100%;
  position: relative;
  .wrap {
    vertical-align: middle;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 3px;
    padding: 50px;
    transform: translate(-50%, -50%);
    .company {
      font-size: 16px;
      color: black;
      font-weight: 640;
      line-height: 50px;
      text-align: center;
    }
    .img {
      text-align: center;
      margin-bottom: 26px;
    }
    .info {
      color: #969090;
      font-size: 16px;
      line-height: 36px;
      margin-bottom: 46px;
      text-align: center;
    }
    .btn {
      text-align: center;
    }
  }
}
</style>
