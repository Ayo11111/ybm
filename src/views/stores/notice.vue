<template>
  <div class="container" v-loading="loading">
    <el-checkbox v-model="checked" @change="check">只看未读</el-checkbox>
    <el-divider></el-divider>
    <div class="item" v-for="item in data" :key="item.id">
      <div class="box">
        <div>
          <div style="margin-bottom: 8px;display: flex;align-items: center;">
            <el-tag
              type="danger"
              v-if="item.readStatus === 0"
              style="margin-right: 10px"
              >New</el-tag
            >
            <router-link :to="`/stores/notice/detail/${item.id}`">
              <b>{{ item.title }}</b>
            </router-link>
          </div>
          <span class="content">{{ item.content }}</span>
        </div>
        <span>{{ item.createTime }}</span>
      </div>
      <el-divider></el-divider>
    </div>
    <Pagination :total="total" @pagination="pagination"></Pagination>
  </div>
</template>

<script>
import { fhGetNoticesList } from '@/api/notices'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      data: [],
      checked: false,
      total: 0,
      loading: false
    }
  },
  created() {
    this.getNoticesList()
  },
  methods: {
    async getNoticesList(params) {
      this.loading = true
      try {
        const { results, count } = await fhGetNoticesList(params)
        this.data = results
        this.total = count
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    check(val) {
      if (val) {
        this.getNoticesList({
          readStatus: 0
        })
      } else {
        this.getNoticesList()
      }
    },
    pagination(params) {
      if (this.checked) {
        params = Object.assign(
          {
            readStatus: 0
          },
          params
        )
        this.getNoticesList(params)
      } else {
        this.getNoticesList(params)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .content {
    width: 400px;
    height: 20px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
