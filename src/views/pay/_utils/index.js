/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-29 14:23:15
 * @LastEditors: LuoJie
 * @LastEditTime: 2022-05-09 11:11:31
 */
import { validFormPhone } from '@/utils/form-validate'
import { validatePhoneTwo, validIdCard } from '@/utils/validate.js'
export const rules = {
  licence: [{ required: true, message: '请上传图片' }],
  storeFront: [{ required: true, message: '请上传图片' }],
  inStoreScene: [{ required: true, message: '请上传图片' }],
  checkoutCounter: [{ required: true, message: '请上传图片' }],
  accountOpeningVideo: [
    {
      required: true,
      message: '请上传开户意愿视频',
      trigger: ['change', 'blur']
    }
  ],
  lic_id: [{ required: true, message: '请输入' }],
  businessLicenseNumber: [{ required: true, message: '请填写证件注册号' }],
  company: [{ required: true, message: '请填写公司名称' }],
  short_name: [{ required: true, message: '请填写公司简称' }],
  legalPerson: [{ required: true, message: '请填写经营者/法人姓名' }],
  companyAddress: [{ required: true, message: '请填写注册地址' }],
  businessStartTime: [
    { required: true, message: '请填写证件生效日期', trigger: 'blur' }
  ],
  legalIDCardFront: [
    {
      required: true,
      message: '请上传身份证人像面照片',
      trigger: ['change', 'blur']
    }
  ],
  idDocCopy: [
    {
      required: true,
      message: '请上传证件照片',
      trigger: ['change', 'blur']
    }
  ],
  legalIDCardBack: [
    {
      required: true,
      message: '请上传身份证国徽面照片',
      trigger: ['change', 'blur']
    }
  ],
  corp_name: [
    {
      required: true,
      message: '请填写身份证姓名',
      trigger: ['change', 'blur']
    }
  ],
  idDocName: [
    {
      required: true,
      message: '请填写证件姓名',
      trigger: ['change', 'blur']
    }
  ],
  corp_idcard: [
    {
      required: true,
      message: '请填写身份证号码',
      trigger: ['change', 'blur']
    },
    { validator: validIdCard, trigger: ['change', 'blur'] }
  ],
  idDocNumber: [
    {
      required: true,
      message: '请输入证件号码',
      trigger: ['change', 'blur']
    }
  ],
  idCardStartTime: [
    {
      required: true,
      message: '请填写证件失效日期',
      trigger: ['change', 'blur']
    }
  ],
  idCardEndTime: [
    {
      required: true,
      message: '请填写证件失效日期',
      trigger: ['change', 'blur']
    }
  ],
  attnIDCardFront: [
    {
      required: true,
      message: '请上传身份证人像面照片',
      trigger: ['change', 'blur']
    }
  ],
  attnIDCardBack: [
    {
      required: true,
      message: '请上传身份证国徽面照片',
      trigger: ['change', 'blur']
    }
  ],
  contact_name: [
    {
      required: true,
      message: '请填写身份证姓名',
      trigger: ['change', 'blur']
    }
  ],
  contact_idcard: [
    {
      required: true,
      message: '请填写身份证号码',
      trigger: ['change', 'blur']
    },
    { validator: validIdCard, trigger: ['change', 'blur'] }
  ],
  contactIdCardStartTime: [
    {
      required: true,
      message: '请填写证件失效日期',
      trigger: ['change', 'blur']
    }
  ],
  contactIdCardEndTime: [
    {
      required: true,
      message: '请填写证件失效日期',
      trigger: ['change', 'blur']
    }
  ],
  contact_phone: [
    {
      required: true,
      message: '请输入联系人手机号',
      trigger: ['change', 'blur']
    },
    { validator: validFormPhone, trigger: ['change', 'blur'] }
  ],
  contact_address: [
    {
      required: true,
      message: '请输入联系人通信地址',
      trigger: ['change', 'blur']
    }
  ],
  serv_phone: [
    {
      required: true,
      message: '请输入客服电话',
      trigger: ['change', 'blur']
    },
    { validator: validatePhoneTwo, trigger: ['change', 'blur'] }
  ],
  bank_account_type: [{ required: true, message: '请选择账户类型' }],
  direct_bank_type: [{ required: true, message: '请填写开户银行' }],
  open_bank_name: [{ required: true, message: '请填写开户名称' }],
  bank_branch_code: [{ required: true, message: '请填写开户银行联行号' }],
  bankName: [{ required: true, message: '请填写开户银行全称' }],
  bank_card_id: [{ required: true, message: '请填写银行账号' }],
  bank_account: [{ required: true, message: '请填写开户人' }],
  // bank_mobile: [
  //   { validator: validFormPhone, trigger: ['change', 'blur'] }
  // ],
  bank_cert_no: [
    { required: true, message: '请填写结算人身份证号' },
    { validator: validIdCard, trigger: ['change', 'blur'] }
  ]
}

export const beneficiaryRules = {
  idCardStartTime: [
    {
      required: true,
      message: '请填写证件失效日期',
      trigger: ['change', 'blur']
    }
  ],
  idCardEndTime: [
    {
      required: true,
      message: '请填写证件失效日期',
      trigger: ['change', 'blur']
    }
  ],
  shareholder_name: [
    {
      required: true,
      message: '请填写股东姓名',
      trigger: ['change', 'blur']
    }
  ],
  shareholder_id_card: [
    {
      required: true,
      message: '请输入证件号',
      trigger: ['change', 'blur']
    }
  ],
  shareholder_address: [
    {
      required: true,
      message: '请输入股东地址',
      trigger: ['change', 'blur']
    }
  ],
  shareholder_birthday: [
    {
      required: true,
      message: '请填写股东出生日期',
      trigger: ['change', 'blur']
    }
  ],
  shareholder_rate: [
    {
      required: true,
      message: '请填写股东持股比例',
      trigger: ['change', 'blur']
    }
  ],
  shareholder_nation: [
    {
      required: true,
      message: '请选择股东国籍',
      trigger: ['change', 'blur']
    }
  ],
  ahareholder_cert_type: [
    {
      required: true,
      message: '请选择证件类型',
      trigger: ['change', 'blur']
    }
  ],
  idCardTimeType: [
    {
      required: true,
      message: '请选择有效期类型',
      trigger: ['change', 'blur']
    }
  ]
}

// 进件状态枚举
export const statusEnum = {
  CHECKING: '资料校验中',
  ACCOUNT_NEED_VERIFY: '待账户验证',
  AUDITING: '审核中',
  REJECTED: '已驳回',
  NEED_SIGN: '待签约',
  FINISH: '完成',
  FROZEN: '已冻结',
  '-1': '无效',
  '0': '审核中',
  '1': '完成',
  '2': '审核不通过',
  '3': '禁用'
}

// 商户类型枚举
// export const merchantType = {
//   0: '个体工商户',
//   1: '企业用户',
//   2: '小微商户',
//   3: '其他组织'
// }
export const merchantTypeEnum = [
  {
    label: '个体工商户',
    value: 0
  },
  {
    label: '企业用户',
    value: 1
  },
  {
    label: '小微商户',
    value: 2
  },
  {
    label: '其他组织',
    value: 3
  }
]
