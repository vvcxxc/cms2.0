import { ref, onMounted, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { injectModel } from '@/libs/Provider/Provider'
import { createProvider } from '../store/ApplyStore'
import { Apply } from '../Models/Apply'
import { ConfirmBox } from '@/components/ConfirmBox/ConfirmBox'
export const useApplyIsseuDialog = (props: any, ctx: any) => {
  const apply = injectModel<Apply>('apply')
  const { checkedList, curFormula} = createProvider(props, ctx)
  const visible = computed({
    get() {
      return props.modelValue
    },
    set(val) {
      ctx.emit('update:modelValue', val)
    },
  })


  const formData = ref({})
  const formRef = ref()

  const onClose = () => {
    visible.value = false
  }

  const getAllStep = async () => {
    // const res = await sopConfig.getAllStep(props.productId)
    // store.allStepList.value = res
    // if (res.length) {
    //   store.setCurProcessStep()
    // }
    // console.log(store)
  }

  watch(
    () => visible.value,
    (val) => {
      if (val) {
        getAllStep()
      }
    }
  )

  const onConfirm = async () => {
    ConfirmBox('是否确认下发').then(async () => {
      console.log(checkedList.value, '---checkedList', curFormula.value);
      const params = {
        workSectionIds: checkedList.value.map(item => item.workSectionId),
        productId: curFormula.value.productId,
        formulaVerionId: curFormula.value.currentVersionId
      }
      await apply.createApply(params)
      ElMessage.success('下发成功')
      visible.value = false
      ctx.emit('confirm')
    })
  }

  return {
    formRef,
    formData,
    visible,
    onClose,
    onConfirm,
  }
}
