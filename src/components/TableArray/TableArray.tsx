import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import styles from './TableArray.module.scss'
import CommonTable from '@/components/CommonTable/CommonTable'
import { debounce } from 'lodash'

interface Category {
  name: string
  description: string
  propertyKey: string
  propertyType: string
  propertyValue: boolean
  sort: number
  visible: boolean
  elementAttributes: any[]
  elementType: string | null
  propertyData: any[] | null
}
const elTypeMap: Record<string, string> = {
  String: 'input',
  Boolean: 'switch',
  Enum: 'select',
  Int32: 'inputNumber',
  Int64: 'inputNumber',
  Double: 'inputNumber',
  Float: 'inputNumber',
  Object: 'input',
}
export default defineComponent({
  name: 'TableArray',
  props: {
    elementAttributes: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: 'ArrayList',
    },
    elementType: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [Array, Object, String],
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const commonRefs = ref()
    const dataSource = ref<Record<string, any>>([])

    const currentFormValue = computed(() => {
      if (props.elementType) {
        return {
          [props.elementType]: dataSource.value.map((item: any) => {
            const obj = { ...item }
            if (obj.id) delete obj.id
            return obj
          }),
        }
      } else {
        return {}
      }
    })

    const columns = computed(() => {
      return props.elementAttributes
        .filter((element: any) => element.visible)
        .map((element) => {
          const category = element as Category
          return {
            title: category.name,
            field: category.propertyKey,
            el: elTypeMap[category.propertyType],
            props: {
              title: category.description,
            },
          }
        })
    })

    const onChangeCurrentValue = debounce(() => {
      const data = currentFormValue.value
      emit('update:modelValue', data)
    }, 100)

    watch(dataSource, onChangeCurrentValue, { deep: true })

    onMounted(() => {
      setTimeout(() => {
        if (props.modelValue && props.elementType) {
          const data: any = props.modelValue
          if (data[props.elementType]) {
            if (props.type === 'ArrayList') {
              if (Array.isArray(data[props.elementType])) {
                dataSource.value = data[props.elementType]
              } else {
                dataSource.value = [data[props.elementType]]
              }
            } else {
              dataSource.value = [data[props.elementType]]
            }
          }
        }
      })
    })

    return () => {
      return (
        <div class={styles.tableArray}>
          <CommonTable
            ref={commonRefs}
            isContextMenu={true}
            v-model:dataSource={dataSource.value}
            columns={columns.value}
            isFooter={true}
            isDrag={true}
            isChecked={false}
            height="300px"
          />
        </div>
      )
    }
  },
})
