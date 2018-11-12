import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import request from 'utils/request'
import sdp from 'libs/sdp'
import template from 'string-template'
import createStore from './create-store'

const isOffline = location.protocol === 'file:'

export default (context, options = {}, register) => {
  const {
    lang = sdp.getLanguageType(),
    fallbackLang = 'zh-CN',
    urlPattern = __PROD__ ? './i18n/{lang}/index.json' : './i18n/index.json',
    translations = {}
  } = options

  register({
    store: createStore({
      lang,
      translations
    }, options)
  }, ({ store }) => {
    // vm for watching i18n
    const vm = new Vue({
      store,
      computed: mapGetters(['lang', 'translations']),
      methods: {
        fetchTranslations (lang) {
          // add `dir="..."` to `<html>`
          document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
          // request json data
          var i18nUrl = template(urlPattern, { lang })
          // 如果是离线就使用 readPackageTextFile 读取本地文件
          var i18nPromise = isOffline ? sdp.readPackageTextFile({ filename: i18nUrl }) : request(template(urlPattern, { lang }))

          i18nPromise
          .then(translations => {
            this.setI18n({ translations })
          })
          .catch(() => {
            this.fetchTranslations(fallbackLang)
          })
        },
        ...mapActions(['setI18n'])
      },
      watch: {
        lang (val) {
          this.fetchTranslations(val)
        }
      },
      created () {
        this.fetchTranslations(this.lang)
      }
    })

    /**
     * I18n
     */
    Vue.prototype.__ = Vue.prototype.$translate = function (keys, ...args) {
      if (!keys) {
        return keys
      }
      let scope
      let keyArray
      // searching at global or local
      if (keys.charAt(0) === '/') {
        const arr = keys.split('.')
        scope = arr[0].slice(1)
        keyArray = arr.slice(1)
      } else {
        scope = this.$options.__scope
        keyArray = keys.split('.')
      }
      // `.` 作为分隔符
      return template(keyArray.reduce((res, key) => {
        if (res && typeof res === 'object' && res.hasOwnProperty(key)) {
          return res[key]
        }
        return keys
      }, scope ? vm.translations[scope] : vm.translations), ...args)
    }
  })
}
