const APIs = window.Bridge ? window.Bridge.require('sdp.appfactory') : {
  getLanguageType () {
    console.info('模拟获取系统语言')
    return 'zh-CN'
  }
}

var readPackageTextFile = window.Bridge ? window.Bridge.require('sdp.filemanager').readPackageTextFile : ({ filename }, success, fail) => {
  success({ filename, message: '目前环境不支持该接口，我只是一个模拟信息' })
}

APIs.readPackageTextFile = function ({ filename }) {
  return new Promise((resolve, reject) => {
    readPackageTextFile({ filename }, {
      success: message => resolve(message),
      fail: message => reject(message)
    })
  })
}

APIs.isWebView = () => {
  return navigator.userAgent.indexOf('SmartCanWebView') !== -1
}

APIs.bridgeReady = fn => {
  if (APIs.isWebView()) {
    window.bridgeReady = fn
  } else {
    fn()
  }
}

export default APIs
