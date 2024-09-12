import { defineComponent, SetupContext, ref, provide } from 'vue'
import styles from './Base.module.scss'
import Box from '../../../Components/Box/Box'
import { useConfigure } from '@/widgets/SystemManagement/Controllers/Configure'
import Text from '@/components/Text/Text'
import CommonTable from '@/widgets/ProcessManagement/Views/Components/CommonTable/CommonTable'
import { columns } from '../../../../enum'
import { _t, LanguageScopeKey } from '../../../../app'

export default defineComponent({
  name: '系统设置',
  emits: ['save'],
  setup(props, ctx: SetupContext) {
    provide(LanguageScopeKey, LanguageScopeKey)
    const { formData, productTableRef, formRef } = useConfigure(props, ctx)
    return () => {
      return (
        <div class={styles.box} style="margin-right: 20px;">
          {/* <Box
                title={_t('产线设置')}
                height="350px"
                padding="93px 0"
                hideBorder={true}
                space="30px"
              > */}
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
              <div>
                <el-input
                  style="width: 510px"
                  placeholder={_t('请输入产线代码')}
                  v-model={formData.ProductionLineCode}
                />
                <div style="width:100%">
                  <Text fontSize="12px" color="#99999A">
                    ({_t('设置产线代码，作为产线的唯一标识代码')}.)
                  </Text>
                </div>
              </div>
            </el-form-item>
            {/* 产线结构 */}
            <el-form-item
              class={styles.formItem}
              label-width="145px"
              label={_t('产线结构') + '：'}
            >
              <el-radio-group v-model={formData.ProductionLineStructure}>
                <el-radio value="0">{_t('产线-工序-工位')}</el-radio>
                <el-radio value="1">
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
          {/* </Box> */}
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
        </div>
      )
    }
  },
})
