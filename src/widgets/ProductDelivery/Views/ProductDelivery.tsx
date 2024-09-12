import { computed, defineComponent, ref, inject } from 'vue'
import { useProductDelivery } from '../Controller/ProductDeliver'
import styles from './ProductDelivery.module.scss'
import { Rect, TipTypeEnum } from '../Types/index.d'
import BaseTable from '@/components/Table/Table'
import Debugger from './Components/Debugger/Debugger'
export default defineComponent({
  name: 'setting',
  props: {
    node: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const {
      color,
      image,
      rectList,
      rectMap,
      width,
      height,
      border,
      containerRef,
      tip,
      visible,
      containerConfig,
      debuggerData,
      tipType,
      workStation,
      onShowTip,
      onClickSvgContent,
    } = useProductDelivery(props, emit)
    const columns = [
      {
        field: 'seq',
        type: 'seq',
        title: '序号',
      },
      {
        field: 'serialNumber',
        title: '产品码',
      },
      {
        field: 'isQualified',
        title: '是否合格',
        width: '100px',
      },
    ]
    const isApp = inject('isApp', false)

    const RenderDialog = () => {
      if (tipType.value === TipTypeEnum.table) {
        return (
          <div style={{ height: '300px' }}>
            <BaseTable
              v-model:dataSource={rectList.value}
              isSeq={true}
              isHidePagination={true}
              isChecked={false}
              isDrag={false}
              columns={columns}
              vSlots={{
                isQualified: ({ row }: any) => {
                  return (
                    <span style={!row.isQualified ? { color: 'red' } : {}}>
                      {row.isQualified ? 'OK' : 'NG'}
                    </span>
                  )
                },
              }}
            ></BaseTable>
          </div>
        )
      }
      return <div class={styles.boxInfo}>产品码: {tip.value}</div>
    }

    return () => {
      const h = (containerConfig.value?.height || 0) / 2
      const SvgLabel = image.value ? 'image' : 'rect'
      return (
        <div
          class={styles.content}
          ref={containerRef}
          onClick={onClickSvgContent}
        >
          <svg class={styles.svg}>
            {rectList.value.map((item: Rect) => {
              const rect = rectMap.value[item.serialNumber]
              return rect.status === 1 ? (
                <SvgLabel
                  onClick={(event) => onShowTip(event, item)}
                  key={item.serialNumber}
                  x={rect.x}
                  y={h - height.value / 2}
                  width={width.value}
                  height={height.value}
                  fill={color.value}
                  stroke={border.value}
                  string-width="1"
                  href={image.value}
                  class={styles.svgRect}
                ></SvgLabel>
              ) : null
            })}
          </svg>
          <el-dialog
            v-model={visible.value}
            modal={false}
            width={tipType.value === TipTypeEnum.table ? '400' : '300'}
            draggable
            append-to-body
            class={styles.dialog}
            onClose={() => (visible.value = false)}
          >
            <RenderDialog />
          </el-dialog>
          <information-debugger>
            <Debugger
              workStation={workStation.value}
              debuggerData={debuggerData.value}
              rectMap={rectMap.value}
            />
          </information-debugger>
        </div>
      )
    }
  },
})
