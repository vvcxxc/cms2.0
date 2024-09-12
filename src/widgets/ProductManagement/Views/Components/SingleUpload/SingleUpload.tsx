import { defineComponent, ref, computed } from 'vue'
import styles from './SingleUpload.module.scss'
import IconButton from '@/components/IconButton/IconButton'
import Pdf from '@/components/Pdf/index.vue'
import { UploadInstance } from 'element-plus'
import { getPdf } from '@/widgets/ProductManagement/Models/Service/Service'
import Icon from '@/components/Icon/Icon'
import { _t } from '../../../app'

export default defineComponent({
  name: '上传文件',
  props: {
    file: {
      type: String,
      default: '',
    },
    fileIcon: {
      type: String,
      default: 'pdf',
    },
    accept: {
      type: String,
      default: '',
    },
    stepId: {
      type: String,
      default: '',
    },
    productId: {
      type: String,
      default: '',
    },
    processId: {
      type: String,
      default: '',
    },
    hasAnnex: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  setup(props, { slots, emit }) {
    const files = ref<any[]>([])

    const uploadRef = ref<UploadInstance>()

    const handleUploadChange = (res: string) => {
      emit('change', res)
    }

    const handleSelectFile = () => {
      if (!uploadRef.value) return
      uploadRef.value.$el.querySelector('input').click()
    }

    const hasFile = computed(() => {
      return !!files.value.length || props.hasAnnex
    })

    const fileUrl = ref('')

    const getPdfFile = async () => {
      const res = await getPdf(props.productId, props.processId, props.stepId)
      fileUrl.value = URL.createObjectURL(res)
      visible.value = true
    }

    const showPDf = async () => {
      if (!hasFile.value) return

      if (files.value.length) {
        const head = files.value[0]
        const file = head.raw ? head.raw : head

        // @ts-ignore
        fileUrl.value = URL.createObjectURL(file)
        visible.value = true
      } else {
        getPdfFile()
      }
    }
    const onExceed = (exceedFiles: File[]) => {
      if (exceedFiles.length) {
        files.value = [
          {
            raw: exceedFiles[0],
          },
        ]
        emit('change', exceedFiles[0])
      }
    }

    const onShow = () => {
      if (props.file) {
        files.value = [props.file]
      }
    }

    const visible = ref(false)

    return () => (
      <div class={styles.container}>
        <el-popover
          popper-style="width:240px;height: 170px"
          placement="top-start"
          trigger="click"
          // popper-class="singleUploadCustomStyle"
          popper-class={styles.popperClass}
          onShow={onShow}
          v-Slots={{
            reference: () =>
              slots.default ? (
                slots.default()
              ) : (
                <Icon
                  style="margin-left: 4px; cursor:pointer"
                  icon="add-annex"
                  width={16}
                  height={16}
                />
              ),
          }}
        >
          <el-upload
            ref={uploadRef}
            v-model:file-list={files.value}
            class={styles.upload}
            drag
            autoUpload={false}
            accept={props.accept}
            show-file-list={false}
            onChange={handleUploadChange}
            onExceed={onExceed}
            limit={1}
            vSlots={{
              tip: () => (
                <div class={styles.tipWrap}>
                  {hasFile.value ? (
                    <div class={styles.preView}>
                      <IconButton icon="pre_icon" onClick={showPDf}>
                        {_t('预览')}
                      </IconButton>
                      {/* <IconButton icon="delete" style="margin-left:10px">删除</IconButton> */}
                    </div>
                  ) : (
                    <IconButton icon="add-p" onClick={handleSelectFile}>
                      {_t('添加本地文件')}
                    </IconButton>
                  )}
                </div>
              ),
            }}
          >
            {hasFile.value ? (
              <div class={styles.abbreviate}>
                <div class={styles.iconBorder}>
                  <Icon icon={props.fileIcon} width={40} height={40} />
                </div>
              </div>
            ) : (
              <div class="el-upload__text" style="line-height:37px">
                {_t('拖拽至这里上传')}
              </div>
            )}
          </el-upload>
        </el-popover>

        {/* @ts-ignore */}
        <Pdf v-model={visible.value} pdfSrc={fileUrl.value} />
      </div>
    )
  },
})
