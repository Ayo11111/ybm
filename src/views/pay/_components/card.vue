<!--
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-10-09 16:58:29
 * @LastEditors: DXY
 * @LastEditTime: 2020-10-15 09:54:33
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in cardArr"
        :key="index"
        :xs="colSpan.xs"
        :sm="colSpan.sm"
        :md="colSpan.md"
        :lg="colSpan.lg"
        :xl="colSpan.xl"
        class="acol"
      >
        <div class="wrap">
          <div class="header">{{ item.header }}</div>
          <div class="title">{{ item.title }}</div>
          <div class="btn">
            <el-button :type="item.button.type" @click="goRoute(item.button.params.organizationType)">
              {{ item.button.label }}
            </el-button>
            <!-- <router-link :to="{ name: item.button.link ,params:item.button.params}">
              <el-button :type="item.button.type">
                {{ item.button.label }}
              </el-button>
            </router-link> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      colSpan: { xs: 24, sm: 12, md: 12, lg: 8, xl: 6, offset: 0 },
      cardArr: [
        {
          header: '个体工商户',
          title: '营业执照上的主体类型一般为个体户、个体工商',
          button: { label: '选择', type: 'primary', link: 'payApply', size: 'medium', params: { organizationType: '4' }}
        },
        {
          header: '企业',
          title: '营业执照上的主体类型一般为有限公司、有限责任公司',
          button: { label: '选择', type: 'primary', link: 'payApply', size: 'medium', params: { organizationType: '2' }}
        },
        {
          header: '党政、机关及事业单位',
          title:
            '包括国内各级、各类政府机构、事业单位等。如：公安、党团、司法、交通、旅游、工商税务、市政、医疗、教育、学校等机构',
          button: { label: '选择', type: 'primary', link: 'payApply', size: 'medium', params: { organizationType: '3' }}
        },
        {
          header: '其他组织',
          title:
            '不属于企业、政府/事业单位的组织机构，如社会团体、民办非企业、基金会。要求机构已办理组织机构代码证',
          button: { label: '选择', type: 'primary', link: 'payApply', size: 'medium', params: { organizationType: '1708' }}
        }
      ]
    }
  },

  mounted() {
    window.app = this
  },

  methods: {
    goRoute(organizationType) {
      this.$router.push({ name: 'payApply' })
      window.localStorage.setItem('organizationType', organizationType)
    }
  }
}
</script>

<style lang="scss" scoped>
.acol {
  text-align: center;
  .wrap {
    padding: 24px;
    margin-bottom: 20px;

    border: 1px solid #eee;
    &:hover {
      box-shadow: 0 0 2px 2px #eee;
    }
    .header {
      font-weight: 700;
      color: #333333;
      padding: 10px 0;
    }
    .title {
      color: #999999;
      line-height: 1.5;
      height: 84px;
      font-weight: 400;
    }

    .btn {
    }
  }
}
</style>
