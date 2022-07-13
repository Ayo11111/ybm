<template>
  <div class="container">
    <div class="upload">
      <b style="font-size: 18px">上传海报</b>
      <OssUpload
        :files="files"
        :set-size="setSize"
        style="margin-top: 10px"
        @beforeUpload="beforeUpload"
        @delImg="delImg"
      />
      <span>图片格式为jpg/png；建议上传比例为690*160</span>
    </div>
    <el-divider />
    <div>
      <el-button
        type="primary"
        @click="visible = true"
        @relationList="relationList"
      >
        选择店铺
      </el-button>
      <span style="margin-left: 8px">已选择{{ storeName.length }}家店铺</span>
    </div>
    <div style="margin-top: 15px">
      <el-tag
        v-for="item in storeName"
        :key="item.id"
        closable
        style="margin-bottom: 8px"
        @close="handleClose(item)"
      >
        {{ item.label }}
      </el-tag>
    </div>
    <el-divider />
    <div class="block">
      <span>跳转类型：</span>
      <el-radio-group v-model="Json['type']">
        <el-radio :label="1">单一详情页</el-radio>
        <el-radio :label="2">商品活动页</el-radio>
        <el-radio :label="3">无跳转</el-radio>
      </el-radio-group>
    </div>
    <div v-show="Json['type'] === 3 ? false : true" class="commodity">
      <div class="top" style="justify-content: space-between">
        <span style="margin-left: 25px">关联商品 {{ activeName.length }}</span>
        <el-link
          :underline="false"
          style="margin-right: 25px"
          @click="dialogVisible = true"
        >
          编辑
        </el-link>
      </div>
      <div style="margin: 8px 8px">{{ food }}</div>
    </div>
    <el-divider />
    <el-form ref="form" :model="Json" label-width="80px">
      <el-form-item label="生效周期" style="margin-bottom: 0">
        <el-radio-group v-model="day">
          <el-radio :label="1">每天</el-radio>
          <el-radio :label="2">指定周期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" style="margin-bottom: 5px">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="(item, index) in week"
            :key="index"
            :label="index"
          >{{ item }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="生效时段" style="margin-bottom: 10px">
        <el-radio-group v-model="time">
          <el-radio :label="1">全天</el-radio>
          <el-radio :label="2">指定时段</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-show="time === 2 ? true : false"
        label=""
        style="margin-bottom: 0"
      >
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
    </el-form>
    <el-divider />
    <div class="block" style="margin-top: 30px">
      <span>启用状态：</span>
      <a-switch
        v-model="value"
        checked-children="启用"
        un-checked-children="禁用"
        @click="change"
      />
    </div>
    <el-divider />
    <el-button type="primary" :loading="disabled" @click="save">保存</el-button>
    <el-button>
      <router-link :to="{ name: 'StoresPoster' }"> 取消 </router-link>
    </el-button>
    <!-- <Relation
      ref="relation"
      :dialog-visible.sync="dialogVisible"
      :active-id.sync="Json['foodTemplateIdList']"
      :active-name.sync="activeName"
      @relationList="relationList"
    />
    <SelectStore
      ref="relation"
      :visible.sync="visible"
      @relationList="relationStore"
    /> -->
  </div>
</template>

<script>
import OssUpload from '@/components/OssUpload'
// import Relation from './_components/relation'
// import SelectStore from '@/components/SelectStore'
import { fhGetBannerDetail, fhPutBanner } from '@/api/banners'
export default {
  components: {
    OssUpload
    // Relation,
    // SelectStore
  },
  data() {
    return {
      food: '',
      value: false,
      dialogVisible: false,
      visible: false,
      Json: {
        type: 1,
        foodTemplateIdList: [],
        imageUrl: '',
        upStatus: 0
      },
      activeName: [],
      disabled: false,
      files: [],
      setSize: true,
      storeName: [],
      week: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      day: 1,
      checkList: [],
      time: 1,
      date: null
    }
  },
  created() {
    this.getBannerDetail(this.$route.params.id)
  },
  methods: {
    async getBannerDetail(bannerId) {
      try {
        const { results } = await fhGetBannerDetail(bannerId)
        this.Json['type'] = results.type
        this.Json['imageUrl'] = results.imageUrl
        if (this.Json['imageUrl'] !== null || this.Json['imageUrl'] !== '') {
          this.files.push({
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: this.Json['imageUrl']
          })
        }
        this.value = results.upStatus
        if (results.foodTemplateIdList !== null) {
          this.Json['foodTemplateIdList'] = results.foodTemplateIdList
          this.arr = results.foodTemplateIdList
          this.food = results.foodTemplateNameList.join('、')
          this.activeName = results.foodTemplateNameList
        }
      } catch (err) {
        console.log(err)
      }
    },
    async putBanner(bannerId, params) {
      this.disabled = true
      if (params.foodTemplateIdList === null) {
        params.foodTemplateIdList = []
      }
      try {
        const { success } = await fhPutBanner(bannerId, params)
        this.disabled = false
        if (success) {
          this.$router.push({ name: 'StoresPoster' })
        }
      } catch (err) {
        console.log(err)
      }
      this.disabled = false
    },
    change(val) {
      val === true ? (this.Json['upStatus'] = 1) : (this.Json['upStatus'] = 0)
    },
    beforeUpload(file) {
      const path = file.host + '/' + file.filePath
      this.Json['imageUrl'] = path
    },
    relationList(foodName, foodId) {
      if (foodId.length > 0) {
        this.Json['foodTemplateIdList'] = foodId
      } else {
        this.Json['foodTemplateIdList'] = []
      }
      this.activeName = foodName
      this.food = foodName.join('、')
      this.dialogVisible = false
    },
    delImg() {
      this.Json['imageUrl'] = null
    },
    save() {
      if (this.Json['foodTemplateIdList'].length === 0) {
        this.Json['foodTemplateIdList'] = null
      }
      this.putBanner(this.$route.params.id, this.Json)
    },
    handleClose(item) {
      this.$refs.relation.close(item)
    },
    relationStore(name, id, select) {
      this.storeName = select
    }
  }
}
</script>

<style lang="scss" scoped>
.upload {
  display: flex;
  flex-flow: column;

  &::v-deep .ant-upload {
    width: 690px;
    height: 160px;
  }
  &::v-deep .ant-upload-list-picture-card-container {
    width: 690px;
    height: 160px;
  }
  &::v-deep .ant-upload-list-picture-card .ant-upload-list-item {
    width: 690px;
    height: 160px;
  }
}
.block {
  margin-bottom: 28px;
}
.commodity {
  width: 586px;
  height: 180px;
  border: 1px solid #cccccc;
  .top {
    height: 50px;
    border-bottom: 1px solid #cccccc;
    display: flex;
    align-items: center;
  }
}

.el-link.el-link--default {
  color: #52ACFF;
}
</style>
