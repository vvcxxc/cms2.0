import path from 'path'
const isWin = process.platform === 'win32'
const fileRegex = /\.(ts)$/
const basePath = path.resolve(process.cwd(), './src/widgets')
// @ts-ignore
const filePath = isWin ? basePath.replaceAll('\\', '/') : basePath
const regex = new RegExp(`${filePath}/([^/]*)/index.ts`)
const NOT_PAGE = 'notPage:true'
/**
 * 提取关键字符
 * @param {*} code
 * @returns
 */
const parseCode = (code) => {
  const importRegion = code.match(/import[^]*?("|')(.*?)\1;/g)
  const exportDefaultRegion = code.match(/export default [\s\S]*?;/)
  const canvasView = code.match(/canvasView: ([^,]+),/)
  const canvasViewValue = canvasView ? canvasView[1] : ''

  const imports = importRegion ? importRegion.join('\n') : ''
  const exportDefault = exportDefaultRegion ? exportDefaultRegion[0] : ''

  return { imports, exportDefault, canvasView: canvasView[0], canvasViewValue }
}

/**
 * 合并处理代码
 * @param {*} param0
 * @param {*} originCode
 */
const mergeCodeString = (
  { imports, exportDefault, canvasView, canvasViewValue },
  originCode
) => {
  const code = `${imports}\n${exportDefault}`
  if (
    canvasView.includes('provider(') &&
    originCode.includes('provider/index')
  ) {
    return code
  }

  const providerCode = 'import { provider } from "@/provider/index";'

  const exportDefaultCode = exportDefault.replace(
    canvasView,
    `canvasView: provider(${canvasViewValue}),`
  )
  return `${imports}\n${providerCode}\n${exportDefaultCode}`
}

export default function VitePluginWidgetProvider(): any {
  return {
    name: 'vite-plugin-widget-provider',
    apply: 'build',

    transform(code, id) {
      if (fileRegex.test(id)) {
        if (regex.test(id)) {
          const codeData = parseCode(code)
          const transformCode = mergeCodeString(codeData, code)
          // const emptyCode = code.replaceAll(' ', '')

          const newCode = transformCode
          // const newCode = emptyCode.includes(NOT_PAGE) ? code : transformCode
          return {
            code: newCode,
            map: null, // 如果可行将提供 source map
          }
        }
      }
    },
  }
}
