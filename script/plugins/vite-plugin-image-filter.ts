/**
 * 增加debugger组件
 * @param option
 * @returns
 */
export default function VitePluginDevelopmentFilter(): any {
  return {
    name: 'vite-plugin-image-filter',
    apply: 'build',

    transform(code, id) {
      if (code.includes('createVNode(Icon')) {
        console.info('code', code)
      }
      // const tag = 'Icon'
      // const regexWithCapture = new RegExp(
      //   `<${tag}>([\\s\\S]*?)<\\/${tag}>`,
      //   'g'
      // )

      // if (regexWithCapture.test(code)) {
      //   if (process.env.NODE_ENV === 'production') {
      //     const newCode = code.replaceAll(regexWithCapture, '')
      //     return newCode
      //   }
      // }
      return code
    },
  }
}
