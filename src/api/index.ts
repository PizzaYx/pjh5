// API 接口统一管理
import { get, post, put, del } from '@/utils/request'

// 定义响应数据类型
export interface Response<T = any> {
  code: number
  data: T
  message: string
}

// 示例：用户相关 API
export const userApi = {
  // 登录
  login(data: { username: string; password: string }) {
    return post<Response<{ token: string; userInfo: any }>>('/user/login', data)
  },

  // 获取用户信息
  getUserInfo() {
    return get<Response<any>>('/user/info')
  },

  // 更新用户信息
  updateUserInfo(data: any) {
    return put<Response<any>>('/user/info', data)
  },
}

// 示例：通用 API
export const commonApi = {
  // 获取配置
  getConfig() {
    return get<Response<any>>('/config')
  },

  // 上传文件
  upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return post<Response<{ url: string }>>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

// 导出所有 API
export default {
  user: userApi,
  common: commonApi,
}

