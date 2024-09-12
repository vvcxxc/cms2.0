import { defineComponent, onMounted, reactive, ref } from 'vue'
import styles from './ConsoleManagement.module.scss'
import { injectModel } from '@/libs/Provider/Provider'
import { Console } from '../Models/Console'
import ElSelect from '@/components/ElSelect/ElSelect'
import ElOption from '@/components/ElSelect/ElOption'
import SettingItem from '@/components/SettingItem/SettingItem.vue'
import { useHook } from '@/libs/Hook/Hook'

export default defineComponent({
  name: 'ConsoleManagementSettings',
  props: {
    showFilter: {
      type: Boolean,
      default: true,
    },
    workSection: {
      type: String,
      default: '',
    },
    workStation: {
      type: String,
      default: '',
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const { createComputed } = useHook(props, emit)

    const consoleModel = injectModel<Console>('Console')
    const workSectionMap = ref<{
      tree: any[]
      items: any[]
    }>({
      tree: [],
      items: [],
    })
    const workSection = createComputed('workSection')
    const workStation = createComputed('workStation')
    const showFilter = createComputed('showFilter', true)

    const workStationList = ref<any>([])
    const initWorkSectionList = async () => {
      workSectionMap.value = await consoleModel.getWorkSection()
    }

    const onWorkSectionChange = () => {
      //实测此时workSection还是改变之前的值
      setTimeout(async () => {
        workStation.value = ''
        workStationList.value = await consoleModel.getWorkStation(
          workSection.value
        )
      })
    }

    onMounted(() => {
      initWorkSectionList()
    })
    return () => (
      <div class={styles.left}>
        <SettingItem title="工位筛选栏">
          <el-checkbox v-model={showFilter.value} class="cms-el-checkbox">
            显示工位筛选栏
          </el-checkbox>
        </SettingItem>
        {!showFilter.value && (
          <SettingItem title="数据">
            <div class={styles.row}>
              <span>工序</span>
              <ElSelect
                v-model={workSection.value}
                onChange={onWorkSectionChange}
                clearable={false}
                filterable
                class="cms-el-select"
                node-key="id"
                props={{
                  label: 'name',
                }}
                data={workSectionMap.value.items}
                placeholder="请选择工序"
              >
                {workSectionMap.value?.items?.map((item: any) => {
                  return (
                    <ElOption
                      label={item.name}
                      value={item.id}
                      key={item.id}
                    ></ElOption>
                  )
                })}
              </ElSelect>
            </div>
            <div class={styles.row}>
              <span>工位</span>
              <ElSelect
                clearable={false}
                class="cms-el-select"
                filterable
                v-model={workStation.value}
                placeholder="请选择工位"
              >
                {workStationList.value.map((item: any) => {
                  return (
                    <ElOption
                      label={item.name}
                      value={item.id}
                      key={item.id}
                    ></ElOption>
                  )
                })}
              </ElSelect>
            </div>
          </SettingItem>
        )}
      </div>
    )
  },
})
