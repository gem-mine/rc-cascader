import { join } from 'path'
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'fs'
import {
  paths
} from '../config'
// import rimraf from 'rimraf'
// import copy from 'copy'

var themeNameRe = /([^(]+)\.(png|jpg|gif|svg|woff2?|eot|ttf)/g
var cssFileNameRe = /\.css$/

export default function () {
  var cssPath = join(paths.dist(), './style/')
  if (existsSync(cssPath)) {
    var fileList = readdirSync(cssPath)
    fileList.forEach(file => {
      if (cssFileNameRe.test(file)) {
        var data = readFileSync(join(cssPath, file), 'utf-8')
        // 把 URL() 的 图片，字体的路径修改了
        data = data.replace(themeNameRe, function (imageUrl) {
          var words = imageUrl.split('/')
          return words[words.length - 1]
        })
        writeFileSync(join(cssPath, file), data)
      }
    })
  }
}
