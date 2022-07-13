<template>
  <el-dialog
    title="选择商家"
    :visible="visible"
    width="45%"
    @close="handleClose"
  >
    <div v-loading="loading" class="box">
      <div class="left">
        <div class="serach">
          <span>商家名称：</span>
          <el-input
            v-model="value"
            placeholder="商家名称"
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
              check-on-click-node
              :filter-node-method="filterNode"
              :default-checked-keys="checkedStoreKeys"
              :current-node-key="key"
              :props="defaultProps"
              @check-change="check"
            />
          </el-scrollbar>
        </div>
      </div>
      <div class="right">
        <div style="margin-left: 25px">
          <div
            style="display: flex;justify-content: space-between;align-items: center;"
          >
            <b>已选商家 ({{ select.length }}/3)</b>
            <a-button type="link" style="font-size: 13px" @click="delAll">
              全部删除
            </a-button>
          </div>
          <el-scrollbar style="flex: 1;height: 336px" class="scroll">
            <ul class="ul">
              <li v-for="item in select" :key="item.id">
                <span>{{ item.name }}</span>
                <div style="cursor: pointer;margin-right:2px">
                  <span
                    style="cursor: pointer;"
                    class="el-icon-close"
                    @click="del(item)"
                  />
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('update:dialogVisible', false)">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { fhGetAllMerchantsPartial } from '@/api/merchant'
const _differenceBy = require('lodash/differenceBy')
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    // 已存在的商家
    active: {
      type: [Array, Object],
      default() {}
    },
    special: {
      type: Boolean,
      default: false
    },
    // 选择的商家id
    checkedStoreId: {
      type: Array,
      default() {}
    },
    // 默认禁用的选项
    defaultDisabledKey: {
      type: Array,
      default() {}
    },
    // 限制选择商家的数量
    limit: {
      type: Number,
      default() {}
    }
  },
  data() {
    return {
      value: '',
      data: [],
      visible: this.dialogVisible,
      select: [],
      checkedStoreKeys: [],
      checkedKeys: [],
      loading: false,
      key: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  watch: {
    value(val) {
      this.$refs.tree.filter(val)
    },
    dialogVisible(v) {
      this.visible = v
    },
    active: {
      handler(v) {
        this.checkedStoreKeys = v.map(el => {
          return el.id
        })
        this.select = v
        this.$forceUpdate()
      },
      immediate: true
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
    this.getSotres()
    window.sm = this
  },
  methods: {
    async getSotres() {
      this.loading = true
      try {
        const { results } = await fhGetAllMerchantsPartial({
          pageSize: 999
        })
        this.data = []
        const children = _differenceBy(results, this.defaultDisabledKey, 'id').map(el => {
          el.disabled = false
          return el
        })
        const data = [{ id: -1, name: '全部商家', disabled: true, children }]
        this.data = data
        if (this.active.length === this.limit) {
          const arr = _differenceBy(this.data[0].children, this.active, 'id')
          arr.forEach(el => {
            el.disabled = true
          })
          this.$forceUpdate()
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    check(val, check) {
      const index = this.select.indexOf(val)
      const node = this.$refs.tree.getCheckedNodes()
      // 限制选择商家的数量
      if (node.length >= this.limit) {
        const arr = _differenceBy(this.data[0].children, node, 'id')
        arr.forEach((el, index) => {
          el.disabled = true
        })
        this.$forceUpdate()
      } else {
        const arr = _differenceBy(this.data[0].children, node, 'id')
        arr.forEach(el => {
          if (el.id !== this.defaultDisabledKey[0]) {
            el.disabled = false
          }
        })
        this.$forceUpdate()
      }
      // end --限制选择商家的数量

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
    handleClose() {
      this.$emit('cancleSelect')
      this.$emit('update:dialogVisible', false)
    },
    del(item) {
      const Index = this.select.indexOf(item)
      this.select.splice(Index, 1)
      this.$refs.tree.setCheckedNodes(this.select)
      this.check(this.select)
    },
    default() {
      this.$nextTick(() => {
        this.$refs.tree && this.$refs.tree.setCheckedNodes(this.checkedKeys)
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
      this.$emit('update:dialogVisible', false)
    },
    delAll() {
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
.el-icon-close {
  border: 1px solid transparent;
  &:hover {
    border: 1px solid #52ACFF;
  }
}
</style>
