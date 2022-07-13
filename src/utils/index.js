/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * 循环渲染对象函数
 * @param {Object} sources 需要循环渲染的数据源
 * @param {String} field 当前项的字段
 * @param {String} suffix 是否需要添加后缀
 * @param {Function} render 渲染函数
 * @return {String} 返回
 */
export function forRender(sources, field, suffix = '', render) {
  const fnFlag = render && typeof render === 'function'
  const valueRaw = sources[field]
  let value = valueRaw === 0 || valueRaw ? valueRaw : '---'
  if (!fnFlag && typeof value === 'number') value = value.toFixed(2)

  return fnFlag ? render(value, sources) : `${value}${suffix}`
}

export function arrayEquals(array1, array2) {
  if (!(array1 || array1)) {
    return false
  }
  // 先比较长度
  if (array1.length !== array2.length) return false

  for (var i = 0, l = array1.length; i < l; i++) {
    // 检查是否为内嵌数组
    if (array1[i] instanceof Array && array2[i] instanceof Array) {
      // 递归比较数组
      if (!arrayEquals(array1[i], array2[i])) return false
      // eslint-disable-next-line no-undef
    } else if (array1[i] !== array2[i]) {
      // 标量比较
      return false
    }
  }
  return true
}

export function getQueryString(name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  const r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}
export function arraysMap(tar = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], sou, map) {
  return sou.reduce((acc, cur, index) => {
    if (cur === map) {
      acc.push(tar[index])
    }
    return acc
  }, [])
}

// 时间段数据格式化
export function formatPeriod(v) {
  return v.reduce((acc, cur, index) => {
    const [startTime, endTime] = cur
    const obj = { startTime, endTime }
    acc.push(obj)
    return acc
  }, [])
}
// 生成uuid
export function creatuuid(len = 1) {
  var temp_url = URL.createObjectURL(new Blob())
  var uuid = temp_url.toString()
  URL.revokeObjectURL(temp_url)
  return uuid.substr(uuid.lastIndexOf('/') + len)
}
