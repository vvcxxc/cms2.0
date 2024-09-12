import { defineComponent, computed, ref, nextTick } from 'vue'
import styles from './ConditionDialog.module.scss'
import BaseDialog from '@/components/BaseDialog/index.vue'
import DyForm from '@/components/DyForm/DyForm'
import { CirclePlus, Delete } from '@element-plus/icons-vue'
import NodeDialog from '../NodeDialog/NodeDialog'
import {
  ConditionType,
  CompositeCondition,
  ConditionItemType,
} from '../../core/enum'
import { Condition } from '../../type'
import { v4 as uuidv4 } from 'uuid'
import { cloneDeep } from 'lodash'
interface CompositeCondition {
  Expression: string
  Label: string
  NOT: boolean
  Operator: string
  Property: string
  Value: {
    '@_xsi:type': string
    '#text': string | number // Assuming "#text" can be either string or number
  }
}
export default defineComponent({
  name: '条件集',
  props: {
    formItemProps: {
      type: Array,
      default: [],
    },
    conditionOptions: {
      type: Array,
      default: [],
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    onConditionChange: {
      type: Function,
      default: () => null,
    },
    getCondition: {
      type: Function,
      default: () => null,
    },
  },
  emits: ['update:modelValue', 'update:formData', 'updateFormData'],

  setup(props, ctx) {
    const edgeType = ref('')
    const visible = ref(false)
    const formRef = ref(null)
    const dataSource = ref([])
    const treeRef = ref()
    const nodeVisible = ref(false)
    const currentFormData = ref({})
    const formItemProps = ref<any[]>([])
    const currentNode = ref<{
      nodeData: {
        children?: any[]
        [key: string]: any
      } | null
    }>({
      nodeData: null,
    })
    const formData = ref<Condition | Record<string, any>>({})

    const currentCondition = computed(() => {
      const type = edgeType.value
      return props.getCondition(type, currentFormData.value)
    })
    /**
     * 是否是复合类型
     */
    const onOpenCondition = () => {
      const nodeId = uuidv4()
      formData.value = cloneDeep(props.formData)
      formData.value.nodeId = nodeId
      formData.value.root = true
      visible.value = true
      nextTick(async () => {
        await handleNodeClick(formData.value as Condition)
        treeRef.value.setCurrentKey(nodeId)
      })
    }

    const onConfirmBtn = () => {
      ctx.emit('updateFormData', formData.value)
      visible.value = false
    }

    const onAddNode = (data: Condition) => {
      currentNode.value.nodeData = data
      nodeVisible.value = true
    }

    const onDeleteNode = (node: any, data: Condition) => {
      const nodeId = data.nodeId
      if (node.parent) {
        node.parent.data.children = node.parent.data.children.filter(
          (data: Condition) => {
            data.nodeId !== nodeId
          }
        )
        nextTick(async () => {
          await handleNodeClick(formData.value as Condition)
        })
      }
    }

    const handleNodeClick = async (data: Condition | any) => {
      const formItems = await props.onConditionChange(
        data[ConditionType],
        false
      )
      formItemProps.value = [
        {
          label: '条件',
          prop: ConditionType,
          clearable: true,
          el: 'select',
          placeholder: '请选择',
          options: props.conditionOptions,
          disabled: true,
        },
        ...formItems,
      ]
      currentFormData.value = data
      edgeType.value = data[ConditionType]
      setCurrentKey(data.nodeId)
    }
    // 节点类型弹窗

    const onConditionDialog = async (data: Condition) => {
      const nodeData = currentNode.value.nodeData
      if (nodeData) {
        data.nodeId = uuidv4()
        nodeData.children = nodeData.children || []
        nodeData.children.push(data)
        await handleNodeClick(data)
        setCurrentKey(data.nodeId)
      }
    }

    const setCurrentKey = (nodeId: string) => {
      nextTick(() => {
        treeRef.value.setCurrentKey(nodeId)
      })
    }

    return () => {
      console.log(formData.value, 'formData.value')
      return (
        <div class={styles.conditionDialog}>
          {/* <el-input
            readonly
            placeholder="请选择条件集"
            v-model={condition.value}
            onClick={onOpenCondition}
          /> */}
          <el-button
            onClick={onOpenCondition}
            style="width: 200px;"
            size="small"
          >
            集合
          </el-button>
          <NodeDialog
            options={props.conditionOptions}
            v-model:visible={nodeVisible.value}
            onConfirm={onConditionDialog}
          ></NodeDialog>

          <BaseDialog
            width="800px"
            title="条件集"
            v-model={visible.value}
            onClose={() => (visible.value = false)}
            onConfirm={onConfirmBtn}
            destroy-on-close
          >
            {formData.value.nodeId ? (
              <div class={styles.dialog}>
                <div class={styles.leftBar}>
                  <el-tree
                    style="max-width: 200px"
                    ref={treeRef}
                    class={styles.tree}
                    data={[formData.value]}
                    node-key="nodeId"
                    onNodeClick={handleNodeClick}
                    default-expand-all
                    highlight-current
                    expand-on-click-node={false}
                    v-slots={{
                      default: ({ node, data }: any) => {
                        return (
                          <div class={styles.nodeStyle}>
                            <span class={styles.label}>
                              {data.Label || data.label || '请输入标签内容'}
                            </span>
                            <div class={styles.tools}>
                              {data[ConditionType] === CompositeCondition ? (
                                <el-button
                                  onClick={() => onAddNode(data)}
                                  type="primary"
                                  link
                                >
                                  <el-icon>
                                    <CirclePlus />
                                  </el-icon>
                                </el-button>
                              ) : null}
                              <el-button
                                onClick={() => onDeleteNode(node, data)}
                                class={styles.box}
                                type="primary"
                                link
                                disabled={data.root}
                              >
                                <el-icon>
                                  <Delete />
                                </el-icon>
                              </el-button>
                            </div>
                          </div>
                        )
                      },
                    }}
                  ></el-tree>
                </div>
                <div class={styles.content}>
                  <DyForm
                    // ref={formConditionRef}
                    isLine={true}
                    formItemProps={formItemProps.value}
                    v-model:formData={currentFormData.value}
                    labelWidth="140px"
                  ></DyForm>
                  <div class={styles.condition}>{currentCondition.value}</div>
                </div>
              </div>
            ) : null}
          </BaseDialog>
        </div>
      )
    }
  },
})
