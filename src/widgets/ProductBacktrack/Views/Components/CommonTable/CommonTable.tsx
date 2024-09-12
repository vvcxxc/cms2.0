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
  watch,
} from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './CommonTable.module.scss'
import { Create } from '@/libs/Create/Create'
import BaseInput from '@/components/BaseInput/BaseInput'
import Variable from '@/components/Variable/Variable'
import Tag from '@/components/Tag/Tag'
import Icon from '@/components/Icon/Icon'
import { useVModels } from '@vueuse/core'
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

const WidgetMap: Record<string, Component> = {
  tag: Tag,
  input: BaseInput,
  variable: Variable,
  constant: BaseInput,
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
    // 点击表格的输入框是否会选中列
    isWidgetSelect: {
      type: Boolean,
      default: false,
    },
    // 点击表格的输入框是否会选中列
    idKey: {
      type: String,
      default: '',
    },
    maxHeight: {
      type: String,
      default: '',
    },
  },
  emits: ['rowClick', 'check'],
  setup(props, ctx: SetupContext) {
    const { dataSource } = useVModels(props, ctx.emit)
    const fieldRequiredMap = reactive<Record<string, any>>({})
    const tableRef = ref<any>()
    const selections = ref<any>([])
    // 菜单
    const contextMenu = [
      {
        label: '向上添加一行',
        fn: (current: CurrentType) => onUpAdd(current),
        icon: 'up',
      },
      {
        label: '向下添加一行',
        fn: (current: CurrentType) => onDownAdd(current),
        icon: 'down',
      },
      {
        label: '删除',
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
            title: '序号',
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

    /**生成slots配置 */
    const generationSlots = computed(() => {
      const slots: Record<string, ({ row, index }: any) => any> = {}
      const columns = props.columns || []
      const lowerCase = (v: string) => v.charAt(0).toLowerCase() + v.slice(1)

      columns.forEach((column: any) => {
        let el = ''
        if (column.el) {
          el = lowerCase(column.el)
        }
        let Widget: Component | any = WidgetMap[el] || null

        if (column.field !== 'action') {
          const config = column.config || {}

          slots[column.field] = ({ row, index }: any) => {
            if (row.el && row.elField === column.field) {
              Widget = WidgetMap[lowerCase(row.el)] || null
            }

            const field = get(row, column.field)

            if (!Widget) {
              const msg = get(row, column.field)
              return msg ? (
                <Text tip={msg} onClick={() => onRowClick({ row })}>
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
                onClick: () => onRowClick({ row }),
              })
            }

            // 后面优化
            if (el === 'tag' && !ops) {
              return (
                <Widget
                  key={column.field}
                  {...config}
                  onClick={() => onRowClick({ row })}
                >
                  {/* {row[column.field]} */}
                  {field}
                </Widget>
              )
            }

            return (
              <Widget
                key={column.field}
                onClick={() => onRowClick({ row })}
                {...config}
                v-model:dataSource={dataSource.value}
                field={column.field}
                index={index}
                options={ops}
                // v-model={row[column.field]}
                modelValue={getFiled.value(row, column.field)}
                onUpdate:modelValue={
                  (val: string | number) => {
                    set(row, column.field, val)
                  }
                  // onUpdateModelValue(val, itemProps.prop)
                  // console.log(row);
                }
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

    const onCheck = (records: any[]) => {
      selections.value = records.map((item) => item.id)
      ctx.emit('check', records)
    }

    const onAdd = () => {
      if (props.create && typeof props.create === 'function') {
        props.create()
        return
      }

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

    watch(
      () => props.columns,
      () => {
        getFieldRequiredMap()
      }
    )

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
                  ElMessage.error(`${item.name}不能为空`)
                  checked = true
                  break
                } else {
                  if (!Object.hasOwn(item, 'isRequired')) {
                    ElMessage.error(`${column.title}不能为空`)
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
                  column.validator(rule, v, errorCallBack, data, index)
                  if (checked) {
                    break
                  }
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
      const data = cloneDeep(dataSource.value)
      if (noCheck || checkRequired(data)) {
        return data.map((item: any) => {
          if (item.id && String(item.id).includes('row_')) {
            return omit(item, ['id'])
          }
          return item
        })
      }
    }

    onMounted(() => getFieldRequiredMap())

    const setCurrentRow = (row: any) => {
      tableRef.value?.setCurrentRow(row[props.idKey])
      ctx.emit('rowClick', row)
    }

    const onRowClick = ({ row }: any) => {
      if (props.isWidgetSelect) {
        setCurrentRow(row)
      }
    }

    ctx.expose({
      getData,
      setCurrentRow,
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
            id={props.idKey}
            ref={tableRef}
            columns={columns.value}
            contextMenu={contextMenuCustom}
            onRowClick={onRowClick}
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
          />
        </div>
      )
    }
  },
})
