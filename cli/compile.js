require('babel-register')

const fs = require('fs')
const debug = require('debug')('plato:compile')
const translateThemeFile = require('./translateCssFile')
debug('Create webpack compiler.')

var packageConfig = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
var version = packageConfig.version

// 生成版本文件
function buildVersion (version) {
  fs.writeFileSync('./dist/i18n/version.txt', `v${version}`)
  fs.writeFileSync('./dist/style/version.txt', `v${version}`)
}

require('webpack')(require('../webpack.config.babel.js')).run((err, stats) => {
  const jsonStats = stats.toJson()

  debug('Webpack compile completed.')
  console.log(stats.toString({
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false,
    colors: true
  }))

  if (err) {
    debug('Webpack compiler encountered a fatal error.', err)
    process.exit(1)
  } else if (jsonStats.errors.length > 0) {
    debug('Webpack compiler encountered errors.')
    console.log(jsonStats.errors)
    process.exit(1)
  } else if (jsonStats.warnings.length > 0) {
    translateThemeFile()
    buildVersion(version)
    debug('Webpack compiler encountered warnings.')
  } else {
    translateThemeFile()
    buildVersion(version)
    debug('No errors or warnings encountered.')
  }
})
