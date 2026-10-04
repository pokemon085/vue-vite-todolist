<template>
  <button
    class="warm-btn"
    :class="[
      `variant-${variant}`,
      `size-${size}`,
      { 'is-block': block, 'is-disabled': disabled || loading },
    ]"
    :type="nativeType"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="icon mdi mdi-loading mdi-spin"></span>
    <span v-else-if="icon" class="icon mdi" :class="icon"></span>
    <span class="btn-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
export interface WarmButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg'
  /** MDI Icon */
  icon?: string
  /** 是否載入中 */
  loading?: boolean
  /** 是否停用 */
  disabled?: boolean
  /** 是否占滿整行 */
  block?: boolean
  /** 原生 button type */
  nativeType?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<WarmButtonProps>(), {
  variant: 'primary',
  size: 'md',
  icon: '',
  loading: false,
  disabled: false,
  block: false,
  nativeType: 'button',
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const handleClick = (e: MouseEvent) => {
  emit('click', e)
}
</script>

<style lang="scss" scoped>
.warm-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  font-weight: 600;
  letter-spacing: 0.3px;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;

  .icon {
    font-size: 1.1em;
    line-height: 1;
  }

  &.is-block {
    display: flex;
    width: 100%;
  }

  &.size-sm {
    padding: 6px 14px;
    border-radius: 14px;
    font-size: 13px;
  }

  &.size-md {
    padding: 10px 20px;
    border-radius: 18px;
    font-size: 14px;
  }

  &.size-lg {
    padding: 13px 26px;
    border-radius: 22px;
    font-size: 16px;
  }

  &.variant-primary {
    background-color: $button-primary-bg;
    color: $card-bg;
    box-shadow: 0 4px 12px $button-primary-shadow-color;

    &:hover:not(.is-disabled) {
      background-color: $primary-warm;
      transform: translateY(-2px);
      box-shadow: 0 6px 16px $button-primary-hover-shadow-color;
    }

    &:active:not(.is-disabled) {
      transform: translateY(0);
      box-shadow: 0 2px 6px $button-primary-active-shadow-color;
    }
  }

  &.variant-secondary {
    background-color: $accent-soft;
    color: $text-warm-secondary;

    &:hover:not(.is-disabled) {
      background-color: $accent-soft-hover;
      transform: translateY(-2px);
    }

    &:active:not(.is-disabled) {
      transform: translateY(0);
    }
  }

  &.variant-outline {
    background-color: $card-bg;
    color: $text-body;
    border-color: $button-outline-border;

    &:hover:not(.is-disabled) {
      background-color: $button-outline-hover-bg;
      border-color: $primary-warm;
      transform: translateY(-2px);
    }

    &:active:not(.is-disabled) {
      transform: translateY(0);
    }
  }

  &.variant-danger {
    background-color: $button-danger-bg;
    color: $text-danger;

    &:hover:not(.is-disabled) {
      background-color: $button-danger-hover-bg;
      transform: translateY(-2px);
    }

    &:active:not(.is-disabled) {
      transform: translateY(0);
    }
  }

  &.is-disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
}
</style>
