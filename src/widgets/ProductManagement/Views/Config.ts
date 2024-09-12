import { _t } from '../app'
import { ref, onMounted, reactive, computed } from 'vue'

export const columns = ref([
  {
    type: 'seq',
    field: 'seq',
    width: 60,
    title: _t('序号'),
  },
  {
    field: 'name',
    title: _t('产品名称'),
  },
  {
    field: 'identificationCode',
    title: _t('产品识别码'),
  },
  {
    field: 'model',
    title: _t('产品型号'),
  },
  {
    field: 'shortNumber',
    title: _t('产品简号'),
  },
  {
    field: 'formulaName',
    title: _t('配方名称'),
    isCheckEdition: true,
  },
  {
    field: 'pocessRoutes',
    title: _t('工艺路线'),
    isCheckEdition: true,
  },
  {
    field: 'remark',
    title: _t('备注'),
  },
])
