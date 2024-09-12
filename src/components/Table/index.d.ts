export interface ParamsItem {
  Sorting?: string
  SkipCount?: string | number
  MaxResultCount?: number
  [key: string]: any
}

export interface ColumnType {
  title?: string
  field?: string
  width?: string | number
  sortable?: boolean
  required?: boolean
  [key: string]: any
}

export interface TablePropsItemType {
  cellStyle?: () => any
  rowStyle?: () => any
  rowClassName?: string | Function
  headBorder?: boolean
  emptyText?: string
  selections?: string[]
  autoFirstClickRow?: boolean
  // 参数
  params?: ParamsItem
  // 数据源
  dataSource: any[]
  // 列
  columns: ColumnType[]
  // 当前页大小
  pageSize?: number
  // 总数
  total?: number
  // 是否隐藏分页
  isHidePagination?: boolean
  // 是否多选
  isChecked?: boolean | Function
  // 是否显示序号
  isSeq?: boolean
  // 是否排序
  isSort?: boolean
  // id..
  id?: string
  // 是否出现拖拽，废弃
  showDarg?: boolean | string
  // 是否拖拽
  isDrag?: boolean | string
  // 是否禁用拖拽 （筛选的时候一般禁用拖拽）
  disabledDrag?: boolean
  // 是否自动高度
  height?: string
  maxHeight?: string
  // 是否开启虚拟滚动
  isVScroll?: boolean
  // 边框
  border?: string | any
  // 请求地址
  url?: string
  // 排序地址模版
  sortUrlTpl?: string
  //显示底部
  isFooter?: boolean
  gt?: number
  // 右键菜单
  contextMenu?: Array<{
    label: string
    fn: (item: any) => void
    [key: string]: any
  }>
  rowConfig?: any
  size?: SizeType | undefined
  // 阻止冒泡
  isStop?: boolean
  LanguageScopeKey?: string
  // [key: string]: any
}

export interface MenuOptionType {
  zIndex?: number
  minWidth?: number
  x?: number
  y?: number
}

export interface contextMenuItemType {
  show: boolean
  current: Record<string, any> | null
  options: any
}
