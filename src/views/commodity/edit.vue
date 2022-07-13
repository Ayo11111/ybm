<template>
  <div class="container">
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="formLabelAlign"
      size="small"
    >
      <el-row :gutter="80">
        <el-col :span="8">
          <el-form-item label="商品名称">
            <el-input v-model="formLabelAlign.name" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品分类">
            <filter-select style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标准分类">
            <filter-select style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="8">
          <el-form-item label="当前状态">
            <el-radio v-model="radio" label="1">下架</el-radio>
            <el-radio v-model="radio" label="2">上架</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="标准分类">
            <filter-select style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="起购数量">
            <el-input v-model="formLabelAlign.type" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="80">
        <el-col :span="8">
          <el-form-item label="商品标签">
            <filter-select style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="速记码">
            <el-input v-model="formLabelAlign.type" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品类型">
            <el-radio v-model="radio1" label="1">单品</el-radio>
            <el-radio v-model="radio1" label="2">套餐</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品描述：">
        <el-input
          v-model="textarea"
          type="textarea"
          :rows="5"
          placeholder="请输入商品描述(100字以内)"
        />
      </el-form-item>
      <el-form-item label="上传缩略图 (建议尺寸 210 x 200)">
        <OssUpload />
      </el-form-item>
      <el-form-item label="上传详情大图 (建议尺寸 668 x 428; 最多上传5张)">
        <OssUpload />
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商品规格：">
            <el-form
              :label-position="labelPosition"
              label-width="80px"
              :model="formLabelAlign"
              size="small"
              style="background: #f7f8fa; padding: 10px 20px;"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="规格名称：">
                    <el-input
                      v-model="name"
                      placeholder="例如：大份、小份"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="库存：">
                    <el-input placeholder="商品库存" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="价格：">
                    <el-input placeholder="商品价格" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="重量：">
                    <el-input v-model="input2" placeholder="商品重量">
                      <template slot="append">克</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="包装费：">
                    <el-input v-model="input2" placeholder="包装费">
                      <template slot="append">元</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-form-item>
          <el-button size="small">添加规格</el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-divider />
    <el-button type="primary">保存</el-button>
    <el-button @click="$router.push({ name: 'Commodity' })">取消</el-button>
  </div>
</template>

<script>
import FilterSelect from '@/components/FilterSelect'
import OssUpload from '@/components/OssUpload'
export default {
  components: {
    FilterSelect,
    OssUpload
  },
  data() {
    return {
      labelPosition: 'top',
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      radio: '1',
      radio1: '1',
      name: ''
    }
  }
}
</script>

<style scoped lang="scss">
.el-form-item {
  margin-bottom: 20px;
}
.el-form-item__label {
  padding: 0 0 0 0;
}
</style>
