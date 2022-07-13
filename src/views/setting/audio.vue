<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-09-01 16:27:55
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-03 09:50:22
-->
<template>
  <div v-loading="loading">
    <el-form>
      <!-- <span style="font-size: 18px">提示方式</span>
      <el-form-item label="来新订单时：">客户端自动弹出窗口</el-form-item>
      <span style="font-size: 18px">铃声设置</span><br />
      <span style="display: block;margin: 10px 0 18px 0"
        ><b style="font-size: 15px;margin-right: 8px">铃声音量</b>
        <span style="color: #7F7F7F;font-size: 12px"
          >若音量过小，请先确认已将电脑音量调到最大</span
        ></span
      >
      <el-form-item>
        <el-input style="width: 150px" placeholder="请输入铃声音量" />
      </el-form-item> -->
      <div style="margin-bottom: 8px">
        <span style="font-size: 18px">铃声播报次数</span>
        <a-button type="link">建议使用推荐设置</a-button>
      </div>
      <b>预订单提醒</b>
      <div class="options">
        <span>预订单快到时间</span>
        <el-form-item label="播报次数" style="width: 300px;margin-bottom: 0">
          <FilterSelect
            :value.sync="formData.preOrderRingsCount"
            :data="option(1)"
            vk="label"
            vl="label"
            vv="value"
            @change="putStoreRingsSetting"
          />
        </el-form-item>
      </div>
      <b>接单与催单提醒</b>
      <div class="options">
        <span>新订单</span>
        <el-form-item label="播报次数" style="width: 300px;margin-bottom: 5px">
          <FilterSelect
            :value.sync="formData.newOrderRingsCount"
            :data="option(1)"
            vk="label"
            vl="label"
            vv="value"
            @change="putStoreRingsSetting"
          />
        </el-form-item>
      </div>
      <div class="options">
        <span>催单</span>
        <el-form-item label="播报次数" style="width: 300px;margin-bottom: 0">
          <FilterSelect
            :value.sync="formData.urgeOrderRingsCount"
            :data="option(0)"
            vk="label"
            vl="label"
            vv="value"
            @change="putStoreRingsSetting"
          />
        </el-form-item>
      </div>
      <b>取消与退款</b>
      <div class="options">
        <span>用户申请退款</span>
        <el-form-item label="播报次数" style="width: 300px;margin-bottom: 0">
          <FilterSelect
            :value.sync="formData.refundOrderRingsCount"
            :data="option(1)"
            vk="label"
            vl="label"
            vv="value"
            @change="putStoreRingsSetting"
          />
        </el-form-item>
      </div>
      <b>配送提醒</b>
      <div class="options">
        <span>配送异常</span>
        <el-form-item label="播报次数" style="width: 300px;margin-bottom: 5px">
          <FilterSelect
            :value.sync="formData.deliverExceptionOrderRingsCount"
            :data="option(0)"
            vk="label"
            vl="label"
            vv="value"
            @change="putStoreRingsSetting"
          />
        </el-form-item>
      </div>
      <div class="options">
        <span>订单发配送失败</span>
        <el-form-item label="播报次数" style="width: 300px;margin-bottom: 0">
          <FilterSelect
            :value.sync="formData.deliverFailOrderRingsCount"
            :data="option(0)"
            vk="label"
            vl="label"
            vv="value"
            @change="putStoreRingsSetting"
          />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import FilterSelect from '@/components/FilterSelect'
import { list } from './audio'
import { fhGetStoreRingsSetting, fhPutStoreRingsSetting } from '@/api/stores'
export default {
  components: {
    FilterSelect
  },
  data() {
    return {
      formData: {},
      loading: false
    }
  },
  computed: {
    option() {
      return index => {
        return list(index)
      }
    }
  },
  created() {
    this.getStoreRingsSetting()
  },
  methods: {
    async getStoreRingsSetting() {
      this.loading = true
      try {
        const { results } = await fhGetStoreRingsSetting()
        this.formData = results || {}
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async putStoreRingsSetting() {
      this.loading = true
      try {
        const { results } = await fhPutStoreRingsSetting(this.formData)
        this.$message.success('编辑成功')
        this.$store.commit('audio/setCount', results || {})
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
b {
  font-size: 15px;
}
.options {
  display: flex;
  align-items: center;
  width: 900px;
  justify-content: space-between;
  margin: 5px 0 18px 0;
}
</style>
