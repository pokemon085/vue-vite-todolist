<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container">
          <h3 class="modal-title">{{ title }}</h3>
          <p class="modal-message">{{ message }}</p>

          <div class="modal-footer">
            <BaseButton variant="outline" class="flex-1" @click="handleClose"> 取消 </BaseButton>
            <BaseButton variant="danger" class="flex-1" @click="handleConfirm"> 確定 </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import BaseButton from '@/components/BaseButton.vue'

defineProps<{
  modelValue: boolean
  title: string
  message: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const handleClose = () => {
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: $shadow-warm;
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 320px;
  background: $surface-input;
  border: 1px solid $accent-soft-hover;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px $shadow-warm;
  text-align: center;
}

.modal-title {
  margin: 0 0 8px;
  font-size: 1.15rem;
  font-weight: 800;
  color: $text-body;
}

.modal-message {
  margin: 0 0 20px;
  font-size: 14px;
  color: $text-warm-secondary;
  line-height: 1.5;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 12px;

  .flex-1 {
    flex: 1;
  }
}
</style>
