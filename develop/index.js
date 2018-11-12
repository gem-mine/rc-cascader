import page from '../page-common'

const requireAll = requireContext => {
  return requireContext.keys().map(path => {
    var Widget = requireContext(path)
    var name = path.replace(/^\.\/(widget-.*)\/(.*)/, 'h5-template/$1') // // {componentName}/{widgetName}
    var id = window.Math.floor(window.Math.random() * 1000)
    if (Widget.prototype) { // 返回一个类，建议开发人员返回一个类
      return new Widget({ id, name })
    } else { // 返回一个实例
      Widget.id = id
      Widget.name = name
      return Widget
    }
  })
}

// requires and returns all widgets
const widgets = requireAll(require.context('../', true, /widget-.*?\/index\.js$/))

page.render(widgets)
