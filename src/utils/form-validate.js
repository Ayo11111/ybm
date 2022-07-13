/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2020-07-27 15:20:24
 * @LastEditors: HJ
 * @LastEditTime: 2021-06-15 09:52:29
 */
import { validPhone } from '@/utils/validate'
import { Message } from 'element-ui'
export const validatorForm = (form, fn) => {
  form.validate(valid => {
    if (valid) {
      fn && fn()
    } else {
      Message.error('请检查您的输入')
    }
  })
}

export const validFormPhone = (rule, value, callback) => {
  validPhone(value) ? callback() : callback('请输入正确的手机号')
}

export const validAccount = (rule, value, callback) => {
  if (/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(value)) {
    callback()
  } else {
    callback('请输入6到16位包含数字或英文字母的账号')
  }
}
