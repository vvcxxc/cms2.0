import { provide, inject, ref, computed, watchEffect, watch } from 'vue'
import { StepMap, StepType } from '../type/SOPConfig'
import { ElMessage } from 'element-plus'
import { hasDuplicates } from '@/utils'
import { _t, LanguageScopeKey } from '../app'

const KEY = 'SOP_CONFIG'

const useStore = (props: any, ctx: any) => {
  const stepDataSource = ref<any[]>([])
  const allStepList = ref<StepMap[]>([])
  const curProcessStep = ref<StepMap>({
    processId: '',
    sopSteps: [],
  })
  const curProcessId = ref('')
  const curProductId = computed(() => props.productId)
  const files = ref<any[]>([])

  const checkStep = () => {
    for (let i = 0; i < curProcessStep.value.sopSteps.length; i++) {
      const it = curProcessStep.value.sopSteps[i]
      if (!it.name || !it.description) {
        ElMessage.warning(_t('工步和工步描述为必填'))
        return false
      }
    }

    if (hasDuplicates(curProcessStep.value.sopSteps, 'name')) {
      ElMessage.warning(_t('工步名称不可以重复'))
      return false
    }

    return true
  }

  const setCurProcessStep = () => {
    if (curProcessId.value) {
      const step = allStepList.value.find(
        (item) => item.processId === curProcessId.value
      )

      if (step) {
        curProcessStep.value = step
      } else {
        const newStep = {
          processId: curProcessId.value,
          sopSteps: [],
        }
        curProcessStep.value = newStep
        allStepList.value.push(newStep) // 全部的工步也要添加进去
      }
    }
  }

  return {
    checkStep,
    setCurProcessStep,
    files,
    curProductId,
    stepDataSource,
    allStepList,
    curProcessStep,
    curProcessId,
  }
}

export type StoreType = ReturnType<typeof useStore>

export const createProvider = (props: any, ctx: any) => {
  const store = useStore(props, ctx)
  provide(KEY, store)
  return store
}

export const createInjector = () => {
  return inject(KEY) as StoreType
}
