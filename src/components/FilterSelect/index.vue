<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-23 15:31:15
 * @LastEditors: CJH
 * @LastEditTime: 2021-09-27 16:32:01
-->
<template>
  <el-select
    class="elSelect"
    v-model="result"
    :filterable="filterable"
    :value-key="vk"
    :multiple="multiple"
    :loading="rawLoading"
    :disabled="disabled"
    :clearable="clearable"
    placeholder="请选择"
    popper-class="el-selectDropdown"
    :popper-append-to-body="false"
    @change="defChange"
  >
    <el-option
      v-for="(i, k) in rawData"
      :key="vk ? i[vk] : k"
      :label="vl ? i[vl] : i"
      :value="vv ? i[vv] : i"
      @click.native="optionClick(i, k)"
    />
  </el-select>
</template>

<script>
export default {
  name: 'FilterSelect',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    clearable: {
      type: Boolean,
      default() {}
    },
    value: {
      type: [Object, Array, String, Number, Boolean],
      default: () => ''
    },
    vk: {
      type: String,
      default: ''
    },
    vl: {
      type: String,
      default: ''
    },
    vv: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    asyncGetData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      result: '',
      rawData: [],
      rawLoading: false,
      filterable: true
    }
  },
  watch: {
    value: {
      // eslint-disable-next-line space-before-function-paren
      handler: function(v) {
        this.result = v
      },
      immediate: true,
      deep: true
    },
    data: {
      // eslint-disable-next-line space-before-function-paren
      handler: function(v) {
        this.rawData = v
      },
      immediate: true,
      deep: true
    },
    loading(v) {
      this.rawLoading = v
    }
  },
  created() {
    window.fs = this
    if (this.asyncGetData) {
      this.filterable = false
      this.getData()
    }
  },
  methods: {
    defChange(v) {
      this.$emit('update:value', v)
    },
    async getData() {
      this.rawLoading = true
      try {
        const { results } = await this.asyncGetData()
        this.rawData = results
        this.$nextTick(() => {
          this.result = this.value
          this.filterable = true
        })
      } catch (e) {
        console.log('debug axios', e)
      }
      this.rawLoading = false
    },
    optionClick(v, i) {
      this.$emit('change', v, i)
    }
  }
}
</script>

<style lang="scss" scoped>
.elSelect {
  &::v-deep .el-selectDropdown {
    z-index: 990 !important;
  }
}
</style>
