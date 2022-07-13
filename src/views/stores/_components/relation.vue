<template>
  <el-dialog
    title="关联商品"
    :visible.sync="dialogVisible"
    width="900"
    @close="$emit('update:dialogVisible', false)"
  >
    <div class="box">
      <div class="left">
        <div class="serach">
          <span>商品名称：</span>
          <el-input
            v-model="value"
            placeholder="请输入内容"
            suffix-icon="el-icon-search"
            style="flex: 1"
          />
        </div>
        <div class="food">
          <el-scrollbar style="flex: 1;height: 304px" class="scroll">
            <a-tree
              style="flex: 1;"
              :show-line="showLine"
              :show-icon="showIcon"
              :default-expanded-keys="['0-0-0']"
              @select="getCities"
            >
              <a-tree-node key="0-0-0">
                <a-icon slot="icon" type="carry-out" />
                <span slot="title" style="color: #52ACFF">商品分类</span>
                <a-tree-node v-for="item in data" :key="item" :title="item" />
              </a-tree-node>
            </a-tree>
          </el-scrollbar>
          <div class="foodList">
            <el-scrollbar style="flex: 1;height: 302px" class="scroll">
              <el-checkbox-group
                v-model="checkedCities"
                style="display: flex;flex-flow: column;"
                @change="checked"
              >
                <el-checkbox
                  v-for="(item, index) in cities"
                  :key="index"
                  :label="item"
                  style="margin-bottom: 10px"
                  >{{ item }}</el-checkbox
                >
              </el-checkbox-group>
            </el-scrollbar>
            <TmEmpty class="tmempty" v-show="cities.length > 0 ? false : true"></TmEmpty>
          </div>
        </div>
      </div>
      <div class="right">
        <div style="margin-left: 25px">
          <b>已选商品({{ select.length }})</b>
          <el-scrollbar style="flex: 1;height: 324px" class="scroll">
            <ul class="ul" style="">
              <li v-for="(item, index) in select" :key="index">
                <span>{{ item }}</span>
                <i
                  class="el-icon-close"
                  style="margin-right: 10px"
                  @click="close(item)"
                />
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
import { fhWmCats } from '@/api/merchant'
import { fhGetFoodList } from '@/api/categories'
import TmEmptyCom from '@/components/TmEmpty'
export default {
  components: {
    TmEmptyCom
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    // 已存在的食物模板id
    activeId: {
      type: Array,
      default: () => []
    },
    // 已存在的食物模板名称
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
      onechange: true
    }
  },
  watch: {
    value(val) {
      if (val !== '') {
        // this.data.forEach(item => {
        //   if (item.indexOf(val) !== -1) {
        //     arr.push(item)
        //   }
        // })
        // this.data = arr
        this.getFoodList({
          foodTemplateName: val
        })
      } else {
        this.getFoodList()
      }
    },
    activeId(val) {
      this.activeName.forEach((item, index) => {
        this.foodId[item] = val[index]
      })
    },
    activeName(val) {
      this.select = val
      this.checkedCities = val
    }
  },
  created() {
    this.cats()
  },
  methods: {
    async cats() {
      try {
        const { results } = await fhWmCats()
        this.data = []
        results.forEach(element => {
          this.data.push(element.name)
          this.citieId[element.name] = element.id
        })
      } catch (err) {
        console.log(err)
      }
    },
    async getFoodList(params) {
      try {
        const { results } = await fhGetFoodList(params)
        this.cities = []
        results.forEach(element => {
          this.cities.push(element.name)
          this.foodId[element.name] = element.id
        })
      } catch (err) {
        console.log(err)
      }
    },
    getCities(selectedKeys) {
      this.getFoodList({
        categoryId: this.citieId[selectedKeys[0]]
      })
    },
    checked(val) {
      this.select = val
    },
    close(name) {
      if (this.checkedCities.indexOf(name) !== -1) {
        const index = this.checkedCities.indexOf(name)
        this.checkedCities.splice(index, 1)
      } else {
        const Index = this.select.indexOf(name)
        this.select.splice(Index, 1)
      }
    },
    ok() {
      this.selectId = []
      this.select.forEach(item => {
        if (this.selectId.indexOf(this.foodId[item]) === -1) {
          this.selectId.push(this.foodId[item])
        }
      })
      this.$emit('relationList', this.select, this.selectId)
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
        position: relative;
        .tmempty {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .right {
    flex: 0.5;
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
