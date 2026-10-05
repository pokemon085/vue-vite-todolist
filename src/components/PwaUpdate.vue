<template>
  <Transition name="fade-slide">
    <div v-if="needRefresh" class="pwa-update-toast" role="alert">
      <div class="toast-icon">✨</div>
      <div class="toast-content">
        <p class="toast-title">發現全新版本</p>
        <p class="toast-desc">點擊更新以取得最新優化與體驗</p>
      </div>
      <div class="toast-actions">
        <BaseButton variant="primary" size="sm" @click="updateServiceWorker()">
          馬上更新
        </BaseButton>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue'
import BaseButton from '@/components/BaseButton.vue'

const { needRefresh, updateServiceWorker } = useRegisterSW()
</script>

<style lang="scss" scoped>
.pwa-update-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background-color: $card-bg;
  border: 1px solid $card-border;
  border-radius: 16px;
  box-shadow:
    0 10px 25px -5px $shadow-toast,
    0 8px 10px -6px $shadow-warm-subtle;
  color: $text-body;
  max-width: 380px;
}

.toast-icon {
  font-size: 1.25rem;
  line-height: 1;
  flex-shrink: 0;
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: $text-title;
}

.toast-desc {
  margin: 0;
  font-size: 0.825rem;
  color: $text-warm-secondary;
  line-height: 1.4;
}

.toast-actions {
  margin-left: 8px;
  flex-shrink: 0;
}
</style>
