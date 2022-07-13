<!--
 * @Descripttion: 注册的第三步
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-16 10:50:23
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-12 13:47:03
-->
<template>
  <div class="_tip_box">
    <el-form
      ref="step3"
      :rules="formRules"
      size="small"
      label-width="100px"
      :model="formData"
    >
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-form-item label="合作医院" prop="hospital">
            <div style="display: flex">
              <el-cascader
                v-model="city"
                :options="options"
                @change="handleChange"
                :disabled="disabled"
              ></el-cascader>
            </div>
          </el-form-item>
          <el-form-item label="合作协议">
            <a
              href="https://top50-dev.oss-cn-shenzhen.aliyuncs.com/ybm/register/%E5%8C%BB%E4%BE%BF%E6%B0%91%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E5%95%86%E6%88%B7%E5%90%88%E4%BD%9C%E5%8D%8F%E8%AE%AE.docx"
              >医便民服务平台商户合作协议.pdf</a
            >
            <el-button style="margin-left: 15px" @click="download"
              >下载</el-button
            >
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import FilterSelect from '@/components/FilterSelect'
import { fhGetHospitalAddress } from '@/api/hospital'
export default {
  name: 'Step3',
  components: {
    FilterSelect
  },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    var validateHospital = (rule, value, callback) => {
      if (this.city.length === 0) {
        callback(new Error('请选择合作医院'))
      } else {
        callback()
      }
    }

    const formRules = {
      hospital: [
        {
          validator: validateHospital,
          trigger: 'blur'
        }
      ]
    }
    const formData = {}
    return {
      formData,
      formRules,
      city: [],
      options: [],
      hospitalIdJson: {},
      hospitalAddr: {},
      ti: null
    }
  },
  watch: {
    data(newVal) {
      this.$nextTick(() => {
        if (this.ti) {
          clearTimeout(this.ti)
        }
        this.ti = setTimeout(() => {
          const { hospitalName } = newVal
          if (hospitalName) {
            this.city = this.hospitalAddr[hospitalName]
          }
          this.formData = newVal
        }, 2000)
      })
    }
  },
  created() {
    this.getHospitalAddress()
  },
  methods: {
    async getHospitalAddress() {
      try {
        const { results } = await fhGetHospitalAddress()
        let data = []
        for (let i = 0; i < results.length; i++) {
          const { province, cityList } = results[i]
          let city_children = []
          for (let c = 0; c < cityList.length; c++) {
            const { city, areaList } = cityList[c]
            let area_children = []
            for (let q = 0; q < areaList.length; q++) {
              const { area, hospitalList } = areaList[q]
              let hospital_children = []
              for (let t = 0; t < hospitalList.length; t++) {
                const { id, hospitalName, province, city, area } = hospitalList[
                  t
                ]
                hospital_children.push({
                  value: hospitalName,
                  label: hospitalName
                })
                this.hospitalIdJson[hospitalName] = id
                this.hospitalAddr[hospitalName] = [
                  province,
                  city,
                  area,
                  hospitalName
                ]
              }
              area_children.push({
                value: area,
                label: area,
                children: hospital_children
              })
            }
            city_children.push({
              value: city,
              label: city,
              children: area_children
            })
          }
          data.push({
            value: province,
            label: province,
            children: city_children
          })
        }
        this.options = data
      } catch (err) {
        console.log(err)
      }
    },
    handleChange(v) {
      console.log(v)
      let hospitalName = v[v.length - 1]
      let hospitalId = this.hospitalIdJson[hospitalName]
      this.formData = Object.assign(this.formData, {
        hospitalId,
        hospitalName
      })
    },
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs.step3.validate(valid => {
          if (valid) {
            resolve(this.formData)
          } else {
            reject('')
          }
        })
      })
    },
    download() {
      const a = document.createElement('a')
      a.href =
        'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/ybm/register/%E5%8C%BB%E4%BE%BF%E6%B0%91%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%E5%95%86%E6%88%B7%E5%90%88%E4%BD%9C%E5%8D%8F%E8%AE%AE.docx'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a) // 移除a元素
    }
  }
}
</script>

<style lang="scss" scoped>
._tip_box::v-deep .ant-tag {
  color: #000;
  border: 1px solid rgba(145, 213, 255, 1);
}

._tip_box::v-deep .anticon {
  color: #0e77d1;
}
</style>
