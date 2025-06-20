<script setup lang="ts">
import { ref, computed } from 'vue'
import ChartTooltip from './ChartTooltip.vue'

interface ColumnData {
  label: string
  value: number
  color: string
  tooltip?: string
}

interface Props {
  data: ColumnData[]
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

const maxValue = computed(() => 
  Math.max(...props.data.map(item => item.value))
)

const handleMouseOver = (event: MouseEvent, item: ColumnData) => {
  const rect = chartRef.value?.getBoundingClientRect()
  if (rect) {
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      data: [
        {
          label: item.label,
          value: item.tooltip || item.value.toLocaleString('pt-BR'),
          color: item.color
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
      class="flex items-end justify-center gap-1 h-full pb-8 overflow-x-auto"
    >
      <div 
        v-for="(item, index) in data" 
        :key="index"
        class="flex flex-col items-center gap-2 min-w-[40px]"
      >
        <!-- Barra da coluna -->
        <div class="relative flex flex-col justify-end" :style="{ height: `${height - 80}px` }">
          <div
            class="w-8 bg-gray-200 rounded-t-md cursor-pointer transition-all duration-300 hover:brightness-110 hover:scale-105"
            :style="{ 
              height: `${(item.value / maxValue) * (height - 80)}px`,
              backgroundColor: item.color
            }"
            @mouseover="handleMouseOver($event, item)"
            @mouseout="handleMouseOut"
          ></div>
        </div>
        
        <!-- Label -->
        <div v-if="showLabels" class="text-[10px] text-gray-600 text-center font-medium leading-tight max-w-[50px]">
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

<!-- ChartColumn uses only Tailwind CSS -->
