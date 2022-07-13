<template>
  <div>
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in tagList"
        :key="index"
        :xs="12"
        :sm="12"
        :md="8"
        :lg="6"
        :xl="4"
      >
        <div class="top">{{ item.label }}</div>
        <div class="main">
          <span v-if="item.prefix" class="prefix">{{ item.prefix }}</span>
          <span class="content">{{ tagData[item.field] }}</span>
          <span v-if="item.suffix" class="suffix">{{ item.suffix }}</span>
        </div>
        <!-- <div class="content">mock数据</div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    tagList: {
      type: Array,
      default() {
        return []
      }
    },
    tagData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },

  mounted() {
    window.tag = this
  },

  methods: {}
}
</script>

<style lang="scss" scoped>
.top {
  font-size: 16px;
  color: #999999;
}
.main {
  color: #333333;
  font-size: 14px;

  .prefix {
    margin-right: 10px;
  }
  .suffix {
    margin-left: 10px;
  }
  .content {
    font-size: 26px;
  }
}
</style>
