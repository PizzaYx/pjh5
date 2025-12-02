<template>
  <div class="demo-page">
    <van-nav-bar
      title="示例页面"
      left-arrow
      @click-left="onClickLeft"
    />

    <div class="demo-content">
      <!-- 表单示例 -->
      <van-cell-group inset title="表单示例">
        <van-field
          v-model="formData.name"
          label="姓名"
          placeholder="请输入姓名"
          clearable
        />
        <van-field
          v-model="formData.phone"
          label="手机号"
          placeholder="请输入手机号"
          type="tel"
          clearable
        />
        <van-field
          v-model="formData.email"
          label="邮箱"
          placeholder="请输入邮箱"
          type="email"
          clearable
        />
      </van-cell-group>

      <div class="button-wrapper">
        <van-button type="primary" block @click="handleSubmit">
          提交表单
        </van-button>
      </div>

      <!-- 工具函数示例 -->
      <van-cell-group inset title="工具函数示例">
        <van-cell title="格式化金额" :value="formatMoney(123456.789)" />
        <van-cell title="格式化手机号" :value="formatPhone('13812345678')" />
        <van-cell title="格式化日期" :value="formatDate(new Date())" />
        <van-cell title="相对时间" :value="formatRelativeTime(Date.now() - 3600000)" />
      </van-cell-group>

      <!-- 弹窗示例 -->
      <van-cell-group inset title="组件示例">
        <van-cell title="显示提示" is-link @click="showToastDemo" />
        <van-cell title="显示对话框" is-link @click="showDialogDemo" />
        <van-cell title="显示加载" is-link @click="showLoadingDemo" />
        <van-cell title="日期选择器" is-link @click="showDatePickerDemo" />
      </van-cell-group>
    </div>

    <!-- 日期选择器 -->
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        title="选择日期"
        @confirm="onDateConfirm"
        @cancel="showDatePicker = false"
      />
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showToast, showDialog, showLoadingToast, closeToast } from 'vant'
import { formatMoney, formatPhone, formatDate, formatRelativeTime } from '@/utils'
import { isPhone, isEmail } from '@/utils/validator'

const router = useRouter()

const formData = reactive({
  name: '',
  phone: '',
  email: '',
})

const showDatePicker = ref(false)
const currentDate = ref(['2024', '01', '01'])

const onClickLeft = () => {
  router.back()
}

const handleSubmit = () => {
  if (!formData.name) {
    showToast('请输入姓名')
    return
  }

  if (!formData.phone || !isPhone(formData.phone)) {
    showToast('请输入正确的手机号')
    return
  }

  if (!formData.email || !isEmail(formData.email)) {
    showToast('请输入正确的邮箱')
    return
  }

  showToast({
    type: 'success',
    message: '提交成功！',
  })
  
  console.log('表单数据:', formData)
}

const showToastDemo = () => {
  showToast({
    message: '这是一个提示消息',
    position: 'top',
  })
}

const showDialogDemo = () => {
  showDialog({
    title: '提示',
    message: '这是一个对话框示例',
  })
}

const showLoadingDemo = () => {
  showLoadingToast({
    message: '加载中...',
    forbidClick: true,
    duration: 2000,
  })
}

const showDatePickerDemo = () => {
  showDatePicker.value = true
}

const onDateConfirm = () => {
  const dateStr = currentDate.value.join('-')
  showToast(`选择的日期：${dateStr}`)
  showDatePicker.value = false
}
</script>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  background-color: #f7f8fa;

  .demo-content {
    padding: 16px;

    .button-wrapper {
      padding: 16px;
    }

    .van-cell-group {
      margin-bottom: 16px;
    }
  }
}
</style>

