import {
  computed,
  ref,
  defineComponent,
  SetupContext,
  onMounted,
  reactive,
  Fragment,
  DefineComponent,
  Component,
} from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './CommonTable.module.scss'
import { Create } from '@/libs/Create/Create'
import BaseInput from '@/components/BaseInput/BaseInput'
import Variable from '@/components/Variable/Variable'
import Tag from '@/components/Tag/Tag'
import Icon from '@/components/Icon/Icon'
import { useVModels } from '@vueuse/core'
import RelationMaterielDialog from '@/widgets/ProcessManagement/Views/Pages/Dialog/RelationMaterielDialog/RelationMaterielDialog'
import RelationBarcodeGenerateDialog from '@/widgets/ProcessManagement/Views/Pages/Dialog/RelationBarcodeGenerateDialog/RelationBarcodeGenerateDialog'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import { ElMessage } from 'element-plus'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
// @ts-ignore
import { v4 as uuidv4 } from 'uuid'
import get from 'lodash/get'
import Text from '@/components/Text/Text'
import isNil from 'lodash/isNil'
import set from 'lodash/set'
import Select from '../Select/Select'
import { clone, isFunction } from 'lodash'
import { _t } from '@/libs/Language/Language'
import ElInputNumber from 'element-plus/es/components/input-number/index'
import ElSwitch from 'element-plus/es/components/switch/index'

const WidgetMap: Record<string, Component> = {
  tag: Tag,
  input: BaseInput,
  variable: Variable,
  constant: BaseInput,
  generateBarcode: RelationBarcodeGenerateDialog,
  parsingBarcode: RelationBarcodeGenerateDialog,
  relationMateriel: RelationMaterielDialog,
  select: Select,
  inputNumber: ElInputNumber,
  switch: ElSwitch,
}

interface CurrentType {
  row: any
  index: number
}

export default defineComponent({
  name: '参数表格',
  props: {
    dataSource: {
      type: Array,
      default: [],
    },
    columns: {
      type: Array,
      default: [],
    },
    isFooter: {
      type: Boolean,
      default: true,
    },
    isDrag: {
      type: Boolean,
      default: true,
    },
    isChecked: {
      type: Boolean,
      default: true,
    },
    isStop: {
      type: Boolean,
      default: false,
    },
    isContextMenu: {
      type: Boolean,
      default: false,
    },
    contextMenu: {
      type: Array,
      default: [],
    },
    height: {
      type: String,
      default: '',
    },
    style: {
      type: Object,
      default: () => ({}),
    },
    delConfig: {
      type: Object,
      default: () => ({
        tip: '',
      }),
    },
    uuid: {
      type: Boolean,
      default: false,
    },
    create: {
      type: Function,
      default: null,
    },
    isSeq: {
      type: Boolean,
      default: true,
    },
    autoHeight: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: String,
      default: '',
    },
    LanguageScopeKey: {
      type: String,
      default: '',
    },
  },
  emits: ['update:dataSource'],
  setup(props, ctx: SetupContext) {
    const { dataSource } = useVModels(props, ctx.emit)
    const fieldRequiredMap = reactive<Record<string, any>>({})
    const tableRef = ref<any>()
    const selections = ref<any>([])
    // 菜单
    const contextMenu = [
      {
        label: _t('向上添加一行'),
        fn: (current: CurrentType) => onUpAdd(current),
        icon: 'up',
      },
      {
        label: _t('向下添加一行'),
        fn: (current: CurrentType) => onDownAdd(current),
        icon: 'down',
      },
      {
        label: _t('删除'),
        fn: ({ index }: CurrentType) => {
          if (selections.value.length) {
            dataSource.value = dataSource.value.filter((item: any) => {
              return !selections.value.includes(item.id)
            })
          } else {
            dataSource.value.splice(index, 1)
          }
        },
        icon: 'close',
      },
    ]

    const columns = computed(() => {
      if (props.isSeq) {
        return [
          {
            type: 'seq',
            width: 40,
            title: _t('序号'),
          },
          ...props.columns,
        ]
      }
      return props.columns
    })

    const onUpAdd = ({ row, index }: CurrentType) => {
      dataSource.value.splice(index, 0, genData())
    }

    const onDownAdd = ({ row, index }: CurrentType) => {
      dataSource.value.splice(index + 1, 0, genData())
    }

    const genData = () => {
      let create: Record<string, any> = {}
      if (props.create && typeof props.create === 'function') {
        const fn = props.create
        create = fn()
      } else {
        if (props.uuid) {
          const id = uuidv4()
          create.id = id
        }
      }

      return new Create(create)
    }

    const getFiled = computed(() => (row: any, field: string) => {
      return get(row, field)
    })

    const customWidgetFnMap = (
      key: string,
      { Widget, column, config, field }: any
    ) => {
      const map: Record<string, any> = {
        tag: (
          <Widget
            key={column.field}
            {...config}
            LanguageScopeKey={props.LanguageScopeKey}
          >
            {field}
          </Widget>
        ),
      }
      return map[key]
    }

    /**生成slots配置 */
    const generationSlots = computed(() => {
      const slots: Record<string, ({ row, index }: any) => any> = {}
      const columns = props.columns || []
      const lowerCase = (v: string) => v.charAt(0).toLowerCase() + v.slice(1)
      columns.forEach((column: any) => {
        let el = column.el
        if (isFunction(el)) {
          const elStr = el()
          el = typeof elStr === 'string' ? elStr : el
        }
        el = el ? lowerCase(el) : el

        let Widget: Component | any = WidgetMap[el] || null
        if (column.field !== 'action') {
          const config = column.config || column.props || {}

          slots[column.field] = (scope: any) => {
            const { row, index } = scope
            if (row.el && row.elField === column.field) {
              Widget = WidgetMap[lowerCase(row.el)] || null
            }

            const field = get(row, column.field)

            if (!Widget) {
              const msg = get(row, column.field)
              return msg ? (
                <Text tip={msg} LanguageScopeKey={props.LanguageScopeKey}>
                  {row.isRequired ? (
                    <Fragment>
                      {column.field !== 'description' ? (
                        <span style="color:#D9001B;">*</span>
                      ) : null}

                      {msg}
                    </Fragment>
                  ) : (
                    msg
                  )}
                </Text>
              ) : (
                '-'
              )
            }
            const options = column.options || row.options

            const ops = options?.value || options

            const slot = ctx.slots[column.field]
            // 支持slots
            if (slot) {
              return slot(Widget, {
                row,
                options: ops,
                config,
                column,
                field: column.field,
                index,
                dataSource: dataSource.value,
              })
            }

            if (!ops) {
              const CurrentWidget = customWidgetFnMap(el, {
                Widget,
                column,
                config,
                field,
              })
              if (CurrentWidget) return CurrentWidget
            }

            return (
              <Widget
                key={column.field}
                {...config}
                v-model:dataSource={dataSource.value}
                field={column.field}
                index={index}
                options={ops}
                // v-model={row[column.field]}
                modelValue={getFiled.value(row, column.field)}
                onUpdate:modelValue={(val: string | number) =>
                  onUpdateModelValue(val, row, column)
                }
                LanguageScopeKey={props.LanguageScopeKey}
              />
            )
          }
        } else {
          return '-'
          // return get(row, column.field)
        }
      })
      return slots
    })

    const onUpdateModelValue = (
      val: string | number,
      row: Record<string, any>,
      column: Record<string, any>
    ) => {
      set(row, column.field, val)
      column.format && column.format(val, row)
    }

    const onCheck = (records: any[]) => {
      selections.value = records.map((item) => item.id)
    }

    const onAdd = () => {
      if (Array.isArray(dataSource.value)) {
        dataSource.value.push(genData())
      } else {
        dataSource.value = []
        dataSource.value.push(genData())
        tableRef.value?.scrollToRowLine()
      }
      tableRef.value?.scrollToRowLine()
    }

    const onDelRow = (row: any) => {
      const delFn = () =>
        (dataSource.value = dataSource.value.filter((item) => {
          return item !== row
        }))
      if (props.delConfig?.tip && !row?.id?.includes('row_')) {
        ConfirmBox(props.delConfig?.tip).then(() => {
          delFn()
        })
      } else {
        delFn()
      }
    }
    /**
     * 获取字段Required
     */
    const getFieldRequiredMap = () => {
      props.columns.forEach((item: any) => {
        // 隐藏字段不需要校验
        if ((!item.hide && item.required) || item.customRequired) {
          fieldRequiredMap[item.field] = item
        }
      })
    }
    /**
     * 校验是否有必填
     * @param data
     * @returns
     */
    const checkRequired = (data: any[]) => {
      const fields = Object.keys(fieldRequiredMap)
      let checked = false
      if (fields.length) {
        for (let index = 0; index < data.length; index++) {
          const item: any = data[index]

          if (checked) {
            break
          } else {
            for (let idx = 0; idx < fields.length; idx++) {
              const fieldKey = fields[idx]
              const v = get(item, fieldKey)
              const column = fieldRequiredMap[fieldKey]
              if (isNil(v) || v === '') {
                if (item.isRequired) {
                  ElMessage.error(`${item.name} ${_t('不能为空')}`)
                  checked = true
                  break
                } else {
                  if (!Object.hasOwn(item, 'isRequired')) {
                    ElMessage.error(`${column.title} ${_t('不能为空')}`)
                    checked = true
                    break
                  }
                }
              } else {
                if (column.validator && column.validator instanceof Function) {
                  const rule = {
                    field: fieldKey,
                    fullField: column.field,
                    type: typeof v,
                  }
                  const errorCallBack = (msg: string) => {
                    ElMessage.error(msg)
                    checked = true
                  }
                  column.validator(rule, v, errorCallBack)
                  break
                }
              }
            }
          }
        }
      }
      return !checked
    }

    /**
     * 获取数据，并提供校验，删除多余字段
     * @param noCheck
     * @returns
     */
    const getData = (noCheck = false) => {
      const data: any[] = []
      dataSource.value.forEach((item: any) => {
        const value = item.value
        delete item.value
        const obj = cloneDeep({
          ...item,
          // value: {
          //   description: value?.description,
          //   name: value?.name,
          //   objectName: value?.objectName,
          //   value: value?.value,
          // },
        })
        if (typeof value === 'object') {
          obj.value = {
            description: value?.description,
            name: value?.name,
            objectName: value?.objectName,
            value: value?.value,
          }
        } else {
          obj.value = value
        }
        item.value = value
        data.push(obj)
      })
      if (noCheck || checkRequired(data)) {
        const newData = data.map((item: any) => {
          if (item.id && String(item.id).includes('row_')) {
            return omit(item, ['id'])
          }
          return item
        })
        return newData
      }
    }

    onMounted(() => getFieldRequiredMap())

    ctx.expose({
      getData,
    })

    return () => {
      let contextMenuCustom: boolean | any = []
      if (props.isContextMenu || props.contextMenu?.length) {
        contextMenuCustom = props.contextMenu?.length
          ? props.contextMenu
          : contextMenu
      }
      return (
        <div
          class={styles.CommonTable}
          style={{ ...props.style, height: props.height }}
        >
          <BaseTable
            ref={tableRef}
            class={styles.table}
            columns={columns.value}
            contextMenu={contextMenuCustom}
            vSlots={{
              ...generationSlots.value,
              action: ({ row, column }: any) => {
                return (
                  <Icon
                    icon={column.icon || 'closeDark'}
                    style="cursor: pointer;"
                    onClick={() => onDelRow(row)}
                    width={16}
                    height={16}
                  />
                )
              },
            }}
            gt={40}
            size="mini"
            v-model:dataSource={dataSource.value}
            isHidePagination={true}
            isChecked={props.isChecked}
            isDrag={props.isDrag}
            isFooter={props.isFooter}
            isVScroll={true}
            isStop={props.isStop}
            onCheck={onCheck}
            height={props.height}
            maxHeight={props.maxHeight}
            autoHeight={props.autoHeight}
            onClickFooter={onAdd}
            LanguageScopeKey={props.LanguageScopeKey}
          />
        </div>
      )
    }
  },
})
