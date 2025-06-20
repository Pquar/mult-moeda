<script setup lang="ts">
interface TooltipData {
  label: string
  value: string | number
  color?: string
}

interface Props {
  data: TooltipData[]
  title?: string
  visible?: boolean
  x?: number
  y?: number
}

defineProps<Props>()
</script>

<template>
  <div 
    v-if="visible"
    class="absolute z-[1000] pointer-events-none transform -translate-x-1/2 -translate-y-full -mt-2.5"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div class="bg-black/90 text-white px-3 py-2 rounded-md text-xs shadow-lg min-w-[150px]">
      <h4 v-if="title" class="font-semibold mb-1 text-sm">{{ title }}</h4>
      <div class="flex flex-col gap-0.5">
        <div 
          v-for="(item, index) in data" 
          :key="index"
          class="flex items-center gap-1.5"
        >
          <div 
            v-if="item.color"
            class="w-2 h-2 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></div>
          <span class="font-medium">{{ item.label }}:</span>
          <span class="ml-auto font-semibold">{{ item.value }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ChartTooltip uses only Tailwind CSS -->
