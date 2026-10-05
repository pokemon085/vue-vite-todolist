<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3>{{ data.title }}</h3>

            <button type="button" class="close-btn" @click="handleClose" aria-label="關閉視窗">
              <span class="close">✖</span>
            </button>
          </div>

          <div class="modal-body">
            <div class="add-todo-form">
              <InputField
                v-model="form.name"
                label-name="項目名稱"
                placeholder="請輸入項目"
                input-type="text"
                required
              />

              <InputField
                v-model="form.price"
                label-name="金額"
                placeholder="請輸入金額"
                input-type="number"
              />

              <InputField v-model="form.date" label-name="購買日期" input-type="date" />

              <InputField
                v-model="form.note"
                label-name="備註"
                placeholder="請輸入備註"
                input-type="textarea"
              />
            </div>
          </div>

          <div class="modal-footer">
            <BaseButton variant="outline" @click="handleClose"> 取消 </BaseButton>

            <BaseButton variant="primary" :disabled="!form.name" @click="handleSubmit">
              確認
            </BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import BaseButton from '@/components/BaseButton.vue'
import type { listItem, operateDetailType } from '@/type/list'
import { TodoStatus } from '@/utils/constants'
import { getToday } from '@/utils'
import InputField from '@/components/InputField.vue'

// 新增/編輯對話框

const props = defineProps<{
  modelValue: boolean
  data: operateDetailType
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', value: listItem): void
}>()

// 初始表單
const getInitialForm = (): listItem => ({
  id: crypto.randomUUID(),
  name: '',
  price: 0,
  date: getToday(),
  note: '',
  status: TodoStatus.InProgress,
})

const form = reactive<listItem>(getInitialForm())

/**
 * 重置表單
 */
const resetForm = () => {
  Object.assign(form, getInitialForm())
}

/**
 * 關閉 Modal
 */
const handleClose = () => {
  emit('update:modelValue', false)
}

/**
 * 提交
 */
const handleSubmit = () => {
  if (!form.name) return

  emit('submit', { ...form })
}

watch(
  () => props.modelValue,
  (value) => {
    // 關閉時清空
    if (!value) {
      resetForm()
      return
    }

    // 開啟時取得資料
    const data = props.data.data
    // 編輯
    if (data?.id) {
      form.id = data.id
      form.name = data.name ?? ''
      form.price = data.price ?? 0
      form.date = data.date ?? getToday()
      form.note = data.note ?? ''
      form.status = data.status ?? TodoStatus.InProgress
      return
    }

    // 新增
    resetForm()
  },
)
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $shadow-warm;
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 80%;
  max-width: 420px;
  background: $card-bg;
  border-radius: 20px; /* 柔和圓角 */
  box-shadow:
    0 10px 25px -5px $shadow-warm,
    0 8px 10px -6px $shadow-warm-subtle;
  border: 1px solid $card-border;
  overflow: hidden;
  padding: 24px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 800;
    color: $text-title;
  }

  .close-btn {
    background: transparent;
    border: none;
    font-size: 1.4rem;
    color: $text-muted;
    cursor: pointer;
    line-height: 1;
    padding: 4px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      color: $text-title;
    }
  }
}

.modal-body {
  margin-bottom: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.add-todo-form {
  margin-top: 8px;
}
</style>
