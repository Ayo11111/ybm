<template>
  <el-dialog
    title="关联商品"
    :visible.sync="dialogVisibleType"
    width="900"
    :close-on-click-modal="false"
    @close="$emit('update:dialogVisible', false)"
  >
    <div class="serach">
      <span>商品名称：</span>
      <el-input
        v-model="value"
        placeholder="请输入商品名称"
        suffix-icon="el-icon-search"
        style="width: 60%; display: inline-block"
      />
    </div>
    <div v-loading="loading" class="box">
      <div class="left">
        <div class="food">
          <el-scrollbar style="flex: 1; height: 349px" class="scroll">
            <a-tree
              v-if="data.length > 0"
              style="flex: 1"
              checkable
              :checked-keys="checkedKeys"
              :default-expanded-keys="['0-0-0']"
              @select="getCities"
              @check="check"
            >
              <a-tree-node key="0-0-0" v-loading="loadingCat">
                <a-icon slot="icon" type="carry-out" />
                <span slot="title" style="color: #52ACFF">
                  商品分类({{ data.length }})
                </span>
                <a-tree-node v-for="(item, index) in data" :key="index">
                  <template slot="title">
                    <span v-if="item.foodCount === undefined">{{
                      item.name
                    }}</span>
                    <span v-else>{{ item.name }}({{ item.foodCount }})</span>
                  </template>
                </a-tree-node>
              </a-tree-node>
            </a-tree>
            <TmEmpty v-else text="暂无分类" />
          </el-scrollbar>
          <div class="foodList">
            <el-scrollbar
              v-if="loadingCities || cities.length > 0"
              v-loading="loadingCities"
              style="flex: 1; height: 360px"
              class="scroll"
            >
              <!-- checkbox -->
              <div v-if="cities.length > 0 && radioOrcheckbox === 'checkbox'">
                <el-checkbox
                  v-model="checkAll"
                  style="font-weight: 700 !important; margin-bottom: 10px"
                  :indeterminate="isIndeterminate"
                  @change="handleCheckAllChange"
                >
                  全选
                </el-checkbox>
                <el-checkbox
                  v-for="(item, index) in cities"
                  ref="checkbox"
                  :key="index"
                  :value="selectedId.has(item.id)"
                  style="margin-bottom: 10px; display: block"
                  @change="val => changeS(val, item)"
                >
                  {{ item.name }}
                </el-checkbox>
              </div>
              <!-- radio -->
              <div v-if="radioOrcheckbox === 'radio'">
                <el-radio
                  v-for="(item, index) in cities"
                  :key="index"
                  v-model="checkedCities"
                  :label="item.id"
                  style="margin-bottom: 10px; display: block"
                  @change="val => checked(val, item)"
                >
                  {{ item.name }}
                </el-radio>
              </div>
            </el-scrollbar>
            <TmEmpty v-else text="暂无菜品" />
          </div>
        </div>
      </div>
      <div class="right">
        <div v-if="radioOrcheckbox === 'checkbox'" style="margin-left: 25px">
          <b style="margin-bottom: 8px">已选商品({{ selected.size }}) </b>
          <span style="float: right" class="delete-item" @click="delall"
            >清空</span
          >
          <el-scrollbar style="height: 349px" class="scroll">
            <ul v-if="selected.size > 0" class="ul" style="">
              <li v-for="(item, index) in selected" :key="index">
                <span>{{ item.name }}</span>
                <i class="el-icon-close" @click="close(item)" />
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div v-if="radioOrcheckbox === 'radio'" style="margin-left: 25px">
          <b style="margin-bottom: 8px">已选商品 </b>
          <ul v-if="selected.size > 0" class="ul" style="">
            <li v-for="(item, index) in selected" :key="index">
              <span>{{ item.name }}</span>
              <i class="el-icon-close" @click="close(item)" />
            </li>
          </ul>
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
import { fhGetShareCat, fhGetShareTemplate } from '@/api/marketing/discount'
import { fhGetCategories, fhGetFoodList } from '@/api/categories'

export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    radioOrcheckbox: {
      type: String,
      default() {
        return ''
      }
    },
    // 已存在的食物模板{name,id}
    activeName: {
      type: Array,
      default: () => []
    },
    // 选择店铺
    storeIds: {
      type: Array,
      default() {
        return []
      }
    },
    // 是否是交集
    share: {
      type: Boolean,
      default() {}
    }
  },
  data() {
    return {
      disabledFresh: false,
      freshIcon: 'el-icon-refresh',
      showFresh: false,
      loadingCat: false,
      selectedId: new Set(),
      selected: new Set(),
      loadingCities: false,
      isIndeterminate: false,
      checkAll: false,
      storeIdsList: this.storeIds,
      dialogVisibleType: false,
      value: '', // 搜索框输入
      showLine: true,
      showIcon: false,
      cities: [], // 中间区
      checkedCities: undefined,
      data: [], // 商品分类
      citieId: [], // 分类id,
      categoryId: null,
      checkedKeys: [],
      activeCheck: null
    }
  },
  computed: {
    loading() {
      return this.loadingCat || this.loadingCities
    }
  },
  watch: {
    cities(val) {
      this.compuAll()
    },
    storeIds(val) {
      this.storeIdsList = val
      this.cats()
    },
    // 搜索
    value(val) {
      this.searchTimer && clearInterval(this.searchTimer)
      this.searchTimer = setInterval(() => {
        this.handlerSearch(val)
        clearInterval(this.searchTimer)
        this.searchTimer = null
      }, 400)
    },
    activeName: {
      handler(val) {
        if (val.length > 0) {
          this.checkedCities = val[0].id
          this.selected = new Set(val)
          this.selectedId = new Set(
            val.map(ele => {
              return ele.id
            })
          )
        } else {
          this.checkedCities = undefined
          this.selected = new Set()
          this.selectedId = new Set()
        }
        this.radioOrcheckbox === 'checkbox' && this.compuAll()
        this.$forceUpdate()
      },
      immediate: true
    },
    dialogVisible(v) {
      this.dialogVisibleType = v
    }
  },
  mounted() {
    window.selectfood = this
  },
  created() {
    this.cats()
  },
  methods: {
    // 删除全部
    delall() {
      this.selected = new Set()
      this.selectedId = new Set()
      this.checkedCities = undefined
      this.compuAll()
    },
    // 判断全选，半选
    compuAll() {
      this.checkAll = this.cities.every((ele, index) => {
        return this.selectedId.has(ele.id)
      })
      const some = this.cities.some((ele, index) => {
        return this.selectedId.has(ele.id)
      })
      this.isIndeterminate = some && !this.checkAll
    },
    // 点击checkbox
    changeS(val, item) {
      if (val) {
        this.selected.add(item)
        this.selectedId.add(item.id)
      } else {
        ;``
        let status = this.selected.delete(item)
        this.selectedId.delete(item.id)
        if (!status) {
          const { id } = item
          let selecteArr = Array.from(this.selected)
          let newSelecte = selecteArr.filter(i => i.id !== id)
          this.selected = new Set(newSelecte)
        }
      }
      this.compuAll()

      this.$forceUpdate()
    },
    // 点击全选checkbox
    handleCheckAllChange(val) {
      if (val) {
        // 全选
        this.cities.forEach((ele, index) => {
          if (!this.selectedId.has(ele.id)) {
            this.selected.add(ele)
            this.selectedId.add(ele.id)
          }
        })
        this.checkAll = true
      } else {
        // 取消全选
        this.cities.forEach((ele, index) => {
          if (this.selectedId.has(ele.id)) {
            this.selected.delete(ele)
            this.selectedId.delete(ele.id)
          }
        })
        this.checkAll = false
      }
      this.$forceUpdate()
      this.isIndeterminate = false
    },
    // 处理搜索
    handlerSearch(key) {
      if (key !== '') {
        this.getFoodList(
          {
            pageSize: 999,
            foodTemplateName: key,
            storeIds: this.storeIdsList.join(',')
          },
          { isSearch: true }
        )
      } else if (this.tempCities) {
        this.cities = this.tempCities
        this.tempCities = null
      }
    },
    // 请求分类
    async cats() {
      this.loadingCat = true
      try {
        if (this.share) {
          // 交集
          const { results } = await fhGetShareCat({
            storeIds: this.storeIdsList.join(',')
          })
          this.data = results
        } else {
          const { results } = await fhGetCategories({
            storeIds: this.storeIdsList.join(',')
          })
          this.data = results[0].categoryByCountVos
        }

        this.data.forEach((val, index) => {
          this.citieId[index] = val.id
        })
        this.loadingCat = false
      } catch (err) {
        console.log(err)
      } finally {
        this.loadingCat = false
      }
    },
    // 请求商品列表
    async getFoodList(params, options = {}) {
      const { isSearch = false } = options
      isSearch && !this.tempCities && (this.tempCities = this.cities)
      this.loadingCities = true
      try {
        // 交集
        const { results } = this.share
          ? await fhGetShareTemplate(params)
          : await fhGetFoodList(params)
        isSearch ? (this.cities = results) : this.addDishes(results)
      } catch (err) {
        console.log(err)
      }
      this.loadingCities = false
    },
    // 添加新的菜品到列表
    addDishes(data) {
      data.forEach(item => {
        if (this.cities.indexOf(item) === -1) {
          this.cities.push(item)
        }
      })
    },
    // 选中分类获取对应商品list
    getCities(selectedKeys) {
      if (
        selectedKeys[0] === '0-0-0' ||
        (!selectedKeys[0] &&
          selectedKeys[0] !== 0 &&
          this.activeCheck === '0-0-0')
      ) {
        if (selectedKeys[0]) {
          this.activeCheck = selectedKeys[0]
        }
        const objLen = Object.keys(this.citieId).length
        if (this.checkedKeys.length < objLen) {
          for (const i in this.citieId) {
            const index = this.checkedKeys.indexOf(parseInt(i))
            if (index === -1) {
              this.checkedKeys.push(parseInt(i))
            }
          }
        } else {
          this.checkedKeys = []
          this.activeCheck = null
        }
        this.check(this.checkedKeys)
        return
      }
      if (selectedKeys[0] || selectedKeys[0] === 0) {
        this.activeCheck = selectedKeys[0]
        const index = this.checkedKeys.indexOf(selectedKeys[0])
        if (index === -1) {
          this.checkedKeys.push(selectedKeys[0])
        } else {
          this.checkedKeys.splice(index, 1)
        }
      } else {
        const index = this.checkedKeys.indexOf(this.activeCheck)
        this.checkedKeys.splice(index, 1)
      }
      this.check(this.checkedKeys)
    },
    checked(val, item) {
      console.log('checked', val, item)
      this.checkedCities = val
      this.selected = new Set([item])
      this.selectedId = new Set([val])
      this.$forceUpdate()
    },
    check(val) {
      this.checkedKeys = val
      const index = val.indexOf('0-0-0')
      if (index !== -1) {
        val.splice(index, 1)
      }
      this.cities = []
      val.forEach(item => {
        this.getFoodList({
          pageSize: 999,
          categoryId: this.citieId[item],
          storeIds: this.storeIdsList.join(',')
        })
      })
    },
    // 删除单个商品
    close(item) {
      // 多选框
      if (this.radioOrcheckbox === 'checkbox') {
        this.selected.delete(item)
        this.selectedId.delete(item.id)

        this.$forceUpdate()
        this.compuAll()
      } else {
        //  单选框
        this.selected = new Set()
        this.selectedId = new Set()
        this.checkedCities = undefined
      }
    },
    ok() {
      if (this.selected.size > 0) {
        this.$emit(
          'selectFood',
          Array.from(this.selected),
          Array.from(this.selectedId)
        )
        this.$emit('update:dialogVisible', false)
      } else {
        this.$message.error('请选择菜品')
      }
    }
  },
  beforeRouteLeave(from, to, next) {
    clearInterval(this.searchTimer)
    this.searchTimer = null
    next()
  }
}
</script>

<style scoped lang="scss">
.serach {
  margin-bottom: 14px;
}
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

    .food {
      flex: 1;
      // margin-top: 10px;
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
    flex: 0.5;
    display: flex;
    flex-flow: column;
    // padding: 8px 0;
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
          margin-right: 12px;
        }
      }
    }
  }
}
::v-deep .el-scrollbar__wrap {
  overflow-x: hidden;
}
.el-dialog__body {
  padding: 10px 20px;
}
.el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
