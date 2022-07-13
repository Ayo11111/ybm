<template>
  <el-dialog
    title="选择店铺"
    :visible="visible"
    width="45%"
    @close="$emit('update:visible', false)"
  >
    <div v-loading="loading" class="box">
      <div class="left">
        <div class="serach">
          <span>店铺名称：</span>
          <el-input
            v-model="value"
            placeholder="店铺名、城市"
            suffix-icon="el-icon-search"
            style="flex: 1"
          />
        </div>
        <div class="food">
          <el-scrollbar style="flex: 1;height: 304px" class="scroll">
            <el-tree
              ref="tree"
              :data="data"
              show-checkbox
              node-key="id"
              :filter-node-method="filterNode"
              :default-checked-keys="checkedStoreKeys"
              :current-node-key="key"
              @check-change="check"
              @node-click="click"
            />
          </el-scrollbar>
        </div>
      </div>
      <div class="right">
        <div style="margin-left: 25px">
          <div
            style="display: flex;justify-content: space-between;align-items: center;"
          >
            <b>已选店铺({{ select.length }})</b>
            <a-button type="link" style="font-size: 13px" @click="del">
              全部删除
            </a-button>
          </div>
          <el-scrollbar style="flex: 1;height: 336px" class="scroll">
            <ul class="ul">
              <li v-for="item in select" :key="item.id">
                <span>{{ item.label }}</span>
                <div style="cursor: pointer;margin-right:2px">
                  <span
                    style="cursor: pointer;"
                    class="el-icon-close"
                    @click="close(item)"
                  />
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:visible', false)">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fhGetSotres } from '@/api/stores'
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    // 已存在的店铺id
    active: {
      type: [Array, Object],
      default: () => []
    },
    special: {
      type: Boolean,
      default: false
    },
    // 选择的店铺id
    checkedStoreId: {
      type: Array,
      default() {}
    }
  },
  data() {
    return {
      value: '',
      data: [],
      select: [],
      checkedStoreKeys: this.checkedStoreId,
      checkedKeys: [],
      cancel: false,
      online: true,
      loading: false,
      ti: null,
      key: null
    }
  },
  watch: {
    value(val) {
      this.$refs.tree.filter(val)
    },
    checkedStoreId(val) {
      this.checkedStoreKeys = val
      this.selectId = new Set(val)
      this.$forceUpdate()
    },
    active(val) {
      if (val.length > 0) {
        this.checkedKeys = val
        val.map(ele => {
          ele.label = ele.storeName
        })
        this.select = val
      }
    },
    data(val) {
      if (this.checkedKeys.length > 0) {
        this.default()
      }
    },
    special(val) {
      this.data.forEach(item => {
        item.disabled = val
      })
      this.$nextTick(() => {
        this.$forceUpdate()
      })
    },
    key(newVal) {
      console.log(newVal)
    }
  },
  mounted() {
    window.st = this
    this.loading = true
    this.getSotres()
  },
  methods: {
    async getSotres() {
      try {
        const { results } = await fhGetSotres({
          pageSize: 999
        })
        const Json = {}
        this.data = []
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
        const data = []
        for (const i in Json) {
          data.push({
            label: i,
            children: Json[i].children,
            disabled: this.special
          })
        }
        this.data = data
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    check(val, check, child) {
      const index = this.select.indexOf(val)
      const node = this.$refs.tree.getCheckedNodes()
      if (this.special && !val.children && index === -1 && check) {
        this.select = []
        this.$set(this.select, 0, val)
        this.$refs.tree.setCheckedNodes(this.select)
      } else if (!this.special) {
        this.select = node.filter(i => {
          return i.children === undefined
        })
      }
    },
    click(val, check, node) {
      const index = this.select.indexOf(val)
      if (!val.children) {
        if (index === -1) {
          if (this.special) {
            this.select = []
            this.$set(this.select, 0, val)
          } else {
            this.select.push(val)
          }
        } else {
          this.select.splice(index, 1)
        }
        this.$refs.tree.setCheckedNodes(this.select)
      }
    },
    close(item) {
      const Index = this.select.indexOf(item)
      this.select.splice(Index, 1)
      this.cancel = true
      this.$refs.tree.setCheckedNodes(this.select)
    },
    default() {
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.setCheckedNodes(this.checkedKeys)
        console.log(this.checkedKeys)
        for (let i = 0; i < this.checkedKeys.length; i++) {
          this.checkedKeys[i].label = this.checkedKeys[i].storeName
          delete this.checkedKeys[i].storeName
        }
        this.select = this.checkedKeys
      })
    },
    ok() {
      const name = []
      const id = []
      this.select.forEach(item => {
        name.push(item.label)
        id.push(item.id)
      })
      this.$emit('relationList', name, id, this.select)
      this.$emit('update:visible', false)
    },
    del() {
      this.select = []
      this.$refs.tree.setCheckedNodes(this.select)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>

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
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
