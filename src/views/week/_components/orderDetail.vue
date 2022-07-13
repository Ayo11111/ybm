<template>
  <a-modal
    title="订单详情"
    width="66%"
    :visible="visible"
    :footer="null"
    @ok="handleOk"
    @cancel="onClose"
  >
    <week-order-info
      :raw-value="item"
      type="restaurant"
      :orderListType="1"
    />
  </a-modal>
</template>

<script>
import WeekOrderInfo from '@/components/WeekOrderInfo'
import { deepClone } from '@/utils'
export default {
  components: {
    WeekOrderInfo
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      item: {}
    }
  },
  async created() {
  },
  methods: {
    handleOk() {
    },
    onOpen(item) {
      if (item) {
        this.item = deepClone(item)
      }
      this.$emit('update:visible', true)
    },
    onClose() {
      this.item = {}
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style scoped lang="scss">
</style>
