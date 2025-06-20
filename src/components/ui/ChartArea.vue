<script setup lang="ts">
import { ref, computed } from 'vue'
import ChartTooltip from './ChartTooltip.vue'

interface AreaData {
  label: string
  value: number
  date?: string
}

interface Props {
  data: AreaData[]
  width?: number
  height?: number
  color?: string
  showTooltip?: boolean
  title?: string
  yAxisLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: 400,
  height: 200,
  color: '#3b82f6',
  showTooltip: true
})

const svgRef = ref<SVGElement>()
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  data: [] as any[]
})

const padding = { top: 20, right: 20, bottom: 60, left: 50 }
const chartWidth = computed(() => props.width - padding.left - padding.right)
const chartHeight = computed(() => props.height - padding.top - padding.bottom)

const maxValue = computed(() => Math.max(...props.data.map(d => d.value)))
const minValue = computed(() => Math.min(...props.data.map(d => d.value)))

const points = computed(() => {
  if (props.data.length === 0) return []
  
  const xStep = props.data.length === 1 
    ? chartWidth.value / 2 
    : chartWidth.value / (props.data.length - 1)
  const yRange = maxValue.value - minValue.value
  
  return props.data.map((item, index) => {
    const x = props.data.length === 1 
      ? padding.left + chartWidth.value / 2 
      : padding.left + index * xStep
    const y = yRange === 0 
      ? padding.top + chartHeight.value / 2
      : padding.top + chartHeight.value - ((item.value - minValue.value) / yRange) * chartHeight.value
    
    return { x, y, ...item }
  })
})

const pathData = computed(() => {
  if (points.value.length === 0) return ''
  
  let path = `M ${points.value[0].x} ${padding.top + chartHeight.value}`
  path += ` L ${points.value[0].x} ${points.value[0].y}`
  
  points.value.forEach((point, index) => {
    if (index === 0) return
    path += ` L ${point.x} ${point.y}`
  })
  
  path += ` L ${points.value[points.value.length - 1].x} ${padding.top + chartHeight.value}`
  path += ' Z'
  
  return path
})

const lineData = computed(() => {
  if (points.value.length === 0) return ''
  
  let path = `M ${points.value[0].x} ${points.value[0].y}`
  
  points.value.forEach((point, index) => {
    if (index === 0) return
    path += ` L ${point.x} ${point.y}`
  })
  
  return path
})

const yAxisTicks = computed(() => {
  const ticks = []
  const tickCount = 5
  const step = (maxValue.value - minValue.value) / (tickCount - 1)
  
  for (let i = 0; i < tickCount; i++) {
    const value = minValue.value + i * step
    const y = padding.top + chartHeight.value - (i / (tickCount - 1)) * chartHeight.value
    ticks.push({ y, value: value.toFixed(0) })
  }
  
  return ticks
})

const handleMouseOver = (event: MouseEvent, point: any) => {
  if (!props.showTooltip) return
  
  const rect = svgRef.value?.getBoundingClientRect()
  if (rect) {
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      data: [
        {
          label: point.date || point.label,
          value: point.value.toLocaleString(),
          color: props.color
        }
      ]
    }
  }
}

const handleMouseOut = () => {
  tooltip.value.visible = false
}
</script>

<template>
  <div class="relative flex flex-col items-center gap-4">
    <div v-if="title" class="text-base font-semibold text-gray-700 text-center">{{ title }}</div>
    
    <svg 
      ref="svgRef"
      :width="width" 
      :height="height" 
      class="bg-gray-50 rounded-lg"
    >
      <!-- Grid lines -->
      <g class="grid">
        <line
          v-for="tick in yAxisTicks"
          :key="tick.y"
          :x1="padding.left"
          :y1="tick.y"
          :x2="padding.left + chartWidth"
          :y2="tick.y"
          stroke="#e5e7eb"
          stroke-width="1"
        />
      </g>
      
      <!-- Y Axis -->
      <g class="y-axis">
        <line
          :x1="padding.left"
          :y1="padding.top"
          :x2="padding.left"
          :y2="padding.top + chartHeight"
          stroke="#6b7280"
          stroke-width="1"
        />
        <text
          v-for="tick in yAxisTicks"
          :key="tick.y"
          :x="padding.left - 10"
          :y="tick.y + 4"
          text-anchor="end"
          class="text-xs fill-gray-600 font-sans"
        >
          {{ tick.value }}
        </text>
      </g>
      
      <!-- X Axis -->
      <g class="x-axis">
        <line
          :x1="padding.left"
          :y1="padding.top + chartHeight"
          :x2="padding.left + chartWidth"
          :y2="padding.top + chartHeight"
          stroke="#6b7280"
          stroke-width="1"
        />
        <text
          v-for="(point, index) in points"
          :key="index"
          :x="point.x"
          :y="padding.top + chartHeight + 25"
          text-anchor="middle"
          class="text-xs fill-gray-600 font-sans"
        >
          {{ point.label }}
        </text>
      </g>
      
      <!-- Area -->
      <path
        :d="pathData"
        :fill="color"
        fill-opacity="0.3"
        class="transition-opacity duration-200 ease-in-out"
      />
      
      <!-- Line -->
      <path
        :d="lineData"
        :stroke="color"
        stroke-width="2"
        fill="none"
        class="transition-all duration-200 ease-in-out"
      />
      
      <!-- Data points -->
      <g class="data-points">
        <circle
          v-for="(point, index) in points"
          :key="index"
          :cx="point.x"
          :cy="point.y"
          r="4"
          :fill="color"
          class="transition-all duration-200 ease-in-out cursor-pointer hover:r-6"
          @mouseover="handleMouseOver($event, point)"
          @mouseout="handleMouseOut"
        />
      </g>
    </svg>
    
    <ChartTooltip
      :visible="tooltip.visible"
      :x="tooltip.x"
      :y="tooltip.y"
      :data="tooltip.data"
    />
  </div>
</template>

<!-- ChartArea uses only Tailwind CSS -->
