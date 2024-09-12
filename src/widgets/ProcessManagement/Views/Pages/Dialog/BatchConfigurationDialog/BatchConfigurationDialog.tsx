import { defineComponent, KeepAlive, PropType, SetupContext } from 'vue'
import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import styles from './BatchConfigurationDialog.module.scss'
import { useBatchConfigurationDialog } from '../../../../Controllers/BatchConfigurationDialog'
import Search from '@/components/Search/Search'
import BatchParamsSignalConfig from './BatchParamsSignalConfig'
import { _t, LanguageScopeKey } from '../../../../app'

interface PropsType {
  modelValue: boolean
  visible: boolean
  flowId: string
}

export default defineComponent({
  name: '批量配置',
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    flowType: {
      type: [String, Number],
      default: '',
    },
    title: {
      type: String as PropType<string>,
      default: '',
    },
  },
  emits: ['update:modelValue', 'confirm', 'close'],
  setup(props: any, ctx: SetupContext) {
    const {
      visible,
      list,
      state,
      s,
      activeList,
      active,
      batchRefTabs,
      errorList,
      onClose,
      onConfirmBatch,
      onSearch,
      onClickStation,
      onOpen,
    } = useBatchConfigurationDialog(props, ctx)

    return () => {
      const workStationList = list.value.length ? list.value : state.value
      return (
        <BaseDialog
          width="1017px"
          height="480px"
          v-model={visible.value}
          title={props.title || _t('批量配置')}
          append-to-body={true}
          destroy-on-close
          submitDisabled={!workStationList.length}
          onClose={onClose}
          onConfirm={onConfirmBatch}
          onOpen={onOpen}
        >
          {workStationList.length ? (
            <div class={styles.batchConfig}>
              <div class={styles.batchConfigLeft}>
                <Search
                  class={styles.search}
                  v-model={s.value}
                  onConfirm={onSearch}
                  placeholder={_t('请输入')}
                />
                {
                  <div class={styles.ul}>
                    {workStationList?.map(
                      (item: { label: string; value: string }) => {
                        return (
                          <div
                            onClick={() => onClickStation(item.value)}
                            class={{
                              [styles.list]: true,
                              [styles.active]: item.value === active.value,
                              [styles.error]: errorList.value.includes(
                                item.value
                              ),
                            }}
                          >
                            {activeList.value.includes(item.value) ? (
                              <div class={styles.noSavePointer}></div>
                            ) : null}
                            {item.label}
                          </div>
                        )
                      }
                    )}
                  </div>
                }
              </div>
              {activeList.value.map((name) => {
                const isShow = name === active.value
                return (
                  <div style={{ display: isShow ? 'block' : 'none' }}>
                    <BatchParamsSignalConfig
                      active={name}
                      ref={(rf: any) => (batchRefTabs.value[name] = rf)}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <el-empty
              style="margin-top: 60px"
              description={_t('暂无数据')}
              LanguageScopeKey={LanguageScopeKey}
            />
          )}
        </BaseDialog>
      )
    }
  },
})
