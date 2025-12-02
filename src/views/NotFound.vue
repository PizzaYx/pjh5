<template>
  <div class="not-found-page">
    <van-empty
      image="error"
      description="页面不存在"
    >
      <van-button type="primary" @click="goHome">
        返回首页
      </van-button>
    </van-empty>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style>

