import './style/index.css'                              // 引入样式
import template from './template.ejs'                   // 引入 ejs 模板，可根据实际开发的需要选择是否要用 ejs 模板
import I18N from 'I18N'                                 // 引入翻译功能 `I18N` 模块，该模块会在编译时由构建脚本生成
const __ = I18N.setNamespace('h5-template/widget-1')    // 获取该 widget 的翻译函数，格式为 `I18N.setNamespace('{js组件名}/widget-{widgetName}')`，JS组件名不加 `@sdp.nd/` 前缀
// `__` 是一个翻译函数，输入对应的 key 就可以返回对应的语言
// __('name') => '颗粒名称'

// 以 `class` 的方式定义 widget
class Widget1 {
  // 颗粒的构造函数，外部把传入该组件的 ID 和 名称
  constructor ({ id, name }) {
    this.id = id
    this.name = name
    this.el = document.createElement('div')
  }

  // 颗粒要渲染到界面时调用该方法，并返回一个 element 元素，渲染到界面上
  render () {
    const data = {
      name: this.name,
      id: this.id,
      img: require('./style/images/honor.png'), // 引入图片
      __                                        // 传入翻译函数
    }
    // 使用 ejs 模板渲染
    this.el.innerHTML = template(data)
    return this.el
  }
}

export default Widget1
