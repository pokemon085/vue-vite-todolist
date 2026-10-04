<template>
  <div class="search-wrap">
    <span class="search-icon">🔍</span>
    <input
      type="text"
      name="search"
      class="search-input"
      :placeholder="placeholder"
      v-model="model"
    />
    <button
      v-if="model"
      type="button"
      class="clear-btn"
      @click="model = ''"
      aria-label="清除搜尋內容"
    >
      <span class="close">✖</span>
    </button>
  </div>
</template>
<script setup lang="ts">
withDefaults(
  defineProps<{
    placeholder: string
  }>(),
  {
    placeholder: '搜尋關鍵字',
  },
)

const model = defineModel<string>({ default: '' })
</script>
<style lang="scss" scoped>
.search-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
  background: $surface-input;
  border: 1px solid $border-input;
  border-radius: 12px;
  padding: 0 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus-within {
    border-color: $primary-warm;
    background: $card-bg;
    box-shadow: 0 0 0 3px $focus-warm-shadow;
  }

  .search-icon {
    font-size: 20px;
    margin-right: 8px;
  }

  .search-input {
    flex: 1;
    padding: 12px 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: $text-title;

    &::placeholder {
      color: $text-placeholder;
    }
  }

  .clear-btn {
    border: none;
    background: transparent;
    color: $text-muted;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.15s ease;

    &:hover {
      color: $text-title;
    }
  }
}
</style>
