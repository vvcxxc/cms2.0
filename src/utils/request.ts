import { default as axios, AxiosRequestConfig } from 'axios'
import { Session } from '@/utils/storage'
import router from '@/router'

// 配置新建一个 axios 实例
const service = axios.create({
  baseURL: '/',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'Accept-Language': 'zh-Hans'
  },
})

// 请求前
service.interceptors.request.use(
  async (config: any) => {
    const token = Session.get('Token') || import.meta.env.VITE_TOKEN
    // console.log('Token', token);
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    config.headers['X-Requested-With'] = 'XMLHttpRequest'
    if (typeof config.data !== 'object') config.data = JSON.stringify(config.data)
    return config
  },
  (error: any) => {
    return Promise.reject(error)
  }
)

// 响应后
service.interceptors.response.use(
  (response: any) => {
    const { data } = response;
    // if (data.statusCode == 401) {
    //   ElMessage.error('请登录');
    //   router.push({ name: '/login' })
    //   return;
    // }
    return data;
  },
  (error: any) => {
    Session.remove('Token')
    return Promise.reject(error)
  }
)

type Data = unknown

type Request = {
  <D = Data>(url: string, config?: AxiosRequestConfig): Promise<D>
  get<D = Data>(url: string, config?: AxiosRequestConfig): Promise<D>
  delete<D = Data>(url: string, config?: AxiosRequestConfig): Promise<D>
  post<D = Data>(url: string, data?: any, config?: AxiosRequestConfig): Promise<D>
  put<D = Data>(url: string, data?: any, config?: AxiosRequestConfig): Promise<D>
} & typeof service

const request = service as Request
export { request as default, request }

