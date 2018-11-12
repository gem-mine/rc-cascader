import format from 'string-template'
import langData from './i18n/index.json'

var APIs = {
  setNamespace (namespace) {
    return function (keys, ...args) {
      namespace && (keys = `${namespace}.${keys}`)

      if (!langData) {
        return keys
      }
      // `.` 作为分隔符
      return format(keys.split('.').reduce((res, key) => {
        if (res && res.hasOwnProperty && res.hasOwnProperty(key)) {
          return res[key]
        }
        return keys
      }, langData), ...args)
    }
  }
}

export default APIs
