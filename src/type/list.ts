import { TodoStatus } from '../utils/constants'

export interface listItem {
  id: string
  name: string
  price: number
  date: string
  note: string
  status: todoStatusType // 0: 全部, 1: 已完成, 2: 進行中
}

export type todoStatusType = (typeof TodoStatus)[keyof typeof TodoStatus]

export type operateType = '新增' | '編輯' // 彈窗操作類型

// 新增/編輯彈窗資料
export interface operateDetailType {
  show: boolean
  title: string
  data: Partial<listItem>
}

export interface confirmDetail {
  show: boolean
  title: string
  message: string
  fun: () => void
}
