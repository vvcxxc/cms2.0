# Vue 3 组件文档

## InformationTable 组件

### 描述

`InformationTable` 组件是一个基于 Vue 3 的表格组件，用于展示具有各种功能的表格数据，例如排序、分页和右键上下文菜单。该组件利用了 VXE-Table 库提供表格功能。

### Props

- **dataSource** (`Array<Object>`): 表格的数据源。
- **columns** (`Array<Object>`): 表格列的配置。
- **pageSize** (`Number`): 每页显示的项数。
- **total** (`Number`): 记录的总数。
- **isHidePagination** (`Boolean`): 是否隐藏分页控件。
- **isChecked** (`Boolean`): 是否显示多选复选框。
- **isSort** (`Boolean`): 是否启用排序。
- **id** (`String`): 用于唯一标识每一行的键字段。
- **showDarg** (`Boolean`/`String`): 已弃用。用于显示/隐藏拖拽功能。
- **isDrag** (`Boolean`/`String`): 是否启用拖拽功能。
- **autoHeight** (`Boolean`): 是否自动调整表格高度。
- **isVScroll** (`Boolean`): 是否启用虚拟滚动。
- **border** (`String`/`Any`): 表格的边框样式。
- **url** (`String`): 用于获取数据的 API 端点。
- **isFooter** (`Boolean`): 是否显示带有添加按钮的页脚。
- **contextMenu** (`Array`): 右键上下文菜单的配置。
- **rowConfig** (`Any`): 表格行的附加配置。
- **size** (`String`): 表格的大小（'small'、'mini' 或默认）。

### Events

- **check(records: `Array`)**: 当选择复选框时触发。
- **sort(...args: `Any`)**: 当排序更改时触发。
- **page(currentPage: `Number`)**: 当当前页更改时触发。
- **rowClick(row: `Object`)**: 当点击行时触发。
- **update:dataSource(data: `Array`)**: 当数据源更新时触发。
- **clickFooter()**: 当点击页脚添加按钮时触发。

### Methods

- **setSelectRow(keys: `Array`, checked: `Boolean`)**: 根据键设置选定的行。
- **setRow(row: `Object`)**: 设置当前行。
- **clearSelectEvent()**: 清除所有选定的行。

### 使用

```vue
<template>
  <InformationTable
    :dataSource="yourDataSource"
    :columns="yourColumns"
    :pageSize="10"
    :total="yourTotalRecords"
    :isChecked="true"
    :isSort="true"
    :id="'id'"
    :isDrag="true"
    :autoHeight="true"
    :isVScroll="true"
    :border="'1px solid #e3e6ed'"
    :url="'your/api/endpoint'"
    :isFooter="true"
    :contextMenu="yourContextMenuConfig"
    :rowConfig="yourRowConfig"
    :size="'small'"
    @check="handleCheck"
    @sort="handleSort"
    @page="handlePage"
    @rowClick="handleRowClick"
    @update:dataSource="handleUpdateDataSource"
    @clickFooter="handleClickFooter"
  />
</template>

<script>
import InformationTable from 'path/to/InformationTable.vue'

export default {
  components: {
    InformationTable,
  },
}
</script>
```

### 注意事项

- 这是一个基本的概述文档。根据你的具体要求进行定制和扩展。
- 确保 VXE-Table 库已正确安装和配置在你的项目中。
- 根据设计偏好可能需要额外的样式设置。
