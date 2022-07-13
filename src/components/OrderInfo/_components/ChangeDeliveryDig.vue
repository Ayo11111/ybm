<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-27 10:17:12
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-29 14:03:31
-->
<template>
  <el-dialog append-to-body title="切换配送方式" :visible.sync="visable" @close="cancel">
    <div v-loading="mainLoad">
      <p>
        <span>当前订单配送方式为：</span><span>{{ deliveryName }}</span>
      </p>
      <div>
        <span>选择新的配送方式：</span>
        <el-radio-group v-model="params.deliveryType">
          <el-radio
            v-for="(i, k) in deliverys"
            :key="k"
            :label="i.deliveryType"
          >
            {{ i.deliveryName }}
          </el-radio>
        </el-radio-group>
      </div>
    </div>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :loading="okLoad || mainLoad" @click="ok">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { fhGetStoreDelivery } from '@/api/stores'
import { fhChangeDelivery } from '@/api/orders'
export default {
  name: 'ChangeDeliveryDig',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    deliveryType: {
      type: Number,
      default: null
    },
    orderId: {
      type: String,
      default: ''
    },
    riderId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      visable: false,
      deliverys: [],
      okLoad: false,
      mainLoad: false,
      params: {
        deliveryType: this.deliveryType
      }
    }
  },
  computed: {
    deliveryName() {
      let res = ''
      const { deliverys } = this
      deliverys.forEach(i => {
        if (i.deliveryType === this.deliveryType) res = i.deliveryName
      })
      return res
    }
  },
  watch: {
    show(v) {
      this.visable = v
      this.getStoreDelivery()
    },
    riderId(v) {
      if (v) {
        this.params.riderId = v
        this.$nextTick(() => this.hangeDelivery())
      }
    }
  },
  methods: {
    async getStoreDelivery() {
      this.mainLoad = true
      try {
        const { results } = await fhGetStoreDelivery()
        this.deliverys = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.mainLoad = false
    },
    async hangeDelivery() {
      this.okLoad = true
      try {
        await fhChangeDelivery(this.orderId, this.params)
        this.$message.success('切换配送方式成功')
        this.cancel()
        this.$emit('ok')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.$emit('update:riderId', '')
      this.okLoad = false
    },
    cancel() {
      this.$emit('update:show', false)
    },
    ok() {
      if (this.params.deliveryType === this.deliveryType) {
        this.$message.info('当前选择的配送方式没有发生改变')
        return
      }
      if (this.params.deliveryType === 1) {
        this.$parent.showDig('selfDeliveryDig')
      } else {
        this.hangeDelivery()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
