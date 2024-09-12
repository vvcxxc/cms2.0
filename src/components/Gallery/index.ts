import request from '@/utils/request'
// 判断图片大小-进行压缩
const MIN_SIXE = 1 * 1024 * 1024 //压缩最小值
const MAX_WIDTH = 2560 //压缩最大宽度
const MAX_HEIGHT = 1900 //压缩最大高度
export function uploadBefore(file: any) {
  return new Promise((resolve, reject) => {
    let image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      // 调用方法获取blob格式，方法写在下边
      let resultBlob: Blob
      if (file.size > MIN_SIXE) {
        resultBlob = compressUpload(image, file, MAX_WIDTH, MAX_HEIGHT)
      } else {
        resultBlob = new Blob([file])
      }

      resolve(resultBlob)

      URL.revokeObjectURL(image.src)
    }
    image.onerror = () => {
      reject()
    }
  })
}

/* 图片压缩方法-canvas压缩 */
export function compressUpload(
  image: any,
  file: any,
  maxWidth = 4096,
  maxHeight = 2160,
  quality = 0.4
) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')
  // let initSize = image.src.length
  let { width, height } = image
  // console.log(width)
  // 默认最大4K分辨率,超过进行压缩、
  let newWidth = width
  let newHeight = height
  if (width > maxWidth && height > maxHeight) {
    const rate = Math.min(maxWidth / width, maxHeight / height)
    newWidth = width * rate
    newHeight = height * rate
  } else if (width > maxWidth) {
    newWidth = maxWidth
    newHeight = (maxWidth / width) * height
  } else if (height > maxHeight) {
    newWidth = maxHeight
    newHeight = (maxHeight / height) * width
  } else {
    newWidth = width
    newHeight = height
  }
  canvas.width = newWidth
  canvas.height = newHeight
  // ctx?.fillRect(0, 0, canvas.width, canvas.height)
  ctx?.drawImage(image, 0, 0, newWidth, newHeight)

  // 进行最小压缩0.1
  let compressData = canvas.toDataURL(file.type || 'image/jpeg', quality)

  // 压缩后调用方法进行base64转Blob，方法写在下边
  let blobImg = dataURItoBlob(compressData)
  // console.log(blobImg)
  return blobImg
}

/* base64转Blob对象 */
export function dataURItoBlob(data: any) {
  let byteString
  if (data.split(',')[0].indexOf('base64') >= 0) {
    byteString = atob(data.split(',')[1])
  } else {
    byteString = unescape(data.split(',')[1])
  }

  let mimeString = data.split(',')[0].split(':')[1].split(';')[0]
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i)
  }
  // console.log([ia])
  return new Blob([ia], { type: mimeString })
}

/**
 * 文件流转为base64
 * res：文件流
 */
export function fileToBase64(res: any) {
  return (
    'data:image/png;base64,' +
    btoa(new Uint8Array(res).reduce((data, byte) => data + String.fromCharCode(byte), ''))
  )
}

//创建图库图片
export function createProjectImg(groupKey: string, imageKey: string) {
  return new Promise((resolve, reject) => {
    request({
      url: `/api/v1/view/image/fromgallery`,
      method: 'post',
      data: {
        groupKey: groupKey,
        imageKey: imageKey,
      },
      silent: true,
    })
      .then((res) => {
        resolve(res)
      })
      .catch(() => {
        reject()
      })
  })
}
