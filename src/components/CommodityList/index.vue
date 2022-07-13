<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-24 14:56:32
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-16 12:03:27
-->
<template>
  <div class="main-box">
    <!-- 菜单部分 -->
    <div v-if="!rawShowMenu" v-loading="catagoryLoad" class="sort">
      <ul>
        <template v-for="(i, k) in statusList">
          <li :key="k">
            <span
              ref="status"
              :class="{ active: k === statusCurr }"
              @click="changeMenu(k, i)"
            >
              {{ i.statusName }}({{ i.count }})
            </span>
          </li>
        </template>
      </ul>
    </div>
    <el-divider />
    <el-container id="main" class="main">
      <!-- 侧边分类 -->
      <el-aside width="14%" class="side">
        <el-scrollbar
          v-loading="catagoryLoad"
          wrap-style="color:'#fff';fontSize:'14px';"
          view-style="color:'#fff';fontSize:'14px';"
          :native="true"
        >
          <div
            v-if="statusCurr < 4"
            class="catBox"
            style="text-align: center; margin-bottom: 12px"
          >
            <el-button @click="openAddCate">新建分类</el-button>
          </div>
          <tm-empty v-show="catagoryList.length === 0" text="暂无分类" />
          <draggable
            v-if="sortCategories"
            v-model="catagoryList"
            class="list-group"
            tag="ul"
            :drag-options="{
              animation: 0,
              group: 'description',
              ghostClass: 'ghost'
            }"
            @end="dragEnd"
          >
            <template v-for="(item, index) in catagoryList">
              <side-item
                v-if="JSON.stringify(item) !== '{}'"
                :key="index"
                :value="item"
                :update-data="updateData"
                :sort-cate="sortCategories"
                :del-cate="delCate"
                :edit-cate="editCate"
                :curr-cate="query.categoryId"
                :status-curr="statusCurr"
                @openEditCate="type => openEditCate(item, type)"
                @click.native="changeCate(index, item)"
              />
            </template>
          </draggable>
          <ul v-else class="list-group">
            <template v-for="(item, index) in catagoryList">
              <side-item
                v-if="JSON.stringify(item) !== '{}'"
                :key="index"
                :value="item"
                :update-data="updateData"
                :sort-cate="sortCategories"
                :del-cate="delCate"
                :edit-cate="editCate"
                :status-curr="statusCurr"
                :curr-cate="query.categoryId"
                @openEditCate="type => openEditCate(item, type)"
                @click.native="changeCate(index, item)"
              />
            </template>
          </ul>
        </el-scrollbar>
      </el-aside>
      <!-- 主要商品部分 -->
      <el-container>
        <el-header v-show="statusCurr < 4" class="header">
          <div
            style="
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #eee;
            "
          >
            <div class="btn">
              <span style="margin-right: 20px">
                <el-checkbox
                  v-model="checkAll"
                  :indeterminate="indeterminate"
                  @change="check"
                >
                  全选
                </el-checkbox>
              </span>
              <!-- 商品操作按钮 -->
              <el-button
                v-for="(i, k) in batchBtns"
                :key="'btn' + k"
                :loading="i.load"
                size="medium"
                @click="batchBtnFn(i)"
              >
                {{ i.name }}
              </el-button>
            </div>
            <div class="btn" style="padding-right: 15px">
              <!-- <a-button type="link">商品排序</a-button> -->
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="$router.push({ name: 'CommodityCreate' })"
              >
                新建商品
              </el-button>
            </div>
          </div>
        </el-header>
        <el-main v-loading="commodityLoad">
          <template v-if="JSON.stringify(commodity[0]) !== '{}'">
            <info
              v-for="(i, k) in commodity"
              ref="info"
              :key="k"
              :index="k"
              :value="i"
              :checked="foodTemplateIdArr.includes(i.id)"
              :update-data="updateData"
              :edit-option="editOption"
              :edit-food="editFood"
              :delete-food="deleteFood"
              :drop-off-option="dropOffOption"
              :check-item="checkOne"
              :router-query="routerQuery"
              :show-drop-off="showDropOff"
              :show-weight="statusCurr < 4 ? showWeight : false"
              :status-curr="statusCurr"
              @rawGetFoodList="rawGetFoodList"
            />
          </template>
          <tm-empty v-show="commodity.length === 0" text="暂无菜品" />
          <Pagination
            v-if="total !== 0"
            :total="total"
            :cur-page="query.pageNumber"
            :page-size="query.pageSize"
            @pagination="pagination"
          />
        </el-main>
      </el-container>
    </el-container>
    <AddCate
      ref="addCate"
      :visible.sync="visible"
      :type="cateType"
      :cate-data.sync="itemCate"
      :edit-load="editLoad"
      @putFoodCats="putFoodCats"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import Pagination from '@/components/Pagination'
import Info from './_components/Info'
import SideItem from './_components/SideItem'
import { statusTypes } from './_utils'
import {
  fhGetCatAutitsList,
  fhGetFoodAutitsList,
  fhPutCatAutits
} from '@/api/commodity'
import AddCate from './_components/AddCate'
export default {
  name: 'CommodityList',
  components: {
    Info,
    Pagination,
    draggable,
    SideItem,
    AddCate
  },
  props: {
    // 获取函数
    getFoodList: {
      type: Function,
      default: null
    },
    // 获取分类
    getCatagoryList: {
      type: Function,
      default: null
    },
    // 批量处理按钮
    batchBtns: {
      type: Array,
      default: () => []
    },
    // 排序分类
    sortCategories: {
      type: Function,
      default: null
    },
    // 删除分类
    delCate: {
      type: Function,
      default: null
    },
    // 编辑分类
    editCate: {
      type: Function,
      default: null
    },
    // 编辑商品
    editFood: {
      type: Function,
      default: () => {}
    },
    // 删除商品
    deleteFood: {
      type: Function,
      default: () => {}
    },
    // 修改属性配置
    editOption: {
      type: Array,
      default: () => []
    },
    // 上下架配置式
    dropOffOption: {
      type: Object,
      default: null
    },
    showDropOff: {
      type: Boolean,
      default: true
    },
    showWeight: {
      type: Boolean,
      default: true
    },
    // 修改的跳转配置
    routerQuery: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      statusTypes,
      // 侧边栏
      // 商品信息
      // 商品批量操作部分
      isCheckAll: true,
      checkAll: false,
      visible: false,
      cateType: 'add',
      editLoad: false,
      itemCate: {},
      // 分页
      query: {
        pageNumber: 1,
        pageSize: 10
      },
      foodTemplateIdArr: [],
      foodNameArr: [],
      // 总商品
      total: 0,
      // 商品
      commodity: [{}],
      commodityLoad: false,
      // 分类
      catagoryList: [{}],
      catagoryLoad: false,
      // 菜单
      statusList: [],
      statusCurr: -1,
      // 是否可以拖拽
      isDragging: false,
      menu: null
    }
  },
  computed: {
    rawShowMenu() {
      const { statusList } = this
      return (
        statusList &&
        statusList.length === 1 &&
        statusList[0].statusName === '全部'
      )
    },
    indeterminate() {
      return !this.checkAll && this.foodTemplateIdArr.length > 0
    }
  },
  created() {
    window.cd = this
    const { menu } = this.$route.query
    if (menu) {
      this.menu = menu
    }
    this.getCatagoryList && this.rawGetCategories()
  },
  methods: {
    // 切换菜单
    toggleMenu(v) {
      const data = this.statusList[v]
      const { count = 0 } = data || {}
      const temp = data ? data.categoryByCountVos : []
      if (temp[0] && temp[0].name !== '全部') {
        temp.unshift({
          createTime: null,
          foodCount: count,
          id: -1,
          name: '全部',
          weight: -1
        })
      }
      this.catagoryList = temp.length > 0 ? temp : []
      this.$forceUpdate()
    },
    // 获取所有商品
    async rawGetFoodList() {
      this.commodityLoad = true
      try {
        const { results, count } = await this.getFoodList(this.query)
        this.commodity = results
        this.total = count
        this.foodTemplateIdArr = []
      } catch (e) {
        console.log('debug axios', e)
      }
      this.commodityLoad = false
    },
    // 获取所有分类
    async rawGetCategories() {
      this.catagoryLoad = true
      this.commodityLoad = true
      try {
        const { results } = await this.getCatagoryList()

        // 所有菜单
        this.statusList = results
        if (this.statusCurr < 4) {
          this.statusCurr = 0
          this.toggleMenu(0)
          this.query.statusType = results[0] ? results[0].statusType : ''
          this.$nextTick(() => {
            this.getFoodList && this.rawGetFoodList()
          })
        }
        if (this.menu) {
          this.$nextTick(() => {
            setTimeout(() => {
              this.changeMenu(Number(this.menu))
              this.menu = null
            }, 300)
          })
        }
      } catch (e) {
        console.log('axios', e)
      }
      this.commodityLoad = false
      this.catagoryLoad = false
    },
    // 审核的分类
    async getCatAutitsList(params) {
      this.catagoryLoad = true
      try {
        const { results } = await fhGetCatAutitsList(params)
        this.catagoryList = results
        // this.statusList = results
        // this.statusCurr = 0
        // this.toggleMenu(0)
      } catch (err) {
        console.log(err)
      }
      this.catagoryLoad = false
    },
    // 审核的菜品
    async getFoodAutitsList(params) {
      this.commodityLoad = true
      try {
        const { results, count } = await fhGetFoodAutitsList(params)
        results.forEach(item => {
          const { period, attribute, skuList } = item
          if (period) {
            const periodJson = JSON.parse(period)
            const { timePeriodList } = periodJson
            timePeriodList.forEach(i => {
              const { startTime, endTime } = i
              i.startTime = `${startTime}:00`
              i.endTime = `${endTime}:00`
            })
            item.period = periodJson
          }
          if (attribute) {
            item.attributeDtoList = eval('(' + attribute + ')')
          }
          item.foodSkuList = skuList
        })
        this.commodity = results
        this.total = count
        this.foodTemplateIdArr = []
      } catch (err) {
        console.log(err)
      }
      this.commodityLoad = false
    },
    // 修改分类
    async putCatAutits(id, params) {
      this.editLoad = true
      try {
        this.statusCurr < 4
          ? await this.editCate(id, params)
          : await fhPutCatAutits(id, params)
        this.$message.success('修改成功')
        this.visible = false
        this.itemCate = {}
        if (this.statusCurr < 4) {
          this.$refs.addCate.infoVisible = true
          // this.updateData()
        } else {
          const params = {
            auditStatus: this.statusCurr === 4 ? null : false
          }
          this.getCatAutitsList(params)
          this.rawGetCategories()
        }
      } catch (err) {
        console.log(err)
      }
      this.editLoad = false
    },
    // async putEditCate(id, params) {
    //   try {

    //   } catch (err) {
    //     console.log()
    //   }
    // },
    // 切换菜单
    changeMenu(index, data) {
      if (index >= 4) {
        this.changeAuditsMenu(index)
        return
      }
      const { categoryByCountVos, statusType } = data
      this.statusCurr = index
      this.toggleMenu(index)
      this.$forceUpdate()
      this.catagoryLoad = true
      this.catagoryList = categoryByCountVos
      this.query = {
        pageNumber: 1,
        pageSize: 10
      }
      statusType && (this.query.statusType = statusType)
      this.foodTemplateIdArr = []
      this.rawGetFoodList()
      setTimeout(() => {
        this.catagoryLoad = false
      }, 1000 * 0.7)
    },
    // 审核的菜单
    changeAuditsMenu(index) {
      const params = {
        auditStatus: index === 4 ? null : false
      }
      this.statusCurr = index
      // this.toggleMenu(index)
      this.$forceUpdate()
      this.query = {
        pageNumber: 1,
        pageSize: 10
      }
      this.foodTemplateIdArr = []
      this.getCatAutitsList(params)
      this.getFoodAutitsList(params)
    },
    // 切换分类
    changeCate(index, data) {
      const { id } = data
      if (this.statusCurr >= 4) {
        return
      }
      Object.assign(this.query, {
        pageNumber: 1,
        pageSize: 10,
        categoryId: id === -1 ? '' : id
      })
      this.foodTemplateIdArr = []
      this.rawGetFoodList()
    },
    // 分页功能
    pagination(params) {
      Object.assign(this.query, params)
      this.rawGetFoodList()
    },
    // 全选
    check(type) {
      this.foodTemplateIdArr = type ? this.commodity.map(i => i.id) : []
    },
    // 单选
    checkOne(type, id, item) {
      type ? this.foodTemplateIdArr.push(id) : this.deselect(id, item)
    },
    // 取消选择
    deselect(id, item) {
      const { foodTemplateIdArr } = this
      const index = foodTemplateIdArr.indexOf(id)
      this.foodTemplateIdArr.splice(index, 1)
    },
    // 批量按钮的执行函数
    async batchBtnFn(item) {
      if (this.foodTemplateIdArr.length < 1) {
        this.$message.error('请先选择需要操作商品')
        return
      }
      const { name } = item
      if (/删除/.test(name)) {
        this.$confirm('此操作将批量删除选中的商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          // eslint-disable-next-line space-before-function-paren
          .then(() => {
            this.handlerBatchBtn(item)
          })
          .catch(() => {})
      } else {
        this.handlerBatchBtn(item)
      }
    },
    // 批量执行函数
    async handlerBatchBtn(item) {
      const { fn, field } = item
      item.load = true
      try {
        const sendKey = field || 'foodTemplateIdArray'
        await fn({ [sendKey]: this.foodTemplateIdArr.join(',') })
        this.updateData()
        this.checkAll = false
      } catch (e) {
        console.log('debug axios', e)
      }
      // eslint-disable-next-line require-atomic-updates
      item.load = false
    },
    // 更新数据
    updateData(option) {
      if (option) {
        const { id } = option
        if (id === this.query.categoryId) {
          this.query.categoryId = ''
        }
      }
      this.statusCurr = -1
      this.toggleMenu(-1)
      this.rawGetCategories()
      this.rawGetFoodList()
    },
    // 拖拽结束
    async dragEnd(e) {
      this.catagoryLoad = true
      try {
        await this.sortCategories({ categoryList: this.catagoryList })
        this.$message.success('排序成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      this.catagoryLoad = false
    },
    openAddCate() {
      this.visible = true
      this.cateType = 'add'
    },
    openEditCate(value, type) {
      this.visible = true
      this.cateType = type
      this.itemCate = value
    },
    putFoodCats(params) {
      this.putCatAutits(params.id, params)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-main {
  padding-top: 0;
}

.main-box {
  &::v-deep .el-divider {
    margin: 0;
  }

  &::v-deep .el-scrollbar__wrap {
    margin-right: -12px !important;
    height: 1310px !important;
    overflow-x: hidden;
  }
}

.sort {
  ul {
    margin: 0;
    padding: 0;
    overflow: hidden;
    line-height: 60px;
    padding: 0 14px;
    li {
      float: left;
      padding: 0 20px;
      margin-right: 20px;
      border-bottom: 2px solid transparent;
      cursor: pointer;
    }
    .choosed {
      border-bottom: 2px solid #52acff;
    }
  }
}

.main {
  .side {
    border-right: 1px solid rgb(228, 222, 222);
    background: #ffffff;
    padding: 0;
    padding-top: 10px;
    font-family: none;
    font-size: 14px;

    .list-group {
      padding: 0;
    }
  }
  .el-container {
    .header {
      padding: 0;
      .btn {
        overflow: hidden;
        padding: 15px 0 15px 21px;
        // border-bottom: 1px solid #eee;
        margin-bottom: 0;
      }
    }
    .main {
      padding: 0;
      .list {
        li {
          // border-bottom: 1px solid #eee;
          padding: 24px 20px;
          .img-outer {
            position: relative;
            .img {
              width: 78px;
              height: 78px;
              background: {
                size: 100% auto;
                position: center;
                repeat: no-repeat;
              }
            }
            .tips {
              position: absolute;
              bottom: 0;
              left: 0;
              padding: 4px 0;
              text-align: center;
              width: 100%;
              font-size: 10px;
              color: #fff;
              background: rgba(0, 0, 0, 0.6);
            }
          }

          .name {
            color: #000;
            font-size: 16px;
            margin-bottom: 10px;
          }

          .guqing {
            margin: 0 0 0 3%;
            padding-top: 40px;
            text-align: center;
          }
          .tuijian {
            margin: 0 0 0 0;
            padding-top: 40px;
            text-align: center;
          }

          .caozuo {
            margin: 0 0 0 0;
            padding-top: 6px;
          }
          .food {
            margin: 0 15px;
            .name {
              font-size: 16px;
              color: black;
              margin-bottom: 14px;
            }
            .input {
              display: flex;
              align-items: center;
              margin-right: 20px;
              .el-select,
              .el-input {
                margin-left: 10px;
                min-width: 160px;
              }
            }
          }
        }
      }
    }
  }
}

.active {
  color: #52acff;
}

.actives {
  background: #eee;
}
</style>
