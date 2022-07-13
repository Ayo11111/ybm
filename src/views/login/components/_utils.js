/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 15:57:52
 * @LastEditors: CJH
 * @LastEditTime: 2021-07-06 10:10:49
 */
import { validPhone, validatePhoneTwo, validEmail } from '@/utils/validate'
// import wxCates from '@/utils/wx-cates'
const validPhoneFn = (rule, value, callback) => {
  if (!validPhone(value)) {
    callback(new Error('请输入正确的手机号码'))
  } else {
    callback()
  }
}
const validEmailFn = (rule, value, callback) => {
  if (!validEmail(value)) {
    callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}
const validPswLn = (rule, value, callback) => {
  if (value.length < 6 || value.length > 16) {
    callback(new Error('请输入长度为6到16位的密码'))
  } else {
    callback()
  }
}

// 分类
const categories = [
  {
    label: '盖浇饭',
    id: 0
  },
  {
    label: '汉堡',
    id: 1
  },
  {
    label: '米粉面馆',
    id: 2
  },
  {
    label: '麻辣烫',
    id: 3
  },
  {
    label: '包子粥店',
    id: 4
  },
  {
    label: '生煎锅贴',
    id: 5
  },
  {
    label: '饺子馄饨',
    id: 6
  },
  {
    label: '香锅砂锅',
    id: 7
  },
  {
    label: '简餐',
    id: 8
  },
  {
    label: '烧腊饭',
    id: 9
  },
  {
    label: '烧腊饭',
    id: 10
  },
  {
    label: '黄焖鸡米饭',
    id: 11
  },
  {
    label: '咖喱饭',
    id: 12
  },
  {
    label: '煲仔饭',
    id: 13
  },
  {
    label: '川湘菜',
    id: 14
  },
  {
    label: '粤菜',
    id: 15
  },
  {
    label: '东北菜',
    id: 16
  },
  {
    label: '云南菜',
    id: 17
  },
  {
    label: '江浙菜',
    id: 18
  },
  {
    label: '西北菜',
    id: 19
  },
  {
    label: '鲁菜',
    id: 20
  },
  {
    label: '新疆菜',
    id: 21
  },
  {
    label: '火锅烤鱼',
    id: 22
  },
  {
    label: '海鲜',
    id: 23
  },
  {
    label: '其他菜系',
    id: 24
  },
  {
    label: '烧烤',
    id: 25
  },
  {
    label: '炸鸡炸串',
    id: 26
  },
  {
    label: '鸭脖卤味',
    id: 27
  },
  {
    label: '小龙虾',
    id: 28
  },
  {
    label: '地方小吃',
    id: 29
  },
  {
    label: '零食',
    id: 30
  },
  {
    label: '奶茶果汁',
    id: 31
  },
  {
    label: '甜品',
    id: 32
  },
  {
    label: '咖啡',
    id: 33
  },
  {
    label: '水果',
    id: 34
  },
  {
    label: '蔬菜豆品',
    id: 35
  },
  {
    label: '肉禽蛋品',
    id: 36
  },
  {
    label: '海鲜水产',
    id: 37
  },
  {
    label: '蛋糕',
    id: 38
  },
  {
    label: '面包',
    id: 39
  }
]

const imgValid = file =>
  new Promise((resolve, reject) => {
    const { size } = file
    if (size > 1024) reject({ message: '当前选中的文件过大' })
    else resolve(false)
  })

const pickerOptions = {
  disabledDate: date => {
    const time = new Date().valueOf()
    return time > date.valueOf()
  }
}

export const form = [
  {
    label: '店铺类型',
    type: 'select',
    field: 'merchantManagerType'
  },
  {
    label: '主营品类',
    type: 'select',
    field: 'mainCates'
  },
  {
    label: '辅营品类(选填)',
    type: 'select',
    field: 'auxCates'
  },
  {
    label: '店铺名称',
    key: 'name',
    type: 'input',
    field: 'name',
    placeholder: '请输入店铺名称'
  },
  {
    label: '店铺区域',
    key: 'districtArr',
    type: 'cascader',
    field: 'districtArr'
  },
  {
    label: '店铺地址',
    key: 'adrDetail',
    type: 'inputAdr',
    field: 'adrDetail',
    placeholder: '请填写店铺地址'
  },
  {
    label: '门脸图',
    type: 'upload',
    field: 'environmentImages',
    limitSize: 2,
    remarks: '图片大小不超过2M；格式为png、jpg；建议尺寸 644 * 436'
  },
  {
    label: '店铺logo',
    type: 'upload',
    field: 'logoUrl',
    limitSize: 2,
    remarks: '图片不得大于2MB，格式JPG/PNG，宽高比4:3，尺寸不小于320*240像素'
  },
  {
    label: '店铺联系人',
    key: 'principal',
    type: 'input',
    field: 'principal',
    placeholder: '请输入联系人名称'
  },
  {
    label: '联系电话',
    key: 'principalMobile',
    type: 'input',
    field: 'principalMobile',
    placeholder: '请输入联系人手机号,便于后续平台与您联系'
  }
]

export const step2Form = [
  {
    label: '法人姓名',
    type: 'input',
    field: 'legalRep',
    span: 24
  },
  {
    label: '法人身份证正面照',
    type: 'upload',
    field: 'idCardCopy',
    limitSize: 2,
    remarks: '请上传证件清晰原件扫描件或拍摄照片,大小不超过2M；格式为png、jpg；'
  },
  {
    label: '法人身份证反面照',
    type: 'upload',
    field: 'idCardNational',
    limitSize: 2,
    remarks: '请上传证件清晰原件扫描件或拍摄照片,大小不超过2M；格式为png、jpg'
  }
]

export const step3Form = [
  {
    label: '营业执照电子照',
    type: 'upload',
    field: 'businessImg',
    limitSize: 2,
    remarks: '请上传证件清晰原件扫描件或拍摄照片,大小不超过2M；格式为png、jpg；'
  },
  {
    label: '营业执照名称',
    type: 'input',
    field: 'businessName',
    placeholder: '请填写营业执照上的名称'
  },
  {
    label: '注册号/统一社会信用代码',
    type: 'input',
    field: 'businessLicenseNumber',
    placeholder: '请填写营业执照上的注册号'
  },
  {
    label: '法定代表人/经营者',
    type: 'input',
    field: 'managerName',
    placeholder: '请填写店铺法定代表人真实姓名'
  },
  {
    label: '经营场所/住所',
    type: 'input',
    field: 'businessAddress',
    placeholder: '请填写营业执照上的住所地址'
  },
  {
    label: '营业执照有效期',
    type: 'radioTime',
    dateType: 'daterange',
    pickerOptions,
    field: 'businessLicenseStatus'
  },
  {
    label: '注册/成立时间',
    type: 'time',
    dateType: 'date',
    pickerOptions,
    field: 'businessCreateTime',
    oiptions: {
      disabledDate: date => {
        const time = new Date().valueOf()
        return time < date.valueOf()
      }
    }
  },
  {
    label: '发证/登记机关',
    type: 'input',
    field: 'issuanceRegistrationAuthority',
    placeholder: '请填写营业执照右下角红章内文字信息'
  },
  {
    label: '核准日期',
    type: 'time',
    field: 'approvalTime',
    placeholder: '请输入核准日期',
    oiptions: {
      disabledDate: date => {
        const time = new Date().valueOf()
        return time < date.valueOf()
      }
    }
  }
]
