<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-08-13 14:22:40
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-11 10:44:15
-->
<template>
  <li
    v-loading="mainLoad"
    class="sideBox"
    :style="`border-bottom: ${statusCurr === 5 ? '1px solid red' : 'none'}`"
    :class="`'side-box' ${
      (value.id === -1 ? !currCate : currCate === value.id) && 'choosed'
    }`"
  >
    <div class="side-box">
      <div :style="{ width: showFn ? 60 : 100 + '%' }">
        <span class="cate_name">{{ value.name }}</span>
        <span
          v-if="value.foodCount > 0"
          class="cate_number"
        >({{ value.foodCount }})</span>
      </div>
      <el-button
        v-if="statusCurr >= 4"
        type="primary"
        @click="$emit('openEditCate', 'autitsEdit')"
      >编辑</el-button>
      <div
        v-if="showFn && value.id !== -1 && statusCurr < 4"
        @click.stop.prevent
      >
        <el-tooltip
          v-show="sortCate"
          class="item"
          effect="light"
          content="拖动排序"
          placement="top-start"
        >
          <i class="el-icon-d-caret" style="cursor: move" />
        </el-tooltip>

        <el-tooltip
          v-show="editCate"
          class="item"
          effect="light"
          content="编辑分类"
          placement="top-start"
        >
          <i class="el-icon-edit" @click="handlerEdit" />
        </el-tooltip>

        <el-tooltip
          v-show="delCate"
          class="item"
          effect="light"
          content="删除分类"
          placement="top-start"
        >
          <i
            v-loading="delLoad"
            class="el-icon-delete"
            @click="handlerDel(value.id)"
          />
        </el-tooltip>
      </div>
    </div>
    <div v-show="statusCurr === 5" class="error">
      <span>审核结果：{{ !value.auditStatus ? '不通过' : '通过' }}</span>
      <span>审核意见：{{ value.auditOpinion }}</span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'SideItem',
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    currCate: {
      type: [String, Number],
      default: null
    },
    updateData: {
      type: Function,
      default: () => {}
    },
    sortCate: {
      type: Function,
      default: null
    },
    delCate: {
      type: Function,
      default: null
    },
    editCate: {
      type: Function,
      default: null
    },
    statusCurr: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mainLoad: false,
      delLoad: false,
      validateC(value) {
        if (!value) {
          return '请输入分类名称'
        }
        if (value.length > 4) {
          return '请输入少于5个字的分类名称'
        }
      }
    }
  },
  computed: {
    showFn() {
      const { sortCate, delCate, editCate } = this
      return sortCate || delCate || editCate
    }
  },
  methods: {
    handlerDel(id) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        // eslint-disable-next-line space-before-function-paren
        .then(async () => {
          await this.deleteCategories(id)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 删除分类
    async deleteCategories(id) {
      this.delLoad = true
      try {
        await this.delCate(id)
        this.$message.success('删除成功')
        this.updateData({ id })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.delLoad = false
    },
    // 编辑分类
    handlerEdit() {
      this.$emit('openEditCate', 'edit')
      // const { name, id } = this.value
      // this.$prompt('请输入分类', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   inputValidator: this.validateC,
      //   inputValue: name
      // })
      //   // eslint-disable-next-line space-before-function-paren
      //   .then(async ({ value }) => {
      //     this.mainLoad = true
      //     try {
      //       await this.editCate(id, { name: value })
      //       this.$message.success('修改分类成功')
      //       this.value.name = value
      //     } catch (e) {
      //       console.log('debug axios', e)
      //     }
      //     this.mainLoad = false
      //   })
      //   .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.sideBox {
  display: flex;
  flex-flow: column;
}
.side-box {
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div {
    flex: none;
  }

  & > div:nth-child(1) {
    width: 60%;
  }
}

li {
  .error {
    color: red;
    margin-top: 10px;
    font-size: 15px;
    display: flex;
    justify-content: center;
    flex-flow: column;
  }
  list-style: none;
  padding: 20px 24px;
  border-left: 2px solid transparent;
  cursor: pointer;

  .cate_name {
    color: rgb(39, 39, 39);
    margin-right: 4px;
  }

  .cate_number {
    color: rgb(119, 112, 112);
  }

  .item {
    padding: 0 2px;
  }

  &:hover {
    background: #eee;
  }

  .active {
    background: #52acff;
  }

  &.choosed {
    background: #eee;
    border-left: 2px solid #52acff;
  }
}
</style>
