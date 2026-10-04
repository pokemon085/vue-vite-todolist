import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ToastOptions {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

export const useToastStore = defineStore('toast', () => {
  const isShow = ref(false)
  const toastMessage = ref('')
  const toastType = ref<'success' | 'warning' | 'error' | 'info'>('warning')
  let timer: number | null = null

  const showToast = ({ message, type = 'warning', duration = 2500 }: ToastOptions) => {
    if (timer) clearTimeout(timer)

    toastMessage.value = message
    toastType.value = type
    isShow.value = true

    timer = window.setTimeout(() => {
      isShow.value = false
    }, duration)
  }

  return {
    isShow,
    toastMessage,
    toastType,
    showToast,
  }
})
