<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-03-29 05:52:51
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-20 07:25:14
-->
<template>
  <div>
    <el-row>
      <el-col v-for="(item, index) in tagList" :key="index" v-bind="colConfig">
        <div class="top">
          <span>{{ item.label }}</span>
          <el-tooltip
            v-if="item.tip"
            class="item"
            effect="dark"
            :content="item.tip"
            placement="top"
          >
            <i class="el-icon-question" />
          </el-tooltip>
        </div>
        <div class="main">
          <template
            v-if="
              (tagData[item.field] !== null &&
                tagData[item.field] !== undefined) ||
                tagData[item.field] === 0
            "
          >
            <span v-if="item.prefix" class="prefix">{{ item.prefix }}</span>
            <span class="content">{{ tagData[item.field] }}</span>
            <span v-if="item.suffix" class="suffix">{{ item.suffix }}</span>
          </template>
          <template v-else>
            <span>---</span>
          </template>
        </div>
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
    },
    colConfig: {
      type: Object,
      default: () => {
        return {
          xs: 12,
          sm: 12,
          md: 8,
          lg: 6,
          xl: 4
        }
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
.el-col {
  margin-bottom: 14px;
}
.top {
  font-size: 16px;
  color: #999999;
  .item {
    margin-left: 6px;
  }
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
