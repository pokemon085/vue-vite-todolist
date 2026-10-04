<template>
  <Teleport to="body">
    <Transition name="toast-fade">
      <div v-if="isShow" class="global-toast" :class="toastType">
        <span class="icon">{{ icon }}</span>
        <span class="message">{{ toastMessage }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()
const { isShow, toastMessage, toastType } = storeToRefs(toastStore)

const icon = computed(() => {
  switch (toastType.value) {
    case 'warning':
      return '⚠️'
    case 'success':
      return '✅'
    case 'error':
      return '❌'
    default:
      return 'ℹ️'
  }
})
</script>

<style lang="scss" scoped>
.global-toast {
  position: fixed;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 6px 18px var(--shadow-toast);
  z-index: 2000;
  pointer-events: none;
  max-width: 50%;

  .icon {
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;
  }

  background-color: var(--bg-main);
  color: var(--text-body);
  border: 1px solid var(--card-border);

  &.warning {
    background-color: var(--accent-soft);
    color: var(--text-title);
    border: 1px solid var(--card-border);
  }

  &.success {
    background-color: var(--surface-success);
    color: var(--text-success);
    border: 1px solid var(--border-success);
  }

  &.error {
    background-color: var(--surface-danger);
    color: var(--accent-terracotta-hover);
    border: 1px solid var(--border-danger-soft);
  }
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -12px);
}
</style>
