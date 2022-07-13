<template>
  <div class="container">
    <div class="upload">
      <el-button type="primary" @click="add">新增招牌</el-button>
      <a-divider dashed />
      <div v-show="status">
        <div class="ossBox">
          <div>
            <OssUpload ref="oss" :set-size="setSize" @beforeUpload="beforeUpload" />
          </div>
          <div style="margin-left: 30px">
            <span>图片格式为jpg/png；建议上传比例为750 * 288；最多可上传5张</span>
            <div style="margin-top: 18px">
              <el-button type="primary" :loading="btnLoad" @click="save">保存</el-button>
              <el-button :loading="btnLoad" @click="cancel">取消</el-button>
            </div>
          </div>
        </div>
        <a-divider dashed />
      </div>
    </div>
    <b style="font-size: 18px">默认招牌</b>
    <div class="item">
      <div class="info ">
        <img src="@/assets/zpbackground.jpg">
        <div class="box">
          <div
            class="block"
            style="justify-content: space-between;margin-top: 5px"
          >
            <div>
              <span style="color:#52ACFF ">当无启用或没有上传招牌图片时，将使用该默认招牌</span>
            </div>

          </div>

        </div>
      </div>
    </div>
    <a-divider dashed />

    <b v-show="data.length === 0 ? false : true" style="font-size: 18px">已上传招牌</b>
    <div v-for="item in data" :key="item.id" class="item">
      <div class="info">
        <img :src="item.imageUrl">
        <div class="box">
          <div
            class="block"
            style="justify-content: space-between;margin-top: 5px"
          >
            <div>
              <span>创建时间：{{ item.createTime }}</span>
            </div>
            <div style="display: flex;">
              <i class="el-icon-close" @click="del(item.id)" />
            </div>
          </div>
          <div class="block">
            <span>启用状态：</span>
            <div style="flex: 1;display: flex;justify-content: space-between;">
              <a-switch
                v-model="item.upStatus"
                checked-children="启用"
                un-checked-children="禁用"
                :loading="swiLoad"
                @click="change(item.id, item.upStatus)"
              />
            </div>
          </div>
        </div>
      </div>
      <el-divider />
    </div>
  </div>
</template>

<script>
import OssUpload from '@/components/OssUpload'
import {
  fhGetShopList,
  fhPostShop,
  fhPutShopStatus,
  fhDeleteShop
} from '@/api/sign'
export default {
  components: {
    OssUpload
  },
  data() {
    return {
      data: [],
      status: false,
      imgUrl: null,
      btnLoad: false,
      setSize: true,
      swiLoad: false
    }
  },
  created() {
    this.fhGetShopList()
  },
  methods: {
    async fhGetShopList() {
      try {
        const { results } = await fhGetShopList()
        this.data = results
      } catch (err) {
        console.log(err)
      }
      this.$forceUpdate()
    },
    async postShop(params) {
      this.btnLoad = true
      try {
        await fhPostShop(params)
        this.cancel()
        this.$message.success('上传成功')
        this.fhGetShopList()
      } catch (err) {
        console.log(err)
      }
      this.btnLoad = false
    },
    async putShopStatus(bgId, params) {
      this.swiLoad = true
      try {
        await fhPutShopStatus(bgId, params)
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
        this.fhGetShopList()
      } catch (err) {
        console.log(err)
      }
      this.swiLoad = false
    },
    async deleteShop(bgId) {
      try {
        await fhDeleteShop(bgId)
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.fhGetShopList()
      } catch (err) {
        console.log(err)
      }
    },
    beforeUpload(file) {
      const path = file.host + '/' + file.filePath
      this.imgUrl = path
    },
    change(bgId, status) {
      this.putShopStatus(bgId, {
        status: status
      })
    },
    del(bgId) {
      this.$confirm('确认要删除吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteShop(bgId)
      })
    },
    save() {
      this.postShop({
        imageUrl: this.imgUrl
      })
    },
    add() {
      this.status = true
    },
    cancel() {
      this.status = false
      if (this.imgUrl !== null) {
        this.$refs.oss.cleanFileList()
        this.$refs.oss.removeFn()
        this.imgUrl = null
      }
    }
  }
}
</script>

<style scoped lang="scss">
.upload {
  &::v-deep .ant-upload {
    width: 452px;
    height: 194px;
  }
  &::v-deep .ant-upload-picture-card-wrapper,
  .clearfix,
  .false {
    width: 452px;
    height: 194px;
  }
  &::v-deep .ant-upload-list-picture-card-container {
    width: 452px;
    height: 194px;
  }
  &::v-deep .ant-upload-list-picture-card .ant-upload-list-item {
    width: 452px;
    height: 194px;
  }
  .ossBox {
    display: flex;
  }
}
.item {
  margin-top: 20px;
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
</style>
