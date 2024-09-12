import { defineComponent, onMounted, ref, computed } from 'vue'
import SettingItem from '@/components/SettingItem/SettingItem.vue'
import ElSelect from '@/components/ElSelect/ElSelect'
import ElOption from '@/components/ElSelect/ElOption'
import Icon from '@/components/Icon/Icon'
import styles from './ProductDelivery.module.scss'
import { useGlobalState } from '@/libs/Store/Store'
import { useHook } from '@/libs/Hook/Hook'
import BaseConfigProvider from '@/components/BaseConfigProvider/BaseConfigProvider'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import { Diff } from '../enum'
// import GalleryMaterial from '@/components/Gallery/gallery.vue'
// import { Session } from '@/utils/storage'

export default defineComponent({
  name: 'setting',
  props: {
    workStation: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#9fcdff',
    },
    width: {
      type: Number,
      default: 50,
    },
    height: {
      type: Number,
      default: 30,
    },
    mode: {
      type: Number,
      default: 0,
    },
    diff: {
      type: Number,
      default: Diff,
    },
    destroySpeed: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update'],
  setup(props, { emit }) {
    const { createComputed } = useHook(props, emit)
    const workStation = createComputed('workStation')
    const color = createComputed('color')
    const image = createComputed('image')
    const width = createComputed('width')
    const height = createComputed('height')
    const border = createComputed('border', '#ddd')
    const mode = createComputed('mode', 0)
    const diff = createComputed('diff', Diff)
    const destroySpeed = createComputed('destroySpeed', 1)
    const headers = computed(() => {
      return {
        Authorization: `Bearer ${sessionStorage.getItem('Token')}`,
        'X-Project': sessionStorage.getItem('X-Project'),
      }
    })
    const workStationList = ref<
      {
        label: string
        value: string
      }[]
    >([])
    const { getWorkStationList } = useGlobalState()
    const onWorkSectionChange = () => {}
    const onImageSuccess = (response: any) => {
      image.value = `${response.fileUrl}/raw`
    }
    const onDelImage = (event: Event) => {
      event?.stopPropagation()
      image.value = ''
    }
    // const { workStation, onWorkSectionChange } = useProductDelivery(props)
    onMounted(async () => {
      workStationList.value = await getWorkStationList()
    })
    // const { get } = useGlobalState()
    return () => (
      <div class={styles.content}>
        <SettingItem title="数据">
          <div class={styles.row}>
            <div class={styles.rowStyle}>
              <span class={styles.title}>宽度</span>
              <el-input-number
                style="width: 60px; margin: 0 5px"
                min={1}
                step={1}
                precision={0}
                class="cms-el-input-number-x"
                v-model={width.value}
                controls-position="right"
              />
            </div>
            <div class={styles.rowStyle}>
              <span class={styles.title}>高度</span>
              <el-input-number
                style="width: 60px; margin: 0 5px"
                min={1}
                step={1}
                precision={0}
                class="cms-el-input-number-x"
                v-model={height.value}
                controls-position="right"
              />
            </div>
          </div>
          {/* 工位 */}
          <div class={styles.row}>
            <span>工位</span>
            <ElSelect
              v-model={workStation.value}
              style="width: 200px"
              placeholder="请选择"
              clearable
              filterable
              onChange={onWorkSectionChange}
            >
              {workStationList.value.map((item) => {
                return (
                  <ElOption
                    label={item.label}
                    value={item.value}
                    key={item.value}
                  ></ElOption>
                )
              })}
            </ElSelect>
          </div>
          {/* 模式 */}
          <div class={styles.row}>
            <span>模式</span>
            <ElSelect
              v-model={mode.value}
              style="width: 200px"
              placeholder="请选择"
              clearable
              filterable
            >
              <ElOption label="产品输送" value={0} key="0"></ElOption>
              <ElOption label="产品流出" value={1} key="1"></ElOption>
            </ElSelect>
          </div>
          {/* 模堆叠差式 */}
          <div class={styles.row}>
            <span>堆叠差值</span>
            <el-input-number
              style="width: 60px;"
              min={1}
              max={width.value + 10}
              step={1}
              precision={0}
              class="cms-el-input-number-x"
              v-model={diff.value}
              controls-position="right"
            />
          </div>
          <div class={styles.row}>
            <span>销毁速率</span>
            <el-input-number
              style="width: 60px;"
              min={1}
              max={10}
              step={1}
              precision={1}
              class="cms-el-input-number-x"
              v-model={destroySpeed.value}
              controls-position="right"
            />
          </div>
          <div class={[styles.row, 'dark']}>
            <span>边框</span>
            <BaseConfigProvider>
              <el-color-picker
                class={styles.color}
                v-model={border.value}
              ></el-color-picker>
            </BaseConfigProvider>
          </div>
          {/* 颜色 */}
          <div class={[styles.row, 'dark']}>
            <span>颜色</span>
            <BaseConfigProvider>
              <el-color-picker
                class={styles.color}
                v-model={color.value}
              ></el-color-picker>
            </BaseConfigProvider>
          </div>
          {/* 图片 */}
          <div class={styles.row}>
            <span>图片</span>
            <el-upload
              class={styles.upload}
              action="/api/v1/blob/file?container=ProductDelivery"
              show-file-list={false}
              name="formFile"
              headers={headers.value}
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
              onSuccess={onImageSuccess}
            >
              <div class={styles.uploadContent}>
                {image.value ? (
                  <img src={image.value} style="width: 100%" />
                ) : (
                  <Icon icon="image" width={40} height={40}></Icon>
                )}
                {image.value ? (
                  <div class={styles.mask} onClick={onDelImage}>
                    <SvgIcon
                      class={styles.del}
                      type="del"
                      width={20}
                      color="#f1f1f1"
                      height={20}
                    ></SvgIcon>
                  </div>
                ) : null}
              </div>
            </el-upload>
          </div>
        </SettingItem>
      </div>
    )
  },
})
