import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { showToast, showLoadingToast, closeToast } from 'vant'
import { API_CONFIG } from '@/config/api.config'

// 创建 axios 实例
const service: AxiosInstance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
})

// 是否正在刷新 token
let isRefreshing = false
// 重试队列，每一项是一个函数
let requests: ((token: string) => void)[] = []

// 刷新 Token 的方法
async function refreshToken() {
    try {
        const response = await axios.get(`${API_CONFIG.baseURL}/auth/getToken`, {
            params: {
                appcode: API_CONFIG.APP_CODE,
                secret: API_CONFIG.APP_SECRET,
            },
        })
        const res = response.data
        if (res.code === 200 || res.code === 0 || res.code === 1200) {
            return res.data?.access_token
        }
        return null
    } catch (error) {
        console.error('刷新 Token 失败:', error)
        return null
    }
}

// ==========================================
// 请求拦截器
// ==========================================
service.interceptors.request.use(
    (config) => {
        // Token 生成接口不需要带 Token
        if (config.url?.includes('/auth/getToken')) {
            return config
        }

        // 添加 token（如果有）
        const token = localStorage.getItem('token')
        if (token) {
            config.headers['token'] = `${token}`
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
        console.error('请求错误:', error)
        return Promise.reject(error)
    }
)

// ==========================================
// 响应拦截器
// ==========================================
service.interceptors.response.use(
    (response: AxiosResponse) => {
        closeToast()

        const res = response.data

        // 根据后端约定的状态码判断请求是否成功
        // 后端返回格式：{ code: 200, msg: 'success', data: {...} }
        if (res.code !== 200 && res.code !== 0 && res.code !== 1200) {
            // 特殊处理：token 过期或失效 (1201, 403)
            if (res.code === 1201 || res.code === 403) {
                const config = response.config

                if (!isRefreshing) {
                    isRefreshing = true
                    return refreshToken()
                        .then((token) => {
                            if (token) {
                                localStorage.setItem('token', token)
                                config.headers['token'] = `${token}`

                                // 执行队列中的请求
                                requests.forEach((cb) => cb(token))
                                requests = []

                                // 重试当前请求
                                return service(config)
                            } else {
                                // 刷新失败，跳转登录或清理状态
                                localStorage.removeItem('token')
                                return Promise.reject(new Error('Token 刷新失败'))
                            }
                        })
                        .catch((err) => {
                            return Promise.reject(err)
                        })
                        .finally(() => {
                            isRefreshing = false
                        })
                } else {
                    // 正在刷新，将请求加入队列
                    return new Promise((resolve) => {
                        requests.push((token) => {
                            config.headers['token'] = `${token}`
                            resolve(service(config))
                        })
                    })
                }
            }

            showToast({
                message: res.msg || res.message || '请求失败',
                position: 'top',
            })

            return Promise.reject(new Error(res.msg || res.message || '请求失败'))
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

