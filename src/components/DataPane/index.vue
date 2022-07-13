<template>
  <div>
    <el-tabs
      type="border-card"
      @tab-click="handelTabC"
    >
      <el-tab-pane
        v-for="(item, index) in paneList"
        :key="index"
        :label="item.label"
      >
        <div class="tab">
          <div class="tab-header">活动效果数据 <span style="margin-left:20px;font-size:14px;color:#9a9999">数据自{{ dataSource.startTime }}起统计</span> </div>
          <div class="tab-main">
            <el-row :gutter="30">
              <el-col v-for="(i, j) in cardList" :key="j" :span="5">
                <div class="tab-item">
                  <div class="tab-item-title">
                    {{ i.label }}
                    <template v-if="i.comment">
                      <el-tooltip
                        class="item"
                        effect="dark"
                        :content="i.comment"
                        placement="top-start"
                      >
                        <img :src="i.icon" alt width="14">
                      </el-tooltip>
                    </template>
                  </div>
                  <div class="tab-item-detail">
                    <span v-if="i.prefix">{{ i.prefix }}</span>
                    <template v-if=" dataSource[i.field]!==null">{{ dataSource[i.field] }}</template>
                    <template v-else>---</template>
                    <span v-if="i.suffix">{{ i.suffix }}</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    dataSource: {
      type: Object,
      default() {}
    },
    paneList: {
      type: Array,
      default() {}

    },
    cardList: {
      type: Array,
      default() {}

    }
  },
  data() {
    return {
    }
  },

  mounted() {
    window.app = this
  },

  methods: {
    handelTabC() {}
  }

}
</script>

<style lang='scss' scoped>
.el-tabs {
  margin-bottom: 20px;
}
.tab {
  color: #777683;
  padding: 0 14px;
}
.tab-header {
  margin-top: 25px;
  line-height: 16px;
  padding-left: 20px;
  height: 16px;
  border-left: 4px solid #a1a3b3;
  margin-bottom: 20px;
}

.tab-item {
  padding: 20px;
  background: #fafafa;
}
.tab-item-title {
  color: #626073;
  line-height: 26px;
}
.tab-item-detail {
  color: #272727;
  font-size: 20px;
  font-weight: 600;
}
</style>
