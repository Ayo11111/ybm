<template>
  <div class="container">
    <div class="top">
      <el-button
        type="primary"
        :loading="loading"
        :disabled="data.length >= 8 ? true : false"
        @click="$router.push({ name: 'AddPoster' })"
      >
        新增海报
      </el-button>
      <span style="margin-left: 10px">
        建议上传海报尺寸690*160，文件最大3M，最多可上传8张
      </span>
    </div>
    <el-divider />
    <div v-loading="loading">
      <div v-for="(item, index) in data" :key="item.id" class="item">
        <div class="info">
          <img :src="item.imageUrl">
          <div class="box">
            <div
              class="block"
              style="justify-content: space-between; margin-top: 5px"
            >
              <div>
                <span>关联店铺数：{{ item.storeIdList.length }}</span>
                <span style="margin-left: 70px">
                  关联商品数：{{ item.foodTemplateIdList.length }}
                </span>
              </div>
              <div style="display: flex">
                <div class="sort">
                  <i
                    style="position: absolute; left: -17px; top: -3.6px"
                    class="el-icon-caret-top"
                    @click="topSort(index)"
                  />
                  <i
                    style="position: absolute; left: -17px; bottom: -3px"
                    class="el-icon-caret-bottom"
                    @click="bottomSort(index)"
                  />
                </div>
                <i class="el-icon-close" @click="del(item.id)" />
              </div>
            </div>
            <div class="block">
              <span style="margin-right: 10px"> 生效周期： </span>
              <span v-if="item.weekCycleArr.length === 7">每天</span>
              <template v-else>
                <span v-for="(i, j) in item.weekCycleArr" :key="j">
                  <span v-if="j === item.weekCycleArr.length - 1">
                    {{ i }}
                  </span>
                  <span v-else> {{ i }}、 </span>
                </span>
              </template>
            </div>
            <div class="block">
              <span style="margin-right: 20px">
                创建时间：{{ item.createTime }}
              </span>
              <span>上次编辑时间：{{ item.updateTime }}</span>
            </div>
            <div class="block">
              <span>启用状态：</span>
              <div
                style="
                  flex: 1;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                "
              >
                <a-switch
                  v-model="item.upStatus"
                  checked-children="启用"
                  un-checked-children="禁用"
                  :loading="disabled"
                  @click="change(item.id, item.upStatus)"
                />
                <router-link :to="`editPoster/${item.id}`">
                  <a-button type="link">编辑</a-button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
        <el-divider />
      </div>
    </div>
  </div>
</template>

<script>
import {
  fhGetBannerList,
  fhPutBannerStatus,
  fhDeleteBanner,
  fhPutBannerSort
} from '@/api/banners'
import { arraysMap } from '@/utils'

export default {
  data() {
    return {
      data: [],
      disabled: false,
      bannerIds: [],
      loading: false
    }
  },
  mounted() {
    this.getBannerList()
    window.app = this
  },
  methods: {
    fhGetBannerList,
    async getBannerList() {
      this.loading = true
      try {
        const { results = [] } = await fhGetBannerList()
        if (Array.isArray(results)) {
          this.data = results.map((element, index) => {
            switch (element.type) {
              case 1:
                element.type = '单一详情'
                break
              case 2:
                element.type = '商品活动页'
                break
              case 3:
                element.type = '无跳转'
                break
            }
            if (element.foodTemplateNameList !== null) {
              element.foodTemplateNameList = element.foodTemplateNameList.join(
                '、'
              )
            }
            const sou = element.weekCycle.split('').reverse()
            element.weekCycleArr = arraysMap(undefined, sou, '1')
            return element
          })
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async putBannerStatus(bannerId, params) {
      try {
        await fhPutBannerStatus(bannerId, params)
        let str = ''
        if (params.status) {
          str = '启用'
        } else {
          str = '禁用'
        }
        this.$message({
          type: 'success',
          message: `${str}成功`
        })
        this.getBannerList()
      } catch (err) {
        console.log(err)
      }
      this.disabled = false
    },
    async deleteBanner(bannerId) {
      try {
        await fhDeleteBanner(bannerId)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.getBannerList()
      } catch (err) {
        console.log(err)
      }
    },
    async putBannerSort(params) {
      try {
        await fhPutBannerSort(params)
      } catch (err) {
        console.log(err)
      }
    },
    change(id, value) {
      this.disabled = true
      this.putBannerStatus(id, {
        status: value
      })
    },
    del(bannerId) {
      this.$confirm('确认要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteBanner(bannerId)
      })
    },
    topSort(index) {
      const topIndex = index - 1
      if (topIndex >= 0) {
        const topArray = this.data[topIndex]
        this.$set(this.data, topIndex, this.data[index])
        this.$set(this.data, index, topArray)
      } else {
        const topArray = this.data.shift()
        this.data.push(topArray)
      }
      this.bannerIds = []
      this.data.forEach(item => {
        this.bannerIds.push(item.id)
      })
      this.bannerIds = this.bannerIds.join(', ')
      this.putBannerSort({
        bannerIds: this.bannerIds
      })
    },
    bottomSort(index) {
      const bottomIndex = index + 1
      if (bottomIndex <= this.data.length - 1) {
        const bottomArray = this.data[bottomIndex]
        this.$set(this.data, bottomIndex, this.data[index])
        this.$set(this.data, index, bottomArray)
      } else {
        const bottomArray = this.data.pop()
        this.data.unshift(bottomArray)
      }
      this.bannerIds = []
      this.data.forEach(item => {
        this.bannerIds.push(item.id)
      })
      this.bannerIds = this.bannerIds.join(', ')
      this.putBannerSort({
        bannerIds: this.bannerIds
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin-bottom: 40px;
  .info {
    display: flex;
    img {
      width: 452px;
      height: 194px;
      margin-right: 50px;
    }
    .box {
      flex: 1;
      .block {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
        i {
          margin-left: 14px;
          cursor: pointer;
        }
      }
    }
    .sort {
      position: relative;
      i:hover {
        color: #52ACFF;
      }
    }
  }
}
.el-link.el-link--default {
  color: #52ACFF;
}
</style>
