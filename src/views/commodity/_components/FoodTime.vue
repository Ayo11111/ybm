<template>
  <div>
    <el-dialog
      title="商品时间段"
      :visible.sync="dialogTableVisible"
      style="z-index: 1049;"
    >
      <a-table
        :columns="columns"
        :data-source="data"
        :pagination="false"
        :scroll="{ y: '45vh' }"
        :loading="loading"
      >
        <template slot="name" slot-scope="text, item">
          <el-input
            v-if="item.edit"
            v-model="item.name"
            placeholder="请输入时间段名"
          />
          <span v-else>{{ text }}</span>
        </template>
        <template slot="time" slot-scope="text, item">
          <el-time-picker
            v-model="item.startTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            style="width: 10em;"
          />
          <span style="margin: 0 10px;">至</span>
          <el-time-picker
            v-model="item.endTime"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
            style="width: 10em;"
          />
        </template>
        <template slot="edit" slot-scope="text, item, index">
          <el-link type="primary" :underline="false" @click="delOne(index)">
            删除
          </el-link>
        </template>
      </a-table>
      <div v-show="!(loading || saveLoad)" class="add" @click="newTime">
        <i class="el-icon-plus" />
        <span>添加</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="loading"
          :loading="loading || saveLoad"
          @click="postBatch"
        >
          确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fhGetfoodPeriods, fhPostBatch } from '@/api/categories'
export default {
  data() {
    return {
      dialogTableVisible: false,
      data: [],
      columns: [
        {
          dataIndex: 'name',
          title: '名称',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '出售时间段',
          scopedSlots: { customRender: 'time' },
          width: '50%'
        },
        {
          dataIndex: '',
          title: '操作',
          scopedSlots: { customRender: 'edit' }
        }
      ],
      loading: false,
      saveLoad: false
    }
  },
  watch: {
    dialogTableVisible(v) {
      if (v) this.getfoodPeriods()
    }
  },
  created() {
    this.getfoodPeriods()
  },
  methods: {
    // 获取所有时间段
    async getfoodPeriods() {
      this.loading = true
      try {
        const { results } = await fhGetfoodPeriods()
        this.data = results
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 添加时间段
    newTime() {
      this.data.push({
        name: '',
        startTime: '',
        endTime: '',
        edit: true
      })
    },
    // 批量处理
    async postBatch() {
      this.saveLoad = true
      try {
        const { data } = this
        let message = null
        for (let i = 0; i < data.length; i++) {
          const { name, startTime, endTime } = data[i]
          if (!name) {
            message = '您有新添加的时间段没有输入时间段名'
            break
          }
          if (!startTime) {
            message = '您有新添加的时间段没有选择开始时间'
            break
          }
          if (!endTime) {
            message = '您有新添加的时间段没有选择结束时间'
            break
          }
        }
        if (message) {
          this.$message.error(message)
        } else {
          await fhPostBatch({ foodPeriodForms: this.data })
          this.$message.success('保存时间段成功')
          this.dialogTableVisible = false
        }
      } catch (err) {
        console.log(err)
      }
      this.saveLoad = false
    },
    // 删除一个时间
    delOne(index) {
      this.$confirm(
        '此操作将暂时删除该时间段,点击保存后将永久删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.data.splice(index, 1)
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped>
.add {
  height: 38px;
  width: 100%;
  line-height: 38px;
  text-align: center;
  border-radius: 3px;
  margin-top: 15px;
  border: 1px dashed #cccccc;
}
.add:hover {
  color:#52ACFF;
  border: 1px dashed #52ACFF;
  cursor: pointer;
}
</style>
