/**
 * 取得今日日期
 * @returns 今日日期，格式為 YYYY-MM-DD
 */
export const getToday = (): string => {
  const today = new Date()

  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
