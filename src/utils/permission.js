// @ts-ignore
import sdk from 'sdk'
import BaseDialog from '../../components/BaseDialog/index.vue'

const {
  utils: { userInfo },
  models: {
    Language: { _t },
  },
} = sdk

const permissionCodes: any = ref([])

let permissions =
  process.env.NODE_ENV === 'development'
    ? []
    : //@ts-ignore
      window.app.current.project?.current.page?.permissions
const permission = {
  id: node?.id,
  name: node?.name,
  subs: [
    // {
    //   id: 'PersonnelQualification',
    //   name: '人员资质',
    // },
    {
      id: 'personnelQualification',
      name: '人员资质-打印',
    },
  ],
}

permissions.push(permission)

// mock data
if (process.env.NODE_ENV === 'development') {
  userInfo.permissions = {
    all: false,
    widgets: ['labelManagement-print'],
  }
}

if (userInfo.permissions.all) {
  permissionCodes.value = permission.subs.map((item) => item.id)
} else {
  permissionCodes.value = userInfo.permissions.widgets
}
