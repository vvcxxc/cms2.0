import {
  defineComponent,
  ref,
  computed,
  onMounted,
  watch,
  onUnmounted,
  Component,
  inject,
} from 'vue'
import styles from './TableFilter.module.scss'
import { CaretBottom } from '@element-plus/icons-vue'
import IconButton from '@/components/IconButton/IconButton'

import ElInput from '../Input/Input'
import Select from '@/components/Select/Select'
import Option from '@/components/Select/Option'
import Icon from '../Icon/Icon'
import { FormPropsType, FormItemPropType, PropsType } from '../DyForm/DyForm.d'
import isNil from 'lodash/isNil'
import { useVModel } from '@vueuse/core'
import { Language, scope } from '@/libs/Language/Language'
import { c } from 'vite/dist/node/types.d-AKzkD8vd'

const formItemElementMap: Record<string, any> = {
  input: ElInput,
  select: Select,
}

const Type: Record<string, string> = {
  select: 'select',
}

interface FieldMapType {
  [key: string]: Array<{
    label: string
    value: string | number | boolean
  }>
}
export default defineComponent({
  name: '表格筛选',
  props: {
    title: {
      type: String,
      default: '',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    tableRef: {
      type: Object,
      default: null,
    },
    modelValue: {
      type: Object,
      default: null,
    },
    text: {
      type: String,
      default: '',
    },
    fieldMap: {
      type: Object,
      default: () => ({}),
    },
    options: {
      type: Array,
      default: () => [],
    },
    defaultOptions: {
      type: Array,
      default: () => [],
    },
    LanguageScopeKey: {
      type: String,
    },
  },
  emits: ['update:modelValue', 'data', 'change'],
  setup(props, { attrs, slots, emit }) {
    const visible = ref(false)
    const columnsFilter = ref<FormItemPropType>([])
    const isDisabled = ref<boolean>(false)
    const defaultData = ref({})
    const data = ref({})
    const optionMap = ref<Record<string, any>>({})
    const LanguageScopeKey = inject('LanguageScopeKey')
    const _t = computed(() => {
      return scope(props.LanguageScopeKey || LanguageScopeKey)
    })
    const form = computed({
      get() {
        return props.modelValue
      },
      set(v) {
        emit('update:modelValue', v)
      },
    })

    const formData = props.modelValue ? form : data
    let flag = false
    /**
     * 添加筛选条件
     */
    const onAddFilter = (isInit?: boolean) => {
      if (isInit) {
        columnsFilter.value = []
      }
      let length = columnsFilter.value.length
      for (let index = 0; index < props.columns.length; index++) {
        const element: any = props.columns[index]
        if (element.el && !columnsFilter.value.includes(element)) {
          columnsFilter.value.push(element)
          break
        }
      }
      if (length === columnsFilter.value.length - 1) {
        isDisabled.value = true
      }
    }

    /**
     * 重置所有状态，初始化表格
     *  */
    const onReset = () => {
      // columnsFilter.value = []
      // Object.entries(defaultData.value).forEach(([key, value]) => {
      //   formData.value[key] = value
      // })
      // onAddFilter()
      // onSearchTable()
    }
    /**
     * 打开弹窗
     */
    const onListener = () => {
      visible.value = false
    }
    /**
     * 子组件点击
     * @param evt
     */
    const onChildClick = async (evt: Event) => {
      evt.stopPropagation()
      await getOptions()
      visible.value = true
    }
    /**
     * 表格搜索
     */
    const onSearchTable = () => {
      const tableRef =
        props.tableRef && props.tableRef.value
          ? props.tableRef.value
          : props.tableRef
      const data: Record<string, any> = { ...formData.value }

      Object.entries(data).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          data[key] = ''
        }
      })
      if (tableRef) {
        tableRef?.getList?.(data)
      } else {
        emit('data', data)
        emit('change', data)
      }
    }
    const hasFormData = computed(() => {
      if (Object.keys(formData.value).length === 0) return false
      return Object.entries(formData.value).every(([key, value]) => {
        return value !== null && value !== undefined && value !== ''
      })
    })
    /**
     * 初始化disabled状态
     */
    const initDisabled = () => {
      const els = props.columns.filter((column: any) => column.el)
      if (els.length <= 1) {
        isDisabled.value = true
      } else {
        isDisabled.value = false
      }
    }

    watch(
      () => props.columns,
      (val) => {
        if (props.columns.length) {
          onAddFilter(true)
          initDisabled()
          flag = true
        }
      },
      {
        immediate: true,
        deep: true,
      }
    )

    onMounted(() => {
      if (props.columns.length) {
        onAddFilter(true)
        initDisabled()
        flag = true
      }
      defaultData.value = { ...props.modelValue }
      document.addEventListener('click', onListener)
    })

    onUnmounted(() => {
      document.removeEventListener('click', onListener)
    })

    // const getOptions = async (
    //   item: Record<string, any>,
    //   $props: Record<string, any>
    // ) => {
    //   if (typeof item.options === 'function') {
    //     return await item.options()
    //   } else {
    //     let options: any =
    //       item.options || props.fieldMap?.[$props.item.prop] || []
    //     if (props.defaultOptions.length) {
    //       options = options.concat(props.defaultOptions)
    //     }
    //     return options
    //   }
    // }
    const getOptions = async () => {
      const columns = props.columns
      for (let index = 0; index < columns.length; index++) {
        const column: any = columns[index]
        if (column.prop) {
          let options: any[] = []
          if (typeof column.options === 'function') {
            options = await column.options()
          } else {
            options = column.options || props.fieldMap?.[column.prop] || []
          }
          if (props.defaultOptions.length) {
            options = props.defaultOptions.concat(options)
          }
          optionMap.value[column.prop] = options
        }
      }
    }

    const onClickBtn = (evt: Event) => {
      evt.stopPropagation()
      flag = false
      onAddFilter()
    }

    /**
     * option
     * @param $props
     * @returns
     */
    const Column = ($props: any) => {
      const column: Record<string, any> = $props.item
      const options = optionMap.value[column.prop] || []
      if (Type[column.el]) {
        return options.map(
          (el: {
            label: string
            description: string
            value: string | number
            name: string
          }) => (
            <Option
              label={el.description || el.label || el.name}
              value={el.value}
            ></Option>
          )
        )
      }
      return null
    }

    return () => {
      const icon = isDisabled.value ? 'icon_add2' : 'add-p'

      return (
        <div onClick={onChildClick}>
          <el-popover
            visible={visible.value}
            placement="bottom-start"
            width={296}
            show-arrow={false}
            popper-class={styles.popover}
            persistent={false}
            popper-style={{
              marginTop: '-7px',
              padding: '10px',
              paddingBottom: '8px',
            }}
            trigger="click"
            vSlots={{
              reference: () => (
                <span class={{ [styles.textColor]: hasFormData.value }}>
                  {slots.default?.()}
                </span>
              ),
            }}
            onShow={onReset}
          >
            <div
              class={styles.box}
              onClick={(evt: Event) => {
                evt.stopPropagation()
              }}
            >
              {columnsFilter.value.map((column: any) => {
                const Widget = formItemElementMap[column.el] || null

                return Widget ? (
                  <div class={styles.filter}>
                    <span class={styles.span}>{_t.value(column.title)}: </span>
                    <Widget
                      v-model={formData.value[column.prop]}
                      style="width: 160px;margin-left: 16px"
                      // size="small"
                      placeholder={_t.value(`${column.placeholder}`)}
                      onChange={onSearchTable}
                      clearable
                      teleported={false}
                    >
                      <Column item={column} />
                    </Widget>
                  </div>
                ) : null
              })}
            </div>
            <IconButton
              onClick={onClickBtn}
              icon={icon}
              disabled={isDisabled.value}
            >
              {props.text}
            </IconButton>
          </el-popover>
        </div>
      )
    }
  },
})
