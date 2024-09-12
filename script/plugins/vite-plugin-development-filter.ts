// @ts-nocheck

/**
 * 增加debugger组件
 * @param option
 * @returns
 */
export default function VitePluginDevelopmentFilter(option: {
  tag: string
}): any {
  return {
    name: 'vite-plugin-development-filter',
    apply: 'build',

    transform(code, id) {
      const tag = option.tag
      const regexWithCapture = new RegExp(
        `<${tag}>([\\s\\S]*?)<\\/${tag}>`,
        'g'
      )

      if (regexWithCapture.test(code)) {
        if (process.env.NODE_ENV === 'production') {
          const newCode = code.replaceAll(regexWithCapture, '')
          return newCode
        }
      }
      return code
    },
  }
}
