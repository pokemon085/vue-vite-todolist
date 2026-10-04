import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { listItem } from '@/type/list'

export const useTodoListStore = defineStore('todoList', () => {
  const list = ref<listItem[]>([])

  const getTodoList = () => {
    const storedTodos = localStorage.getItem('todos')
    list.value = storedTodos ? (JSON.parse(storedTodos) as listItem[]) : []
  }

  const saveTodoList = () => {
    localStorage.setItem('todos', JSON.stringify(list.value))
  }

  return { list, getTodoList, saveTodoList }
})
