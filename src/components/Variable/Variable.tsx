import { computed, defineComponent, ref } from 'vue'
import sdk from 'sdk'
import styles from './Variable.module.scss'
import Icon from '../Icon/Icon'
import { Base } from '@/libs/Base/Base'
import { useVModels } from '@vueuse/core'
import get from 'lodash/get'
import { set } from 'lodash'
import { text } from 'stream/consumers'
const { openVariableDialog } = sdk.utils
import { getScopeT, Language } from '@/libs/Language/Language'

interface CurrentVariableType {
  id?: string
  name?: string
}

export default defineComponent({
  name: '变量',
  props: {
    modelValue: {
      type: [Number, String],
      default: '',
    },
    isClose: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    // 以下属性用来多选
    dataSource: {
      type: Array,
      default: () => [],
    },
    isMultiple: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    field: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    LanguageScopeKey: {
      type: String,
      default: '',
    },
  },
  emits: ['update:modelValue', 'update:dataSource', 'change'],
  setup(props, { attrs, slots, emit }) {
    const _t = getScopeT(props.LanguageScopeKey)

    const elementType = {
      input: 'input',
      select: 'select',
    }
    const variable = computed({
      get: () => {
        return props.modelValue === null ? '' : String(props.modelValue)
      },
      set: (val) => emit('update:modelValue', val),
    })

    const { dataSource } = useVModels(props, emit)

    /**
     * 多选
     */
    const onMultipleSelectVariable = (varData: any[]) => {
      if (props.field) {
        const index = props.index
        console.log(index, varData, dataSource, 'scope>>>>>>')

        varData.forEach((variable, i: number) => {
          const row: any = dataSource.value[index + i]
          if (row) {
            const v = get(row, props.field)

            if (typeof v !== 'object' || v === null) {
              set(row, props.field, variable.name)
            }
          }
        })
      }
    }

    const onSelectVariable = async () => {
      const currentVariable: CurrentVariableType = {}
      // if (variable.value) {
      //   currentVariable.id = Base.getVariableIdByName(variable.value)
      //   currentVariable.name = variable.value
      // }
      try {
        const varData = await openVariableDialog({
          currentVariable,
          isMultiple: props.isMultiple,
          defaultCheckKey: [],
          showConfig: false,
          configData: {},
        })
        if (!props.isMultiple) {
          variable.value = varData.name
          emit('change', varData.name)
        } else {
          onMultipleSelectVariable(varData)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const onClear = () => {
      variable.value = ''
    }
    return () => {
      const type = props.type || attrs.type
      if (type === elementType.select) {
        return (
          <el-input
            v-model={variable.value}
            {...attrs}
            clearable={props.clearable || props.isClose}
            readonly={props.isClose || props.clearable}
            class={styles.selectVariable}
            placeholder={_t('请选择')}
            suffix-icon={
              <el-button
                link
                type="primary"
                size="small"
                style="margin-right: 10px;"
                onClick={onSelectVariable}
              >
                {_t('选择')}
              </el-button>
            }
          ></el-input>
        )
      }
      if (type === elementType.input) {
        return (
          <el-input
            v-model={variable.value}
            onClick={onSelectVariable}
            {...attrs}
            clearable={props.clearable || props.isClose}
            readonly={props.isClose || props.clearable}
            suffix-icon={
              attrs.disabled ? null : (
                <Icon
                  onClick={onClear}
                  style="cursor: pointer"
                  icon="close_x"
                ></Icon>
              )
            }
          ></el-input>
        )
      }
      return (
        <div class={styles.variable}>
          {variable.value ? (
            <div class={styles.content} onClick={onSelectVariable}>
              <span title={variable.value} class={styles.text}>
                {variable.value}
              </span>
              {props.isClose ? (
                <Icon
                  width={16}
                  height={16}
                  icon="close_x"
                  onClick={() => (variable.value = '')}
                />
              ) : null}
            </div>
          ) : (
            <span onClick={onSelectVariable} class={styles.select}>
              {_t('请选择')}
            </span>
          )}
        </div>
      )
    }
  },
})
