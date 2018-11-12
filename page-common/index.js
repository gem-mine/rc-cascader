import './style/flexible.css'
import './style/index.css'
import I18N from 'I18N'

const __ = I18N.setNamespace('h5-template/page-common')

class CommonPage {
  render (widgets) {
    const pageFragment = document.createDocumentFragment()

    widgets.forEach(widget => {
      pageFragment.appendChild(widget.render())
    })

    document.title = __('title')
    document.body.appendChild(pageFragment)
  }
}

export default new CommonPage()
