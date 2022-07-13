<template>
  <div>
    <el-dialog
      title="选择店铺"
      :visible.sync="dialogVisibleType"
      width="45%"
      :close-on-click-modal="false"
      @close="digCancel"
    >
      <div class="box">
        <div class="left">
          <div class="serach">
            <span>搜索：</span>
            <el-input
              v-model="value"
              placeholder="店铺名、城市"
              suffix-icon="el-icon-search"
              style="flex: 1"
            />
          </div>
          <div v-loading="loadingDialog" class="food">
            <el-scrollbar style="flex: 1;height: 304px" class="scroll">
              <el-tree
                ref="tree"
                :data="data"
                show-checkbox
                node-key="id"
                :default-checked-keys="checkedStoreKeys"
                :filter-node-method="filterNode"
                :check-on-click-node="true"
                @check-change="check"
                @check="checkOne"
              />
              <div v-if="showFresh" style="text-align:center">
                <el-button
                  type="primary"
                  :icon="freshIcon"
                  size="small"
                  :disabled="disabledFresh"
                  @click="fresh"
                >
                  刷新
                </el-button>
              </div>
            </el-scrollbar>
          </div>
        </div>
        <div class="right">
          <div style="margin-left: 25px">
            <div style="position:relative">
              <b>已选店铺({{ select.size }})</b>
              <span
                type="text"
                style="position:absolute;right:0;top:0"
                class="delete-item"
                @click="delAll"
              >
                清空
              </span>
            </div>
            <el-scrollbar style="flex: 1;height: 336px" class="scroll">
              <ul class="ul">
                <li v-for="item in select" :key="item.id">
                  <span>{{ item.label }}</span>
                  <i
                    class="el-icon-close"
                    style="position:relative;right:2em"
                    @click="close(item)"
                  />
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="digCancel">
          取 消
        </el-button>
        <el-button type="primary" @click="ok">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fhGetSotres } from '@/api/stores'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 选择的店铺 {name,id}
    checkedStore: {
      type: Array,
      default() {}
    },
    // 选择的店铺id
    checkedStoreId: {
      type: Array,
      default() {}
    },
    radioOrCheckbox: {
      type: String,
      default() {
        return 'checkbox'
      }
    }
  },
  data() {
    return {
      disabledFresh: false,
      freshIcon: 'el-icon-refresh',
      showFresh: false,
      checkedStoreKeys: this.checkedStoreId,
      dialogVisibleType: this.dialogVisible,
      loadingDialog: true,
      value: '',
      showLine: true,
      showIcon: false,
      cities: [],
      foodId: {},
      checkedCities: [],
      data: [],
      select: new Set(),
      selectId: new Set(),
      citieId: {},
      onechange: true,
      checkedKeys: []
    }
  },
  watch: {
    checkedStore(val) {
      this.select = new Set(val)
      this.$forceUpdate()
    },
    checkedStoreId(val) {
      this.checkedStoreKeys = val
      this.selectId = new Set(val)
      this.$forceUpdate()
    },
    value(val) {
      this.$refs.tree.filter(val)
    },
    dialogVisible(v) {
      this.dialogVisibleType = v
    }
  },
  mounted() {
    window.st = this
  },
  updated() {},
  created() {
    this.getSotres()
    this.tempCheck = new Set()
    this.tempFilterFlag = false
    // this.tempCloseFlag = false
  },
  methods: {
    // 刷新
    fresh() {
      this.getSotres()
    },
    // 删除全部
    delAll() {
      this.selectId.clear()
      this.select.clear()
      this.$refs.tree.setCheckedKeys([])
      this.$forceUpdate()
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) {
        this.tempCheck = new Set()
        this.tempFilterFlag = false
      }
      const { id } = data
      if (data.label.indexOf(value) !== -1) {
        this.tempCheck.add(id)
        this.tempFilterFlag = true
      }
      return data.label.indexOf(value) !== -1
    },
    // 获取店铺，数据格式化
    async getSotres() {
      this.loadingDialog = true
      this.disabledFresh = true
      this.showFresh = false
      this.freshIcon = 'el-icon-loading'
      try {
        const { results } = await fhGetSotres({
          pageSize: 999
        })
        this.showFresh = results.length === 0
        const Json = {}
        results.forEach(item => {
          if (Json[item.province] === undefined) {
            Json[item.province] = {}
            Json[item.province]['children'] = []
            Json[item.province]['children'].push({
              id: item.id,
              label: item.storeName
            })
          } else {
            Json[item.province]['children'].push({
              id: item.id,
              label: item.storeName
            })
          }
        })
        for (const i in Json) {
          this.data.push(
            this.radioOrCheckbox === 'radio'
              ? {
                label: i,
                disabled: true,
                children: Json[i].children
              }
              : {
                label: i,
                children: Json[i].children
              }
          )
        }
      } catch (err) {
        this.$message({
          type: 'error',
          message: err
        })
      }
      this.loadingDialog = false
      this.disabledFresh = false
      this.freshIcon = 'el-icon-refresh'
    },
    checkOne(one, two) {
      this.select.clear()
      this.selectId.clear()
      if (this.radioOrCheckbox === 'radio') { // 单选
        const chekckedId = one.id
        this.$refs.tree.setCheckedKeys([chekckedId])
        this.select.add(one)
        this.selectId.add(chekckedId)
      } else { // 多选
        two.checkedNodes.forEach(element => {
          if (element.id) {
            this.select.add(element)
            this.selectId.add(element.id)
          }
        })
      }

      this.select.delete(undefined)
      this.selectId.delete(undefined)
      this.$forceUpdate()
    },
    check(data, check, half) {
      // 过滤
      // 判断是父节点
      // 判断是全选
      // if (this.tempCloseFlag) return
      // const { id } = check

      // if (this.tempFilterFlag) {
      //   if (this.tempCheck.has(id)) {
      //     // 被选中
      //     console.log('debug 被选中')
      //   } else {
      //     // 不被选择
      //     console.log('debug 不被选择')
      //     this.$refs.tree.setChecked(val, false)
      //   }
      // }
      // const index = this.select.has(val)
      // if (check && !index && val.children === undefined) {
      //   console.log('debuf 选中子节点')
      //   // 选中子节点
      //   this.select.add(val)
      //   this.selectId.add(val.id)
      //   this.$forceUpdate()
      // } else if (!check && val.children === undefined) {
      //   // 取消选择子节点
      //   console.log('debuf 取消选择子节点')

      //   this.select.delete(val)
      //   this.selectId.delete(val.id)

      //   this.$forceUpdate()
      // } else if (!check && val.children && val.children.length > 0) {
      //   // 取消选择父节点
      //   console.log('debuf 取消选择父节点')
      //   if (child) {
      //     return
      //   } else {
      //     val.children.forEach(value => {
      //       this.select.delete(value)
      //       this.selectId.delete(value.id)

      //       this.$forceUpdate()
      //     })
      //   }
      // } else if (check && val.children && val.children.length > 0) {
      //   // 选中父节点
      //   console.log('debuf 选中父节点')

      //   val.children.forEach(value => {
      //     this.select.add(value)
      //     this.selectId.add(value.id)
      //   })
      //   this.$forceUpdate()
      // }
    },
    // 删除单个
    close(item) {
      // this.tempCloseFlag = true
      this.select.delete(item)
      this.selectId.delete(item.id)
      this.$refs.tree.setChecked(item, false)
      this.$forceUpdate()
    },
    ok() {
      this.$emit(
        'relationList',
        Array.from(this.select),
        Array.from(this.selectId)
      )
      this.$emit('update:dialogVisible', false)
    },
    digCancel() {
      this.dialogVisibleType = false
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style scoped>
.el-dialog__body {
  padding: 10px 20px;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
<style scoped lang="scss">
.box {
  width: 100%;
  height: 360px;
  display: flex;
  .left {
    flex: 1;
    border-right: 1px solid #cccccc;
    display: flex;
    flex-flow: column;
    padding-right: 20px;
    .serach {
      display: flex;
      align-items: center;
    }
    .food {
      flex: 1;
      margin-top: 10px;
      display: flex;
      .overflow {
        display: flex;
        flex: 1;
        max-height: 100%;
        overflow: scroll;
      }
      .foodList {
        flex: 1;
        border-left: 1px solid #cccccc;
        padding-top: 11px;
        padding-left: 20px;
      }
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-flow: column;
    .ul {
      margin: 0;
      padding: 0;
      margin-top: 10px;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        i {
          margin-top: 4px;
          cursor: pointer;
        }
      }
    }
  }
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
