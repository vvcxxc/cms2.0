import {
  computed,
  ref,
  defineComponent,
  SetupContext,
  onMounted,
  reactive,
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
import { _t } from '@/libs/Language/Language'

const WidgetMap = {
  tag: Tag,
  input: BaseInput,
  variable: Variable,
  constant: BaseInput,
  parsingBarcode: null,
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
    LanguageScopeKey: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx: SetupContext) {
    const { dataSource } = useVModels(props, ctx.emit)
    const fieldRequiredMap = reactive({})

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
          dataSource.value.splice(index, 1)
        },
        icon: 'close',
      },
    ]

    const onUpAdd = ({ row, index }: CurrentType) => {
      dataSource.value.splice(index, 0, genData())
    }

    const onDownAdd = ({ row, index }: CurrentType) => {
      dataSource.value.splice(index + 1, 0, genData())
    }

    const genData = () => {
      return new Create({})
    }

    /**生成slots配置 */
    const generationSlots = computed(() => {
      const slots = {}
      const columns = props.columns || []
      columns.forEach((column: any) => {
        let el = null
        if (column.el) {
          el = column.el.charAt(0).toLowerCase() + column.el.slice(1)
        }
        const Widget = WidgetMap[el] || null
        if (column.field !== 'action' && Widget) {
          const config = column.config || {}
          slots[column.field] = ({ row }: any) => {
            return (
              <Widget
                {...config}
                dataSource={dataSource.value}
                options={row.options}
                v-model={row[column.field]}
              />
            )
          }
        }
      })
      return slots
    })

    const onCheck = (fn: any) => {
      return () => {}
    }

    const onAdd = () => {
      dataSource.value.push(genData())
    }

    const onDelRow = (row: any) => {
      dataSource.value = dataSource.value.filter((item) => item !== row)
    }
    /**
     * 获取字段Required
     */
    const getFieldRequiredMap = () => {
      props.columns.forEach((item: any) => {
        if (item.required) {
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
            for (let index = 0; index < fields.length; index++) {
              const fieldKey = fields[index]
              if (!item[fieldKey]) {
                const column = fieldRequiredMap[fieldKey]
                ElMessage.error(`${column.title} ${_t('不能为空')}`)
                checked = true
                break
              }
            }
          }
        }
      }
      return !checked
    }

    /**
     * 获取数据，并提供校验，删除多余字段
     */
    const getData = () => {
      const data = cloneDeep(dataSource.value)
      if (checkRequired(data)) {
        return data.map((item: any) => {
          if (item.id && String(item.id).includes('row_')) {
            return omit(item, ['id'])
          }
          return item
        })
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
            columns={[
              {
                type: 'seq',
                width: 40,
                title: _t('序号'),
              },
              ...props.columns,
            ]}
            contextMenu={contextMenuCustom}
            vSlots={{
              ...generationSlots.value,
              action: ({ row }: any) => (
                <Icon icon="closeDark" onClick={() => onDelRow(row)} />
              ),
            }}
            size="mini"
            v-model:dataSource={dataSource.value}
            isHidePagination={true}
            isChecked={props.isChecked}
            isDrag={props.isDrag}
            isFooter={props.isFooter}
            isVScroll
            onCheck={onCheck}
            onClickFooter={onAdd}
            LanguageScopeKey={props.LanguageScopeKey}
          />
        </div>
      )
    }
  },
})
