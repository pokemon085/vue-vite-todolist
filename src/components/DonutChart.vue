<template>
  <div ref="chartRef" class="progress-chart"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import * as echarts from 'echarts'

const chartRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const props = defineProps<{
  completed: number
  total: number
}>()

// 百分比
const progress = computed(() => {
  if (!props.total || props.total === 0) return 0
  const rate = (props.completed / props.total) * 100
  return Math.min(100, Math.max(0, Math.round(rate)))
})

const updateChart = () => {
  if (!chart) return

  const rootStyles = getComputedStyle(document.documentElement)
  const progressColor = rootStyles.getPropertyValue('--primary-warm').trim()
  const trackColor = rootStyles.getPropertyValue('--total-card-border').trim()
  const labelColor = rootStyles.getPropertyValue('--text-body').trim()

  chart.setOption({
    series: [
      {
        type: 'pie',
        radius: ['70%', '88%'],
        silent: true,
        startAngle: 90,
        data: [
          {
            value: progress.value,
            itemStyle: {
              color: progressColor,
              borderRadius: progress.value > 0 && progress.value < 100 ? 10 : 0, // 端點帶點圓角更溫柔
            },
          },
          {
            value: 100 - progress.value,
            itemStyle: {
              color: trackColor,
            },
          },
        ],
        label: {
          show: true,
          position: 'center',
          formatter: `${progress.value}%`,
          fontSize: 18,
          fontWeight: '700',
          color: labelColor,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
        labelLine: {
          show: false,
        },
      },
    ],
  })
}

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value)
  updateChart()
}

const handleResize = () => {
  chart?.resize()
}

watch(progress, () => {
  updateChart()
})

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>

<style scoped lang="scss">
.progress-chart {
  width: 100%;
  height: 100%;
  min-width: 88px;
  min-height: 88px;
}
</style>
