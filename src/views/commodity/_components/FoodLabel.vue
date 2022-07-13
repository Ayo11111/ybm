<template>
  <el-dialog title="商品标签" :visible.sync="dialogTableVisible" width="600px">
    <div v-loading="mainLoad" class="box">
      <el-tag
        v-for="(tag, index) in dynamicTags"
        :key="tag.id"
        v-loading="tag.load"
        closable
        :disable-transitions="false"
        @close="deleteTags(tag, index)"
      >
        {{ tag.name }}
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag"
        size="small"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
      <el-button v-else class="button-new-tag" size="small" @click="showInput">
        <i class="el-icon-plus" />
        添加
      </el-button>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogTableVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fhPostAddTags, fhDeleteTags, fhGetTagsList } from '@/api/categories'
export default {
  data() {
    return {
      dialogTableVisible: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      mainLoad: false
    }
  },
  created() {
    this.getTagsList()
  },
  methods: {
    async getTagsList() {
      this.mainLoad = true
      try {
        const { results } = await fhGetTagsList()
        this.dynamicTags = results.map(i => {
          i.load = false
          return i
        })
      } catch (err) {
        console.log(err)
      }
      this.mainLoad = false
    },
    async postAddTags(params) {
      try {
        const { results } = await fhPostAddTags(params)
        this.dynamicTags.push(results)
        this.$message({
          message: '添加标签成功',
          type: 'success'
        })
      } catch (err) {
        console.log(err)
      }
    },
    async deleteTags(tag, index) {
      const { id: tagId } = tag
      tag.load = true
      try {
        await fhDeleteTags(tagId)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.dynamicTags.splice(index, 1)
      } catch (err) {
        console.log(err)
      }
      // eslint-disable-next-line require-atomic-updates
      tag.load = false
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue.length > 3) {
        this.$message.error('请输入长度小于等于3的标签')
        return
      }
      if (inputValue) {
        this.postAddTags({ name: inputValue })
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style scoped>
.box {
  width: 100%;
  display: flex;
  flex-flow: wrap;
}

.el-tag {
  margin-right: 10px;
  margin-bottom: 12px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 7em;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
