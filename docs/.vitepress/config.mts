import { defineConfig } from 'vitepress'
export default defineConfig({
  title: '信息化组件库',
  description: '前端信息化组件库',
  base: '/info',

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: '快速开始', link: '/quick-start' },
    ],

    sidebar: {
      '/components': [
        {
          text: 'BaseContent 内容框',
          link: '/components/BaseContent',
        },
        {
          text: 'BaseDialog 对话框',
          link: '/components/BaseDialog',
        },
        {
          text: 'BaseDrawer 抽屉',
          link: '/components/BaseDrawer',
        },
        {
          text: 'BaseInput 输入框',
          link: '/components/BaseInput',
        },
        {
          text: 'ConfirmBox 确认框',
          link: '/components/ConfirmBox',
        },
        {
          text: 'Container 容器',
          link: '/components/Container',
        },
        {
          text: 'Content 内容区',
          link: '/components/Content',
        },
        {
          text: 'DialogPreView 弹窗预览',
          link: '/components/DialogPreView',
        },
        {
          text: 'Dyform 动态表单',
          link: '/components/Dyform',
        },
        {
          text: 'Empty 空',
          link: '/components/Empty',
        },
        {
          text: 'Flow 显示',
          link: '/components/Flow',
        },
        {
          text: 'Icon 图标',
          link: '/components/Icon',
        },
        {
          text: 'IconButon 图标按钮',
          link: '/components/IconButton',
        },
        {
          text: 'Pdf Pdf',
          link: '/components/Pdf',
        },
        {
          text: 'PreviewDialog 预览弹窗iframe',
          link: '/components/PreviewDialog',
        },
        {
          text: 'Search 搜索',
          link: '/components/Search',
        },
        {
          text: 'SearchInput 选择输入组件',
          link: '/components/SearchInput',
        },
        {
          text: 'Tag 标签',
          link: '/components/Tag',
        },
        {
          text: 'Tab 搜索',
          link: '/components/Tab',
        },
        {
          text: 'Table 表格',
          link: '/components/Table',
        },
        {
          text: 'TableFilter 表格筛选',
          link: '/components/TableFilter',
        },
        {
          text: 'TdButton td按钮',
          link: '/components/TdButton',
        },
        {
          text: 'Text 文本',
          link: '/components/Text',
        },
        {
          text: 'Title 标题',
          link: '/components/Title',
        },
        {
          text: 'TouchScale 缩放',
          link: '/components/TouchScale',
        },
        {
          text: 'Upload 上传',
          link: '/components/Upload',
        },
        {
          text: 'Variable 变量',
          link: '/components/Variable',
        },
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://gitlab.syc-cms.com:8443/lmes-plugin/web/information-ui',
      },
    ],
  },
})
