/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-25 16:03:40
 * @LastEditors: DXY
 * @LastEditTime: 2020-10-09 11:46:53
 */
// region: 'oss-cn-beijing',
// accessKeyId: 'LTAI4FgdMgX7AZ9FCAynxguU',
// accessKeySecret: 'NAVKasLiXaYyCyw4EgQtLX2ybWjG2W',
// bucket: 'main-test'
import DB from './indexLib'

const OSS = require('ali-oss')
const client = new OSS({
  region: 'oss-cn-shenzhen',
  accessKeyId: 'LTAI4FqC3vDNm6wfZsjNhXBK',
  accessKeySecret: 'Y3rBsXOe9cFciohV6xFYJGktrpsmCN',
  bucket: 'top50-dev'
  // region: 'oss-cn-beijing',
  // accessKeyId: 'LTAI4FgdMgX7AZ9FCAynxguU',
  // accessKeySecret: 'NAVKasLiXaYyCyw4EgQtLX2ybWjG2W',
  // bucket: 'main-test'
})

const progress = (p, _checkpoint) => {
  console.log({ p })
  console.log(_checkpoint)
  if (_checkpoint) {
    DB.saveCat({ id: 1, checkpoint: _checkpoint, file: _checkpoint.file, name: _checkpoint.name })
  }
}
// 开始分片上传。
async function multipartUpload(name, file, checkpoint = null) {
  console.log('after', file)
  try {
    const result = await client.multipartUpload(name, file, {
      progress,
      checkpoint,
      meta: {
        year: 2020,
        people: 'test'
      }
    })
    console.log(result)
    const head = await client.head(name)
    console.log({ head })
    DB.deleteCat(1)
    return Promise.resolve({ status: 'success', code: 200, result: result })
  } catch (e) {
    // 捕获超时异常。
    if (e.code === 'ConnectionTimeoutError') {
      console.log('TimeoutError')
      // do ConnectionTimeoutError operation
    }
    console.log(e)
    return Promise.reject(e)
  }
}

export default multipartUpload
