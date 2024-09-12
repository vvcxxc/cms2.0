# information-standard

## 安装

```js
yarn
```

## 运行

```js
npm run dev
// or
yarn dev

```

## 编译

```js
npm run build
```

## 目录结构

```js
|- public
|- script
|- src
|----api //暂时废弃
|----assets //资源
|----cms //cms sdk依赖
|----components //cms sdk依赖
|------BaseDialog //封装的弹窗，样式统一
|------Table//封装的表格，样式统一
|------other...//其他
|----provider //全局注入，element命名空间
|------provider.ts // h
|------provider.vue // render组件
|----utils //工具
|------enum //枚举
|----widgets //组件
|------hook.ts //钩子
|------...
index.html
```

## 快速开始

### 开发分为主仓库基座： information-base 和标准组件及定制化组件

开发流程为：

#### 1、拉取基座仓库

```bash
git clone https://gitlab.syc-cms.com/lmes-plugin/web/information-base.git
```

#### 2、拉取子仓库组件

```bash
yarn pull
```

#### 3、按需要是否将所有组件切换到指定分支

```
yarn checkout 【分支名】
```

## 功能

#### 命名空间

> `element-plus`采用`sass`的`$namespace`来解决`css`样式冲突问题

```js
$namespace = 'cs'
```

element-plus 组件的样式从 el-xx 替换成 cs-xx，使用时，仍然使用<el-xx></el-xx>

> element-plus 自动按需引入，无需手动引入，无需全局安装

<b>！！！注意</b>

使用 ElMessage 和 ElMessageBox 时，需要手动引入

```js
import { ElMessage, ElMessageBox } from 'element-plus'
```

### 权限

在/src/widgets/hook.ts 中引入权限控制 hook

```js
import { usePermission } from '@/libs/Permission/Permission'
import { permissionCodes } from '../enum'

usePermission(props, permissionCodes)

...
defineComponent({
  directives: {
    permission: vPermission,
  },
})

 <IconButton
 //权限控制
  v-permission="workSection-add"
  icon="add-p"
  onClick={onAddProcess}
  type="primary"
>
  添加工序
</IconButton>

```

### 路由地址

路由地址统一由 package.json 中的 name 和/widgets/[组件名]拼接而成
如：

> https://localhost:8001/#/base/PersonnelQualification

### 统一使用`BaseDialog`和`Table`来开发

#### 弹窗例子

```vue
<BaseDialog
  :title="t('编辑人员资质')"
  v-model="visible"
  class="person-dialog"
  @close="visible = false"
  @confirm="onConfirm"
>
      <el-form
        label-width="113px"
        :inline="true"
        :model="formData"
        label-position="left"
      >
        <el-form-item :label="t('人员ID')" class="person-item">
          <el-input
            v-model="formData.user"
            :placeholder="t('请输入人员ID')"
            class="person-input"
            disabled
            clearable
          />
        </el-form-item>
        ...
      </el-form>
    </BaseDialog>
```

#### Table 表格组件

```vue
<div class="table-content">
    <Table
    :dataSource="dataSource"
    :columns="columns"
    :total="total"
    :pageSize="MaxResultCount"
    :isChecked="true"
    @sort="onSort"
    @page="onPageChange"
    >
    <template #printTime="{ row }">
        <span>{{ dayjs(row.printTime).format('YYYY-MM-DD HH:MM:ss') }}</span>
    </template>
    <template #action="{ row }">
        <el-button @click="onEdit(row)" class="btn-edit" type="info">{{
        t('修改')
        }}</el-button>
    </template>
    </Table>
</div>

...

<script>
const columns = [
  {
    title: '序号',
    type: 'seq',
    width: '60',
  },
  {
    title: '人员ID',
    field: 'personID',
  },
  {
    title: '人员姓名',
    field: 'name',
  },
  {
    title: '资质工序码',
    field: 'qualification',
  },
  {
    title: '卡号',
    field: 'cardNumber',
  },
  {
    title: '操作',
    field: 'action',
    width: '100',
  },
]
</script>
```

### 分支命名

> 开发：feature/xx
> 稳定：release/xx

### 问题

如遇到问题，把问题抛到群里，大家一起想办法解决，不要一个人闷着。

### 微前端配置

**`single-spa`**
待补充...

### 资源整合平台

解决开发效率和项目资源浪费等问题
待补充...
方案待更新...
