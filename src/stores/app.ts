// 应用状态管理示例
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 状态
  const loading = ref(false)
  const theme = ref<'light' | 'dark'>('light')

  // 方法
  function setLoading(value: boolean) {
    loading.value = value
  }

  function setTheme(value: 'light' | 'dark') {
    theme.value = value
    localStorage.setItem('theme', value)
  }

  function toggleTheme() {
    setTheme(theme.value === 'light' ? 'dark' : 'light')
  }

  // 初始化
  function init() {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
    if (savedTheme) {
      theme.value = savedTheme
    }
  }

  return {
    loading,
    theme,
    setLoading,
    setTheme,
    toggleTheme,
    init,
  }
})

