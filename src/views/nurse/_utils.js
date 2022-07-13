/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-12 10:55:18
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-09 16:19:02
 */
// import

import { validIdCard } from '@/utils/validate'
import { validFormPhone } from '@/utils/form-validate'
import { fhCreateNurse } from '@/api/nurse'

// 下拉选项
export const options = {
  // 性别
  sex: [
    {
      label: '男',
      value: 1
    },
    {
      label: '女',
      value: 2
    }
  ],
  // 护工等级
  levels: [
    {
      label: '普通护理员',
      value: 1
    },
    {
      label: '高级护理员',
      value: 2
    }
  ],
  // 服务状态
  status: [
    {
      label: '全部',
      value: null
    },
    {
      label: '未审核',
      value: 1
    },
    {
      label: '审核未通过',
      value: 2
    },
    {
      label: '空闲',
      value: 3
    },
    {
      label: '服务中',
      value: 4
    }
  ],
  // 审核意见
  auditStatus: [
    {
      label: '同意',
      value: true
    },
    {
      label: '拒绝',
      value: false
    }
  ],
  // 审核状态
  auditResults: {
    null: '待审核',
    true: '已通过',
    false: '未通过'
  }
}

// 护工状态枚举
export const nurseStatusEnum = new Map(
  options.status.map(i => (i.value ? [i.value, i.label] : []))
)
// 护工等级枚举
export const nurseLevelEnum = new Map(
  options.levels.map(i => [i.value, i.label])
)

// 护工表单的校验规则
export const nurseRules = {
  name: [
    { required: true, message: '请输入护工姓名', trigger: ['blur', 'change'] }
  ],
  phone: [
    {
      required: true,
      message: '请输入护工手机号',
      trigger: ['blur', 'change']
    },
    { validator: validFormPhone, trigger: ['blur', 'change'] }
  ],
  sex: [{ required: true, message: '请选择性别', trigger: ['blur', 'change'] }],
  birthday: [
    { required: true, message: '请输入出生日期', trigger: ['blur', 'change'] }
  ],
  nurseLevel: [
    { required: true, message: '请选择护理等级', trigger: ['blur', 'change'] }
  ],
  nursingYears: [
    { required: true, message: '请输入护理年限', trigger: ['blur', 'change'] }
  ],
  photo: [
    { required: true, message: '请上传护工照片', trigger: ['blur', 'change'] }
  ],
  // sickroom: [
  //   { required: true, message: '请选择专职科室', trigger: ['blur', 'change'] }
  // ],
  identityCardNumber: [
    {
      required: true,
      message: '请输入身份证号码',
      trigger: ['blur', 'change']
    },
    { validator: validIdCard, trigger: ['blur', 'change'] }
  ],
  identityCardFace: [
    {
      required: true,
      message: '请上传身份证正面照片',
      trigger: ['blur', 'change']
    }
  ],
  identityCardNationalEmblem: [
    {
      required: true,
      message: '请上传身份证反面照片',
      trigger: ['blur', 'change']
    }
  ],
  introduction: [
    { required: true, message: '请输入个人介绍', trigger: ['blur', 'change'] }
  ],
  price: [
    { required: true, message: '请输入护理单价', trigger: ['blur', 'change'] }
  ],
  auditStatus: [
    { required: true, message: '请选择审核结果', trigger: ['blur', 'change'] }
  ],
  auditOpinion: [
    { required: true, message: '请输入审核意见', trigger: ['blur', 'change'] }
  ]
}

// 批量创建护工
export const batchCreateNurse = count => {
  const random = number => Math.floor(Math.random() * number)
  for (let i = 0; i < count; i++) {
    const data = {
      nursingYears: random(10),
      price: random(100),
      name: `测试护工-${random(10)}`,
      phone: '15521062142',
      sex: 1,
      birthday: '2017-06-13',
      nurseLevel: 1,
      photo:
        'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/ybm/merchant/08062021186064/43/nurse/vc-upload-1623726628475-6_1.png',
      identityCardNumber: '421127199602143515',
      identityCardFace:
        'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/ybm/merchant/08062021186064/43/nurse/vc-upload-1623726628475-8_1.png',
      identityCardNationalEmblem:
        'https://top50-dev.oss-cn-shenzhen.aliyuncs.com/ybm/merchant/08062021186064/43/nurse/vc-upload-1623726628475-10_1.png',
      introduction: '1',
      auditStatus: true,
      auditOpinion: '这不是审核'
    }
    fhCreateNurse(data)
  }
}
window.batchCreateNurse = batchCreateNurse
