<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-25 14:11:00
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-10 10:58:20
-->
<template>
  <el-dialog append-to-body title="选择配送员" :visible="visible" :before-close="cancel">
    <el-row>
      <el-col :span="24">备餐已完成，请选择配送员</el-col>
    </el-row>
    <el-row v-loading="mainLoad">
      <el-col
        v-if="deliveryList.length > 0"
        :span="24"
        style="margin-top: 24px;"
      >
        <el-row type="flex" class="cardBox">
          <div
            v-for="(i, k) in deliveryList"
            :key="k"
            :class="['card', { 'card-act': k === chooseDelivery }]"
            @click="chooseADelivery(k, i.id)"
          >
            <p style="padding-top: 12px;">{{ i.name }}</p>
            <p style="padding-bottom: 12px;">{{ i.phone }}</p>
            <a-icon
              v-show="k === chooseDelivery"
              type="check-circle"
              class="card-icon"
              :style="{ color: ' #52ACFF' }"
            />
          </div>
        </el-row>
      </el-col>
      <el-col v-else :span="20">
        <router-link
          :to="{ name: 'DeliveryStaff', query: { add: true } }"
          style="color: #52ACFF;"
        >
          没有配送员前往添加
        </router-link>
      </el-col>
    </el-row>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" :loading="okLoad" @click="ifChnageDelivery">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getDeliverys } from '@/api/delivery/staff'
import { fhAssignment } from '@/api/week-order'
export default {
  name: 'SelfDeliveryDig',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    orderIds: {
      type: String,
      default: ''
    },
    riderId: {
      type: [Number, String],
      default: ''
    },
    isChange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: this.show,
      chooseDelivery: -1,
      deliveryList: [],
      okLoad: false,
      mainLoad: false
    }
  },
  watch: {
    show(v) {
      if (v) this.deliverys()
      this.visible = v
    }
  },
  methods: {
    // 获取所有配送员
    async deliverys() {
      this.mainLoad = true
      try {
        const { results } = await getDeliverys({ pageSize: 999 })
        this.deliveryList = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.mainLoad = false
    },
    // 选中一个配送员
    chooseADelivery(index, id) {
      this.chooseDelivery = index
      this.personId = id
    },
    // 关闭当前弹窗
    cancel() {
      this.$emit('update:show', false)
    },
    // 是否是切换配送方式
    ifChnageDelivery() {
      this.isChange ? this.changeDelivery() : this.ok()
    },
    changeDelivery() {
      this.$emit('update:riderId', this.personId)
      this.cancel()
      // this.$emit('ok')
    },
    // 选中配送员
    async ok() {
      this.okLoad = true
      try {
        await fhAssignment({ orderIds: this.orderIds, riderId: this.personId })
        this.cancel()
        this.$emit('ok')
        this.$message.success('选择配送员成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.okLoad = false
    }
  }
}
</script>

<style lang="scss" scoped>
.cardBox {
  flex-wrap: wrap;
  .card {
    position: relative;
    width: 180px;
    border-radius: 9px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: 0 10px 10px 0;
    p {
      padding-left: 12px;
      cursor: pointer;
    }
    .card-icon {
      position: absolute;
      bottom: 14px;
      right: 12px;
    }
  }
  .card-act {
    border: 1px solid #52ACFF;
  }
}
</style>
