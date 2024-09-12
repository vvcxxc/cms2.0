const { glob } = require('glob')
const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const regExp = /export default [\s\S]*?;/
const regExpObj = /\{[\s\S]*?;/
const babel = require('@babel/core')
const pkg = require('../package.json')
const isWin = process.platform === 'win32'

/**
 * 根据widgets下的组件，自动生成菜单数据，用于对外引用
 */
async function start() {
  const tsFiles = await glob(resolve(process.cwd(), 'src/widgets/*/index.ts'), {
    ignore: 'node_modules/**',
    windowsPathsNoEscape: true,
  })

  const menu = []
  const menuMap = {}
  const errorKey = ' is not defined'

  tsFiles.forEach((filePath) => {
    const spl = !isWin ? filePath.split('/') : filePath.split('\\')

    const patchName = spl[spl.length - 2]
    const file = readFileSync(filePath, { encoding: 'utf8' })
    const { code } = babel.transformSync(file)
    const exportDefaultRegion = code.match(regExp)
    const exportDefaultContent = exportDefaultRegion[0]
    if (exportDefaultContent) {
      const v = exportDefaultContent.match(regExpObj)
      const canvasView = exportDefaultContent.match(/canvasView: ([^,]+),/)
      let canvasViewValue = canvasView ? canvasView[0] : ''
      canvasViewValue = !canvasViewValue.includes(')')
        ? canvasViewValue.replace(',', '),')
        : canvasViewValue

      const c = v[0].replace(canvasViewValue, '')
      let setViewMatch = c.match(/settingsView:\s*(.*?)(?=\s*[,}])/)
      let newCode = ''
      if (setViewMatch[0]) {
        newCode = c.replace(setViewMatch[0], '').replace(';', '')
      }
      if (newCode.includes('canvasView')) {
        newCode = newCode.replace(
          /canvasView\s*:\s*.*?(\{.*?\}|\(.*?\)|[^\s,]+)\s*,?\s*(?=\n|$)/gs,
          ''
        )
      }

      const codeRun = (code) => {
        const fn = new Function(`return ${code}`)
        const widgetInfo = fn()
        const row = {
          name: widgetInfo.name,
          path: `/${pkg.name}/` + patchName,
          icon: widgetInfo.icon,
          notPage: !!widgetInfo.notPage,
        }
        menu.push(row)
        menuMap[patchName] = row
      }
      try {
        codeRun(newCode)
      } catch (error) {
        if (error.message.includes(errorKey)) {
          const iconKey = error.message.split(errorKey)
          if (iconKey.length > 1) {
            const iconName = iconKey[0]
            const code = newCode.replaceAll(iconName, `"${iconName}"`)
            codeRun(code)
          }
        } else {
          console.error(error.message, '请@阮伟光处理')
        }
      }
    }
  })
  const data = `export const menu = ${JSON.stringify(
    menu,
    null,
    2
  )};\nexport const menuMap = ${JSON.stringify(menuMap, null, 2)};`
  writeFileSync(resolve(process.cwd(), './src/config/menu.ts'), data, {
    encoding: 'utf-8',
  })
}
const startTime = performance.now()

start()

console.log('执行时间: ', Math.ceil(performance.now() - startTime), 'ms')
