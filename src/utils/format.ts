// 格式化工具函数

/**
 * 格式化金额（保留两位小数，千分位分隔）
 */
export function formatMoney(value: number | string, decimals = 2): string {
  const num = Number(value)
  if (isNaN(num)) return '0.00'
  
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化手机号（中间4位用*代替）
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

/**
 * 格式化身份证号（中间部分用*代替）
 */
export function formatIdCard(idCard: string): string {
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
}

/**
 * 格式化银行卡号（每4位空格分隔）
 */
export function formatBankCard(cardNumber: string): string {
  return cardNumber.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ')
}

/**
 * 格式化日期时间
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化相对时间（刚刚、几分钟前、几小时前等）
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < month) return `${Math.floor(diff / day)}天前`
  if (diff < year) return `${Math.floor(diff / month)}个月前`
  return `${Math.floor(diff / year)}年前`
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 格式化数字（添加千分位）
 */
export function formatNumber(num: number | string): string {
  return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * 格式化百分比
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * 隐藏字符串中间部分
 */
export function hideMiddle(str: string, start = 3, end = 4): string {
  if (str.length <= start + end) return str
  
  const startStr = str.substring(0, start)
  const endStr = str.substring(str.length - end)
  const stars = '*'.repeat(str.length - start - end)
  
  return startStr + stars + endStr
}

/**
 * 首字母大写
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转下划线
 */
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
}

/**
 * 下划线转驼峰
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase())
}

