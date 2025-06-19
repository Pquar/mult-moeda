<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const contentClass = computed(() => 
  cn("px-6", props.class)
)
</script>

<template>
  <div :class="contentClass" data-slot="card-content">
    <slot />
  </div>
</template>
