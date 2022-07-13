<!--
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-15 14:05:57
 * @LastEditors: CJH
 * @LastEditTime: 2021-06-16 10:34:13
-->
<template>
  <a-modal
    :visible="visible"
    width="50%"
    title="调配护工"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="$emit('update:visible', false)"
  >
    <el-form inline>
      <el-form-item label="护工性别">
        <FilterSelect
          :clearable="true"
          :data="sexData"
          :value.sync="formData.sex"
          vl="label"
          vv="value"
        />
      </el-form-item>
      <el-form-item
        :clearable="true"
        :data="levelData"
        label="护工等级"
        vl="label"
        vv="value"
      >
        <FilterSelect
          :clearable="true"
          :data="levelData"
          :value.sync="formData.nurseLevel"
          vl="label"
          vv="value"
        />
      </el-form-item>
      <el-form-item label="护理年限" style="display: flex;width: 600px">
        <div style="display: flex">
          <el-input
            v-model.number="formData.nursingYearsStart"
            oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
          ></el-input>
          <span style="margin: 0 8px">~</span>
          <el-input
            v-model.number="formData.nursingYearsEnd"
            oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
          ></el-input>
          <span style="margin-left: 8px">年</span>
        </div>
      </el-form-item>
      <el-form-item label="护工姓名">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="护工手机号">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="select">
          查询
        </el-button>
        <el-button :loading="loading" @click="cancel">重置</el-button>
      </el-form-item>
    </el-form>
    <a-table
      :columns="columns"
      :data-source="nurses"
      :selectedRowKeys="selectedRowKeys"
      :loading="loading"
      rowKey="id"
      :scroll="{ x: 1600, y: 200 }"
      :rowSelection="rowSelection"
      :pagination="false"
    >
      <div slot="index" slot-scope="scope, item, index">
        {{ index }}
      </div>
      <div slot="info" slot-scope="scope">
        <div style="display: flex">
          <!-- {{ scope }} -->
          <a-avatar :size="38" icon="user" :src="scope.photo" />
          <div class="infoText">
            <span>{{ scope.name }}</span>
            <span
              >{{ scope.sex === 1 ? '男' : '女' }} {{ scope.age || 0 }}岁</span
            >
          </div>
        </div>
      </div>
      <div slot="nurseLevel" slot-scope="scope">
        {{ ['', '普通护理员', '高级护理员'][scope] }}
      </div>
      <div slot="status" slot-scope="scope">
        {{ ['', '未审核', '审核未通过', '空闲', '服务中'][scope] }}
      </div>
      <div slot="nursingYears" slot-scope="scope">{{ scope }} 年</div>
    </a-table>
    <Pagination
      :total="total"
      @pagination="pagination"
      :curPage.sync="curPage"
    ></Pagination>
  </a-modal>
</template>

<script>
import FilterSelect from '@/components/FilterSelect'
import Pagination from '@/components/Pagination'
import { fhGetNurses, fhPutOrderNurse } from '@/api/nurse'
export default {
  components: {
    FilterSelect,
    Pagination
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orderId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      selectedRowKeys: [],
      formData: {},
      nurses: [],
      loading: false,
      total: 0,
      curPage: 1,
      confirmLoading: false,
      sexData: [
        {
          label: '男',
          value: 1
        },
        {
          label: '女',
          value: 2
        }
      ],
      levelData: [
        {
          label: '普通护理员',
          value: 1
        },
        {
          label: '高级护理员',
          value: 2
        }
      ],
      columns: [
        {
          title: '序号',
          dataIndex: '',
          scopedSlots: { customRender: 'index' }
        },
        {
          title: '护工信息',
          dataIndex: '',
          scopedSlots: { customRender: 'info' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '单价(元/天)',
          dataIndex: 'price'
        },
        {
          title: '护理等级',
          dataIndex: 'nurseLevel',
          scopedSlots: { customRender: 'nurseLevel' }
        },
        {
          title: '护理年限',
          dataIndex: 'nursingYears',
          scopedSlots: { customRender: 'nursingYears' }
        },
        {
          title: '专职科室',
          dataIndex: 'sickroom'
        },
        {
          title: '身份证号',
          dataIndex: 'identityCardNumber'
        },
        {
          title: '注册时间',
          dataIndex: 'createTime'
        }
      ]
    }
  },
  computed: {
    rowSelection() {
      return {
        type: 'radio',
        onChange: this.onSelectChange
      }
    }
  },
  created() {
    this.getNurses()
  },
  methods: {
    async getNurses(params) {
      this.loading = true
      try {
        const { results } = await fhGetNurses(params)
        this.nurses = results.results
        this.total = results.count
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async putOrderNurse(params) {
      this.confirmLoading = true
      try {
        await fhPutOrderNurse(this.orderId, params)
        this.$emit('update:visible', false)
      } catch (err) {
        console.log(err)
      }
      this.confirmLoading = false
    },
    select() {
      this.getNurses(this.formData)
    },
    cancel() {
      this.formData = {}
      this.curPage = 1
      this.getNurses()
    },
    handleOk() {
      if (this.selectedRowKeys.length > 0) {
        this.putOrderNurse({ nurseId: this.selectedRowKeys[0] })
      } else {
        this.$message.error('请选择护工')
      }
    },
    pagination(v) {
      this.getNurses(Object.assign({}, this.params, v))
    },
    onSelectChange(v) {
      this.selectedRowKeys = v
    }
  }
}
</script>

<style lang="scss" scoped>
.infoText {
  margin-left: 20px;
  display: flex;
  flex-flow: column;
}
</style>
