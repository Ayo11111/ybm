/*
 * @Descripttion: HJ
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: HJ
 * @Date: 2021-06-08 13:42:35
 * @LastEditors: HJ
 * @LastEditTime: 2021-07-22 03:51:44
 */
export const download = function(href, name) {
  const a = document.createElement('a')
  a.href = href
  if (name) {
    a.download = name // 自定义文件名
  }
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a) // 移除a元素
}

export const downloadFile = function(
  data,
  fileName,
  suffix = 'xlsx',
  type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
) {
  const blob = new Blob([data], {
    type
  })
  const name = `${fileName}.${suffix}`
  const href = window.URL.createObjectURL(blob) // 创建链接对象
  download(href, name)
  window.URL.revokeObjectURL(href) // 移除链接对象
}

export const downloadIamge = function(imgsrc, name) {
  const image = new Image()
  // 解决跨域 Canvas 污染问题
  image.setAttribute('crossOrigin', 'anonymous')
  image.onload = function() {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    context.drawImage(image, 0, 0, image.width, image.height)
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a') // 生成一个a元素
    const event = new MouseEvent('click') // 创建一个单击事件
    a.download = name || 'photo' // 设置图片名称
    a.href = url // 将生成的URL设置为a.href属性
    a.dispatchEvent(event) // 触发a的单击事件
  }
  image.src = imgsrc
}
