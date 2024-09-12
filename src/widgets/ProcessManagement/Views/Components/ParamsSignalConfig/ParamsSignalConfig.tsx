import {
  Ref,
  defineComponent,
  SetupContext,
  Fragment,
  DefineComponent,
  PropType,
} from 'vue'
import styles from './ParamsSignalConfig.module.scss'
import { useParams } from '@/widgets/ProcessManagement/Controllers/ParamsSignalConfig'
import Tab from '@/components/Tab/Tab'
import TabPane from '@/components/Tab/TabPane'
import CommonTable from '../../Components/CommonTable/CommonTable'
import { isEdition } from '@/libs/Permission/Permission'
import { _t, LanguageScopeKey } from '../../../app'

export default defineComponent({
  name: '参数配置',
  props: {
    // modelValue: {
    //   type: Boolean,
    //   default: false,
    // },
    data: {
      type: Object,
      default: () => ({}),
    },
    maxHeight: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    row: {
      type: Object,
      default: () => ({}),
    },
    sectionKeyMap: {
      type: Object,
      default: () => ({}),
    },
    id: {
      type: String as PropType<string>,
      default: '',
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx: SetupContext) {
    const { onTab, tabData, active, commonRefs, onChangeAbility } = useParams(
      props,
      ctx
    )
    return () => {
      const style = props.width ? { width: props.width } : {}
      Object.assign(style, {
        visibility: tabData.value.length ? 'visible' : 'hidden',
      })
      return (
        <Fragment>
          <div class={styles.drawer} style={style}>
            <Tab
              v-model:active={active.value}
              size="small"
              type="params"
              onTab={onTab}
            >
              {tabData.value.map((item) => {
                return (
                  <TabPane
                    isHide={!isEdition([item.edition])}
                    key={item.name}
                    label={item.label}
                    name={item.name}
                  >
                    <CommonTable
                      ref={(rf: any) => {
                        if (props.id) {
                          commonRefs.value[props.id] =
                            commonRefs.value[props.id] || {}
                          commonRefs.value[props.id][item.name] = rf
                        } else {
                          commonRefs.value[item.name] = rf
                        }
                      }}
                      isContextMenu={item.isContextMenu}
                      v-model:dataSource={item.data}
                      columns={item.columns}
                      isFooter={item.isFooter}
                      isDrag={item.isDrag}
                      isChecked={item.isChecked}
                      max-height={props.maxHeight || ''}
                      LanguageScopeKey={LanguageScopeKey}
                      v-slots={{
                        // 功能选项
                        abilityValue: (
                          Widget: DefineComponent,
                          { row, config, options }: any
                        ) => {
                          return (
                            <Widget
                              {...config}
                              v-model={row.abilityValue}
                              options={options}
                              onChange={() => onChangeAbility(row, options)}
                            />
                          )
                        },
                      }}
                    />
                  </TabPane>
                )
              })}
            </Tab>
          </div>
          {!tabData.value.length ? (
            <el-empty description={_t('暂无数据')} />
          ) : null}
        </Fragment>
      )
    }
  },
})
