<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-22 14:17:36
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-24 15:39:38
-->
<template>
  <div style="margin-top:18px">
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in storeArr"
        :key="index"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
        style="margin-bottom:18px"
      >
        <div class="tag">
          <template v-if="typeof(item)==='object'">
            <div class="info">{{ item.label }}</div>
            <span><i
              v-if="false"
              class="el-icon-close"
              @click="delStore(item, index)"
            /></span>
          </template>
          <template v-else>
            <div class="info">{{ item }}</div>
            <span><i
              v-if="false"
              class="el-icon-close"
              @click="delStore(item, index)"
            /></span>
          </template>

        </div>

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    storeArr: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },

  mounted() {
    window.storeTags = this
  },

  methods: {
    delStore() {

    }
  }

}
</script>

<style lang='scss' scoped>
.tag {
  display: inline-block;
  width: 100%;
  background-color: #f4f4f5;
  color: #909399;
  height: 36px;
  padding: 0 10px;
  line-height: 36px;
  font-size: 12px;
  border: 1px dashed #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  .info {
    width: calc(100% - 20px);
    display: inline-block;
  }
}
</style>
