// 用户状态管理示例
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref<string>('')
  const userInfo = ref<any>(null)

  // 方法
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUserInfo(info: any) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  function clearUserInfo() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 初始化
  function init() {
    const savedToken = localStorage.getItem('token')
    const savedUserInfo = localStorage.getItem('userInfo')
    
    if (savedToken) {
      token.value = savedToken
    }
    
    if (savedUserInfo) {
      try {
        userInfo.value = JSON.parse(savedUserInfo)
      } catch (error) {
        console.error('解析用户信息失败:', error)
      }
    }
  }

  // 登录
  async function login(username: string, password: string) {
    // 这里调用实际的登录 API
    // const res = await userApi.login({ username, password })
    // setToken(res.data.token)
    // setUserInfo(res.data.userInfo)
    
    // 示例代码
    console.log('登录:', username, password)
  }

  // 登出
  function logout() {
    clearUserInfo()
    // 跳转到登录页
    // router.push('/login')
  }

  return {
    token,
    userInfo,
    setToken,
    setUserInfo,
    clearUserInfo,
    init,
    login,
    logout,
  }
})

