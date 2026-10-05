<template>
  <div class="form-item">
    <label> {{ labelName }} <span v-if="required" class="required"> *</span> </label>
    <input
      v-if="inputType === 'text'"
      :value="modelValue"
      type="text"
      :placeholder="placeholder"
      class="form-input"
      @input="handleInput"
    />
    <input
      v-else-if="inputType === 'number'"
      :value="modelValue"
      type="number"
      :placeholder="placeholder"
      class="form-input"
      @input="handleInput"
    />
    <input
      v-else-if="inputType === 'date'"
      :value="modelValue"
      type="date"
      class="form-input"
      @input="handleInput"
    />
    <textarea
      v-else-if="inputType === 'textarea'"
      :value="modelValue"
      :placeholder="placeholder"
      rows="3"
      class="form-input"
      @input="handleInput"
    ></textarea>
  </div>
</template>
<script setup lang="ts">
// 共用輸入組件

type InputType = 'text' | 'number' | 'date' | 'textarea'

const props = withDefaults(
  defineProps<{
    labelName: string
    required?: boolean
    modelValue: string | number
    placeholder?: string
    inputType: InputType
  }>(),
  { required: false, placeholder: '' },
)

const emit = defineEmits<{ (e: 'update:modelValue', value: string | number): void }>()

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const value = props.inputType === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>
<style lang="scss" scoped>
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  label {
    font-size: 16px;
    font-weight: 700;
    color: $text-body;
    margin-bottom: 6px;
  }
  .required {
    color: $accent-terracotta;
  }
  .form-input {
    padding: 10px 14px;
    background: $surface-input;
    border: 1px solid $border-input;
    border-radius: 12px;
    font-size: 14px;
    color: $text-title;
    outline: none;
    transition: all 0.2s ease;
    font-family: inherit;
    &::placeholder {
      color: $text-placeholder;
    }
    &:focus {
      border-color: $primary-warm;
      background: $card-bg;
      box-shadow: 0 0 0 3px $focus-warm-shadow;
    }
  }
}
</style>
