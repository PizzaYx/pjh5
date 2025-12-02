import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 可以在这里添加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    // 显示加载提示
    if (config.headers?.showLoading !== false) {
      showLoadingToast({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
      })
    }

    return config
  },
  (error: AxiosError) => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    closeToast()

    const res = response.data

    // 根据后端约定的状态码判断请求是否成功
    // 这里假设后端返回 { code: 200, data: {}, message: 'success' }
    if (res.code !== 200 && res.code !== 0) {
      showToast({
        message: res.message || '请求失败',
        position: 'top',
      })

      // 特殊处理：token 过期或未登录
      if (res.code === 401 || res.code === 403) {
        // 清除本地 token
        localStorage.removeItem('token')
        // 跳转到登录页
        // router.push('/login')
      }

      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res
  },
  (error: AxiosError) => {
    closeToast()

    console.error('响应错误:', error)

    let message = '网络错误'
    if (error.response) {
      switch (error.response.status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          localStorage.removeItem('token')
          // router.push('/login')
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = `连接错误${error.response.status}`
      }
    } else if (error.message.includes('timeout')) {
      message = '请求超时'
    } else if (error.message.includes('Network Error')) {
      message = '网络连接错误'
    }

    showToast({
      message,
      position: 'top',
    })

    return Promise.reject(error)
  }
)

// 导出常用请求方法
export default service

// 封装 GET 请求
export function get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.get(url, { params, ...config })
}

// 封装 POST 请求
export function post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.post(url, data, config)
}

// 封装 PUT 请求
export function put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.put(url, data, config)
}

// 封装 DELETE 请求
export function del<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<T> {
  return service.delete(url, { params, ...config })
}

// 封装文件上传
export function upload<T = any>(url: string, file: File | Blob, config?: AxiosRequestConfig): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)
  
  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  })
}

