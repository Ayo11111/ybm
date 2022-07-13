/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-09-09 10:27:52
 * @LastEditors: HJ
 * @LastEditTime: 2021-02-26 17:33:33
 */
import { validatePhoneTwo } from '@/utils/validate'

const form = [
  {
    field: 'storeName',
    errMsg: '请输入店铺名称',
    text: '店铺名称'
  },
  {
    field: 'announcement',
    errMsg: '请输入店铺公告',
    text: '店铺公告'
  },
  {
    field: 'erpStoreId',
    errMsg: '请输入收银系统ID',
    text: '收银系统ID',
    unrequired: true
  },
  {
    field: 'cascader',
    errMsg: '请选择所属城市',
    text: '所属城市'
  },
  {
    field: 'fullAddress',
    errMsg: '请输入店铺地址',
    text: '店铺地址'
  },
  {
    field: 'phone',
    errMsg: '请输入店铺热线',
    text: '店铺热线',
    rules: [
      {
        validator: validatePhoneTwo,
        trigger: 'change'
      }
    ]
  },
  {
    field: 'businessTime',
    errMsg: '请输入营业时间',
    text: '营业时间'
  },
  {
    field: 'storeManagerId',
    errMsg: '请选择店铺店长',
    text: '店铺店长'
  },
  {
    field: 'logoImage',
    errMsg: '请上传店铺头像',
    text: '店铺头像'
  },
  {
    field: 'businessLicenseImgs',
    errMsg: '请上传营业执照',
    text: '营业执照'
  },
  {
    field: 'manageLicenseImags',
    errMsg: '请上传经营许可证',
    text: '经营许可证'
  },
  {
    field: 'manageLicenseEnd',
    errMsg: '请选择经营许可证过期时间',
    text: '过期时间'
  },
  {
    field: 'quantitativeClassificationImage',
    errMsg: '请上传店铺营业执照图片',
    text: '量化分级信息',
    unrequired: true
  },
  {
    field: 'companyName',
    errMsg: '请填写店铺营业执照中的经营者名称',
    text: '经营者名称'
  },
  {
    field: 'businessAddress',
    errMsg: '请填写店铺营业执照中的经营场所',
    text: '经营场所'
  },
  {
    field: 'legalRepresentative',
    errMsg: '请填写店铺营业执照中的法定代表人',
    text: '法定代表人'
  },
  {
    field: 'licenseNumber',
    errMsg: '请填写食品经营许可证号',
    text: '食品经营许可证号'
  },
  {
    field: 'businessScope',
    errMsg: '请填写店铺营业执照中的经营项目',
    text: '经营项目'
  },
  {
    field: 'mainBusiness',
    errMsg: '请填写店铺营业执照中的主体业态',
    text: '主体业态'
  },
  {
    field: 'quantitativeClassificationEnd',
    errMsg: '请选择店铺营业执照的有效期',
    text: '有效期'
  }
]
const rule = {}
;(() => {
  form.forEach(i => {
    const { field, errMsg, rules = [], unrequired } = i
    const baseRule = unrequired
      ? []
      : [
          {
            required: true,
            message: errMsg,
            trigger: ['blur', 'change']
          }
        ]
    rule[field] = baseRule.concat(rules)
  })
})(this)

export default rule
