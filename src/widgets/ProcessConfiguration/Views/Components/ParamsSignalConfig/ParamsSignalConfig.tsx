import { Ref, defineComponent, SetupContext, Fragment } from 'vue'
import styles from './ParamsSignalConfig.module.scss'
import { useParams } from '@/widgets/ProcessManagement/Controllers/ParamsSignalConfig'
import Tab from '@/components/Tab/Tab'
import TabPane from '@/components/Tab/TabPane'
import CommonTable from '../../Components/CommonTable/CommonTable'

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
    height: {
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
  },
  emits: ['update:modelValue'],
  setup(props, ctx: SetupContext) {
    const { onTab, tabData, active, commonRefs } = useParams(props, ctx)
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
                  <TabPane key={item.name} label={item.label} name={item.name}>
                    <CommonTable
                      ref={(rf: any) => (commonRefs.value[item.name] = rf)}
                      isContextMenu={item.isContextMenu}
                      v-model:dataSource={item.data}
                      columns={item.columns}
                      isFooter={item.isFooter}
                      isDrag={item.isDrag}
                      isChecked={item.isChecked}
                      height={props.height || ''}
                    />
                  </TabPane>
                )
              })}
            </Tab>
          </div>
          {!tabData.value.length ? <el-empty description="暂无数据" /> : null}
        </Fragment>
      )
    }
  },
})
