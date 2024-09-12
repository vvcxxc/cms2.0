import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './Configure.module.scss'
import Box from '../../Components/Box/Box'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'
import Text from '@/components/Text/Text'
import CommonTable from '@/widgets/ProcessManagement/Views/Components/CommonTable/CommonTable'
import { columns } from '../../../enum'
import { _t, LanguageScopeKey } from '../../../app'

export default defineComponent({
  name: '系统设置',
  emits: ['save'],
  setup(props, ctx: SetupContext) {
    provide(LanguageScopeKey, LanguageScopeKey)
    const { formData, productTableRef, formRef } = useConfigure(props, ctx)
    return () => {
      return (
        <div class={styles.configure}>
          <el-form
            ref={formRef}
            class={styles.formStyleContent}
            label-width="145px"
            model={formData}
            label-position="left"
          >
            <div class={styles.box} style="margin-right: 20px;">
              <Box
                title={_t('产线设置')}
                height="350px"
                padding="93px 0"
                space="30px"
              >
                <div class={styles.content}>
                  {/* 产线代码 */}
                  <el-form-item
                    class={styles.formItem}
                    label-width="145px"
                    label={_t('产线代码') + '：'}
                    prop="ProductionLineCode"
                    rules={[
                      {
                        max: 20,
                        message: _t('自定义输入，长度为20字符'),
                        trigger: 'change',
                      },
                    ]}
                  >
                    <el-input
                      style="width: 510px"
                      placeholder={_t('请输入产线代码')}
                      v-model={formData.ProductionLineCode}
                    />
                    <Text fontSize="12px" color="#99999A">
                      ({_t('设置产线代码，作为产线的唯一标识代码')}.)
                    </Text>
                  </el-form-item>
                  {/* 产线结构 */}
                  <el-form-item
                    class={styles.formItem}
                    label-width="145px"
                    label={_t('产线结构') + '：'}
                  >
                    <el-radio-group v-model={formData.ProductionLineStructure}>
                      <el-radio label="0">{_t('产线-工序-工位')}</el-radio>
                      <el-radio label="1">
                        {_t('产线-产线段(工段)-工序-工位')}
                      </el-radio>
                    </el-radio-group>
                    <div style="width:100%">
                      <Text fontSize="12px" color="#99999A">
                        ({_t('设置产线的层次结构，用于工序的产线建模')}.)
                      </Text>
                    </div>
                  </el-form-item>
                </div>
              </Box>

              <Box title={_t('调试模式')} space="30px">
                <div class={styles.baseContent}>
                  <el-form-item
                    class={styles.formItemBase}
                    label-width="145px"
                    label={_t('启用调试模式') + '：'}
                  >
                    <el-switch
                      active-value="1"
                      inactive-value="0"
                      active-text={_t('开')}
                      inactive-text={_t('关')}
                      class={styles.switch}
                      v-model={formData.EnableDebugMode}
                    ></el-switch>
                    <div style="width:100%">
                      <Text fontSize="12px" color="#99999A">
                        ({_t('启用后支持工单下发后修改工序配置、工艺配方要求')}
                        .)
                      </Text>
                    </div>
                  </el-form-item>
                </div>
              </Box>

              <Box title={_t('产品管理')} space="30px">
                <div class={styles.baseContent}>
                  <el-form-item
                    class={styles.formItemBase}
                    label-width="145px"
                    label={_t('SOP配置') + '：'}
                  >
                    <el-radio-group v-model={formData.Sop_Enabled}>
                      <el-radio label="0">{_t('禁用')}</el-radio>
                      <el-radio label="1">{_t('启用')}</el-radio>
                    </el-radio-group>
                    {/* <div style="width:100%">
                      <Text fontSize="12px" color="#99999A">
                        ({_t('设置产线的层次结构，用于工序的产线建模')}.)
                      </Text>
                    </div> */}
                  </el-form-item>
                </div>
              </Box>
              <Box title={_t('工艺配方')} height="110px" space="30px">
                <div class={styles.baseContent}>
                  <el-form-item
                    class={styles.formItemBase}
                    label-width="145px"
                    label={_t('下发方式') + '：'}
                  >
                    <el-radio-group v-model={formData.FormulaDistributionMode}>
                      <el-radio label="0">
                        {_t('下发工单联动配方下发')}
                      </el-radio>
                      <el-radio label="1">
                        {_t('配方应用页面手动下发')}
                      </el-radio>
                      <el-radio label="2">
                        {_t('工序识别产品时下发配方')}
                      </el-radio>
                    </el-radio-group>
                    <div style="width:100%">
                      <Text fontSize="12px" color="#99999A">
                        ({_t('配置工艺配方的下发方式')}.)
                      </Text>
                    </div>
                  </el-form-item>
                </div>
              </Box>
              <Box
                title={_t('功能模块')}
                space="40px"
                height="80px"
                padding="5px"
              >
                <div class={styles.baseContent}>
                  <el-form-item
                    class={styles.formItemBase}
                    label-width="145px"
                    label={_t('工单管理模块') + '：'}
                  >
                    <el-switch
                      active-value="1"
                      inactive-value="0"
                      active-text={_t('开')}
                      inactive-text={_t('关')}
                      class={styles.switch}
                      v-model={formData.PluginState}
                    ></el-switch>
                  </el-form-item>
                </div>
              </Box>
            </div>
            <div class={styles.box}>
              <Box
                title={_t('产线段定义')}
                space="30px"
                height="350px"
                description={`(${_t('系统设置启用后，支持对产线段定义')}.)`}
                hideBorder={true}
                backgroundColor="transparent"
              >
                <CommonTable
                  delConfig={{
                    tip: _t('产线段删除后，引用关系一并删除'),
                  }}
                  ref={(rf: any) => (productTableRef.value = rf)}
                  v-model:dataSource={formData.ProductionLineSegment}
                  LanguageScopeKey={LanguageScopeKey}
                  columns={columns}
                  isFooter={true}
                  isDrag={false}
                  isChecked={false}
                  maxHeight="346px"
                />
              </Box>
              <Box title={_t('过程设置')} space="30px">
                <div class={styles.baseContent}>
                  <el-form-item
                    class={styles.formItemBase}
                    label-width="145px"
                    label={_t('检测时间范围') + '：'}
                  >
                    {_t('近')}&nbsp;
                    <el-input-number
                      min={0}
                      max={366}
                      step={1}
                      size="small"
                      controls-position="right"
                      style={{ margin: '0 5px' }}
                      v-model={formData.TimeRangeForDetection}
                      value-on-clear={0}
                      controls={false}
                    />
                    {_t('天')}
                    <div style="width:100%">
                      <Text fontSize="12px" color="#99999A">
                        (
                        {_t(
                          '配置产品状态检测、漏工序、重码及产品码更新相关业务在追溯报表的数据查询范围'
                        )}
                        .)
                      </Text>
                    </div>
                  </el-form-item>
                </div>
              </Box>
              <Box title={_t('过程参数')} space="30px">
                <div class={styles.baseContent}>
                  <el-form-item
                    class={styles.formItemBase}
                    label-width="145px"
                    label={_t('返修数据展示') + '：'}
                  >
                    <el-radio-group
                      v-model={formData.ShowTraceDataWithLatestData}
                    >
                      <el-radio label="0">{_t('展示所有数据')}</el-radio>
                      <el-radio label="1">{_t('展示最新数据')}</el-radio>
                    </el-radio-group>
                    <div style="width:100%">
                      <Text fontSize="12px" color="#99999A">
                        ({_t('选择返修产品的过程参数展示方式')}.)
                      </Text>
                    </div>
                  </el-form-item>
                </div>
              </Box>
              <Box title={_t('不良品管理')} space="30px" height="90px">
                <div class={styles.baseContent}>
                  <el-form-item
                    class={styles.formItemBase}
                    label-width="145px"
                    label={_t('判定结果选择项') + '：'}
                  >
                    <el-checkbox
                      v-model={formData.EquipmentRepair_Enabled}
                      true-value="1"
                      false-value="0"
                      disabled={true}
                    >
                      {_t('设备返修')}
                    </el-checkbox>
                    <el-checkbox
                      v-model={formData.ManualRepair_Enabled}
                      true-value="1"
                      false-value="0"
                    >
                      {_t('人工返修')}
                    </el-checkbox>
                    <el-checkbox
                      v-model={formData.Scrap_Enabled}
                      true-value="1"
                      false-value="0"
                    >
                      {_t('产品报废')}
                    </el-checkbox>
                    <el-checkbox
                      v-model={formData.NgProductOutflow_Enabled}
                      true-value="1"
                      false-value="0"
                    >
                      {_t('NG品流出')}
                    </el-checkbox>

                    <div style="width:100%">
                      <Text fontSize="12px" color="#99999A">
                        ({_t('选择不合格品处理的判定结果选项')}.)
                      </Text>
                    </div>
                  </el-form-item>
                </div>
              </Box>
            </div>
          </el-form>
        </div>
      )
    }
  },
})
