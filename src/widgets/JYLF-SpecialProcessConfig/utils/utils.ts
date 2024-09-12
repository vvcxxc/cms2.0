import { pick } from 'lodash'

export const getSecttonBaseData = (rowData: any) => {
  return pick(rowData, [
    'id',
    'workSectionId',
    'collectPeriod',
    'photoCount',
    'tdPhotoCount',
    'isSolderJoint',
    'solderJointFilePath',
  ])
}

export const getStationBaseData = (rowData: any) => {
  return pick(rowData, [
    'id',
    'workSectionId',
    'workStationId',
    'tagCamera',
    'deviceIP',
    'cameraNo',
    'tdPhotoCount',
    'photoCount',
    'tagTDCamera',
    'tdDeviceIP',
    'tdCameraIP',
    'tdCameraID',
    'tdCameraPort',
    'tdCameraHighSpeedPort',
    'isTDCamera',
    'isUploadMES_DP',
    'isUploadMES_CC',
    'isUploadMES_TDCC'
  ])
}
