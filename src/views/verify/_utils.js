/*
 * @Descripttion: HJ
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-14 15:57:52
 * @LastEditors: HJ
 * @LastEditTime: 2021-04-25 17:18:28
 */
import { validPhone, validatePhoneTwo } from '@/utils/validate'
import wxCates from '@/utils/wx-cates'
const validPhoneFn = (rule, value, callback) => {
  if (!validPhone(value)) {
    callback(new Error('请输入正确的手机号码'))
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

export const form = [
  {
    label: '商家名称:',
    type: 'input',
    field: 'name',
    edit: false
  },
  {
    label: '品牌:',
    type: 'input',
    field: 'brandName',
    edit: false
  },
  {
    label: '经营年限:',
    type: 'number',
    field: 'doingYears',
    valid: 'number',
    edit: true,
    rules: { type: 'integer', required: true, message: '请输入数字' }
  },
  {
    label: '商家热线:',
    type: 'input',
    field: 'hotLine',
    edit: true,
    rules: {
      validator: validatePhoneTwo,
      message: '请输入正确的手机号码、固话号码、虚拟号码，例如：137XXXXXXXXX；0752-XXXXXXX；400X-XXX-XXX'
    }
  },
  {
    label: '省/市/区:',
    key: 'region',
    type: 'cascader',
    field: 'regionRaw',
    edit: true
  },
  {
    label: '详细地址:',
    type: 'input',
    field: 'adrDetail',
    edit: true
  },
  {
    label: '商家简介:',
    type: 'textarea',
    field: 'introduction',
    auto: { minRows: 4 },
    rows: '4',
    maxlength: 200,
    placeholder: '不能超过200个字符',
    span: 24,
    edit: true
  },
  {
    label: '联系人:',
    type: 'input',
    field: 'principal',
    edit: true
  },
  {
    label: '联系方式:',
    type: 'input',
    field: 'principalMobile',
    rules: {
      validator: validPhoneFn,
      required: true,
      trigger: 'change'
    },
    edit: true
  },
  {
    label: '商家主分类:',
    type: 'input', // select
    field: 'mainCates',
    options: categories,
    edit: false
  },
  {
    label: '商家辅分类:',
    type: 'input',
    field: 'auxCates',
    options: categories,
    edit: false,
    unRequired: true
  },
  {
    label: '标准分类:',
    key: 'standardCategory',
    type: 'input',
    field: 'standardCategory',
    props: {
      value: 'label'
    },
    options: wxCates,
    edit: false
  },
  {
    label: '法定代表人:',
    type: 'input',
    field: 'legalRep',
    span: 24,
    edit: false
  },
  {
    label: '营业执照:',
    type: 'upload',
    field: 'businessImg',
    remarks: '请上传证件清晰彩色原件扫描件或数码拍摄照片大小不超过2M；格式为png、jpg；建议上传尺寸 644* 436',
    limitSize: 2
  },
  {
    label: '经营许可证:',
    type: 'upload',
    field: 'manageImg',
    remarks: '请上传证件清晰彩色原件扫描件或数码拍摄照片大小不超过2M；格式为png、jpg；建议上传尺寸 644* 436',
    limitSize: 2
  },
  {
    label: '有效期:',
    type: 'time',
    field: 'businessDate'
  },
  {
    label: '有效期:',
    type: 'time',
    field: 'manageDate'
  },
  {
    label: '商家logo:',
    type: 'upload',
    field: 'logoUrl',
    remarks: '请上传图片,大小不超过500k；格式为png、jpg；建议尺寸 120 * 120',
    span: 24,
    limitSize: 0.5
  }
]

export const ossImgs = (url, name) => {
  return url
    ? [
      {
        uid: '-1',
        name: `${name}`,
        status: 'done',
        url
      }
    ]
    : null
}
