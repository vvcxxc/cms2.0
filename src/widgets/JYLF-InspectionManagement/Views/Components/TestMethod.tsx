import { defineComponent, ref, watch, SetupContext, onMounted } from 'vue'
import { useVModels } from '@vueuse/core'
import { TaskDialogColumns } from '../../enum'
import BaseTable from '@/components/Table/Table'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'

export default defineComponent({
  name: '测试方式',
  props: {
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  emits: ['update:modelValue', 'confirm'],
  setup(props: any, ctx: SetupContext) {
    const { modelValue } = useVModels(props, ctx.emit)

    const tableRef = ref()
    const dataSource = ref<any[]>([])
    const isinit = ref(false)
    watch(
      () => props.count,
      (val, oldVal) => {
        if (isinit && !/^[1-9]\d*$/.test(String(val))) {
          ElMessage.warning('请输入正整数')
          dataSource.value = []
          return
        }
        if (val === oldVal) return
        let groups = []
        for (let i = 0; i < val; i++) {
          groups.push({
            id: uuidv4(),
            judge: '',
          })
        }
        dataSource.value = groups
        setTimeout(() => {
          sumbit()
        })
      }
    )
    onMounted(() => {
      setTimeout(() => {
        dataSource.value = modelValue.value
        isinit.value = true
      })
    })
    const sumbit = () => {
      const data = cloneDeep(dataSource.value)
      modelValue.value = data
      ctx.emit('confirm', data)
    }
    return () => {
      return (
        <BaseTable
          ref={tableRef}
          v-model:dataSource={dataSource.value}
          columns={TaskDialogColumns}
          isHidePagination={true}
          v-slots={{
            judge: ({ row }: any) => {
              return (
                <el-select v-model={row.judge} onChange={sumbit}>
                  <el-option label="OK" value={1}></el-option>
                  <el-option label="NG" value={2}></el-option>
                </el-select>
              )
            },
          }}
        ></BaseTable>
      )
    }
  },
})
