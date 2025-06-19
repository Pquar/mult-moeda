<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const cardClass = computed(() => 
  cn(
    "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
    props.class
  )
)
</script>

<template>
  <div :class="cardClass" data-slot="card">
    <slot />
  </div>
</template>
