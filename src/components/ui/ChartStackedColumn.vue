<script setup lang="ts">
import { ref, computed } from 'vue'
import ChartTooltip from './ChartTooltip.vue'

interface StackedData {
  label: string
  segments: {
    value: number
    color: string
    tooltip: string
    name: string
  }[]
}

interface Props {
  data: StackedData[]
  height?: number
  showLabels?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,
  showLabels: true
})

const chartRef = ref<HTMLDivElement>()
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  data: [] as any[]
})

const maxValue = computed(() => {
  return Math.max(...props.data.map(item => 
    item.segments.reduce((sum, segment) => sum + segment.value, 0)
  ))
})

const handleMouseOver = (event: MouseEvent, segment: any, item: StackedData) => {
  const rect = chartRef.value?.getBoundingClientRect()
  if (rect) {
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      data: [
        {
          label: `${item.label} - ${segment.name}`,
          value: segment.tooltip,
          color: segment.color
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
  <div class="relative w-full" :style="{ height: `${height}px` }">
    <div v-if="title" class="text-base font-semibold text-gray-700 text-center mb-4">{{ title }}</div>
    
    <div 
      ref="chartRef"
      class="flex items-end justify-center gap-4 h-full pb-8"
    >
      <div 
        v-for="(item, index) in data" 
        :key="index"
        class="flex flex-col items-center gap-2 min-w-[60px]"
      >
        <div class="relative flex flex-col justify-end" :style="{ height: `${height - 80}px` }">
          <div class="w-12 relative">
            <div
              v-if="item.segments[0]"
              class="absolute bottom-0 w-full cursor-pointer transition-all duration-300 hover:brightness-110 rounded-t-md"
              :style="{ 
                height: `${(item.segments[0].value / maxValue) * (height - 80)}px`,
                backgroundColor: item.segments[0].color
              }"
              @mouseover="handleMouseOver($event, item.segments[0], item)"
              @mouseout="handleMouseOut"
            ></div>
                        <div
              v-if="item.segments[1]"
              class="absolute bottom-0 w-full cursor-pointer transition-all duration-300 hover:brightness-110 rounded-t-md"
              :style="{ 
                height: `${(item.segments[1].value / maxValue) * (height - 80)}px`,
                backgroundColor: item.segments[1].color
              }"
              @mouseover="handleMouseOver($event, item.segments[1], item)"
              @mouseout="handleMouseOut"
            ></div>
          </div>
        </div>
        
        <div v-if="showLabels" class="text-xs text-gray-600 text-center font-medium max-w-[80px] text-nowrap">
          {{ item.label }}
        </div>
      </div>
    </div>
    
    <ChartTooltip
      :visible="tooltip.visible"
      :x="tooltip.x"
      :y="tooltip.y"
      :data="tooltip.data"
    />
  </div>
</template>