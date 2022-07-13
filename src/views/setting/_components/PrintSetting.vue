<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-03-24 14:23:47
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-22 15:05:18
-->
<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="`${index || index === 0 ? '编辑' : '新建'}打印机`"
  >
    <el-form
      ref="form"
      :model="printConfig"
      :rules="formRule"
      label-width="10em"
    >
      <el-form-item label="请选择打印机品牌" prop="printType">
        <filter-select
          :data="printType"
          :value.sync="printConfig.printType"
          vk="printType"
          vl="printName"
          vv="printType"
        />
      </el-form-item>
      <el-form-item label="请选择打印机类型" prop="printCategory">
        <filter-select
          :data="printCategory"
          :value.sync="printConfig.printCategory"
          vk="printType"
          vl="printName"
          vv="printType"
        />
      </el-form-item>
      <el-form-item label="小票宽度" prop="printWidth">
        <div>
          <el-input-number
            v-model="printConfig.printWidth"
            :controls="false"
            placeholder="请输入小票宽度"
          />
          <span>mm</span>
        </div>
      </el-form-item>
      <el-form-item label="打印机SN码" prop="sn">
        <el-input
          v-model="printConfig.sn"
          placeholder="请输入打印机SN码"
          class="print-input"
          clearable
        />
      </el-form-item>
      <el-form-item label="打印机KEY码" prop="snKey">
        <el-input
          v-model="printConfig.snKey"
          placeholder="请输入打印机KEY码"
          class="print-input"
          clearable
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="controlDialog(false)">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="comfirm">
        确 定
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { options, printTypeMap } from '../_utils'
import { fhEditPrints } from '@/api/stores/index'
import FilterSelect from '@/components/FilterSelect'
import { deepClone } from '@/utils'
export default {
  name: 'PrintSetting',
  components: {
    FilterSelect
  },
  props: {
    source: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    index: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      // 打印机品牌和打印机的options
      ...options,
      // 是否显示弹窗
      dialogVisible: false,
      // 打印配置
      printConfig: {
        printType: null,
        printCategory: null,
        printWidth: null,
        sn: '',
        snKey: '',
        deviceId: ''
      },
      // 表单规则
      formRule: {
        printType: [
          {
            required: true,
            message: '请选择打印机品牌',
            trigger: ['blur', 'change']
          }
        ],
        printCategory: [
          {
            required: true,
            message: '请选择打印机类型',
            trigger: ['blur', 'change']
          }
        ],
        printWidth: [
          {
            required: true,
            message: '请输入打印机宽度',
            trigger: ['blur', 'change']
          }
        ],
        sn: [
          {
            required: true,
            message: '请输入打印机SN码',
            trigger: ['blur', 'change']
          }
        ],
        snKey: [
          {
            required: true,
            message: '请输入打印机Key码',
            trigger: ['blur', 'change']
          }
        ],
        deviceId: [
          {
            required: true,
            message: '请输入打印机设备号',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 编辑loading
      loading: false
    }
  },
  watch: {
    value: {
      handler(v) {
        if (v) this.printConfig = { ...v, ...v.printConfig }
      },
      immediate: true,
      deep: true
    },
    dialogVisible: {
      handler(v) {
        if (!v && this.$refs.form) {
          this.$refs.form.clearValidate()
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 显示弹窗
    controlDialog(flag) {
      if (!flag) {
        this.printConfig = {}
        this.$emit('update:value', {})
      }
      this.dialogVisible = flag
    },
    // 确认
    comfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.editPrints()
        }
      })
    },
    // 请求编辑接口
    async editPrints() {
      this.loading = true
      try {
        const { index } = this
        let { printConfig } = this
        const { sn, snKey, printType } = printConfig
        const printName = printTypeMap.get(printType)
        const config = deepClone(this.source)
        const flag = index || index === 0

        printConfig = {
          status: config.length === 0,
          ...printConfig,
          printName,
          printConfig: {
            sn,
            snKey
          }
        }

        if (flag) config[index] = printConfig
        else config.unshift(printConfig)
        await fhEditPrints(config)
        this.$parent.getPrints()
        this.$message.success(`${flag ? '编辑' : '新建'}打印机成功`)
        this.controlDialog(false)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-input__inner {
  text-align: left;
}
</style>
