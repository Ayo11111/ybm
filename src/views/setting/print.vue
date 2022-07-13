<!--
 * @Descripttion:
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-07-12 17:36:51
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-22 06:02:37
-->
<template>
  <div v-loading="loading" class="container">
    <div class="mb-24">
      <span>打印机设置</span>
      <el-button style="float: right" @click="showPrintSetting()">
        添加打印机
      </el-button>
    </div>
    <el-table border :data="prints">
      <el-table-column label="打印机编号SN">
        <template slot-scope="{ row: { printConfig } }">
          <span>{{ printConfig ? printConfig.sn : '---' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="打印机识别码KEY">
        <template slot-scope="{ row: { printConfig } }">
          <span>{{ printConfig ? printConfig.snKey : '---' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="{ row: { printCategory } }">
          <span>{{ printCategoryMap.get(printCategory) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="品牌">
        <template slot-scope="{ row: { printType } }">
          <span>{{ printTypeMap.get(printType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="小票宽度">
        <template slot-scope="{ row: { printWidth } }">
          <span>{{ printWidth }}mm</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row, $index }">
          <a-switch
            :checked="row.status"
            checked-children="启用"
            un-checked-children="禁用"
            :loading="row.statusLoading"
            @change="editPrints(row, $index, $event)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template slot-scope="{ row, $index }">
          <el-button :loading="row.printLoading" @click="printTest(row)">
            打印测试
          </el-button>
          <el-button @click="showPrintSetting(row, $index)">编辑</el-button>
          <el-button @click="deletePrint(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PrintSetting
      ref="printSetting"
      :source="prints"
      :index="printIndex"
      :value.sync="tempPrintConfig"
    />
  </div>
</template>

<script>
import { printCategoryMap, printTypeMap } from './_utils'
import { fhGetPrints, fhPrintTest, fhEditPrints } from '@/api/stores'
import PrintSetting from './_components/PrintSetting'
import { deepClone } from '@/utils'
export default {
  name: 'Print',
  components: { PrintSetting },
  data() {
    return {
      prints: [],
      printCategoryMap,
      printTypeMap,
      loading: false,
      // 表单的第几个
      printIndex: null,
      // 当前编辑的配置
      tempPrintConfig: {}
    }
  },
  created() {
    this.getPrints()
  },
  methods: {
    // 获取打印机列表
    async getPrints() {
      this.loading = true
      try {
        const { results } = await fhGetPrints()
        this.prints = results.map(i => {
          i.printLoading = false
          i.statusLoading = false
          return i
        })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 显示配置打印弹窗
    showPrintSetting(item = {}, index = null) {
      this.printIndex = index
      this.tempPrintConfig = item
      this.$nextTick(() => {
        this.$refs.printSetting.controlDialog(true)
      })
    },
    // 打印测试
    async printTest(item) {
      item.printLoading = true
      try {
        await fhPrintTest(item)
        this.$message.success('测试打印机成功')
      } catch (e) {
        console.log('debug axios', e)
      }
      item.printLoading = false
    },
    // 修改打印机状态
    async editPrints(item, index, flag) {
      item.statusLoading = true
      try {
        const config = deepClone(this.prints)
        config[index].status = flag
        await fhEditPrints(config)
        this.prints[index].status = flag
        this.$message.success(`${flag ? '启' : '禁'}用打印机成功`)
        this.getPrints()
      } catch (e) {
        console.log('debug axios', e)
      }
      item.statusLoading = false
    },
    // 删除打印机
    deletePrint(item, index) {
      const { status } = item
      if (status) {
        this.$message.warning('启用中的打印机不允许删除')
        return
      }

      this.$confirm('此操作将永久删除该打印机, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            try {
              instance.confirmButtonLoading = true
              instance.confirmButtonText = '执行中...'
              const config = deepClone(this.prints)
              config.splice(index, 1)
              try {
                await fhEditPrints(config)
                this.getPrints()
              } catch (e) {
                console.error('编辑打印机错误 error', e)
              }
              done()
              instance.confirmButtonLoading = false
            } catch (e) {
              console.error('删除打印机出错 error', e)
            }
          } else {
            done()
          }
          this.$nextTick(() => {
            if (this.$refs.printSetting) {
              this.$refs.printSetting.$refs.form.clearValidate()
            }
          })
        }
      })
        .then(action => {
          console.log('debug', action)
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #fff;
  padding: 0;
  margin: 0;
}
</style>
