/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-27 13:57:16
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-27 14:58:40
 */
const DB_NAME = 'FileDb'
const DB_VERSION = 1
let DB

export default {
  // 打开db
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) { return resolve(DB) }
      console.log('OPENING DB', DB)
      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = e => {
        console.log('Error opening db', e)
        reject('Error')
      }

      request.onsuccess = e => {
        DB = e.target.result
        resolve(DB)
      }

      request.onupgradeneeded = e => {
        console.log('onupgradeneeded')
        const db = e.target.result
        db.createObjectStore('files', { autoIncrement: true, keyPath: 'id' })
      }
    })
  },
  // 删除数据
  async deleteCat(file) {
    const db = await this.getDb()

    return new Promise(resolve => {
      const trans = db.transaction(['files'], 'readwrite')
      trans.oncomplete = () => {
        resolve()
      }

      const store = trans.objectStore('files')
      store.delete(file)
    })
  },
  // 获取
  async getCats() {
    const db = await this.getDb()

    return new Promise(resolve => {
      const trans = db.transaction(['files'], 'readonly')
      trans.oncomplete = () => {
        resolve(files)
      }

      const store = trans.objectStore('files')
      const files = []

      store.openCursor().onsuccess = e => {
        const cursor = e.target.result
        if (cursor) {
          files.push(cursor.value)
          cursor.continue()
        }
      }
    })
  },

  async saveCat(files) {
    const db = await this.getDb()

    return new Promise(resolve => {
      const trans = db.transaction(['files'], 'readwrite')
      trans.oncomplete = () => {
        resolve()
      }

      const store = trans.objectStore('files')
      store.put(files)
    })
  }

}
