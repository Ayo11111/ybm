/*
 * @Descripttion: DXY
 * @Company: 思宏科技
 * @version: v1.0
 * @Author: DXY
 * @Date: 2020-09-02 16:04:02
 * @LastEditors: DXY
 * @LastEditTime: 2020-09-02 16:04:05
 */
export function setLocalStorage(key, value) {
  value.forEach((value, index) => {
    localStorage.setItem(value, JSON.stringify(key[index]))
  })
}

export function getLocalStorage(key, value) {
  value.forEach((value, index) => {
    localStorage.setItem(value, JSON.stringify(key[index]))
  })
}

export function removeLocalStorage(key) {
  key.forEach(value => {
    localStorage.removeItem(value)
  })
}
