import { App } from 'vue'
import XEUtils from 'xe-utils'
import VXETablePluginElement from 'vxe-table-plugin-element'
import 'vxe-table-plugin-element/dist/style.css'
import {
  VXETable,
  Header,
  Icon,
  Column,
  Table,
  Edit,
  Validator,
  Tooltip,
  Grid,
  List,
  Input,
  Select,
  Optgroup,
  Option,
} from 'vxe-table'
import 'vxe-table/lib/style.css'
import zhCNLocat from 'vxe-table/lib/locale/lang/zh-CN'

VXETable.use(VXETablePluginElement)
// 全局默认参数
VXETable.setup({
  version: 0,
  zIndex: 2800,
  table: {
    autoResize: true,
  },
  tooltipConfig: {
    enterable: true,
  },
})

// 导入默认的国际化（如果项目中使用多语言，则应该导入到 vue-i18n 中）
VXETable.setup({
  i18n: (key, args) =>
    XEUtils.toFormatString(XEUtils.get(zhCNLocat, key), args),
})

export function useTable(app: App) {
  app
    .use(Header)
    .use(Icon)
    .use(Column)
    .use(Edit)
    .use(Validator)
    .use(Table)
    .use(Tooltip)
    .use(Grid)
    .use(List)
    .use(Input)
    .use(Select)
    .use(Optgroup)
    .use(Option)
}
