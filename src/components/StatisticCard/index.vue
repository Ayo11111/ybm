<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-19 21:24:16
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-20 05:53:27
-->
<template>
  <div :class="`${selectd ? 'selected' : ''} card-outer`" @click="handleSelect">
    <!-- 标题 -->
    <div>
      <span>{{ config.label }}</span>
      <el-tooltip
        v-if="config.tip"
        class="item"
        effect="dark"
        :content="config.tip"
        placement="top"
      >
        <i class="el-icon-question" />
      </el-tooltip>
    </div>
    <!-- 统计的数字 -->
    <div>
      <span v-if="config.prefix" class="prefix">{{ config.prefix }}</span>
      <span class="number">{{ value[config.field] }}</span>
      <span v-if="config.suffix" class="suffix">{{ config.suffix }}</span>
    </div>
    <!-- 附加的统计 -->
    <template v-if="config.children && config.children.length > 0">
      <div v-for="(i, k) in config.children" :key="k">
        <span class="other-label mr-12">{{ i.label }}</span>
        <span v-if="i.prefix" class="other-prefix">{{ i.prefix }}</span>
        <span class="other-number">{{ value[i.field] }}</span>
        <span v-if="i.suffix" class="other-suffix">{{ i.suffix }}</span>
      </div>
    </template>
    <!-- 底部带边框的三角形 -->
    <div class="arr-down"><span /></div>
  </div>
</template>

<script>
export default {
  name: 'StatisticCard',
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    name: {
      type: String,
      default: ''
    },
    active: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  computed: {
    selectd() {
      const { active, name } = this
      return active === name
    }
  },
  methods: {
    handleSelect() {
      this.$emit('select', this.name, this.config)
    }
  }
}
</script>

<style lang="scss" scoped>
.card-outer ~ .card-outer {
  margin-left: 12px;
}

.card-outer {
  $width: 16px;

  display: inline-block;
  background: #fff;
  box-shadow: 0 0 12px 1px rgba(0, 0, 0, 0.2);
  padding: 18px 12px;
  border-radius: 1px;
  min-width: 205px;
  min-height: 115px;
  cursor: pointer;
  margin-bottom: $width;

  & > div {
    position: relative;
    z-index: 5;
  }

  .number {
    font-weight: 700;
    font-size: 26px;
  }

  .arr-down {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, calc(100% - 1px));
    display: none;

    width: 0;
    height: 0;
    border-left: $width solid transparent;
    border-right: $width solid transparent;
    border-top: $width solid #f59a23;
    span {
      position: absolute;
      left: -($width - 2px);
      top: -($width - 1px);
      display: block;
      width: 0;
      height: 0;
      border-left: $width - 2px solid transparent;
      border-right: $width - 2px solid transparent;
      border-top: $width - 2px solid #fff;
    }
  }
}

.selected {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #f59a23;
  }
  .arr-down {
    display: block;
  }
}
</style>
