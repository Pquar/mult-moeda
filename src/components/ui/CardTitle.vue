<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {})

const titleClass = computed(() => 
  cn("leading-none font-semibold", props.class)
)
</script>

<template>
  <div :class="titleClass" data-slot="card-title">
    <slot />
  </div>
</template>
