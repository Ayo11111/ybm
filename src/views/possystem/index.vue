<template>
  <div v-loading="loadingDetail" class="container">
    <div class="status">
      开启收银系统：
      <a-switch
        :checked="openStatus"
        checked-children="开"
        un-checked-children="关"
        :loading="loadingStatus"
        @change="changeStatus"
      />
    </div>
    <div v-show="openStatus" class="set">
      <el-form
        ref="form"
        v-loading="loadingSave"
        :model="formData"
        :rules="rules"
        label-suffix=":"
        label-width="9em"
      >
        <el-form-item label="收银系统" prop="name">
          <span v-if="editOrSave === 'edit'">{{ alias }}</span>
          <filter-select
            v-else
            :data.sync="selectOptions"
            :value.sync="formData.name"
            vk="name"
            vl="alias"
            vv="name"
            style="width: 50%"
            @change="selectName"
          />
        </el-form-item>
        <el-form-item
          v-for="(i, k) in erpFormConfig"
          :key="k"
          :prop="i.field"
          :label="i.label"
        >
          <a
            v-if="editOrSave === 'edit' && i.field === 'domain'"
            :href="formData[i.field]"
          >
            {{ formData[i.field] }}
          </a>
          <span v-else-if="editOrSave === 'edit'">{{ formData[i.field] }}</span>
          <el-input
            v-else
            v-model="formData[i.field]"
            :placeholder="`请输入${i.label}`"
          />
        </el-form-item>
      </el-form>
      <el-divider />
      <template v-if="editOrSave === 'save'">
        <el-button type="primary" :loading="loadingSave" @click="submit">
          保存
        </el-button>
        <el-button @click="getDetail">取消</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="editOrSave = 'save'">
          修改配置
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import FilterSelect from '@/components/FilterSelect'
import { fhGetPos, fhSetPos, fhSetPosStatus } from '@/api/possystem'
export default {
  components: {
    FilterSelect
  },
  data() {
    return {
      selectOptions: [],
      sendData: [],
      loadingDetail: false,
      alias: '',
      loadingSave: false,
      loadingStatus: false,
      openStatus: true,
      editOrSave: 'save',
      formData: {},
      rules: {
        name: [
          { required: true, message: '请选择', trigger: ['blur', 'change'] }
        ],
        developerId: [
          { required: true, message: '请填写', trigger: ['blur', 'change'] }
        ],
        secret: [
          { required: true, message: '请填写', trigger: ['blur', 'change'] }
        ],
        domain: [
          { required: true, message: '请填写', trigger: ['blur', 'change'] }
        ]
      },
      // 当前用户选中的收银系统的配置
      erpFormConfig: {}
    }
  },
  watch: {},
  mounted() {
    window.app = this
    this.getDetail()
  },
  methods: {
    selectName(v) {
      const { forms = {} } = v || {}
      this.erpFormConfig = forms
      const arr = this.sendData.find(el => el.name === v.name)
      const { name, secret, developerId, selectStatus, domain } = arr
      this.formData = { name, secret, developerId, selectStatus, domain }
    },
    async getDetail() {
      this.$refs.form.clearValidate()
      this.loadingDetail = true
      try {
        const {
          results: { openStatus, merchantDeveloperRspList }
        } = await fhGetPos()
        this.openStatus = openStatus
        this.sendData = this.selectOptions = merchantDeveloperRspList
        let [target] = merchantDeveloperRspList.filter(el => el.selectStatus)
        target = target || {}

        const {
          alias = '',
          name = '',
          secret = '',
          developerId = '',
          selectStatus = false,
          domain = '',
          forms
        } = target
        this.alias = alias
        this.erpFormConfig = forms

        const formData = {
          name,
          secret,
          developerId,
          selectStatus,
          domain
        }

        this.formData = target ? formData : {}

        this.editOrSave = this.sendData.every(el => {
          return el.secret === null && el.secret === null
        })
          ? 'save'
          : 'edit'
      } catch (e) {
        console.log(e)
      }
      this.loadingDetail = false
    },
    changeStatus(e) {
      this.$confirm(`确定要${e ? '开启' : '关闭'}收银系统吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.postStatus(e)
      })
    },
    async postStatus(e) {
      this.loadingStatus = true
      try {
        await fhSetPosStatus({ openStatus: e })
        this.$message.success(`成功${e ? '开启' : '关闭'}收银系统`)
        this.openStatus = e
      } catch (e) {
        console.log(e)
      }
      this.loadingStatus = false
    },
    async setting(loading, type) {
      this.$confirm(
        `从 ${this.alias} 同步的菜品将全部被下架！确定要更新收银系统信息吗`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        this[loading] = true
        const sendData = {
          merchantDeveloperReqList: this.sendData,
          openStatus: this.openStatus
        }

        try {
          await fhSetPos(sendData)
          this.$message.success(`${type === 'save' ? '保存' : '编辑'}成功`)
        } catch (e) {
          console.log(e)
        }
        this[loading] = false
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { name, developerId, secret, domain } = this.formData
          this.sendData.forEach(el => {
            if (el.name === name) {
              el.selectStatus = true
              el.developerId = developerId
              el.secret = secret
              el.domain = domain
              el.selectStatus = true
            } else {
              el.selectStatus = false
            }
          })
          this.setting('loadingSave', 'save')
        } else {
          this.$message.error('请填写完整')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #eee;
  padding: 0;
  > div {
    background: #fff;
    padding: 20px;
  }
  .status {
    margin-bottom: 20px;
  }
}
</style>
