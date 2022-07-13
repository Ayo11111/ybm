<template>
  <el-dialog
    title="选择店铺"
    :visible.sync="dialogVisible"
    width="45%"
    @close="$emit('update:dialogVisible', false)"
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
        <div class="food">
          <el-scrollbar style="flex: 1;height: 304px" class="scroll">
            <el-tree
              ref="tree"
              :data="data"
              show-checkbox
              node-key="label"
              @check-change="check"
            />
          </el-scrollbar>
        </div>
      </div>
      <div class="right">
        <div style="margin-left: 25px">
          <b>已选店铺({{ select.length }})</b>
          <el-scrollbar style="flex: 1;height: 336px" class="scroll">
            <ul class="ul">
              <li v-for="item in select" :key="item.id">
                <span>{{ item.label }}</span>
                <i class="el-icon-close" @click="close(item)" />
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
import { fhGetSotres } from '@/api/stores'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 已存在的店铺id
    activeId: {
      type: Array,
      default: () => []
    },
    // 已存在的店铺名称
    activeName: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      value: '',
      showLine: true,
      showIcon: false,
      cities: [],
      foodId: {},
      checkedCities: [],
      data: [],
      select: [],
      selectId: [],
      citieId: {},
      onechange: true,
      checkedKeys: [],
      cancel: false
    }
  },
  watch: {
    value(val) {
      const arr = []
      if (val !== '') {
        this.data.forEach(item => {
          if (item.indexOf(val) !== -1) {
            arr.push(item)
          }
        })
        this.data = arr
      } else {
        this.cats()
      }
    },
    activeId(val) {
      this.activeName.forEach((item, index) => {
        this.foodId[item] = val[index]
      })
    },
    activeName(val) {
      this.select = val
    }
  },
  created() {
    this.getSotres()
  },
  methods: {
    async getSotres() {
      try {
        const { results } = await fhGetSotres({
          pageSize: 999
        })
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
          this.data.push({
            label: i,
            children: Json[i].children
          })
        }
      } catch (err) {
        console.log(err)
      }
    },
    check(val, check) {
      const index = this.select.indexOf(val)
      if (check && index === -1 && val.children === undefined) {
        this.select.push(val)
      } else if (!check && this.cancel === false) {
        this.select.splice(index, 1)
      }
      // = this.$refs.tree.getCheckedNodes()
    },
    close(item) {
      const Index = this.select.indexOf(item)
      this.select.splice(Index, 1)
      this.cancel = true
      this.$refs.tree.setCheckedNodes(this.select)
      // console.log(this.$refs.tree.getCheckedNodes())
      // if (this.checkedCities.indexOf(name) !== -1) {
      //   const index = this.checkedCities.indexOf(name)
      //   this.checkedCities.splice(index, 1)
      // } else {
      //   const Index = this.select.indexOf(name)
      //   this.select.splice(Index, 1)
      // }
    },
    ok() {
      this.selectId = this.select.map(val => {
        return val.id
      })
      // this.select.forEach(item => {
      //   if (this.selectId.indexOf(this.foodId[item]) === -1) {
      //     this.selectId.push(this.foodId[item])
      //   }
      // })
      this.$emit('relationList', this.select, this.selectId)
      this.$emit('update:dialogVisible', false)
    }
  }
}
</script>

<style>
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
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
