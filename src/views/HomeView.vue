<template>
  <div class="todo-list-wrap">
    <header class="header-section">
      <div class="header-title-box">
        <span class="sub-title">MY SHOPPING LIST</span>
        <h1 class="todo-list-title">採買小清單 📋</h1>
      </div>

      <div class="header-actions">
        <BaseButton
          variant="outline"
          size="sm"
          class="btn-action"
          @click="triggerImport"
          :loading="importXlsxLoading"
        >
          ⬇️ 匯入
          <input ref="fileInput" type="file" accept=".xlsx,.xls" hidden @change="importFromExcel" />
        </BaseButton>
        <BaseButton
          v-if="allLength > 0"
          variant="outline"
          size="sm"
          class="btn-action"
          @click="exportToExcel"
        >
          📤 匯出
        </BaseButton>
      </div>
    </header>

    <!-- 總計與進度卡片 -->
    <div class="common-card total-card">
      <div class="total-content">
        <div class="info">
          <span class="title">預算與總預計花費</span>
          <div class="price">
            <span class="currency">NT$</span>
            {{ totalPrice.toLocaleString() }}
          </div>
          <div class="completed-info">✨ 已完成 {{ completedLength }} / {{ allLength }} 個項目</div>
        </div>
        <div class="chart-box">
          <DonutChart :completed="completedLength" :total="allLength" />
        </div>
      </div>

      <div class="action-btn-group">
        <BaseButton variant="primary" size="md" class="btn-add" @click="addItem">
          ＋ 新增採買項目
        </BaseButton>
        <BaseButton
          v-if="allLength > 0"
          variant="danger"
          size="md"
          class="btn-clear"
          @click="clearAllList"
        >
          🧹 清空所有清單
        </BaseButton>
      </div>
    </div>

    <!-- 列表卡片 -->
    <div class="common-card todo-list-container">
      <div class="list-header">
        <h2 class="title">清單明細</h2>
        <div class="filter-status-wrap">
          <button
            v-for="statusItem in statusList"
            :key="statusItem.key"
            :class="['status-tab', { active: currentStatus === statusItem.key }]"
            @click="changeStatus(statusItem.key)"
          >
            <span class="status-tab__name">{{ statusItem.name }}</span>
            <span class="status-tab__count">{{ statusItem.status }}</span>
          </button>
        </div>
      </div>

      <!-- 搜尋 -->
      <SearchInput v-model="searchKey" placeholder="搜尋採買項目名稱..." />

      <!-- 清單內容 -->
      <div class="todo-list">
        <div
          v-for="item in filterList"
          :key="item.id"
          :class="['todo-item', { completed: item.status === TodoStatus.Completed }]"
        >
          <label class="todo-item__checkbox-label">
            <input
              type="checkbox"
              v-model="item.status"
              :true-value="TodoStatus.Completed"
              :false-value="TodoStatus.InProgress"
              class="todo-item__checkbox"
            />
            <span class="custom-checkbox"></span>
          </label>

          <div class="todo-item__main">
            <div class="todo-item__title-row">
              <span class="todo-item__name">{{ item.name }}</span>
              <span class="todo-item__price">NT$ {{ item.price.toLocaleString() }}</span>
            </div>
            <div class="todo-item__meta-row">
              <span v-if="item.date" class="todo-item__date">
                <span class="calendar">📅</span> {{ item.date }}
              </span>
              <span v-if="item.note" class="todo-item__note">
                <span class="notebook">📝</span> {{ item.note }}
              </span>
            </div>
          </div>

          <div class="todo-item__actions">
            <button @click="editItem(item)" class="btn-icon edit" title="編輯">
              <span class="pencil">✍️</span>
            </button>
            <button @click="deleteItem(item.id)" class="btn-icon delete" title="刪除">
              <span class="trash">❌</span>
            </button>
          </div>
        </div>
        <NoData v-if="filterList.length === 0" name="目前沒有任何項目喔～" />
      </div>
    </div>

    <!-- 確認刪除彈窗 -->
    <ConfirmModal
      v-model="confirmDetail.show"
      :title="confirmDetail.title"
      :message="confirmDetail.message"
      @confirm="confirmDetail.fun"
    />

    <!-- 新增/編輯彈窗 -->
    <OperateTaskModal
      v-model="operateDetail.show"
      @submit="operateTodoList"
      :data="operateDetail"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue'
import type { listItem, todoStatusType, operateDetailType, confirmDetail } from '@/type/list'
import { TodoStatusNameMap, TodoStatus } from '@/utils/constants'
import OperateTaskModal from '@/components/OperateTaskModal.vue'
import DonutChart from '@/components/DonutChart.vue'
import BaseButton from '@/components/BaseButton.vue'
import { storeToRefs } from 'pinia'
import { useTodoListStore } from '@/stores/todoList'
import ConfirmModal from '@/components/ConfirmModal.vue'
import { getToday } from '@/utils/index'
import { useToastStore } from '@/stores/toast'
import * as XLSX from 'xlsx'
import SearchInput from '@/components/SearchInput.vue'
import NoData from '@/components/NoData.vue'

const todoListStore = useTodoListStore()
const toastStore = useToastStore()
const { list } = storeToRefs(todoListStore)
const { getTodoList, saveTodoList } = todoListStore

const currentStatus = ref(TodoStatus.All)
const searchKey = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const importXlsxLoading = ref(false)

// 新增/編輯彈窗資料
const operateDetail = ref<operateDetailType>({
  show: false,
  title: '新增',
  data: {},
})

// 確認彈窗
const confirmDetail = ref<confirmDetail>({
  show: false,
  title: '',
  message: '',
  fun: () => {},
})

const allLength = computed(() => list.value.length)

const inProgressLength = computed(() => {
  return list.value.filter((item) => item.status === TodoStatus.InProgress).length
})

const completedLength = computed(() => {
  return list.value.filter((item) => item.status === TodoStatus.Completed).length
})

/**
 * 計算總花費
 */
const totalPrice = computed(() => {
  return list.value.reduce((sum, item) => sum + (item.price || 0), 0)
})

/**
 * 清單狀態列表 全部/進行中/已完成
 */
const statusList = computed(() => [
  {
    name: TodoStatusNameMap[TodoStatus.All],
    key: TodoStatus.All,
    status: allLength.value,
  },
  {
    name: TodoStatusNameMap[TodoStatus.InProgress],
    key: TodoStatus.InProgress,
    status: inProgressLength.value,
  },
  {
    name: TodoStatusNameMap[TodoStatus.Completed],
    key: TodoStatus.Completed,
    status: completedLength.value,
  },
])

/**
 * 過濾搜尋跟狀態後的清單列表
 */
const filterList = computed(() => {
  const keyword = searchKey.value.trim().toLowerCase()

  return list.value.filter((todo) => {
    const isKeywordMatch = !keyword || todo.name.toLowerCase().includes(keyword)
    const isStatusMatch =
      currentStatus.value === TodoStatus.All || todo.status === currentStatus.value

    return isKeywordMatch && isStatusMatch
  })
})

/**
 * 切換狀態
 */
const changeStatus = (id: todoStatusType) => {
  currentStatus.value = id
}

/**
 * 清空所有清單
 */
const clearAllList = () => {
  confirmDetail.value = {
    show: true,
    title: '確定要清空所有項目?',
    message: '清空後資料無法復原喔！',
    fun: () => {
      list.value = []
      saveTodoList()
      toastStore.showToast({
        message: '已清空購物清單',
        type: 'info',
      })
    },
  }
}

/**
 * 新增清單
 */
const addItem = () => {
  operateDetail.value = {
    show: true,
    title: '新增採買項目',
    data: {},
  }
}

/**
 * 刪除清單
 */
const deleteItem = (id: string) => {
  confirmDetail.value = {
    show: true,
    title: '確定要刪除該項目?',
    message: '刪除後無法復原',
    fun: () => {
      list.value = list.value.filter((item) => item.id !== id)
      saveTodoList()
    },
  }
}

/**
 * 編輯清單
 */
const editItem = (item: listItem) => {
  operateDetail.value = {
    show: true,
    title: '編輯採買項目',
    data: { ...item },
  }
}

/**
 * 新增/編輯操作後返回的處理
 */
const operateTodoList = (item: listItem) => {
  const findIdIndex = list.value.findIndex((i) => i.id === item.id)
  const sameName = list.value.some((i) => i.id !== item.id && i.name.trim() === item.name.trim())

  if (sameName) {
    toastStore.showToast({
      message: '已有相同名稱的項目！',
      type: 'warning',
    })
    return
  }

  // 編輯
  if (findIdIndex !== -1) {
    list.value[findIdIndex] = item
    operateDetail.value.show = false
    saveTodoList()
    toastStore.showToast({
      message: '編輯成功！',
      type: 'success',
    })
    return
  }

  // 新增
  list.value.push(item)
  operateDetail.value.show = false
  saveTodoList()
  toastStore.showToast({
    message: '新增成功！',
    type: 'success',
  })
}

/**
 * 創建Excel檔案
 */
const createExcelFile = (): File => {
  type ExportRow = Record<string, string | number>

  const exportData: ExportRow[] = list.value.map((item, index) => ({
    項次: index + 1,
    項目名稱: item.name,
    狀態: TodoStatusNameMap[item.status] || '-',
    '金額 (NT$)': item.price || 0,
    日期: item.date || '-',
    備註: item.note || '-',
  }))

  exportData.push({
    項次: '總計金額',
    項目名稱: '',
    狀態: '',
    '金額 (NT$)': totalPrice.value,
    日期: '',
    備註: '',
  })

  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, '採買清單')

  const excelData = XLSX.write(wb, {
    bookType: 'xlsx',
    type: 'array',
  })

  return new File([excelData], `採買清單_${getToday()}.xlsx`, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

/**
 * 匯出至 Excel
 */
const exportToExcel = (): void => {
  const file = createExcelFile()

  const url = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = url
  link.download = file.name
  link.click()

  URL.revokeObjectURL(url)
}

/**
 * 匯入Excel操作狀態轉key
 */
const getStatusFromName = (status: unknown): todoStatusType => {
  const statusName = String(status ?? '').trim()

  if (statusName === TodoStatusNameMap[TodoStatus.Completed]) {
    return TodoStatus.Completed
  }

  if (statusName === TodoStatusNameMap[TodoStatus.InProgress]) {
    return TodoStatus.InProgress
  }

  return TodoStatus.InProgress
}

/**
 * 開啟檔案選擇
 */
const triggerImport = (): void => {
  confirmDetail.value = {
    show: true,
    title: '確定要載入清單?',
    message: '載入後原資料會被覆蓋喔！',
    fun: () => {
      fileInput.value?.click()
    },
  }
}

/**
 * 匯入 Excel
 */
const importFromExcel = (event: Event): void => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  const showError = () => {
    toastStore.showToast({
      message: '匯入失敗',
      type: 'error',
    })
  }

  if (!file) {
    showError()
    return
  }

  const reader = new FileReader()

  reader.onload = async (e): Promise<void> => {
    const data = e.target?.result

    if (!data) {
      showError()
      return
    }

    importXlsxLoading.value = true
    const workbook = XLSX.read(data, {
      type: 'array',
    })

    // 第一個工作表
    const sheetName = workbook.SheetNames[0]

    if (!sheetName) {
      showError()
      return
    }

    const worksheet = workbook.Sheets[sheetName]

    if (!worksheet) {
      importXlsxLoading.value = false
      showError()
      return
    }

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)
    const firstRow = rows[0]
    if (!firstRow || !('項目名稱' in firstRow)) {
      importXlsxLoading.value = false
      target.value = ''

      toastStore.showToast({
        message: '匯入失敗：找不到「項目名稱」欄位',
        type: 'error',
      })
      return
    }

    const importedList: listItem[] = rows
      .filter((row) => row['項目名稱'])
      .map((row) => ({
        id: crypto.randomUUID(),
        name: String(row['項目名稱'] ?? ''),
        price: Number(row['金額 (NT$)'] ?? 0),
        date: String(row['日期'] ?? ''),
        note: String(row['備註'] ?? ''),
        status: getStatusFromName(row['狀態']),
      }))

    list.value = importedList
    importXlsxLoading.value = false
    target.value = ''
    await nextTick()
    toastStore.showToast({
      message: '匯入成功',
      type: 'success',
    })
  }

  reader.readAsArrayBuffer(file)
}

onMounted(() => {
  getTodoList()
})
</script>

<style lang="scss" scoped>
.todo-list-wrap {
  max-width: 800px;
  margin: 0 auto;
  padding: 32px 20px;
  background-color: $bg-main;
  min-height: 100vh;
  box-sizing: border-box;
  color: $text-title;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;

  .header-title-box {
    .sub-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      color: $primary-warm;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }

    .todo-list-title {
      font-size: 26px;
      font-weight: 800;
      color: $text-title;
      margin: 0;
      letter-spacing: -0.5px;
    }
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.common-card {
  background: $card-bg;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid $card-border;
  box-shadow:
    0 10px 25px -5px rgba($primary-hover, 0.04),
    0 8px 10px -6px rgba($primary-hover, 0.02);
  margin-bottom: 24px;
}

.total-card {
  background: $total-card-bg;
  border: 1px solid $total-card-border;
  position: relative;
  overflow: hidden;

  .total-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .title {
      font-size: 13px;
      font-weight: 600;
      color: $text-warm-secondary;
      letter-spacing: 0.2px;
    }

    .price {
      margin-top: 6px;
      font-size: 36px;
      font-weight: 800;
      color: $text-body;
      letter-spacing: -0.5px;
      line-height: 1.1;

      .currency {
        font-size: 18px;
        font-weight: 600;
        color: $primary-hover;
        margin-right: 4px;
      }
    }

    .completed-info {
      margin-top: 10px;
      font-size: 13px;
      color: $primary-hover;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-weight: 600;
      background: rgba($accent-soft, 0.6);
      padding: 4px 10px;
      border-radius: 20px;
    }

    .chart-box {
      width: 96px;
      height: 96px;
      flex-shrink: 0;
    }
  }

  .action-btn-group {
    border-top: 1px dashed $border-warm-divider;
    padding-top: 18px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;

    .btn-add {
      flex: 1;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 4px 12px $shadow-primary-soft;
    }

    .btn-clear {
      font-size: 13px;
      border-radius: 12px;
      background: transparent;
      border: 1px solid transparent;
      color: $text-danger;
      opacity: 0.85;

      &:hover {
        opacity: 1;
        background: $surface-danger;
        border-color: $button-danger-hover-bg;
      }
    }
  }
}

/* 清單容器與 Tab */
.todo-list-container {
  padding: 24px;

  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;

    .title {
      font-size: 18px;
      font-weight: 800;
      color: $text-title;
      margin: 0;
    }
  }

  .filter-status-wrap {
    display: inline-flex;
    gap: 4px;
    background: $surface-soft;
    padding: 4px;
    border-radius: 12px;

    .status-tab {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 8px;
      border: none;
      background: transparent;
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 600;
      color: $text-warm-secondary;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

      &__count {
        font-size: 11px;
        background: rgba($text-warm-secondary, 0.1);
        padding: 1px 7px;
        border-radius: 10px;
        font-weight: 700;
      }

      &:hover {
        color: $text-title;
      }

      &.active {
        background: $card-bg;
        color: $primary-warm;
        box-shadow: 0 2px 8px $shadow-warm-medium;

        .status-tab__count {
          background: $accent-soft;
          color: $primary-hover;
        }
      }
    }
  }
}

/* 清單項目列表 */
.todo-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .todo-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    background: $card-bg;
    border: 1px solid $card-border;
    border-radius: 14px;
    transition: all 0.2s ease;

    &:hover {
      background: $surface-input;
      border-color: $border-input;
      box-shadow: 0 4px 12px rgba($primary-hover, 0.04);
    }

    &__checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
    }

    &__checkbox {
      position: absolute;
      opacity: 0;
      cursor: pointer;

      &:checked ~ .custom-checkbox {
        background-color: $primary-warm;
        border-color: $primary-warm;

        &::after {
          display: block;
        }
      }
    }

    .custom-checkbox {
      width: 22px;
      height: 22px;
      border: 2px solid $checkbox-border;
      border-radius: 8px;
      transition: all 0.2s ease;
      position: relative;
      background-color: $card-bg;

      &::after {
        content: '';
        position: absolute;
        display: none;
        left: 7px;
        top: 3px;
        width: 5px;
        height: 10px;
        border: solid $card-bg;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }

    /* 已完成狀態 */
    &.completed {
      opacity: 0.6;
      background: $surface-soft;
      border-color: transparent;

      .todo-item__name {
        text-decoration: line-through;
        color: $text-muted;
      }

      .todo-item__price {
        color: $text-muted;
      }
    }

    &__main {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0; // 防止文字溢出跑版
    }

    &__title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    &__name {
      font-size: 16px;
      font-weight: 700;
      color: $text-title;
      word-break: break-word;
    }

    &__price {
      font-size: 15px;
      font-weight: 800;
      color: $primary-warm;
      white-space: nowrap;
    }

    &__meta-row {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 12px;
      color: $text-muted;
      flex-wrap: wrap;

      span {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
    }

    &__actions {
      display: flex;
      gap: 6px;

      .btn-icon {
        border: none;
        background: $surface-soft;
        padding: 8px;
        border-radius: 10px;
        cursor: pointer;
        color: $text-warm-secondary;
        font-size: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s ease;

        &.edit {
          background: $accent-soft;
          color: $primary-warm;

          &:hover {
            background: $accent-soft-hover;
          }
        }

        &.delete {
          background: $surface-danger;
          color: $text-danger-bright;

          &:hover {
            background: $button-danger-hover-bg;
          }
        }
      }
    }
  }
}

@media (max-width: 576px) {
  .todo-list-wrap {
    padding: 20px 14px;
  }

  .header-section {
    flex-direction: column;
    align-items: flex-start;

    .header-actions {
      width: 100%;

      .btn-action {
        flex: 1;
      }
    }
  }

  .common-card {
    padding: 18px;
    border-radius: 16px;
  }

  .todo-list-container {
    padding: 18px;

    .list-header {
      flex-direction: column;
      align-items: stretch;

      .filter-status-wrap {
        display: flex;
        width: 100%;

        .status-tab {
          flex: 1;
          justify-content: center;
          min-width: 0;
          gap: 4px;
          padding: 8px 4px;
          white-space: nowrap;

          &__count {
            padding: 1px 5px;
          }
        }
      }
    }
  }
}
</style>
