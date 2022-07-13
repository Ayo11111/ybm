<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-08 19:08:45
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-08 19:18:42
-->
<template>
  <div style="display: flex">
    <a-avatar :size="62" icon="user" :src="value.nursePhoto" />
    <div>
      <div v-show="value.nurseName" class="infoText">
        <span>
          {{ value.nurseName }}
          <a-tag style="margin-left: 5px">
            {{ levels[value.nurseLevel] || '等级未知' }}
          </a-tag>
        </span>
        <span>
          {{ value.nurseSexText }}
          <span>{{ age }}</span>
        </span>
        <span>手机号 {{ value.nursePhone || '未知' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { maps } from './_utils'
export default {
  name: 'NurseInfo',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      ...maps
    }
  },
  computed: {
    age() {
      const { nurseBirthday } = this.value
      const age = this.$moment().diff(this.$moment(nurseBirthday), 'years')
      return age ? `${age}岁` : '年龄未知'
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.infoText {
  margin-left: 20px;
  display: flex;
  flex-flow: column;
}
</style>
