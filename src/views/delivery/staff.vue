<template>
  <div class="container">
    <el-row>
      <el-button type="primary" size="small" @click="showAddForm">
        新增配送员
      </el-button>
    </el-row>
    <a-table
      style="margin-top: 25px"
      :pagination="false"
      :data-source="deliveryList"
      :columns="deliveryHead"
      :loading="tableLoading"
      row-key="id"
    >
      <template v-if="JSON.stringify(item)!=='{}'" slot="edit" slot-scope="text, item, index">
        <el-button type="text" @click="editOne(item)">编辑</el-button>
        <a-divider type="vertical" />
        <el-button
          type="text"
          style="color: red"
          :loading="item.delLoading"
          @click="confirmDel(item.id, index)"
        >
          删除
        </el-button>
      </template>
    </a-table>
    <pagination :total="total" @pagination="pagination" />
    <a-modal
      :title="edit ? '编辑配送员' : '新增配送员'"
      :visible="visible"
      :confirm-loading="addLoading"
      @ok="validForm"
      @cancel="hideAddForm"
    >
      <el-form
        ref="deliForm"
        :model="newDelivery"
        :rules="newDeliveryRule"
        inline
      >
        <el-form-item label="配送员名称" prop="name">
          <el-input
            v-model="newDelivery.name"
            placeholder="请输入配送员名称"
            @keyup.enter.native="addDelivery"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" style="margin-left: 1em">
          <el-input
            v-model="newDelivery.phone"
            placeholder="请输入配送员联系电话"
            @keyup.enter.native="addDelivery"
          />
        </el-form-item>
      </el-form>
    </a-modal>
  </div>
</template>

<script>
import {
  putDelivery,
  getDeliverys,
  delDelivery,
  editDelivery
} from '@/api/delivery/staff'
import { validPhone } from '@/utils/validate'
import Pagination from '@/components/Pagination'
export default {
  name: 'DeliveryStaff',
  components: {
    Pagination
  },
  data() {
    const validPhoneFn = (rule, value, callback) => {
      if (!validPhone(value)) {
        callback(new Error('请输入正确的手机号码'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      query: {},
      deliveryList: [{}],
      deliveryHead: [
        {
          title: '配送员名称',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '配送员联系方式',
          dataIndex: 'phone',
          key: 'phone'
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'edit' }
        }
      ],
      tableLoading: false,
      visible: false,
      newDelivery: { name: '', phone: '', pageNumber: 1, pageSize: 10 },
      newDeliveryRule: {
        name: [
          {
            required: true,
            message: `请输入配送员名称`,
            trigger: 'change'
          }
        ],
        phone: [
          {
            required: true,
            message: `请输入配送员联系方式`,
            trigger: 'blur'
          },
          { validator: validPhoneFn, required: true, trigger: 'change' }
        ]
      },
      addLoading: false,
      edit: false
    }
  },
  mounted() {
    this.getDeliveryList()
  },
  methods: {
    async getDeliveryList() {
      this.tableLoading = true
      try {
        const { results, count } = await getDeliverys(this.query)
        this.total = count
        this.deliveryList = results.map(i => {
          i.delLoading = false
          return i
        })
        this.visible = this.$route.query.add && results.length <= 0
        Object.assign(this.newDelivery, { name: '', phone: '' })
      } catch (e) {
        console.log(e)
      }
      this.tableLoading = false
    },
    showAddForm() {
      this.visible = true
    },
    hideAddForm() {
      this.visible = false
      this.edit = false
    },
    validForm() {
      this.addLoading = true
      this.$refs.deliForm.validate(valid => {
        if (valid) {
          this.addDelivery()
        } else {
          this.$message.error('请检查您的输入')
          this.addLoading = false
        }
      })
    },
    async addDelivery() {
      this.addLoading = true
      const { edit, tempDelivery } = this
      try {
        await (edit
          ? editDelivery(tempDelivery.id, this.newDelivery)
          : putDelivery(this.newDelivery))
        this.$message.success(`${edit ? '编辑' : '添加'}成功`)
        this.getDeliveryList()
        this.visible = false
      } catch (e) {
        console.log(e)
      }
      this.addLoading = false
    },
    confirmDel(id, index) {
      this.deliveryList[index].delLoading = true
      this.$confirm('请确认是否删除配送员?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.delDeliveryFn(id, index)
        })
        .catch(() => {
          this.deliveryList[index].delLoading = false
        })
    },
    async delDeliveryFn(id, index) {
      try {
        await delDelivery(id)
        this.deliveryList.splice(index, 1)
        --this.total
        this.$message.success('删除成功')
        if (this.deliveryList.length === 0 && this.query.pageNumber > 1) {
          --this.query.pageNumber
          this.getDeliveryList()
        }
      } catch (e) {
        console.log(e)
        this.deliveryList[index].delLoading = false
      }
    },
    editOne(item) {
      const { name, phone } = item
      this.newDelivery = { name, phone }
      this.tempDelivery = item
      this.edit = true
      this.showAddForm()
    },
    pagination(v) {
      Object.assign(this.query, v)
      this.getDeliveryList()
    }
  }
}
</script>
