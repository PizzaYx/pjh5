// 本地存储工具函数

/**
 * localStorage 封装
 */
export const storage = {
  // 设置存储
  set(key: string, value: any): void {
    try {
      const data = JSON.stringify(value)
      localStorage.setItem(key, data)
    } catch (error) {
      console.error('localStorage 存储失败:', error)
    }
  },

  // 获取存储
  get<T = any>(key: string): T | null {
    try {
      const data = localStorage.getItem(key)
      if (data) {
        return JSON.parse(data) as T
      }
      return null
    } catch (error) {
      console.error('localStorage 读取失败:', error)
      return null
    }
  },

  // 删除存储
  remove(key: string): void {
    localStorage.removeItem(key)
  },

  // 清空所有存储
  clear(): void {
    localStorage.clear()
  },

  // 判断是否存在
  has(key: string): boolean {
    return localStorage.getItem(key) !== null
  },
}

/**
 * sessionStorage 封装
 */
export const session = {
  set(key: string, value: any): void {
    try {
      const data = JSON.stringify(value)
      sessionStorage.setItem(key, data)
    } catch (error) {
      console.error('sessionStorage 存储失败:', error)
    }
  },

  get<T = any>(key: string): T | null {
    try {
      const data = sessionStorage.getItem(key)
      if (data) {
        return JSON.parse(data) as T
      }
      return null
    } catch (error) {
      console.error('sessionStorage 读取失败:', error)
      return null
    }
  },

  remove(key: string): void {
    sessionStorage.removeItem(key)
  },

  clear(): void {
    sessionStorage.clear()
  },

  has(key: string): boolean {
    return sessionStorage.getItem(key) !== null
  },
}

/**
 * 带过期时间的存储
 */
interface StorageData<T> {
  value: T
  expire: number | null
}

export const storageWithExpire = {
  // 设置存储（expire 单位：毫秒）
  set<T = any>(key: string, value: T, expire?: number): void {
    const data: StorageData<T> = {
      value,
      expire: expire ? Date.now() + expire : null,
    }
    storage.set(key, data)
  },

  // 获取存储
  get<T = any>(key: string): T | null {
    const data = storage.get<StorageData<T>>(key)
    if (!data) return null

    // 检查是否过期
    if (data.expire && Date.now() > data.expire) {
      storage.remove(key)
      return null
    }

    return data.value
  },

  remove(key: string): void {
    storage.remove(key)
  },
}

export default storage

