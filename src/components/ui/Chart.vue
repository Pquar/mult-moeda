<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
  title: string
  value: string | number
  description?: string
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

const props = withDefaults(defineProps<Props>(), {
  trend: 'neutral',
  color: 'blue'
})

const containerClass = computed(() => 
  cn(
    "bg-card text-card-foreground border rounded-lg shadow-sm p-6",
    props.class
  )
)

const valueClass = computed(() => {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600', 
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600'
  }
  return cn('text-2xl font-bold', colorClasses[props.color])
})

const trendClass = computed(() => {
  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  }
  return cn('text-sm font-medium', trendClasses[props.trend])
})

const trendIcon = computed(() => {
  switch (props.trend) {
    case 'up': return '↗'
    case 'down': return '↘'
    default: return '→'
  }
})
</script>

<template>
  <div :class="containerClass" data-slot="chart">
    <div class="flex items-center justify-between space-y-0 pb-2">
      <h3 class="text-sm font-medium">{{ title }}</h3>
      <slot name="icon" />
    </div>
    <div class="space-y-1">
      <div :class="valueClass">{{ value }}</div>
      <div class="flex items-center space-x-1">
        <span v-if="trendValue" :class="trendClass">
          {{ trendIcon }} {{ trendValue }}
        </span>
        <p v-if="description" class="text-xs text-muted-foreground">
          {{ description }}
        </p>
      </div>
    </div>
    <slot />
  </div>
</template>
