/**
 * 图片处理工具类
 */
import { API_CONFIG } from '@/config/api.config'

/**
 * 处理图片路径
 * - 如果是完整的 URL（http/https），直接返回
 * - 如果是相对路径，拼接 baseURL
 * - 如果为空，返回默认占位图
 */
export function imageDealWith(imagePath: string, defaultImage = ''): string {
  if (!imagePath) {
    return defaultImage
  }

  // 如果已经是完整的 URL，直接返回
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  // 如果是相对路径，拼接 baseURL
  const baseURL = API_CONFIG.baseURL.replace('/v1', '') // 移除 /v1
  return `${baseURL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}

/**
 * 批量处理图片路径
 */
export function batchImageDealWith(imagePaths: string[], defaultImage = ''): string[] {
  return imagePaths.map(path => imageDealWith(path, defaultImage))
}

/**
 * 获取图片的缩略图路径（如果后端支持）
 */
export function getThumbnailPath(imagePath: string, size = 'small'): string {
  const fullPath = imageDealWith(imagePath)
  if (!fullPath) return ''

  // 根据实际后端接口调整
  // 这里假设缩略图通过添加参数获取
  return `${fullPath}?size=${size}`
}

/**
 * 图片加载失败时的默认图片
 */
export const DEFAULT_IMAGE = '/src/assets/img/bg.png'
