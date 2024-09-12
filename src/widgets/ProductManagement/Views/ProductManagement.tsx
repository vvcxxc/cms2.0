import { Fragment, defineComponent, ref } from 'vue'
import styles from './ProductManagement.module.scss'
import { useProduct } from '../Controllers/Product'
import BaseTable from '@/components/Table/Table'
import { columns } from './Config'
import Icon from '@/components/Icon/Icon'
import IconButton from '@/components/IconButton/IconButton'
import Search from '@/components/Search/Search'
import ProductForm from './Pages/Dialog/ProductForm/ProductForm'
import SOPConfig from './Pages/Dialog/SOPConfig/SOPConfig'
import HeaderFieldSettings from './Pages/Dialog/HeaderFieldSettings/HeaderFieldSettings'

import { useProvideModels } from '@/libs/Provider/app'
import { permissionCodes } from '../enum'
import Content from '@/components/Content/Content'
import { _t, LanguageScopeKey } from '../app'
import {
  vPermission,
  vEditionShow,
  useEditionFeature,
  usePermission,
  isEdition,
} from '@/libs/Permission/Permission'

export default defineComponent({
  name: '产品管理',
  directives: {
    permission: vPermission,
    editionShow: vEditionShow,
  },
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    useEditionFeature()
    useProvideModels()
    usePermission(props, permissionCodes)

    const {
      dataSource,
      dialogConfig,
      settingDialogConfig,
      tableRef,
      sopEnabled,
      searchInner,
      onCheck,
      onAddProduct,
      onEditProduct,
      onHeaderFieldSettings,
      onSearch,
      onConfirm,
      openSopDialog,
      onImport,
      onDelete,
      onExport,
    } = useProduct(props)

    return () => {
      if (isEdition(['S']) === undefined) {
        return null
      }
      const currentColumns = columns.value.filter((column) => {
        if (column.isCheckEdition) {
          return isEdition(['S'])
        }
        return true
      })
      return (
        <Content title={_t('产品管理')}>
          <div class={styles.header}>
            <IconButton
              v-permission="product-management-add"
              icon="add-p"
              type="primary"
              onClick={onAddProduct}
            >
              {_t('添加')}
            </IconButton>
            <el-divider direction="vertical" />
            <IconButton
              v-permission="product-management-edit"
              icon="edit"
              onClick={onEditProduct}
            >
              {_t('编辑')}
            </IconButton>

            <IconButton
              v-permission="product-management-field"
              icon="s"
              onClick={onHeaderFieldSettings}
            >
              {_t('表头字段设置')}
            </IconButton>

            <el-upload
              action="#"
              accept=".xlsx"
              show-file-list={false}
              http-request={onImport}
            >
              <IconButton
                v-permission="product-management-import"
                icon="import"
              >
                {_t('导入')}
              </IconButton>
            </el-upload>

            <IconButton
              v-permission="product-management-export"
              icon="export"
              onClick={onExport}
            >
              {_t('导出')}
            </IconButton>
            {sopEnabled.value && (
              <IconButton v-edition-show="M" icon="sop" onClick={openSopDialog}>
                {_t('SOP管理')}
              </IconButton>
            )}

            <IconButton
              v-permission="product-management-delete"
              icon="delete"
              onClick={onDelete}
            >
              {_t('删除')}
            </IconButton>
            {/* <el-input
                class={styles.searchInner}
                size="small"
                prefix-icon={Search}
                placeholder="请输入"
              /> */}
            <Search
              class={styles.searchInner}
              v-model={searchInner.value}
              placeholder={_t('请输入产品名称、产品型号、和产品简码')}
              onConfirm={onSearch}
            />
          </div>
          <div class={styles.mainTable}>
            <BaseTable
              params={{
                Filter: searchInner.value,
              }}
              ref={tableRef}
              LanguageScopeKey={LanguageScopeKey}
              url="/api/v1/productmanagement/product"
              sortUrlTpl="/api/v1/productmanagement/product/{id}/reorder/{sort}"
              v-model:dataSource={dataSource.value}
              columns={currentColumns}
              isDrag={true}
              isChecked={true}
              // isFooter={true}
              onCheck={onCheck}
              onClickFooter={onAddProduct}
              emptyText={_t('暂无数据')}
              v-slots={{
                pocessRoutes: ({ row }: any) => {
                  return row.pocessRoutes.length ? (
                    <el-popover
                      placement="bottom"
                      width={1072}
                      vSlots={{
                        reference: () => (
                          <Icon icon="icon_process" width={64} height={10} />
                        ),
                        default: () => (
                          <div class={styles.processStep}>
                            {row.pocessRoutes.map(
                              (item: string, index: number) => (
                                <Fragment>
                                  <div class={styles.stepItem}>
                                    <el-tooltip
                                      effect="dark"
                                      content={item}
                                      placement="top"
                                      show-after={200}
                                    >
                                      <span class={styles.stepName}>
                                        {item}
                                      </span>
                                    </el-tooltip>
                                  </div>
                                  <Icon
                                    icon={`processStep${(index % 4) + 1}`}
                                    width={19}
                                    height={10}
                                    class={styles.stepIcon}
                                  />
                                </Fragment>
                              )
                            )}
                          </div>
                        ),
                      }}
                    ></el-popover>
                  ) : (
                    <Icon icon="not-config" width={64} height={10} />
                  )
                },
              }}
            />
          </div>
          <ProductForm
            v-model={dialogConfig.visible}
            title={dialogConfig.title}
            rowData={dialogConfig.rowData}
            onConfirm={onConfirm}
          />
          <SOPConfig
            v-model={dialogConfig.sopVisible}
            title={_t('SOP配置')}
            productId={dialogConfig.rowData?.id}
            onConfirm={onConfirm}
          />
          <HeaderFieldSettings v-model={settingDialogConfig.visible} />
        </Content>
      )
    }
  },
})
