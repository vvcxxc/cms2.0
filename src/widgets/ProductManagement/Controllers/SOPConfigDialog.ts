import { ref, onMounted, reactive, computed, watch } from 'vue'
import { FormItemPropType } from '@/components/DyForm/DyForm.d'
import { SOPConfig } from '../Models/SOPConfig'
import { StoreType, createProvider } from '../store/SOPStore'
import { ElMessage } from 'element-plus'
import { injectModel } from '@/libs/Provider/Provider'
import { _t } from '../app'

export const useSOPConfigDialog = (props: any, ctx: any) => {
  const sopConfig = injectModel<SOPConfig>('sopConfig')
  const store = createProvider(props, ctx)

  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })

  const stepRef = ref()
  const sectionRef = ref()

  const formData = ref({})
  const formRef = ref()

  const onClose = () => {
    visible.value = false
  }

  const getAllStep = async () => {
    const res = await sopConfig.getAllStep(props.productId)
    store.allStepList.value = res
    if (res.length) {
      store.setCurProcessStep()
      store.firstOpen.value = false
    }
  }

  watch(
    () => visible.value,
    (val) => {
      if (val) {
        store.firstOpen.value = true
        store.files.value = []
        store.curProcessId.value = ''
        store.allStepList.value = []
        getAllStep()
      }
    }
  )

  const onConfirm = async () => {
    if (!store.checkStep()) {
      return
    }
    console.log(store.allStepList, 'store.allStepList --=-')

    const params = new FormData()
    store.allStepList.value.forEach((item) => {
      item.sopSteps.forEach((it, index, arr) => {
        it.sort = index
        if (it.id?.includes('row_')) {
          delete it.id
        }
      })

      params.append('dtojsons', JSON.stringify(item))
    })

    store.files.value.forEach((file) => {
      params.append('files', file)
    })

    await sopConfig.saveStep(props.productId, params)
    ElMessage.success(_t('操作成功'))
    visible.value = false
    ctx.emit('confirm')
  }

  return {
    stepRef,
    sectionRef,
    formRef,
    formData,
    visible,
    onClose,
    onConfirm,
  }
}
