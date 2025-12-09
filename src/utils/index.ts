// 工具函数统一导出
export * from './storage'
export * from './validator'
export * from './format'
export * from './image'

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function (this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout)
    
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait = 300
): (...args: Parameters<T>) => void {
  let previous = 0
  
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now()
    if (now - previous > wait) {
      func.apply(this, args)
      previous = now
    }
  }
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  
  if (obj instanceof Date) return new Date(obj.getTime()) as any
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any
  if (obj instanceof Object) {
    const clonedObj = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
  
  return obj
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 获取URL参数
 */
export function getUrlParams(url?: string): Record<string, string> {
  const urlStr = url || window.location.href
  const params: Record<string, string> = {}
  const searchParams = new URL(urlStr).searchParams
  
  searchParams.forEach((value, key) => {
    params[key] = value
  })
  
  return params
}

/**
 * 复制到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 判断是否为移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 判断是否为微信浏览器
 */
export function isWeChat(): boolean {
  return /MicroMessenger/i.test(navigator.userAgent)
}

/**
 * 判断是否为iOS设备
 */
export function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

/**
 * 判断是否为Android设备
 */
export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent)
}

/**
 * 滚动到指定位置
 */
export function scrollTo(top = 0, behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({
    top,
    behavior,
  })
}

/**
 * 滚动到顶部
 */
export function scrollToTop(): void {
  scrollTo(0)
}

/**
 * 滚动到底部
 */
export function scrollToBottom(): void {
  scrollTo(document.documentElement.scrollHeight)
}

/**
 * 延迟执行
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

