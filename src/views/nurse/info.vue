<!--
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-12 11:50:47
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-16 18:24:25
-->
<template>
  <div v-loading="loading" class="container">
    <el-form
      ref="form"
      label-width="10em"
      :model="form"
      :rules="nurseRules"
      style="width: 40em"
    >
      <el-form-item
        v-if="form.auditStatus === false"
        label="审核结果"
        prop="auditOpinion"
      >
        <FilterSelect
          :data="auditStatus"
          :value.sync="form.auditStatus"
          vv="value"
          vl="label"
          vk="label"
          disabled
        />
      </el-form-item>
      <el-form-item
        v-if="form.auditStatus === false"
        label="审核意见"
        prop="auditOpinion"
      >
        <el-input
          v-model="form.auditOpinion"
          type="textarea"
          placeholder="请输入审核意见"
          disabled
        />
      </el-form-item>
      <el-form-item label="护工姓名" prop="name">
        <el-input v-model="form.name" placeholder="请输入护工姓名" />
      </el-form-item>
      <el-form-item label="护工手机号" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入护工手机号" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <filter-select
          :data="sex"
          vl="label"
          vk="label"
          vv="value"
          class="w100"
          :value.sync="form.sex"
        />
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="form.birthday"
          value-format="yyyy-MM-dd"
          class="w100"
          placeholder="请选择出生日期"
          :picker-options="pickerOptions"
        />
      </el-form-item>
      <el-form-item label="护理等级" prop="nurseLevel">
        <filter-select
          :data="levels"
          vl="label"
          vk="label"
          vv="value"
          class="w100"
          :value.sync="form.nurseLevel"
        />
      </el-form-item>
      <el-form-item label="护理年限" prop="nursingYears">
        <div class="w100" style="white-space: nowrap">
          <el-input-number
            v-model="form.nursingYears"
            class="mr-12 w100"
            :controls="false"
            placeholder="请输入护理年限"
          />
          <span>年</span>
        </div>
      </el-form-item>
      <el-form-item label="专职科室">
        <filter-select
          :data="dictionaries"
          vl="optionContent"
          vk="optionContent"
          vv="optionContent"
          class="w100"
          :value.sync="form.sickroom"
        />
      </el-form-item>
      <el-form-item label="护工照片" prop="photo">
        <oss-upload
          v-model="form.photo"
          :files="computedImage(form.photo)"
          :path="ossPath"
          :limit="1"
          @change="uploadSuccess($event, 'photo')"
        />
      </el-form-item>
      <el-form-item label="身份证号码" prop="identityCardNumber">
        <el-input
          v-model="form.identityCardNumber"
          placeholder="请输入身份证号码"
        />
      </el-form-item>
      <el-form-item label="身份证正面照片" prop="identityCardFace">
        <oss-upload
          v-model="form.identityCardFace"
          :files="computedImage(form.identityCardFace)"
          :path="ossPath"
          :limit="1"
          @change="uploadSuccess($event, 'identityCardFace')"
        />
      </el-form-item>
      <el-form-item label="身份证反面照片" prop="identityCardNationalEmblem">
        <oss-upload
          v-model="form.identityCardNationalEmblem"
          :files="computedImage(form.identityCardNationalEmblem)"
          :path="ossPath"
          :limit="1"
          @change="uploadSuccess($event, 'identityCardNationalEmblem')"
        />
      </el-form-item>
      <el-form-item label="个人介绍" prop="introduction">
        <el-input
          v-model="form.introduction"
          type="textarea"
          placeholder="请输入个人介绍"
        />
      </el-form-item>
      <el-form-item label="护理单价" prop="price">
        <div class="w100" style="white-space: nowrap">
          <el-input-number
            v-model="form.price"
            class="mr-12 w100"
            :controls="false"
            placeholder="请输入护理单价"
          />
          <span>元/天</span>
        </div>
      </el-form-item>
      <!-- <el-form-item
        v-if="[1, 2].includes(form.status)"
        label="审核结果"
        prop="auditStatus"
      >
        <filter-select
          :data="auditStatus"
          vl="label"
          vk="label"
          vv="value"
          class="w100"
          :value.sync="form.auditStatus"
        />
      </el-form-item> -->
      <el-form-item>
        <router-link :to="{ name: 'NurseList' }" class="mr-12">
          <el-button>取消</el-button>
        </router-link>
        <el-button type="primary" :loading="saveLoad" @click="verifyForm">
          保存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import FilterSelect from '@/components/FilterSelect'
import OssUpload from '@/components/OssUpload'
import { fhGetDictionariesDetails } from '@/api/dictionaries'
import { options, nurseRules, auditStatus } from './_utils'
import { getMerchantManagerType } from '@/utils/auth'
import {
  fhCreateNurse,
  fhGetNurse,
  fhAuditNurse,
  fhEditNurse,
  fhGetAuditNurseDetails,
  fhPutAuditNurseDetails
} from '@/api/nurse'
export default {
  name: 'NurseInfo',
  components: {
    FilterSelect,
    OssUpload
  },
  data() {
    return {
      loading: false,
      saveLoad: false,
      form: {},
      audit: '',
      nurseRules,
      auditStatus,
      // ossPath
      ossPath: 'merchant',
      ...options,
      pickerOptions: {
        disabledDate: time => {
          const minTime = new Date()
          return time.getTime() > minTime
        }
      },
      merchantManagerType: '',
      dictionaries: []
    }
  },
  computed: {
    ...mapGetters(['merchantInfo'])
  },
  watch: {
    merchantInfo: {
      handler(info) {
        const { merchantId, storeId } = info || {}
        this.ossPath = `merchant/${merchantId}/${storeId}/nurse`
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    const { query } = this.$route
    const { nurseId = null, audit = '' } = query
    this.nurseId = nurseId
    this.audit = audit
    if (nurseId) {
      this.$route.meta.title = '护工详情'
    } else {
      this.$route.meta.title = '新建护工'
    }
    this.getDictionariesDetails('full_time_department')
  },
  mounted() {
    if (this.nurseId) {
      this.getNurse()
    }
  },
  methods: {
    async getManagerType() {
      try {
        const results = await getMerchantManagerType()
      } catch (err) {
        console.log(err)
      }
    },
    // 上传成功
    uploadSuccess(file, key) {
      const { src } = file
      this.form[key] = src || null
      this.$nextTick(() => {
        const form = this.$refs.form
        src ? form.clearValidate(key) : form.validateField(key)
      })
    },
    // 获取护工详情
    async getNurse() {
      this.loading = true
      try {
        const { results } = this.audit
          ? await fhGetAuditNurseDetails(this.nurseId)
          : await fhGetNurse(this.nurseId)
        this.form = results
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 校验数据
    async verifyForm() {
      const { status = null } = this.form
      if (this.form.photo.length > 250) {
        this.$message.warning('上传的护工照片的名字过长，请重新命名，名字长度不应超过100个字符')
        return
      }
      if (this.form.identityCardFace.length > 250) {
        this.$message.warning('上传的身份证正面照片的名字过长，请重新命名，名字长度不应超过100个字符')
        return
      }
      if (this.form.identityCardNationalEmblem.length > 250) {
        this.$message.warning('上传的身份证反面照片的名字过长，请重新命名，名字长度不应超过100个字符')
        return
      }
      try {
        await this.$refs.form.validate()
        this.nurseId
          ? status === 1
            ? this.auditNurse()
            : this.editNurse()
          : this.createNurse()
      } catch (e) {
        // console.error('debug e', e)
      }
    },
    // 创建护工
    async createNurse() {
      this.loading = true
      try {
        await fhCreateNurse(this.form)
        this.$message.success('创建护工成功')
        this.$router.go(-1)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 审核入驻的护工
    async auditNurse() {
      this.loading = true
      try {
        await fhAuditNurse(this.nurseId, this.form)
        this.$message.success('审核成功')
        this.$router.go(-1)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.loading = false
    },
    // 修改护工
    async editNurse() {
      this.saveLoad = true
      try {
        this.audit
          ? await fhPutAuditNurseDetails(this.nurseId, this.form)
          : await fhEditNurse(this.nurseId, this.form)
        this.$message.success('平台审核后即编辑护工信息成功')
        this.$router.go(-1)
      } catch (e) {
        console.log('debug axios', e)
      }
      this.saveLoad = false
    },
    // 护工图片
    computedImage(url) {
      return url
        ? [
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url
          }
        ]
        : []
    },
    async getDictionariesDetails(type) {
      try {
        const { results } = await fhGetDictionariesDetails(type)
        this.dictionaries = results.optionContents
        this.dictionaries.unshift({ optionContent: '无专职科室' })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.w100 {
  width: 100%;
}
::v-deep .el-input-number.is-without-controls .el-input__inner {
  text-align: left;
}
</style>
