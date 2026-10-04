<template>
  <div class="empty-state">
    <div class="empty-icon-wrap">
      <span class="mdi mdi-basket-outline"></span>
    </div>
    <span class="empty-text">{{ name }}</span>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    icon?: string
    name: string
  }>(),
  {
    icon: 'mdi-basket-outline',
    name: '',
  },
)
</script>
<style lang="scss" scoped>
.empty-state {
  text-align: center;
  padding: 48px 0;
  color: $text-muted;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  .empty-icon-wrap {
    width: 64px;
    height: 64px;
    background: $surface-soft;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .mdi {
      font-size: 32px;
      color: $primary-hover;
    }
  }

  .empty-text {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
