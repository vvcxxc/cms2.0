import type { Theme } from 'vitepress'
import Layout from '../../Layout/Layout.tsx'
import DefaultTheme from 'vitepress/theme'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    // @ts-ignore
    app.component('Layout', Layout)
  },
} satisfies Theme
