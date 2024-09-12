/*画面制作-模块api*/
import request from '@/utils/request'

/*删除组下图片文件 */
export function delGroupImageFile(group: string, file: string) {
  return request({
    url: `/api/v1/view/image/gallery/${file}?group=${group}`,
    method: 'delete',
    silent: true,
  })
}

/*获取图库树 */
export function getImageTree(keyword: string, groupPath: string) {
  return request({
    url: `/api/v1/view/image/gallery/tree?keyword=${keyword}&groupPath=${groupPath}`,
    method: 'get',
    silent: true,
  })
}

/*删除组和组路径所有图片 */
export function delGroupAllImage(group: string) {
  return request({
    url: `/api/v1/view/image/gallery?group=${group}`,
    method: 'delete',
    silent: true,
  })
}

/*重命名组 */
export function reGroupName(group: string, rename: string) {
  return request({
    url: `/api/v1/view/image/gallery/rename?group=${group}`,
    method: 'put',
    data: `${rename}`,
    silent: true,
  })
}

/*重命名组图片文件名 */
export function reGroupImageName(group: string, fileName: string, rename: string) {
  return request({
    url: `/api/v1/view/image/gallery/${fileName}/rename?group=${group}`,
    method: 'put',
    data: rename,
    silent: true,
  })
}

/*创建组 */
export function addImageFile(name: string, groupKey: string) {
  return request({
    url: `/api/v1/view/image/gallery?groupKey=${groupKey}`,
    method: 'post',
    data: name,
    silent: true,
  })
}

/*上传图片 */
export function updateImg(data: any, group: string) {
  return request({
    url: `/api/v1/view/image/gallery?group=${group}`,
    method: 'post',
    data: data,
    silent: true,
  })
}
