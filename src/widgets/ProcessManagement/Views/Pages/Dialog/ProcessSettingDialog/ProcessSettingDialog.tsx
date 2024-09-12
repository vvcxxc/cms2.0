import Dialog from '@/components/BaseDialog/index.vue'
const BaseDialog: any = Dialog
import { Component, DefineComponent, defineComponent } from 'vue'
import styles from './ProcessSettingDialog.module.scss'
import { useProcessSettingDialog } from '@/widgets/ProcessManagement/Controllers/ProcessSettingDialog'
import Title from '@/components/Title/Title'
import CommonTable from '../../../Components/CommonTable/CommonTable'
import { vEditionShow } from '@/libs/Permission/Permission'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '工序设置',
  directives: {
    editionShow: vEditionShow,
  },
  props: {
    // 控制弹窗显示隐藏
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const {
      visible,
      productData,
      stationData,
      productColumns,
      stationColumns,
      mapDescData,
      mapColumns,
      stationRef,
      materielRef,
      productWorkSectionMap,
      currentMateriel,
      onOpen,
      onChangeSegment,
      onChange,
      onClose,
      onConfirm,
      onSectionMove,
    } = useProcessSettingDialog(props, ctx)
    return () => {
      return (
        <div class={styles.processSetting}>
          <BaseDialog
            width="900px"
            height="562px"
            v-model={visible.value}
            title={_t('工序设置')}
            onClose={onClose}
            onConfirm={onConfirm}
            onOpen={onOpen}
            destroy-on-close
          >
            <Title
              top={18}
              bottom={20}
              v-edition-show="P"
              desc={_t('支持配置产线产品条码与唯一料的装配绑定关系')}
            >
              {_t('物料产品关联工序')}
            </Title>
            {/* 物料产品关联工序 */}
            <CommonTable
              v-edition-show="P"
              ref={materielRef}
              v-model:dataSource={productData.value}
              columns={productColumns}
              isDrag={false}
              isChecked={false}
              // autoHeight="auto"
              maxHeight="300px"
              LanguageScopeKey={LanguageScopeKey}
              v-slots={{
                // 绑定唯一料
                materialName: (
                  Widget: DefineComponent,
                  { row, config }: any
                ) => {
                  return (
                    <Widget
                      {...config}
                      v-model={row.materialKey}
                      defaultValue={row.materialName}
                      options={currentMateriel.value(row.workSectionId)}
                      onMouseenter={() => onChangeSegment(row.workSectionId)}
                      onChange={() =>
                        onChange(
                          [config.valueKey || 'value', row.materialKey, row],
                          ['materialName'],
                          currentMateriel.value(row.workSectionId)
                        )
                      }
                    />
                  )
                },
                // 工序名称
                workSectionCode: (
                  Widget: DefineComponent,
                  { row, config, options }: any
                ) => {
                  const currentOptions =
                    productWorkSectionMap.value?.[row.segment?.id] ||
                    options ||
                    []
                  return (
                    <Widget
                      {...config}
                      v-model={row.workSectionId}
                      options={currentOptions}
                      onMouseenter={() =>
                        onSectionMove(row.segment?.id, row, options)
                      }
                      onChange={() =>
                        onChange(
                          [config.valueKey || 'value', row.workSectionId, row],
                          ['workSectionCode'],
                          options,
                          [row, 'materialKey', 'materialName']
                        )
                      }
                    />
                  )
                },
                // 产线段
                segment: (
                  Widget: DefineComponent,
                  { row, config, options }: any
                ) => {
                  row.segment = row.segment || {}
                  return (
                    <Widget
                      {...config}
                      v-model={row.segment.id}
                      options={options}
                      onChange={() =>
                        onChange(
                          [
                            config.valueKey || 'value',
                            row.segment.id,
                            row.segment,
                          ],
                          ['name', 'product'],
                          options,
                          [row, 'workSectionId']
                        )
                      }
                    />
                  )
                },
              }}
            />
            <Title top={30} bottom={20}>
              {_t('工序结果值配置')}
            </Title>
            {/* 进站结果值配置 */}
            <CommonTable
              ref={stationRef}
              dataSource={stationData.value}
              columns={stationColumns}
              isFooter={false}
              isDrag={false}
              isChecked={false}
              maxHeight="342px"
              LanguageScopeKey={LanguageScopeKey}
            />
            <Title top={30} bottom={20}>
              {_t('补充说明映射')}
            </Title>
            {/* 补充说明映射 */}
            <CommonTable
              dataSource={mapDescData.value}
              columns={mapColumns}
              isFooter={false}
              isDrag={false}
              isChecked={false}
              maxHeight="304px"
              LanguageScopeKey={LanguageScopeKey}
            />
          </BaseDialog>
        </div>
      )
    }
  },
})
