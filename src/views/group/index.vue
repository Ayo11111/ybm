<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-03-03 09:36:50
 * @LastEditors: CJH
 * @LastEditTime: 2021-03-06 17:19:39
-->
<template>
  <div class="container">
    <Info ref="info" class="info" />
    <a-tabs v-model="activeTab" type="card" class="tabs" @change="callback">
      <a-tab-pane key="1" tab="活动配置">
        <Activity @setHead="setHead" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="交易数据">
        <Detail />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Info from './_components/Info'
import Activity from './_components/Activity'
import Detail from './_components/Detail'

export default {
  components: {
    Info,
    Activity,
    Detail
  },
  data() {
    return {
      activeTab: '1'
    }
  },

  mounted() {
    window.app = this
  },

  methods: {
    callback() {},
    setHead(activityWeekList, activityPeriodList, storeList) {
      this.$refs.info.weekList = activityWeekList.join('、') || ''
      this.$refs.info.timeList = activityPeriodList.join('、') || ''
      this.$refs.info.storeList = storeList.join('、') || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #eeeeee;
  padding: 0;
  .info{
    margin-bottom: 26px;
  }
  .tabs {
    ::v-deep .ant-tabs-content {
      background: #fff;
    }
  }
}
::v-deep {
  .ant-tabs-content {
    padding: 24px;
  }
  .ant-tabs.ant-tabs-card .ant-tabs-card-bar .ant-tabs-tab {
    border-radius: 4px 4px 0 0;
    border: none;
    margin-right: 4px;
  }
  .ant-tabs-top-bar {
    margin-bottom: 0;
  }
}
</style>
