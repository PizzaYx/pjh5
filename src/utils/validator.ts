// 表单验证工具函数

/**
 * 验证手机号
 */
export function isPhone(value: string): boolean {
  return /^1[3-9]\d{9}$/.test(value)
}

/**
 * 验证邮箱
 */
export function isEmail(value: string): boolean {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
}

/**
 * 验证身份证号
 */
export function isIdCard(value: string): boolean {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

/**
 * 验证银行卡号
 */
export function isBankCard(value: string): boolean {
  return /^\d{16}|\d{19}$/.test(value)
}

/**
 * 验证车牌号
 */
export function isCarNumber(value: string): boolean {
  return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-Z0-9]{4,5}[A-Z0-9挂学警港澳]$/.test(value)
}

/**
 * 验证URL
 */
export function isURL(value: string): boolean {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)
}

/**
 * 验证密码强度（至少包含大小写字母、数字，长度8-20）
 */
export function isStrongPassword(value: string): boolean {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,20}$/.test(value)
}

/**
 * 验证中文
 */
export function isChinese(value: string): boolean {
  return /^[\u4e00-\u9fa5]+$/.test(value)
}

/**
 * 验证整数
 */
export function isInteger(value: string | number): boolean {
  return /^-?\d+$/.test(String(value))
}

/**
 * 验证正整数
 */
export function isPositiveInteger(value: string | number): boolean {
  return /^\d+$/.test(String(value)) && Number(value) > 0
}

/**
 * 验证小数
 */
export function isDecimal(value: string | number): boolean {
  return /^-?\d+\.\d+$/.test(String(value))
}

/**
 * 验证数字（整数或小数）
 */
export function isNumber(value: string | number): boolean {
  return /^-?\d+(\.\d+)?$/.test(String(value))
}

/**
 * 验证是否为空
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}

/**
 * 自定义验证规则类型
 */
export interface ValidationRule {
  required?: boolean
  message?: string
  validator?: (value: any) => boolean
  trigger?: 'blur' | 'change'
}

/**
 * 表单验证器
 */
export function createValidator(rules: ValidationRule[]) {
  return (value: any) => {
    for (const rule of rules) {
      // 必填验证
      if (rule.required && isEmpty(value)) {
        return rule.message || '该字段不能为空'
      }

      // 自定义验证
      if (rule.validator && !rule.validator(value)) {
        return rule.message || '验证失败'
      }
    }
    return true
  }
}

// 常用验证规则
export const validators = {
  phone: (message = '请输入正确的手机号') => ({
    validator: isPhone,
    message,
  }),
  email: (message = '请输入正确的邮箱') => ({
    validator: isEmail,
    message,
  }),
  idCard: (message = '请输入正确的身份证号') => ({
    validator: isIdCard,
    message,
  }),
  required: (message = '该字段不能为空') => ({
    required: true,
    message,
  }),
}

