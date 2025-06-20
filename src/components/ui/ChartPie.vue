<script setup lang="ts">
import { ref, computed } from 'vue'
import ChartTooltip from './ChartTooltip.vue'

interface PieData {
  label: string
  value: number
  color: string
}

interface Props {
  data: PieData[]
  size?: number
  innerRadius?: number
  showTooltip?: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 160,
  innerRadius: 0,
  showTooltip: true
})

const svgRef = ref<SVGElement>()
const tooltip = ref({
  visible: false,
  x: 0,
  y: 0,
  data: [] as any[]
})

const total = computed(() => 
  props.data.reduce((sum, item) => sum + item.value, 0)
)

const slices = computed(() => {
  let cumulativeAngle = 0
  const radius = props.size / 2 - 10
  const centerX = props.size / 2
  const centerY = props.size / 2
  
  return props.data.map(item => {
    const angle = (item.value / total.value) * 360
    const startAngle = cumulativeAngle
    const endAngle = cumulativeAngle + angle
    
    const startAngleRad = (startAngle - 90) * Math.PI / 180
    const endAngleRad = (endAngle - 90) * Math.PI / 180
    
    const largeArcFlag = angle > 180 ? 1 : 0
    
    const x1 = centerX + Math.cos(startAngleRad) * radius
    const y1 = centerY + Math.sin(startAngleRad) * radius
    const x2 = centerX + Math.cos(endAngleRad) * radius
    const y2 = centerY + Math.sin(endAngleRad) * radius
    
    let pathData = `M ${centerX} ${centerY}`
    pathData += ` L ${x1} ${y1}`
    pathData += ` A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
    pathData += ' Z'
    
    if (props.innerRadius > 0) {
      const innerR = props.innerRadius
      const ix1 = centerX + Math.cos(startAngleRad) * innerR
      const iy1 = centerY + Math.sin(startAngleRad) * innerR
      const ix2 = centerX + Math.cos(endAngleRad) * innerR
      const iy2 = centerY + Math.sin(endAngleRad) * innerR
      
      pathData = `M ${centerX} ${centerY}`
      pathData += ` L ${x1} ${y1}`
      pathData += ` A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
      pathData += ` L ${ix2} ${iy2}`
      pathData += ` A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${ix1} ${iy1}`
      pathData += ' Z'
    }
    
    cumulativeAngle += angle
    
    return {
      ...item,
      pathData,
      percentage: ((item.value / total.value) * 100).toFixed(1)
    }
  })
})

const handleMouseOver = (event: MouseEvent, slice: any) => {
  if (!props.showTooltip) return
  
  const rect = svgRef.value?.getBoundingClientRect()
  if (rect) {
    tooltip.value = {
      visible: true,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      data: [
        {
          label: slice.label,
          value: `${slice.percentage}% (${slice.value})`,
          color: slice.color
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
  <div class="relative w-full h-full">
    <div v-if="title" class="text-base font-semibold text-gray-700 text-center mb-4">{{ title }}</div>
    
    <div class="flex items-center justify-center gap-8 h-full min-h-[200px]">
      <div class="flex-shrink-0">
        <svg 
          ref="svgRef"
          :width="size" 
          :height="size" 
          class="cursor-pointer"
        >
          <g>
            <path
              v-for="(slice, index) in slices"
              :key="index"
              :d="slice.pathData"
              :fill="slice.color"
              :stroke="slice.color"
              stroke-width="1"
              class="transition-all duration-200 ease-in-out hover:opacity-80 hover:brightness-110"
              @mouseover="handleMouseOver($event, slice)"
              @mouseout="handleMouseOut"
            />
          </g>
        </svg>
      </div>

      <div class="flex flex-col gap-2 flex-1 max-w-[280px] max-h-[200px] overflow-y-auto">
        <div 
          v-for="(slice, index) in slices" 
          :key="index"
          class="flex items-center gap-3 text-sm text-gray-600 py-1"
        >
          <div 
            class="w-4 h-4 rounded-full flex-shrink-0"
            :style="{ backgroundColor: slice.color }"
          ></div>
          <span class="flex-1 truncate" :title="slice.label">{{ slice.label }}</span>
          <span class="font-semibold text-gray-700 flex-shrink-0">{{ slice.percentage }}%</span>
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