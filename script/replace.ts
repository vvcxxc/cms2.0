/**
 * 通过element plus自动的namespace进行样式分离
 * 由于目前element plus自动的namespace，无法支持treeshaking
 * 因此打包之后，再遍历dist文件夹，替换打包之后的js、css值，实现namespace最终效果
 */
/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

const distPath = path.resolve(__dirname, '../dist/information-ui/es')

fs.readdir(distPath, function (err, files) {
  if (err) return console.error('Error:(spec)', err)
  for (const filename of files) {
    if (!filename.endsWith('js') && !filename.endsWith('.css')) continue
    const filePath = distPath + '/' + filename

    fs.readFile(filePath, function (err, data) {
      if (err) {
        return err
      }
      let str = data.toString()

      // js仅替换namespace key值即可
      if (filename.endsWith('js')) {
        str = str.replace('"el"', '"cs"')
      }
      // css需要替换所有的el-
      if (filename.endsWith('.css')) {
        str = str.replace(/el-/g, 'cs-')
      }

      fs.writeFile(filePath, str, function (err) {
        if (err) return err
      })
    })
  }
})
