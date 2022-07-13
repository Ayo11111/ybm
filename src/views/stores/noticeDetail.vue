<template>
  <div class="container">
      <div class="top">
          <b>{{data.title}}</b>
          <span>{{data.createTime}}</span>
      </div>
      <el-divider></el-divider>
      <p v-html="data.richText"></p>
  </div>
</template>

<script>
import { fhGetReadNotice } from '@/api/notices'
export default {
  data() {
    return {
      data: {}
    }
  },
  created() {
    this.getReadNotice(this.$route.params.id)
  },
  methods: {
    async getReadNotice(noticesId) {
      try {
        const { results } = await fhGetReadNotice(noticesId)
        this.data = results
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    b {
        font-size: 16px;
    }
}
</style>
