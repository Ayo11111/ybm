/*
 * @Descripttion: 修改为模块的作用信息
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: CJH
 * @Date: 2021-06-26 10:04:28
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-29 10:26:01
 */

const noFuture = {
  disabledDate: date => {
    const time = new Date().valueOf()
    return time < date.valueOf()
  }
}

const noOld = {
  disabledDate: date => {
    const time = new Date().valueOf()
    return time > date.valueOf()
  }
}

export const business = [
  {
    title: '营业执照'
  },
  {
    label: '营业执照',
    type: 'ossUpload',
    field: 'businessLicenseImgs',
    behavior: '上传',
    remarks:
      '<span>1.证件照片要清晰可见</span><span>2.照片不得有水印、logo和其他网站信息</span>'
  },
  {
    label: '统一社会信用代码',
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
    label: '公司名称',
    type: 'input',
    field: 'businessName',
    placeholder: '请填写公司名称'
  },
  {
    label: '经营场所/住所',
    type: 'input',
    field: 'businessAddress',
    placeholder: '请填写营业执照上的住所地址'
  },
  {
    label: '注册资本',
    type: 'input',
    placeholder: '请填写注册资本',
    field: 'registeredCapital',
    validate: false
  },
  {
    label: '注册/成立日期',
    type: 'date',
    field: 'businessCreateTime',
    placeholder: '请选择注册/成立日期',
    behavior: '选择',
    oiptions: noFuture
  },
  {
    label: '发证/登记机关',
    type: 'input',
    field: 'issuanceRegistrationAuthority',
    placeholder: '请填写营业执照右下角红章内文字信息'
  },
  {
    label: '营业执照有效期',
    type: 'radioTime',
    dateType: 'daterange',
    field: 'businessLicenseStatus',
    behavior: '选择',
    oiptions: noOld
  },
  {
    label: '核准日期',
    type: 'date',
    field: 'approvalTime',
    placeholder: '请选择核准日期',
    behavior: '选择',
    oiptions: noFuture
  },
  {
    label: '经营范围',
    type: 'textarea',
    field: 'businessScope',
    validate: false
  },
  {
    type: 'hr'
  },
  {
    title: '特许证件'
  },
  {
    label: '特许证件',
    type: 'ossUpload',
    field: 'manageLicenseImags',
    behavior: '上传',
    remarks:
      '<span>1.证件照片要清晰可见</span><span>2.照片不得有水印、logo和其他网站信息</span>',
    validate: false
  },
  {
    label: '特许证件类型',
    type: 'select',
    field: '',
    placeholder: '',
    validate: false
  },
  {
    label: '特许证件注册号',
    type: 'input',
    field: 'licenseNumber',
    placeholder: '请输入特许证件注册号',
    validate: false
  },
  {
    label: '地址',
    type: 'input',
    field: 'adrDetail',
    placeholder: '请输入地址',
    validate: false
  },
  {
    label: '特许证件有效期',
    type: 'date',
    field: 'manageLicenseEnd',
    placeholder: '请选择特许证件有效期',
    behavior: '选择',
    oiptions: noOld,
    validate: false
  },
  {
    type: 'hr'
  },
  {
    title: '食品安全量化等级图片'
  },
  {
    label: '食品安全量化等级',
    type: 'ossUpload',
    field: 'quantitativeClassificationImage',
    behavior: '上传',
    remarks:
      '<span>1.证件照片要清晰可见</span><span>2.照片不得有水印、logo和其他网站信息</span>',
    validate: false
  }
]
