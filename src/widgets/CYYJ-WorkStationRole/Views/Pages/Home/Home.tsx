import { ref, defineComponent } from 'vue'
import BaseTable from '@/components/Table/Table'
import styles from './Home.module.scss'
import { useHome } from '../../../Controllers/Home'
import { columns } from './Config'
import IconButton from '@/components/IconButton/IconButton'
import { ElMessage, ElMessageBox } from 'element-plus'
import DyForm from '@/components/DyForm/DyForm'

import { useGlobalState } from '@/libs/Store/Store'

export default defineComponent({
  setup(props, ctx) {
    const { workStationList } = useGlobalState()
    const { dataSource, tableRef, checked, search, onCheck, onSearch, onSave } =
      useHome(props, ctx)

    //#region 编辑
    const onEdit = async () => {
      if (!checked.value) {
        ElMessage.warning('请选择一个角色进行编辑!')
        return
      }

      const formRef = ref()
      const formItemProps = [
        { label: '角色名称', prop: 'roleName', el: 'input', disabled: 1 },
        { label: '备注', prop: 'remark', el: 'input', disabled: 1 },
        {
          label: '关联工位',
          prop: 'workStationIds',
          el: 'select',
          multiple: 1,
          options: workStationList.state,
          placeholder: '请选择',
          rules: [{ required: true, message: '必填', trigger: 'blur' }],
        },
      ]
      ElMessageBox.confirm('', '编辑角色', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        message: () => (
          <div>
            <DyForm
              labelWidth="100px"
              labelPosition="left"
              ref={formRef}
              v-model:formData={checked.value}
              formItemProps={formItemProps}
            />
          </div>
        ),
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            formRef.value.validate().then(async () => {
              await onSave(checked.value.roleId, checked.value.workStationIds)
              onSearch()
              done()
            })
          } else {
            done()
          }
        },
      })
    }
    //#endregion

    //#region 渲染表头
    const RenderHeader = () => {
      return (
        <div class={styles.headers}>
          <IconButton icon="edit" onClick={onEdit}>
            编辑
          </IconButton>
          <div class={styles.box}>
            <label>角色名称</label>
            <el-input
              clearable
              onChange={onSearch}
              v-model={search.value}
              class={styles.select}
            ></el-input>
          </div>
        </div>
      )
    }
    //#endregion

    //#region 渲染表格
    const RenderBaseTable = () => {
      return (
        <div class={styles.list}>
          <BaseTable
            ref={tableRef}
            url="/api/v1/cyyjpack/workstationrole"
            v-model:dataSource={dataSource.value}
            columns={columns}
            onRowClick={onCheck}
          ></BaseTable>
        </div>
      )
    }
    //#endregion
    return () => {
      return (
        <div class={styles.content}>
          <RenderHeader />
          <RenderBaseTable />
        </div>
      )
    }
  },
})
